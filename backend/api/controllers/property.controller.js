import Property from "../models/property.model.js";
import { errorHandler } from "../utilites/error.js";

// Controller to create a new property
export const createProperty = async (req, res, next) => {
  try {
    // Extract the authenticated user's ID from the request
    const userId = req.user.id;

    // Combine request body with user reference for property data
    const propertyData = {
      ...req.body,
      userReference: userId,
    };

    // Create and save the new property in the database
    await Property.create(propertyData);

    // Respond with success message
    return res.status(201).json({
      success: true,
      message: "Property created successfully",
    });
  } catch (error) {
    // Pass any other errors to the error-handling middleware
    next(error);
  }
};

// Controller to fetch all properties for a specific user
export const getUserProperties = async (req, res, next) => {
  try {
    // Validate that the authenticated user is accessing their own properties
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You can only access your own properties"));
    }

    // Extract sort options from query parameters (default to 'createdAt' in descending order)
    const { sortField = "createdAt", sortOrder = "desc" } = req.query;
    const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

    // Retrieve properties owned by the authenticated user
    const properties = await Property.find({ userReference: req.params.id }).sort(sortOptions);

    // Respond with the list of properties
    return res.status(200).json(properties);
  } catch (error) {
    // Pass any other errors to the error-handling middleware
    next(error);
  }
};

// Controller to delete a specific property by ID
export const deleteProperty = async (req, res, next) => {
  const { propertyId } = req.params;

  try {
    // Attempt to find and delete the property by its ID
    const deletedProperty = await Property.findByIdAndDelete(propertyId);

    // If the property doesn't exist, send a 404 error
    if (!deletedProperty) {
      return next(errorHandler(404, "Property not found"));
    }

    // Respond with success message
    res.status(200).json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    // Pass any other errors to the error-handling middleware
    next(error);
  }
};

// Controller to fetch details of a specific property by ID
export const getSpecificProperty = async (req, res, next) => {
  const { propertyId } = req.params;

  try {
    // Find the property by its ID
    const property = await Property.findById(propertyId);

    // If the property doesn't exist, send a 404 error
    if (!property) {
      return next(errorHandler(404, "Property not found"));
    }

    // Respond with property details
    res.status(200).json({ success: true, property });
  } catch (error) {
    // Pass any other errors to the error-handling middleware
    next(error);
  }
};

// Controller to update a specific property by ID
export const updateProperty = async (req, res, next) => {
  const { propertyId } = req.params;

  try {
    // Attempt to find and update the property
    const updatedProperty = await Property.findByIdAndUpdate(propertyId, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    // If the property doesn't exist, send a 404 error
    if (!updatedProperty) {
      return next(errorHandler(404, "Property not found"));
    }

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "Property updated successfully",
    });
  } catch (error) {
    // Pass any other errors to the error-handling middleware
    next(error);
  }
};

// Controller to show and filter all properties
export const getAllProperties = async (req, res, next) => {
  try {
    // Destructure filters, search, sorting, and pagination details from the request body
    const { categories, types, basements, features, searchQuery, sortOption, page, limit } =
      req.body;

    // Initialize the match stage for filters in the aggregation pipeline.
    const matchStage = {}; // This will hold filter conditions dynamically.

    // Filter by property categories if provided.
    if (categories && categories.length > 0) {
      matchStage.propertyCategory = { $in: categories }; // Match any category in the provided array.
    }

    // Filter by property types if provided.
    if (types && types.length > 0) {
      matchStage.propertyType = { $in: types }; // Match any type in the provided array
    }

    // Filter by property basements if provided.
    if (basements && basements.length > 0) {
      matchStage.propertyBasement = { $in: basements }; // Match any basement in the provided array
    }

    // Filter by property features if provided.
    if (features && features.length > 0) {
      features.forEach((feature) => {
        matchStage[`propertyFeatures.${feature}`] = true; // Match specific feature fields that are true.
      });
    }

    // Add search functionality to match property names or addresses (case-insensitive).
    if (searchQuery) {
      matchStage.$or = [
        { propertyName: { $regex: searchQuery, $options: "i" } }, // Match propertyName using regex.
        { propertyAddress: { $regex: searchQuery, $options: "i" } }, // Match propertyAddress using regex.
      ];
    }

    // Determine sorting logic based on the provided sortOption.
    const sortStage = {};
    if (sortOption === "priceLowToHigh") {
      sortStage.effectivePrice = 1; // Sort by effectivePrice in ascending order.
    } else if (sortOption === "priceHighToLow") {
      sortStage.effectivePrice = -1; // Sort by effectivePrice in descending order.
    } else if (sortOption === "createdOldToNew") {
      sortStage.createdAt = 1; // Sort by createdAt in ascending order.
    } else {
      sortStage.createdAt = -1; // Default: Sort by createdAt in descending order.
    }

    // Set up pagination variables (page number and items per page).
    const pageNumber = page || 1; // Default to page 1 if not provided.
    const itemsPerPage = limit || 8; // Default to 8 items per page if not provided.
    const skipItems = (pageNumber - 1) * itemsPerPage; // Calculate the number of items to skip for pagination.

    // aggregation refers to the process of performing operations on data to compute and transform it into more useful results.

    // The aggregation pipeline is a sequence of stages that process the data in a specific order,
    // passing the output of one stage to the next. Each stage in the pipeline transforms the data,
    // and the final result is returned at the end of the pipeline.

    // Define the aggregation pipeline
    const pipeline = [
      { $match: matchStage }, // Stage 1: Apply filters.
      {
        $addFields: {
          effectivePrice: {
            $cond: {
              // $cond is an aggregation operator used in the aggregation pipeline to perform conditional operations.
              if: { $eq: ["isOffer", "yes"] }, // If "isOffer" is "yes",
              then: "$offerPrice", // Use "offerPrice".
              else: "$regularPrice", // Otherwise, use "regularPrice".
            },
          },
        },
      },
      { $sort: sortStage }, // Stage 2: Apply sorting.
      {
        $facet: {
          // $facet operator is used in the aggregation pipeline to perform multiple operations in parallel within the same stage.
          // It allows you to create multiple sub-pipelines, each performing its own aggregation tasks, and return the results as an array of documents.
          properties: [
            { $skip: skipItems }, // Skip items for pagination.
            { $limit: itemsPerPage }, // Limit the number of items returned.
            {
              $lookup: {
                from: "users", // Stage 3: Populate user details from the "users" collection.
                localField: "userReference", // Field in the "Property" model.
                foreignField: "_id", // Field in the "users" collection.
                as: "userDetails", // Output field for user details.
                pipeline: [
                  {
                    $project: {
                      userPhoto: 1, // Include userPhoto.
                      userName: 1, // Include userName.
                      userEmail: 1, // Include userEmail.
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                // $unwind operator is used in the aggregation pipeline to deconstruct an array field from the input documents
                // and create a new document for each element in the array.
                path: "$userDetails",
                preserveNullAndEmptyArrays: true, // Keep properties with no matching userReference.
              },
            },
          ],
          totalCount: [{ $count: "count" }], // Calculate the total number of matching properties.
        },
      },
    ];

    // Execute the aggregation pipeline using Mongoose.
    const result = await Property.aggregate(pipeline);

    // Extract properties and total count from the aggregation result.
    const properties = result[0]?.properties || []; // Extract properties or default to an empty array.
    const totalCount = result[0]?.totalCount[0]?.count || 0; // Extract total count or default to 0.
    const totalPages = Math.ceil(totalCount / itemsPerPage); // Calculate total pages.

    // Send a successful response with properties and pagination info.
    res.status(200).json({ properties, totalPages });
  } catch (error) {
    // Pass any errors to the error-handling middleware.
    next(error);
  }
};

export const incrementPropertyViews = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    // Find the property by its ID
    const property = await Property.findById(propertyId);

    // If the property doesn't exist, send a 404 error
    if (!property) {
      return next(errorHandler(404, "Property not found"));
    }

    // Increment the views count by 1
    property.views++;

    // Save the updated property
    await property.save();

    // Respond with success message
    res.status(200).json({ message: "View count updated successfully", views: property.views });
  } catch (error) {
    // Pass any other errors to the error-handling middleware
    next(error);
  }
};

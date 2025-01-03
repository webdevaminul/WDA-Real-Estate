import Property from "../models/property.model.js";
import User from "../models/user.model.js";
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
    const { categories, types, basements, features, searchQuery, sortOption, page, limit } =
      req.body;

    const filter = {};

    if (categories && categories.length > 0) {
      filter.propertyCategory = { $in: categories };
    }
    if (types && types.length > 0) {
      filter.propertyType = { $in: types };
    }
    if (basements && basements.length > 0) {
      filter.propertyBasement = { $in: basements };
    }
    if (features && features.length > 0) {
      const featureFilters = {};
      features.forEach((feature) => {
        featureFilters[`propertyFeatures.${feature}`] = true;
      });
      Object.assign(filter, featureFilters); // Merge featureFilters into the main filter object
    }
    if (searchQuery) {
      filter.$or = [
        { propertyName: { $regex: searchQuery, $options: "i" } },
        { propertyAddress: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Sorting options
    const sortOptions = {};
    if (sortOption === "priceLowToHigh") {
      sortOptions.regularPrice = 1; // Ascending
    } else if (sortOption === "priceHighToLow") {
      sortOptions.regularPrice = -1; // Descending
    }

    // Pagination options
    const pageNumber = page || 1;
    const itemsPerPage = limit || 8;
    const skipItems = (pageNumber - 1) * itemsPerPage;

    // Fetching properties with Mongoose
    const totalItems = await Property.countDocuments(filter); // Get total number of properties for matching filter

    const properties = await Property.find(filter)
      .populate({
        path: "userReference",
        select: "userPhoto userName userEmail",
      })
      .sort(sortOptions)
      .skip(skipItems)
      .limit(itemsPerPage);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Respond with properties and pagination info
    res.status(200).json({ properties, totalPages });
  } catch (error) {
    // Pass any other errors to the error-handling middleware
    next(error);
  }
};

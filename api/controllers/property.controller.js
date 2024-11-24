import Property from "../models/property.model.js";
import { errorHandler } from "../utilites/error.js";

export const createProperty = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const propertyData = {
      ...req.body,
      userReference: userId,
    };

    // Create a new property
    await Property.create(propertyData);

    // Send a success response
    return res.status(201).json({
      success: true,
      message: "Property created successfully",
    });
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};

export const getProperties = async (req, res, next) => {
  // req.user.id is the authenticated user's ID (from verifyToken middleware)
  // req.params.id is the user ID passed in the URL parameters
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only access your own properties"));
  }

  try {
    const { sortField = "createdAt", sortOrder = "desc" } = req.query;
    const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

    // Get all properties for the user
    const properties = await Property.find({ userReference: req.params.id }).sort(sortOptions);
    // Send a success response with the properties
    return res.status(200).json(properties);
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return next(errorHandler(404, "Property not found"));
    }

    res.status(200).json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    next(error);
  }
};

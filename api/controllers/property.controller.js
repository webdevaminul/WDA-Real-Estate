import Property from "../models/property.model.js";

export const createProperty = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const propertyData = {
      ...req.body,
      userReference: userId,
    };

    await Property.create(propertyData);

    // Send a success response
    return res.status(201).json({
      success: true,
      message: "Property created successfully",
    });
  } catch (error) {
    next(error);
  }
};

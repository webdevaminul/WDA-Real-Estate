import Property from "../models/property.model.js";

export const createProperty = async (req, res, next) => {
  try {
    const property = await Property.create(req.body);

    // Send a success response
    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    next(error);
  }
};

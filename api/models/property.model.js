import mongoose from "mongoose";

// Create a user schema object
const propertySchema = new mongoose.Schema(
  {
    propertyImages: {
      type: Array,
      required: true,
    },
    propertyName: {
      type: String,
      required: true,
    },
    propertyAddress: {
      type: String,
      required: true,
    },
    propertyCategory: {
      type: String,
      enum: ["Apartment", "Condo", "Villa", "Duplex", "Townhouse"],
      required: true,
    },
    propertyBasement: {
      type: String,
      enum: ["Concrete", "Wood", "Stone", "Earthen", "Hybrid"],
      required: true,
    },
    propertyArea: {
      type: Number,
      required: true,
    },
    propertyFloor: {
      type: Number,
      required: true,
    },
    propertyBedroom: {
      type: Number,
      required: true,
    },
    propertyBathroom: {
      type: Number,
      required: true,
    },
    propertyDescription: {
      type: String,
      required: true,
    },
    propertyFeatures: {
      parking: {
        type: Boolean,
        default: false,
      },
      masterBed: {
        type: Boolean,
        default: false,
      },
      furnished: {
        type: Boolean,
        default: false,
      },
      swimming: {
        type: Boolean,
        default: false,
      },
    },
    propertyType: {
      type: String,
      enum: ["Sell", "Rent"], // Only 'sell' or 'rent' is allowed
      required: true,
    },
    isOffer: {
      type: String,
      enum: ["yes", "no"], // Only 'yes' or 'no' is allowed
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: function () {
        return this.isOffer === "yes";
      },
    },
    userReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a model using the propertySchema object
const Property = mongoose.model("Property", propertySchema);

// Export the model
export default Property;

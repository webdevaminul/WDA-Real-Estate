import mongoose from "mongoose";

// Create a user schema object
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    userPhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    userBirth: {
      type: Date,
    },
    userPhone: {
      type: String,
    },
    userAddress: {
      type: String,
    },
    userGender: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create a model using the userSchema object
const User = mongoose.model("User", userSchema);

// Export the model
export default User;

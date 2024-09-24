import User from "../models/user.model.js";
import { errorHandler } from "../utilites/error.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  // req.user.id is the authenticated user's ID (from verifyToken middleware)
  // req.params.id is the user ID passed in the URL parameters
  if (req.user.id !== req.params.id) {
    // Return an error if the logged-in user is try to update another user's profile
    return next(errorHandler(401, "You can only update your own account"));
  }

  try {
    // Define an object with fields to be updated (based on request body)
    const updatedInfo = {
      $set: {
        userPhoto: req.body.userPhoto,
        userName: req.body.userName,
        userBirth: req.body.userBirth,
        userPhone: req.body.userPhone,
        userAddress: req.body.userAddress,
        userGender: req.body.userGender,
      },
    };

    // Find user by ID and update their profile with the provided info
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedInfo, { new: true });

    // Remove the password from the user object before sending it back to the client
    const { userPassword, ...userInfo } = updatedUser._doc;

    // Send a success response
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      userInfo,
    });
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  const { userPassword, newPassword } = req.body; // Destructure old and new passwords from request body

  // Ensure the logged-in user is only changing their own password
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own password"));
  }

  try {
    // Fetch the user from the database by ID
    const validUser = await User.findById(req.params.id);

    // Compare the provided current password with the stored hashed password
    const validPassword = await bcryptjs.compare(userPassword, validUser.userPassword);

    // If the current password is incorrect, return an error
    if (!validPassword) {
      return next(errorHandler(401, "Invalid current password"));
    }

    // Hash the new password before saving it to the database
    const newUserPassword = bcryptjs.hashSync(newPassword, 10);

    // Update the user's password in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { userPassword: newUserPassword },
      },
      { new: true }
    );

    // Remove the password from the user object before sending it back to the client
    const { userPassword: pass, ...userInfo } = updatedUser._doc;

    // Send a success response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      userInfo,
    });
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  const { userPassword, isGoogle } = req.body; // Destructure current password and isGoogle from request body

  try {
    if (isGoogle) {
      // Delete the user from the database
      await User.findByIdAndDelete(req.params.id);

      // Clear cookies
      res.clearCookie("refreshToken");

      // Send a success response
      return res.status(200).json({
        success: true,
        message: "Google account deleted successfully",
      });
    } else {
      // Ensure that the userPassword is not undefined
      if (!userPassword) {
        return next(errorHandler(400, "Current password is required"));
      }

      // Ensure the logged-in user is only deleting their own account
      if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only delete your own account"));
      }

      // Fetch the user from the database by ID
      const validUser = await User.findById(req.params.id);

      // Return 404 if user not found in the database
      if (!validUser) {
        return next(errorHandler(404, "User not found"));
      }

      // Compare the provided current password with the stored hashed password
      const validPassword = await bcryptjs.compare(userPassword, validUser.userPassword);

      // If the current password is incorrect, return an error
      if (!validPassword) {
        return next(errorHandler(401, "Invalid current password"));
      }

      // Delete the user from the database
      await User.findByIdAndDelete(req.params.id);

      // Clear cookies
      res.clearCookie("refreshToken");

      // Send a success response
      return res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    }
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};

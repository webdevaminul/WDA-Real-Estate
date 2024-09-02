import User from "../models/user.model.js";
import { errorHandler } from "../utilites/error.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account"));
  }

  try {
    if (req.body.userPassword) {
      req.body.userPassword = bcryptjs.hashSync(req.body.userPassword, 10);
    }

    const updatedInfo = {
      $set: {
        userPhoto: req.body.userPhoto,
        userName: req.body.userName,
        userPassword: req.body.userPassword,
        userBirth: req.body.userBirth,
        userPhone: req.body.userPhone,
        userAddress: req.body.userAddress,
        userGender: req.body.userGender,
      },
    };

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedInfo, { new: true });

    const { password, ...userInfo } = updatedUser._doc;

    res.status(200).json({ message: "User updated successfully", userInfo });
  } catch (error) {
    next(error);
  }
};

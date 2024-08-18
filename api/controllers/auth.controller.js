import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utilites/error.js";
import { PORT } from "../index.js";
import { sendVerificationEmail } from "../utilites/sendVerificationMail.js";

export const signup = async (req, res, next) => {
  try {
    // Extract the user's username, email, and password from the request body
    const { userName, userEmail, userPassword } = req.body;

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({
      $or: [{ userName }, { userEmail }],
    });

    // If a user with the same username or email already exists, return an error message
    if (existingUser) {
      if (existingUser.userName === userName) {
        return res
          .status(409)
          .json({ success: false, message: `Username "${userName}" is already taken` });
      }
      if (existingUser.userEmail === userEmail) {
        return res
          .status(409)
          .json({ success: false, message: `Email "${userEmail}" is already registered` });
      }
    }

    // Generate a token for email varification
    const verificationToken = jwt.sign(
      { userName, userEmail, userPassword },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send a verification email with the verification token
    const verificationLink = `https://localhost:${PORT}/api/auth/verity-email?token=${verificationToken}`;
    sendVerificationEmail(userEmail, verificationLink);

    // Send a success response
    return res
      .status(200)
      .json({ success: true, message: `Please check "${userEmail}" to verify your account.` });
  } catch (error) {
    // Pass any other errors to the error-handling middleware
    next(error);
  }
};

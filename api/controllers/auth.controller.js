import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
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
    const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}&email=${userEmail}`;
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

export const verifyEmail = async (req, res, next) => {
  try {
    // Extract the verification token from the request query parameters
    const { token } = req.query;

    // Checking the user has verification token
    if (!token) {
      return res.status(400).json({ success: false, message: "Missing verification token" });
    }

    // Verify the verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userName, userEmail, userPassword } = decoded;

    // Check if the user already exists
    let user = await User.findOne({ userEmail });
    if (user && user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: `"${userEmail}" is already verified` });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(userPassword, 10);

    // Create a new user with the verified email and hashed password
    if (!user) {
      user = new User({
        userName,
        userEmail,
        userPassword: hashedPassword,
        isVerified: true,
      });

      // Save the new user to the database
      await user.save();
    } else {
      // Update the existing user hashed password
      user.userPassword = hashedPassword;
      user.isVerified = true;
      await user.save();
    }

    // Generate a JWT token for login the user
    const authToken = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
        userEmail: user.userEmail,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the token in a cookie
    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    const { userPassword: pass, ...userInfo } = user._doc;

    // Send a success response
    return res
      .status(201)
      .json({ success: true, message: "Email verification successful", userInfo });
  } catch (error) {
    next(error);
  }
};

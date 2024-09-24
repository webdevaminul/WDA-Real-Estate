import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utilites/error.js";
import { sendVerificationEmail } from "../utilites/sendVerificationMail.js";
import { sendRecoveryMail } from "../utilites/sendRecoveryMail.js";

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
        return next(errorHandler(409, `Username "${userName}" is already taken`));
      } else if (existingUser.userEmail === userEmail) {
        return next(errorHandler(409, `Email "${userEmail}" is already registered`));
      }
    }

    // Generate a token for email varification
    const verificationToken = jwt.sign(
      { userName, userEmail, userPassword },
      process.env.JWT_ACCESS_TOKEN_SECRET
    );

    // Send a verification email with the verification token
    const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;
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

    // Return error if the token is not valid
    if (!token) {
      return next(errorHandler(401, "Invalid email verification token"));
    }

    // Verify the verification token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const { userName, userEmail, userPassword } = decoded;

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(userPassword, 10);

    // Check if the user already exists
    let user = await User.findOne({ userEmail });

    // Create a new user with the verified email and hashed password
    if (!user) {
      user = new User({
        userName,
        userEmail,
        userPassword: hashedPassword,
        isVerified: true,
        isGoogle: false,
      });

      // Save the new user to the database
      await user.save();
    }

    // Generate a JWT access token for login the user
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    // Generate a JWT refresh token for login the user
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: "180d" } // Refresh token expires in 6 months
    );

    // Set the refresh token in a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // 6 months in milliseconds
    });

    // Remove the password from the user object before sending it back to the client
    const { userPassword: pass, ...userInfo } = user._doc;

    // Send a success response
    return res.status(201).json({
      success: true,
      message: "Email verification successful",
      token: accessToken,
      userInfo,
    });
  } catch (error) {
    // Pass any other errors to the error-handling middleware
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    // Extract the user's email, and password from the request body
    const { userEmail, userPassword } = req.body;

    // Check if the user with the provided email exists
    const validUser = await User.findOne({ userEmail });

    // If the user is not found or not verified, return an error message
    if (!validUser || !validUser.isVerified) {
      return next(errorHandler(404, "Invalid email or password"));
    }

    // Compare the provided password with the hashed password stored in the database
    const validPassword = await bcryptjs.compare(userPassword, validUser.userPassword);

    // If the passwords do not match, return an error message
    if (!validPassword) {
      return next(errorHandler(400, "Invalid email or password"));
    }

    // Generate a JWT access token for login the user
    const accessToken = jwt.sign({ id: validUser._id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    // Generate a JWT refresh token for login the user
    const refreshToken = jwt.sign(
      { id: validUser._id },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: "180d" } // Refresh token expires in 6 months
    );

    // Set the refresh token in a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // 6 months in milliseconds
    });

    // Remove the password from the user object before sending it back to the client
    const { userPassword: pass, ...userInfo } = validUser._doc;

    // Send a success response
    return res
      .status(201)
      .json({ success: true, message: "Login successful", token: accessToken, userInfo });
  } catch (error) {
    // Pass any other errors to the error-handling middleware
    next(error);
  }
};

export const googleSignIn = async (req, res, next) => {
  try {
    // Extract the user's email, name, and profile picture from the request body
    const { userName, userEmail, userPhoto } = req.body;

    // Check if the user with the provided email exists
    const validUser = await User.findOne({ userEmail });

    if (validUser) {
      // Generate a JWT access token for login the user
      const accessToken = jwt.sign({ id: validUser._id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });

      // Generate a JWT refresh token for login the user
      const refreshToken = jwt.sign(
        { id: validUser._id },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: "180d" } // Refresh token expires in 6 months
      );

      // Set the refresh token in a cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // 6 months in milliseconds
      });

      // Remove the password from the user object before sending it back to the client
      const { userPassword: pass, ...userInfo } = validUser._doc;

      // Send a success response
      return res
        .status(201)
        .json({ success: true, message: "Google login successful", token: accessToken, userInfo });
    } else {
      // Generate a random 8-character password for the new user
      const generatedPassword = Math.random().toString(36).slice(-8);

      // Hash the password for the new user
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      // Create a new user with the verified email, hashed password, and profile picture
      const newUser = new User({
        userName,
        userEmail,
        userPassword: hashedPassword,
        isVerified: true,
        userPhoto,
        isGoogle: true,
      });

      // Save the new user to the database
      await newUser.save();

      // Generate a JWT access token for login the user
      const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });

      // Generate a JWT refresh token for login the user
      const refreshToken = jwt.sign(
        { id: validUser._id },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: "180d" } // Refresh token expires in 6 months
      );

      // Set the refresh token in a cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // 6 months in milliseconds
      });

      // Remove the password from the user object before sending it back to the client
      const { userPassword: pass, ...userInfo } = newUser._doc;

      // Send a success response
      return res.status(201).json({
        success: true,
        message: "Google registration successful",
        token: accessToken,
        userInfo,
      });
    }
  } catch (error) {
    // Pass any other errors to the error-handling middleware
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    // Clear the authentication token from the cookie
    res.clearCookie("refreshToken");

    // Send a success response
    return res.status(200).json({ success: true, message: "Signout successful" });
  } catch (error) {
    // Pass any other errors to the error-handling middleware
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    // Extract the refresh token from the cookie
    const refreshToken = req.cookies.refreshToken;

    // If the refresh token is missing return an error
    if (!refreshToken) {
      return next(errorHandler(401, "Missing refresh token. Please sign in again."));
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(403, "Invalid refresh token"));
      }

      // Generate a new access token
      const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });

      // Send a success response with the new access token
      return res.status(200).json({ success: true, token: newAccessToken });
    });
  } catch (error) {
    next(error);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    // Extract the user's email from the request body
    const { userEmail } = req.body;

    // Check if the email does not exists in the database
    const existingUser = await User.findOne({ userEmail });

    // If user not found with the same email, return an error message
    if (!existingUser) {
      return next(errorHandler(404, `No user found with email "${userEmail}"`));
    }

    // Generate a token for email varification
    const recoveryToken = jwt.sign({ userEmail }, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });

    // Send a recovery email with the verification token
    const recoveryLink = `http://localhost:5173/password-recovery?token=${recoveryToken}`;
    sendRecoveryMail(userEmail, recoveryLink);

    // Send a success response
    return res.status(200).json({
      success: true,
      message: `Please check "${userEmail}" to reset your password. Recovery link is valid for 5 minutes.`,
    });
  } catch (error) {
    next(error);
  }
};

export const recoverPassword = async (req, res, next) => {
  try {
    // Extract the verification token from the request query parameters
    const { token } = req.query;

    // Extract the new password from the request body
    const { newPassword } = req.body;

    // Check if newPassword is valid
    if (!newPassword) {
      return next(errorHandler(400, "New password is required"));
    }

    // Return an error if the token is not present
    if (!token) {
      return next(errorHandler(400, "Token is missing or invalid"));
    }

    let decodedToken;
    let userEmail;

    // Verify and decode the token
    try {
      decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
      userEmail = decodedToken.userEmail;
    } catch (error) {
      // This block will catch tampered or expired tokens
      return next(errorHandler(401, "Invalid or expired token. Password not changed."));
    }

    // Ensure the user with this email exists in the database
    const existingUser = await User.findOne({ userEmail });

    // If user not found, return an error
    if (!existingUser) {
      return next(errorHandler(404, `No user found with email "${userEmail}"`));
    }

    // Hash the new password
    const hashedPassword = bcryptjs.hashSync(newPassword, 10);

    // Update the user's password only if the token is valid and the user is found
    await User.findOneAndUpdate(
      { userEmail }, // Find by the userEmail
      { $set: { userPassword: hashedPassword } }, // Update the password
      { new: true } // Return the updated document
    );

    // Send a success response
    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully, you can sign in now." });
  } catch (error) {
    next(error);
  }
};

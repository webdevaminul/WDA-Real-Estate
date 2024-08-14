import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  try {
    const { userName, userEmail, userPassword } = req.body;

    // Check if the username or email already exists in the database
    const existingUserName = await User.findOne({ userName });
    const existingUserEmail = await User.findOne({ userEmail });

    // Check if the username already exists
    if (existingUserName) {
      return res
        .status(409)
        .json({ success: false, message: `Username "${userName}" is already taken.` });
    }

    // Check if the email already exists
    if (existingUserEmail) {
      return res
        .status(409)
        .json({ success: false, message: `Email "${userEmail}" is already registered.` });
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(userPassword, 10);

    // Create a new user with the data from the request body
    const newUser = new User({
      userName,
      userEmail,
      userPassword: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Send a success response
    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    // Pass any other errors to the error-handling middleware
    next(error);
  }
};

import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  try {
    const { userName, userEmail, userPassword } = req.body;
    const hashedPassword = bcryptjs.hashSync(userPassword, 10);
    // Create a new user instance with the data from the request body
    const newUser = new User({
      userName,
      userEmail,
      userPassword: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: "User saved successfully" });
  } catch (error) {
    // Handle errors and send an appropriate response
    next(error);
  }
};

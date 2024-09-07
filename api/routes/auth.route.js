import express from "express";
import {
  googleSignIn,
  signin,
  signOut,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";

// Create a new Express router instance
const router = express.Router();

router.post("/signup", signup); // Handle user registration
router.get("/verify-email", verifyEmail); // Handle email verification after user clicks the verification link
router.post("/signin", signin); // Handle user login
router.post("/google", googleSignIn); // Handle google sign in
router.get("/sign-out", signOut); // Handle sign out user

export default router;

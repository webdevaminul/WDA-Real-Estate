import express from "express";
import {
  forgetPassword,
  googleSignIn,
  recoverPassword,
  refreshAccessToken,
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
router.post("/forget-password", forgetPassword); // Handle user forget password
router.post("/recover-password", recoverPassword); // Handle user recover password
router.get("/refresh-token", refreshAccessToken); // Handle refreshing  access token

export default router;

import express from "express";
import { signup, verifyEmail } from "../controllers/auth.controller.js";

// Create a new Express router instance
const router = express.Router();

router.post("/signup", signup); // Handle user registration
router.get("/verify-email", verifyEmail); // Handle email verification after user clicks the verification link

export default router;

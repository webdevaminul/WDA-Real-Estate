import express from "express";
import { createProperty } from "../controllers/property.controller.js";
import { verifyToken } from "../utilites/verifyToken.js";

// Create a new Express router instance
const router = express.Router();

router.post("/create", createProperty);

export default router;

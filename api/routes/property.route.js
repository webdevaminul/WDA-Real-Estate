import express from "express";
import { createProperty, getProperties } from "../controllers/property.controller.js";
import { verifyToken } from "../utilites/verifyToken.js";

// Create a new Express router instance
const router = express.Router();

router.post("/create", verifyToken, createProperty);
router.get("/list/:id", verifyToken, getProperties);

export default router;

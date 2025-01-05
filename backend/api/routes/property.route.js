import express from "express";
import {
  createProperty,
  getUserProperties,
  deleteProperty,
  getSpecificProperty,
  updateProperty,
  getAllProperties,
  incrementPropertyViews,
  getPopularProperties,
} from "../controllers/property.controller.js";
import { verifyToken } from "../utilites/verifyToken.js";

// Create a new Express router instance
const router = express.Router();

router.post("/create", verifyToken, createProperty);
router.get("/list/:id", verifyToken, getUserProperties);
router.delete("/delete/:propertyId", verifyToken, deleteProperty);
router.get("/specific/:propertyId", getSpecificProperty);
router.patch("/update/:propertyId", verifyToken, updateProperty);
router.post("/all-properties", getAllProperties);
router.get("/increment-views/:propertyId", incrementPropertyViews);
router.get("/popular", getPopularProperties);

export default router;

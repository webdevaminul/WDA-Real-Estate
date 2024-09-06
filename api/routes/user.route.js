import express from "express";
import { changePassword, deleteAccount, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utilites/verifyToken.js";

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.post("/change-password/:id", verifyToken, changePassword);
router.delete("/delete-account/:id", verifyToken, deleteAccount);

export default router;

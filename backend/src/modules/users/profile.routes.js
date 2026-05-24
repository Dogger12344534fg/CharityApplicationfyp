import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfilePicture,
} from "./profile.controller.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user profile with stats
router.get("/", getUserProfile);

// Update user profile
router.put("/", updateUserProfile);

// Change password
router.post("/change-password", changePassword);

// Upload profile picture
router.post("/avatar", upload.single("avatar"), uploadProfilePicture);

export default router;

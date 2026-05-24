import express from "express";
import {
  getAllUsersAdmin,
  getUserById,
  updateUserStatus,
  getDonorStats,
  updateUserProfile,
  deleteUser,
} from "./user.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";

const router = express.Router();

// Get summary statistics for the admin dashboard
router.get("/admin/stats", authMiddleware, verifyRole("admin"), getDonorStats);

// Get all users with filters and pagination
router.get("/admin/all", authMiddleware, verifyRole("admin"), getAllUsersAdmin);

// Get a single user by ID
router.get("/admin/:id", authMiddleware, verifyRole("admin"), getUserById);

// Update a user's status (active/inactive/suspended)
router.patch("/admin/:id/status", authMiddleware, verifyRole("admin"), updateUserStatus);

// Update a user's profile information
router.put("/admin/:id", authMiddleware, verifyRole("admin"), updateUserProfile);

// Delete a user (admin only)
router.delete("/admin/:id", authMiddleware, verifyRole("admin"), deleteUser);

export default router;

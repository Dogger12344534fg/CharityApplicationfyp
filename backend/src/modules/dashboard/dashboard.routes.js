import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";
import { getDashboardStats } from "./dashboard.controller.js";

const router = express.Router();

// GET /api/dashboard/stats - Admin dashboard statistics
router.get("/stats", authMiddleware, verifyRole("admin"), getDashboardStats);

export default router;
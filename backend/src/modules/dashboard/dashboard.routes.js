import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";
import { getDashboardStats, getPublicStats } from "./dashboard.controller.js";

const router = express.Router();

// GET /api/dashboard/public-stats - Public platform statistics (no auth)
router.get("/public-stats", getPublicStats);

// GET /api/dashboard/stats - Admin dashboard statistics
router.get("/stats", authMiddleware, verifyRole("admin"), getDashboardStats);

export default router;
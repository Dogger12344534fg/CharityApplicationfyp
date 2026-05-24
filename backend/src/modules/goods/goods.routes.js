import express from "express";
import upload from "../../middleware/upload.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";
import {
	createGoodsDonation,
	getAllGoodsDonations,
	getGoodsDonationsByCampaign,
	getMyGoodsDonations,
	getGoodsDonationById,
	updateGoodsDonation,
	deleteGoodsDonation,
	verifyGoodsDonation,
	rejectGoodsDonation,
	schedulePickup,
	markAsCollected,
	markAsDelivered,
	markAsCompleted,
	getGoodsDonationStats,
} from "./goods.controller.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────────────────
// Get goods donations for a specific campaign (public can see completed donations)
router.get("/campaign/:campaignId", getGoodsDonationsByCampaign);

// ─── Authenticated User Routes ────────────────────────────────────────────────
router.use(authMiddleware);

// User routes
router.get("/my-donations", getMyGoodsDonations);
router.post("/", upload.array("images", 20), createGoodsDonation); // Support multiple images
router.get("/:id", getGoodsDonationById);
router.put("/:id", upload.array("images", 20), updateGoodsDonation);
router.delete("/:id", deleteGoodsDonation);

// ─── Admin Only Routes ────────────────────────────────────────────────────────
router.use(verifyRole("admin"));

// Admin management routes
router.get("/admin/all", getAllGoodsDonations);
router.get("/admin/stats", getGoodsDonationStats);

// Status management routes
router.patch("/:id/verify", verifyGoodsDonation);
router.patch("/:id/reject", rejectGoodsDonation);
router.patch("/:id/schedule", schedulePickup);
router.patch("/:id/collect", markAsCollected);
router.patch("/:id/deliver", markAsDelivered);
router.patch("/:id/complete", markAsCompleted);

export default router;

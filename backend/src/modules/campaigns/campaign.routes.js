import express from "express";
import upload from "../../middleware/upload.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";
import {
	createCampaign,
	deleteCampaign,
	getAllCampaigns,
	getCampaignById,
	getMyCampaigns,
	updateCampaign,
	approveCampaign,
	rejectCampaign,
	suspendCampaign,
	unsuspendCampaign,
} from "./campaign.controller.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────────────────
router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);

// ─── Authenticated User Routes ────────────────────────────────────────────────
router.use(authMiddleware);

router.post("/", upload.single("image"), createCampaign);
router.get("/user/my-campaigns", getMyCampaigns);
router.put("/:id", upload.single("image"), updateCampaign);
router.delete("/:id", deleteCampaign);

// ─── Admin Only Routes ────────────────────────────────────────────────────────
router.use(verifyRole("admin"));

router.patch("/:id/approve", approveCampaign);
router.patch("/:id/reject", rejectCampaign);
router.patch("/:id/suspend", suspendCampaign);
router.patch("/:id/unsuspend", unsuspendCampaign);

export default router;

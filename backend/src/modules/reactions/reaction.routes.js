import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  toggleReaction,
  getMyReaction,
  getCampaignReactions,
} from "./reaction.controller.js";

const router = express.Router({ mergeParams: true });
// mergeParams: true → gets :campaignId from parent router

// GET  /api/campaigns/:campaignId/reactions          → reaction counts (public)
router.get("/", getCampaignReactions);

// GET  /api/campaigns/:campaignId/reactions/mine     → my reaction (auth)
router.get("/mine", authMiddleware, getMyReaction);

// POST /api/campaigns/:campaignId/reactions          → toggle reaction (auth)
// body: { type: "love" | "support" | "sad" | "grateful" | "urgent" }
router.post("/", authMiddleware, toggleReaction);

export default router;

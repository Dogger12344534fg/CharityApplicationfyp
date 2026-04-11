import express from "express";
import upload from "../../middleware/upload.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";
import {
  addComment,
  getCampaignComments,
  deleteComment,
  togglePinComment,
  likeComment,
} from "./comment.controller.js";

const router = express.Router({ mergeParams: true });
// mergeParams: true → gets :campaignId from parent router

// GET  /api/campaigns/:campaignId/comments           → all comments (public)
router.get("/", getCampaignComments);

// Auth required below
router.use(authMiddleware);

// POST /api/campaigns/:campaignId/comments           → add comment (with optional photos/videos)
// FormData: text (optional), media[] (up to 4 files)
router.post("/", upload.array("media", 4), addComment);

// DELETE /api/campaigns/:campaignId/comments/:commentId
router.delete("/:commentId", deleteComment);

// PATCH /api/campaigns/:campaignId/comments/:commentId/pin  → organizer/admin only
router.patch("/:commentId/pin", togglePinComment);

// POST /api/campaigns/:campaignId/comments/:commentId/like
router.post("/:commentId/like", likeComment);

export default router;

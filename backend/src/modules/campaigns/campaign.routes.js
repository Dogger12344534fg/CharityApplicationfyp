import express from "express";
import jwt from "jsonwebtoken";
import upload from "../../middleware/upload.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";

// Sets req.user if a valid Bearer token is present, but never rejects
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, _id: decoded.id, role: decoded.role };
    } catch {
      // invalid/expired token — ignore, treat as unauthenticated
    }
  }
  next();
};
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
import commentRouter from "../comments/comment.routes.js";
import reactionRouter from "../reactions/reaction.routes.js";

const router = express.Router();

router.use("/:campaignId/comments", commentRouter);

router.use("/:campaignId/reactions", reactionRouter);

router.get("/", getAllCampaigns);
router.get("/:id", optionalAuth, getCampaignById);

router.use(authMiddleware);

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  createCampaign,
);

router.get("/user/my-campaigns", getMyCampaigns);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  updateCampaign,
);

router.delete("/:id", deleteCampaign);

router.use(verifyRole("admin"));

router.patch("/:id/approve", approveCampaign);
router.patch("/:id/reject", rejectCampaign);
router.patch("/:id/suspend", suspendCampaign);
router.patch("/:id/unsuspend", unsuspendCampaign);

export default router;

import express from "express";
import upload from "../../middleware/upload.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";
import {
  createTeam, getAllTeams, getAllTeamsAdmin, getTeamById, getMyTeams,
  updateTeam, deleteTeam, joinTeam, leaveTeam, removeMember,
  inviteMembers, addCampaignToTeam, getLeaderboard, getTeamMessages,
  approveJoinRequest, rejectJoinRequest,
  approveTeam, rejectTeam, suspendTeam, unsuspendTeam,
  validateInviteToken, acceptInvite,
} from "./team.controller.js";

const router = express.Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.get("/leaderboard", getLeaderboard);
router.get("/", getAllTeams);
router.get("/invite/:token", validateInviteToken);
router.get("/:id", getTeamById);

// ─── Authenticated ────────────────────────────────────────────────────────────
router.use(authMiddleware);

router.get("/user/my-teams", getMyTeams);
router.get("/:id/messages", getTeamMessages);

router.post("/", upload.single("avatar"), createTeam);
router.put("/:id", upload.single("avatar"), updateTeam);
router.delete("/:id", deleteTeam);

// POST /:id/join → creates a join REQUEST (no longer direct membership)
router.post("/:id/join", joinTeam);
router.post("/:id/leave", leaveTeam);
router.post("/:id/invite", inviteMembers);
router.post("/:id/campaign", addCampaignToTeam);
router.delete("/:id/members/:memberId", removeMember);

// ─── Join request approval (team admin or site admin) ─────────────────────────
router.post("/:id/join-requests/:requestId/approve", approveJoinRequest);
router.post("/:id/join-requests/:requestId/reject", rejectJoinRequest);

// ─── Invite token acceptance (authenticated) ──────────────────────────────────
router.post("/invite/:token/accept", acceptInvite);

// ─── Site Admin Only ──────────────────────────────────────────────────────────
router.use(verifyRole("admin"));

router.get("/admin/all", getAllTeamsAdmin);
router.patch("/:id/approve", approveTeam);
router.patch("/:id/reject", rejectTeam);
router.patch("/:id/suspend", suspendTeam);
router.patch("/:id/unsuspend", unsuspendTeam);

export default router;
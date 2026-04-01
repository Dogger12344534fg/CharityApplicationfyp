import express from "express";
import upload from "../../middleware/upload.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";
import {
  createTeam,
  getAllTeams,
  getAllTeamsAdmin,
  getTeamById,
  getMyTeams,
  updateTeam,
  deleteTeam,
  joinTeam,
  leaveTeam,
  removeMember,
  inviteMembers,
  addCampaignToTeam,
  getLeaderboard,
  approveTeam,
  rejectTeam,
  suspendTeam,
  unsuspendTeam,
} from "./team.controller.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────────────────
// IMPORTANT: specific string routes MUST come before /:id
// otherwise /:id swallows everything (e.g. /leaderboard → id = "leaderboard")
router.get("/leaderboard", getLeaderboard);
router.get("/", getAllTeams);
router.get("/:id", getTeamById);

// ─── Authenticated User Routes ────────────────────────────────────────────────
router.use(authMiddleware);

// IMPORTANT: /user/my-teams must come BEFORE /:id or it is unreachable
// The public /:id route above would have matched — but router.use(authMiddleware)
// means we are now in a fresh middleware chain, so /user/my-teams is fine here.
router.get("/user/my-teams", getMyTeams);
router.post("/", upload.single("avatar"), createTeam);
router.put("/:id", upload.single("avatar"), updateTeam);
router.delete("/:id", deleteTeam);

router.post("/:id/join", joinTeam);
router.post("/:id/leave", leaveTeam);
router.post("/:id/invite", inviteMembers);
router.post("/:id/campaign", addCampaignToTeam);
router.delete("/:id/members/:memberId", removeMember);

// ─── Admin Only Routes ────────────────────────────────────────────────────────
router.use(verifyRole("admin"));

router.get("/admin/all", getAllTeamsAdmin); // GET all teams regardless of status
router.patch("/:id/approve", approveTeam);
router.patch("/:id/reject", rejectTeam);
router.patch("/:id/suspend", suspendTeam);
router.patch("/:id/unsuspend", unsuspendTeam);

export default router;

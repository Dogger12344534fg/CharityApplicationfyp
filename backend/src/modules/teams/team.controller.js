import {
  createTeamService,
  getAllTeamsService,
  getAllTeamsAdminService,
  getTeamByIdService,
  getMyTeamsService,
  updateTeamService,
  deleteTeamService,
  joinTeamService,
  leaveTeamService,
  removeMemberService,
  inviteMembersService,
  addCampaignToTeamService,
  getTeamLeaderboardService,
  approveTeamService,
  rejectTeamService,
  suspendTeamService,
  unsuspendTeamService,
} from "./team.service.js";

// ─── Shared error status resolver ────────────────────────────────────────────
const resolveStatus = (message) => {
  if (message.includes("not found")) return 404;
  if (message.includes("Not authorized")) return 403;
  if (message.includes("private")) return 403;
  if (message.includes("not active")) return 403;
  if (message.includes("already")) return 409;
  if (
    message.includes("Cannot remove") ||
    message.includes("owner") ||
    message.includes("Only") ||
    message.includes("cannot")
  )
    return 422;
  return 400;
};

// ─── Create Team ──────────────────────────────────────────────────────────────
export const createTeam = async (req, res) => {
  try {
    const team = await createTeamService({
      body: req.body,
      file: req.file,
      userId: req.user._id,
    });
    return res.status(201).json({
      success: true,
      message:
        "Team created successfully. It will be visible once approved by an admin.",
      data: team,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Get All Teams (public — active only) ────────────────────────────────────
export const getAllTeams = async (req, res) => {
  try {
    const result = await getAllTeamsService(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get All Teams for Admin (all statuses) ───────────────────────────────────
export const getAllTeamsAdmin = async (req, res) => {
  try {
    const result = await getAllTeamsAdminService(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Team By ID ───────────────────────────────────────────────────────────
export const getTeamById = async (req, res) => {
  try {
    const team = await getTeamByIdService(req.params.id);
    return res.status(200).json({ success: true, data: team });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Get My Teams ─────────────────────────────────────────────────────────────
export const getMyTeams = async (req, res) => {
  try {
    const result = await getMyTeamsService({
      userId: req.user._id,
      query: req.query,
    });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Team ──────────────────────────────────────────────────────────────
export const updateTeam = async (req, res) => {
  try {
    const team = await updateTeamService({
      id: req.params.id,
      body: req.body,
      file: req.file,
      userId: req.user._id,
      userRole: req.user.role,
    });
    return res.status(200).json({
      success: true,
      message: "Team updated successfully.",
      data: team,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Delete Team ──────────────────────────────────────────────────────────────
export const deleteTeam = async (req, res) => {
  try {
    const result = await deleteTeamService({
      id: req.params.id,
      userId: req.user._id,
      userRole: req.user.role,
    });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Join Team ────────────────────────────────────────────────────────────────
export const joinTeam = async (req, res) => {
  try {
    const team = await joinTeamService({
      id: req.params.id,
      userId: req.user._id,
    });
    return res.status(200).json({
      success: true,
      message: "You have joined the team.",
      data: team,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Leave Team ───────────────────────────────────────────────────────────────
export const leaveTeam = async (req, res) => {
  try {
    const result = await leaveTeamService({
      id: req.params.id,
      userId: req.user._id,
    });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Remove Member ────────────────────────────────────────────────────────────
export const removeMember = async (req, res) => {
  try {
    const team = await removeMemberService({
      id: req.params.id,
      memberId: req.params.memberId,
      userId: req.user._id,
      userRole: req.user.role,
    });
    return res
      .status(200)
      .json({ success: true, message: "Member removed.", data: team });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Invite Members ───────────────────────────────────────────────────────────
export const inviteMembers = async (req, res) => {
  try {
    const { emails } = req.body;
    if (!Array.isArray(emails) || emails.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "emails array is required." });

    const result = await inviteMembersService({
      id: req.params.id,
      emails,
      userId: req.user._id,
    });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Add Campaign to Team ─────────────────────────────────────────────────────
export const addCampaignToTeam = async (req, res) => {
  try {
    const { campaignId } = req.body;
    if (!campaignId)
      return res
        .status(400)
        .json({ success: false, message: "campaignId is required." });

    const team = await addCampaignToTeamService({
      id: req.params.id,
      campaignId,
      userId: req.user._id,
    });
    return res
      .status(200)
      .json({ success: true, message: "Campaign added to team.", data: team });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export const getLeaderboard = async (req, res) => {
  try {
    const teams = await getTeamLeaderboardService(req.query.limit ?? 10);
    return res.status(200).json({ success: true, data: teams });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN APPROVAL CONTROLLERS
// ═════════════════════════════════════════════════════════════════════════════

// ─── Approve Team ─────────────────────────────────────────────────────────────
export const approveTeam = async (req, res) => {
  try {
    const team = await approveTeamService({
      id: req.params.id,
      adminId: req.user._id,
    });
    return res.status(200).json({
      success: true,
      message: "Team approved and set to active.",
      data: team,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Reject Team ──────────────────────────────────────────────────────────────
export const rejectTeam = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const team = await rejectTeamService({
      id: req.params.id,
      rejectionReason,
      adminId: req.user._id,
    });
    return res
      .status(200)
      .json({ success: true, message: "Team has been rejected.", data: team });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Suspend Team ─────────────────────────────────────────────────────────────
export const suspendTeam = async (req, res) => {
  try {
    const { suspendedReason } = req.body;
    const team = await suspendTeamService({
      id: req.params.id,
      suspendedReason,
      adminId: req.user._id,
    });
    return res
      .status(200)
      .json({ success: true, message: "Team has been suspended.", data: team });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Unsuspend Team ───────────────────────────────────────────────────────────
export const unsuspendTeam = async (req, res) => {
  try {
    const team = await unsuspendTeamService({
      id: req.params.id,
      adminId: req.user._id,
    });
    return res.status(200).json({
      success: true,
      message: "Team has been reactivated.",
      data: team,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

import {
  createTeamService, getAllTeamsService, getAllTeamsAdminService,
  getTeamByIdService, getMyTeamsService, updateTeamService,
  deleteTeamService, joinTeamService, leaveTeamService,
  removeMemberService, inviteMembersService, addCampaignToTeamService,
  getTeamLeaderboardService, approveJoinRequestService,
  rejectJoinRequestService, approveTeamService, rejectTeamService,
  suspendTeamService, unsuspendTeamService,
  validateInviteTokenService, acceptInviteService,
} from "./team.service.js";
import Message from "./message.model.js";
import Team from "./team.model.js";

// ─── Null-safe error status resolver ─────────────────────────────────────────
// The old version crashed when error.message was undefined — undefined.includes()
// throws a TypeError, which Express catches and silently returns a 500.
const resolveStatus = (message) => {
  if (!message || typeof message !== "string") return 500;
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
  ) return 422;
  return 400;
};

// ─── Unified error responder ──────────────────────────────────────────────────
// Logs the FULL error object (with stack) so you can see the real cause
// in your terminal instead of just [object Object].
const handleError = (res, error, context = "") => {
  console.error(`[TeamController/${context}] error:`, JSON.stringify(error, null, 2), error);
  const message = error?.message || (typeof error === "string" ? error : JSON.stringify(error));
  const status = resolveStatus(message);
  return res.status(status).json({
    success: false,
    message: message ?? "An unexpected error occurred.",
  });
};

export const createTeam = async (req, res) => {
  try {
    const team = await createTeamService({
      body: req.body,
      file: req.file,
      userId: req.user._id,
    });
    return res.status(201).json({
      success: true,
      message: "Team created successfully. It will be visible once approved by an admin.",
      data: team,
    });
  } catch (error) {
    return handleError(res, error, "createTeam");
  }
};

export const getAllTeams = async (req, res) => {
  try {
    const result = await getAllTeamsService(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return handleError(res, error, "getAllTeams");
  }
};

export const getAllTeamsAdmin = async (req, res) => {
  try {
    const result = await getAllTeamsAdminService(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return handleError(res, error, "getAllTeamsAdmin");
  }
};

export const getTeamById = async (req, res) => {
  try {
    const team = await getTeamByIdService(req.params.id);
    return res.status(200).json({ success: true, data: team });
  } catch (error) {
    return handleError(res, error, "getTeamById");
  }
};

export const getMyTeams = async (req, res) => {
  try {
    const result = await getMyTeamsService({ userId: req.user._id, query: req.query });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return handleError(res, error, "getMyTeams");
  }
};

export const updateTeam = async (req, res) => {
  try {
    const team = await updateTeamService({
      id: req.params.id, body: req.body, file: req.file,
      userId: req.user._id, userRole: req.user.role,
    });
    return res.status(200).json({ success: true, message: "Team updated successfully.", data: team });
  } catch (error) {
    return handleError(res, error, "updateTeam");
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const result = await deleteTeamService({
      id: req.params.id, userId: req.user._id, userRole: req.user.role,
    });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return handleError(res, error, "deleteTeam");
  }
};

// POST /:id/join — creates a request, not direct membership
export const joinTeam = async (req, res) => {
  try {
    const result = await joinTeamService({
      id: req.params.id,
      userId: req.user._id,
      message: req.body?.message,
    });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return handleError(res, error, "joinTeam");
  }
};

export const approveJoinRequest = async (req, res) => {
  try {
    const team = await approveJoinRequestService({
      id: req.params.id,
      requestId: req.params.requestId,
      userId: req.user._id,
      userRole: req.user.role,
    });
    return res.status(200).json({
      success: true,
      message: "Join request approved. User is now a member.",
      data: team,
    });
  } catch (error) {
    return handleError(res, error, "approveJoinRequest");
  }
};

export const rejectJoinRequest = async (req, res) => {
  try {
    const result = await rejectJoinRequestService({
      id: req.params.id,
      requestId: req.params.requestId,
      userId: req.user._id,
      userRole: req.user.role,
    });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return handleError(res, error, "rejectJoinRequest");
  }
};

export const leaveTeam = async (req, res) => {
  try {
    const result = await leaveTeamService({ id: req.params.id, userId: req.user._id });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return handleError(res, error, "leaveTeam");
  }
};

export const removeMember = async (req, res) => {
  try {
    const team = await removeMemberService({
      id: req.params.id, memberId: req.params.memberId,
      userId: req.user._id, userRole: req.user.role,
    });
    return res.status(200).json({ success: true, message: "Member removed.", data: team });
  } catch (error) {
    return handleError(res, error, "removeMember");
  }
};

export const inviteMembers = async (req, res) => {
  try {
    const { emails } = req.body;
    if (!Array.isArray(emails) || emails.length === 0)
      return res.status(400).json({ success: false, message: "emails array is required." });

    const result = await inviteMembersService({ id: req.params.id, emails, userId: req.user._id });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return handleError(res, error, "inviteMembers");
  }
};

export const addCampaignToTeam = async (req, res) => {
  try {
    const { campaignId } = req.body;
    if (!campaignId)
      return res.status(400).json({ success: false, message: "campaignId is required." });

    const team = await addCampaignToTeamService({ id: req.params.id, campaignId, userId: req.user._id });
    return res.status(200).json({ success: true, message: "Campaign added to team.", data: team });
  } catch (error) {
    return handleError(res, error, "addCampaignToTeam");
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const teams = await getTeamLeaderboardService(req.query.limit ?? 10);
    return res.status(200).json({ success: true, data: teams });
  } catch (error) {
    return handleError(res, error, "getLeaderboard");
  }
};

export const getTeamMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50, before } = req.query;

    const team = await Team.findById(id).lean();
    if (!team)
      return res.status(404).json({ success: false, message: "Team not found." });

    const uid = req.user._id.toString();
    const isMember =
      team.createdBy.toString() === uid ||
      team.members.some((m) => m.user.toString() === uid);

    if (!isMember)
      return res.status(403).json({ success: false, message: "Not a team member." });

    const filter = { team: id };
    if (before) filter.createdAt = { $lt: new Date(before) };

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(parseInt(limit), 100))
      .populate("sender", "name email")
      .lean();

    return res.status(200).json({ success: true, data: messages.reverse() });
  } catch (error) {
    return handleError(res, error, "getTeamMessages");
  }
};

export const approveTeam = async (req, res) => {
  try {
    const team = await approveTeamService({ id: req.params.id, adminId: req.user._id });
    return res.status(200).json({ success: true, message: "Team approved and set to active.", data: team });
  } catch (error) {
    return handleError(res, error, "approveTeam");
  }
};

export const rejectTeam = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const team = await rejectTeamService({ id: req.params.id, rejectionReason, adminId: req.user._id });
    return res.status(200).json({ success: true, message: "Team has been rejected.", data: team });
  } catch (error) {
    return handleError(res, error, "rejectTeam");
  }
};

export const suspendTeam = async (req, res) => {
  try {
    const { suspendedReason } = req.body;
    const team = await suspendTeamService({ id: req.params.id, suspendedReason, adminId: req.user._id });
    return res.status(200).json({ success: true, message: "Team has been suspended.", data: team });
  } catch (error) {
    return handleError(res, error, "suspendTeam");
  }
};

export const unsuspendTeam = async (req, res) => {
  try {
    const team = await unsuspendTeamService({ id: req.params.id, adminId: req.user._id });
    return res.status(200).json({ success: true, message: "Team has been reactivated.", data: team });
  } catch (error) {
    return handleError(res, error, "unsuspendTeam");
  }
};

// ─── Validate invite token (public) ──────────────────────────────────────────
export const validateInviteToken = async (req, res) => {
  try {
    const result = await validateInviteTokenService(req.params.token);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return handleError(res, error, "validateInviteToken");
  }
};

// ─── Accept invite (authenticated) ───────────────────────────────────────────
export const acceptInvite = async (req, res) => {
  try {
    const team = await acceptInviteService({ token: req.params.token, userId: req.user._id });
    return res.status(200).json({
      success: true,
      message: "You've successfully joined the team!",
      data: team,
    });
  } catch (error) {
    return handleError(res, error, "acceptInvite");
  }
};
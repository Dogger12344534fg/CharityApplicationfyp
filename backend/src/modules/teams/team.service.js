import crypto from "crypto";
import Team from "./team.model.js";
import cloudinary from "../../config/cloudinary.js";
import User from "../users/user.model.js";
import sendEmail, { sendThemedEmail } from "../../services/mail.service.js";

const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const generateInviteToken = () => crypto.randomBytes(32).toString("hex");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const findTeamOrThrow = async (id) => {
  const team = await Team.findById(id);
  if (!team) throw new Error("Team not found.");
  return team;
};

const populateTeam = (query) =>
  query
    .populate("createdBy", "name email")
    .populate("members.user", "name email")
    .populate("approvedBy", "name email")
    .populate("campaigns", "title status raisedAmount goalAmount images")
    .populate("joinRequests.user", "name email")
    .exec();

export const createTeamService = async ({ body, file, userId }) => {
  const { name, description, location, privacy, category, goalAmount, website, inviteEmails } = body;

  if (!file) {
    throw new Error("Team photo is required.");
  }

  const numericGoal = Number(goalAmount);
  if (numericGoal > 200000) {
    throw new Error("Fundraising goal cannot exceed NPR 2,00,000.");
  }

  let emails = [];
  if (inviteEmails) {
    try { emails = JSON.parse(inviteEmails); }
    catch { emails = inviteEmails.split(",").map((e) => e.trim()).filter(Boolean); }
  }

  let avatar = null;
  if (file) avatar = { url: file.path, publicId: file.filename };

  const team = await Team.create({
    name, description, location,
    privacy: privacy ?? "public",
    category, goalAmount: numericGoal,
    website: website || null,
    createdBy: userId, avatar,
    status: "pending",
    invites: emails.map((email) => ({ email })),
    members: [{ user: userId, role: "admin" }],
  });

  try {
    const user = await User.findById(userId);
    if (user && user.email) {
      await sendThemedEmail(
        user.email,
        "Team Created - Pending Approval",
        "Your Team is Under Review",
        `Hi ${user.name}, your team "${name}" has been successfully created and is currently pending admin approval.`,
        "<p style='margin:0'>We will review your team details shortly. You will be notified once it is approved.</p>",
        "View Teams",
        `${FRONTEND_URL}/teams`
      );
    }
  } catch (error) {
    console.error("Failed to send team creation email:", error);
  }

  return team;
};

export const getAllTeamsService = async (query) => {
  const { page = 1, limit = 12, search, category, privacy, sortBy = "raisedAmount", order = "desc" } = query;

  const filter = { status: "active" };
  if (privacy) filter.privacy = privacy;
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [teams, total] = await Promise.all([
    populateTeam(Team.find(filter).sort({ [sortBy]: order === "asc" ? 1 : -1 }).skip(skip).limit(parseInt(limit))),
    Team.countDocuments(filter),
  ]);

  return { teams, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } };
};

export const getAllTeamsAdminService = async (query) => {
  const { page = 1, limit = 20, search, category, status, sortBy = "createdAt", order = "desc" } = query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [teams, total] = await Promise.all([
    populateTeam(Team.find(filter).sort({ [sortBy]: order === "asc" ? 1 : -1 }).skip(skip).limit(parseInt(limit))),
    Team.countDocuments(filter),
  ]);

  return { teams, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } };
};

export const getTeamByIdService = async (id) => {
  const team = await populateTeam(Team.findById(id));
  if (!team) throw new Error("Team not found.");
  return team;
};

export const getMyTeamsService = async ({ userId, query }) => {
  const { page = 1, limit = 10 } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const filter = { $or: [{ createdBy: userId }, { "members.user": userId }] };

  const [teams, total] = await Promise.all([
    populateTeam(Team.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))),
    Team.countDocuments(filter),
  ]);

  return { teams, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } };
};

export const updateTeamService = async ({ id, body, file, userId, userRole }) => {
  const team = await findTeamOrThrow(id);

  const isAdmin =
    userRole === "admin" ||
    team.createdBy.toString() === userId.toString() ||
    team.members.some((m) => m.user.toString() === userId.toString() && m.role === "admin");

  if (!isAdmin) throw new Error("Not authorized to update this team.");

  const { name, description, location, privacy, category, goalAmount, website } = body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (location !== undefined) updates.location = location;
  if (privacy !== undefined) updates.privacy = privacy;
  if (category !== undefined) updates.category = category;
  if (goalAmount !== undefined) updates.goalAmount = Number(goalAmount);
  if (website !== undefined) updates.website = website;

  if (file) {
    if (team.avatar?.publicId) await cloudinary.uploader.destroy(team.avatar.publicId);
    updates.avatar = { url: file.path, publicId: file.filename };
  }

  return populateTeam(Team.findByIdAndUpdate(id, updates, { new: true, runValidators: true }));
};

export const deleteTeamService = async ({ id, userId, userRole }) => {
  const team = await findTeamOrThrow(id);
  const isOwner = userRole === "admin" || team.createdBy.toString() === userId.toString();
  if (!isOwner) throw new Error("Not authorized to delete this team.");

  if (team.avatar?.publicId) await cloudinary.uploader.destroy(team.avatar.publicId);
  await team.deleteOne();
  return { message: "Team deleted successfully." };
};

// ─── Request to Join ──────────────────────────────────────────────────────────
// POST /:id/join now creates a join REQUEST; admin must approve before user
// becomes a member and can access team chat.
export const joinTeamService = async ({ id, userId, message }) => {
  const team = await findTeamOrThrow(id);

  if (team.status !== "active")
    throw new Error("This team is not active and cannot be joined.");

  if (team.createdBy.toString() === userId.toString())
    throw new Error("You are already a member of this team.");

  const alreadyMember = team.members.some((m) => m.user.toString() === userId.toString());
  if (alreadyMember) throw new Error("You are already a member of this team.");

  const existingPending = team.joinRequests?.find(
    (r) => r.user.toString() === userId.toString() && r.status === "pending",
  );
  if (existingPending) throw new Error("You already have a pending join request.");

  if (!team.joinRequests) team.joinRequests = [];
  team.joinRequests.push({ user: userId, message: message?.trim() || "", status: "pending" });
  await team.save();

  try {
    const user = await User.findById(userId);
    if (user && user.email) {
      await sendThemedEmail(
        user.email,
        "Join Request Sent",
        "Request Sent Successfully",
        `Hi ${user.name}, your request to join "${team.name}" has been sent.`,
        "<p style='margin:0'>The team admin will review your request shortly.</p>",
        "View Team",
        `${FRONTEND_URL}/teams/${team._id}`
      );
    }
  } catch (error) {
    console.error("Failed to send join request email:", error);
  }

  return { message: "Join request sent. The admin will review it shortly." };
};

// ─── Approve Join Request (admin) ─────────────────────────────────────────────
export const approveJoinRequestService = async ({ id, requestId, userId, userRole }) => {
  const team = await findTeamOrThrow(id);

  const isAdmin =
    userRole === "admin" ||
    team.createdBy.toString() === userId.toString() ||
    team.members.some((m) => m.user.toString() === userId.toString() && m.role === "admin");

  if (!isAdmin) throw new Error("Not authorized to approve join requests.");

  const request = team.joinRequests.id(requestId);
  if (!request) throw new Error("Join request not found.");
  if (request.status !== "pending") throw new Error("This request has already been processed.");

  request.status = "approved";
  request.respondedAt = new Date();

  const alreadyMember = team.members.some((m) => m.user.toString() === request.user.toString());
  if (!alreadyMember) {
    team.members.push({ user: request.user, role: "member" });
  }

  await team.save();

  try {
    const user = await User.findById(request.user);
    if (user && user.email) {
      await sendThemedEmail(
        user.email,
        "Join Request Approved",
        "Welcome to the Team!",
        `Hi ${user.name}, your request to join "${team.name}" has been approved!`,
        "<p style='margin:0'>You are now a member and can participate in team activities.</p>",
        "Go to Team",
        `${FRONTEND_URL}/teams/${team._id}`
      );
    }
  } catch (error) {
    console.error("Failed to send join approval email:", error);
  }

  return populateTeam(Team.findById(id));
};

// ─── Reject Join Request (admin) ──────────────────────────────────────────────
export const rejectJoinRequestService = async ({ id, requestId, userId, userRole }) => {
  const team = await findTeamOrThrow(id);

  const isAdmin =
    userRole === "admin" ||
    team.createdBy.toString() === userId.toString() ||
    team.members.some((m) => m.user.toString() === userId.toString() && m.role === "admin");

  if (!isAdmin) throw new Error("Not authorized to reject join requests.");

  const request = team.joinRequests.id(requestId);
  if (!request) throw new Error("Join request not found.");
  if (request.status !== "pending") throw new Error("This request has already been processed.");

  request.status = "rejected";
  request.respondedAt = new Date();

  await team.save();

  try {
    const user = await User.findById(request.user);
    if (user && user.email) {
      await sendThemedEmail(
        user.email,
        "Join Request Update",
        "Action Required",
        `Hi ${user.name}, your request to join "${team.name}" was not approved at this time.`,
        "<p style='margin:0'>You can explore other teams on the platform.</p>",
        "Explore Teams",
        `${FRONTEND_URL}/teams`
      );
    }
  } catch (error) {
    console.error("Failed to send join rejection email:", error);
  }

  return { message: "Join request rejected." };
};

export const leaveTeamService = async ({ id, userId }) => {
  const team = await findTeamOrThrow(id);

  if (team.createdBy.toString() === userId.toString())
    throw new Error("Team owner cannot leave. Transfer ownership or delete the team.");

  const before = team.members.length;
  team.members = team.members.filter((m) => m.user.toString() !== userId.toString());
  if (team.members.length === before) throw new Error("You are not a member of this team.");

  await team.save();
  return { message: "You have left the team." };
};

export const removeMemberService = async ({ id, memberId, userId, userRole }) => {
  const team = await findTeamOrThrow(id);

  const isAdmin =
    userRole === "admin" ||
    team.createdBy.toString() === userId.toString() ||
    team.members.some((m) => m.user.toString() === userId.toString() && m.role === "admin");

  if (!isAdmin) throw new Error("Not authorized to remove members.");
  if (team.createdBy.toString() === memberId) throw new Error("Cannot remove the team owner.");

  const before = team.members.length;
  team.members = team.members.filter((m) => m.user.toString() !== memberId);
  if (team.members.length === before) throw new Error("Member not found in this team.");

  await team.save();
  return populateTeam(Team.findById(id));
};

export const inviteMembersService = async ({ id, emails, userId }) => {
  const team = await findTeamOrThrow(id);

  const isAdmin =
    team.createdBy.toString() === userId.toString() ||
    team.members.some((m) => m.user.toString() === userId.toString() && m.role === "admin");

  if (!isAdmin) throw new Error("Not authorized to invite members.");

  const existingEmails = new Set(team.invites.map((inv) => inv.email));
  const now = new Date();
  const expiry = new Date(now.getTime() + INVITE_TOKEN_TTL_MS);

  const newInvites = emails
    .filter((email) => !existingEmails.has(email))
    .map((email) => ({
      email,
      status: "pending",
      inviteToken: generateInviteToken(),
      tokenExpiry: expiry,
    }));

  // Re-issue fresh tokens for emails that were already invited but not accepted
  team.invites.forEach((inv) => {
    if (existingEmails.has(inv.email) && emails.includes(inv.email) && inv.status === "pending") {
      inv.inviteToken = generateInviteToken();
      inv.tokenExpiry = expiry;
    }
  });

  team.invites.push(...newInvites);
  await team.save();

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const shortDesc = team.description?.length > 120
    ? `${team.description.substring(0, 120)}…`
    : team.description;

  const allToEmail = [
    ...newInvites,
    ...team.invites.filter(
      (inv) => existingEmails.has(inv.email) && emails.includes(inv.email) && inv.status === "pending"
    ),
  ];

  for (const inv of allToEmail) {
    const inviteLink = `${frontendUrl}/teams/invite/${inv.inviteToken}`;
    sendThemedEmail(
      inv.email,
      `You're invited to join "${team.name}" on Setu`,
      "You've been invited to join a team!",
      `You've been invited to join <strong>${team.name}</strong> on Setu.`,
      `${shortDesc ? `<p style="margin:0 0 12px;color:#6b7280;font-size:14px;">${shortDesc}</p>` : ""}<p style="margin:0;color:#6b7280;font-size:13px;">This invitation expires in 7 days.</p>`,
      "Accept Invitation",
      inviteLink
    ).catch((err) => console.error(`Invite email failed for ${inv.email}:`, err));
  }

  return { message: `${newInvites.length} invite(s) sent.`, invites: team.invites };
};

// ─── Validate Invite Token (public) ──────────────────────────────────────────
export const validateInviteTokenService = async (token) => {
  const team = await Team.findOne({ "invites.inviteToken": token })
    .populate("createdBy", "name email")
    .populate("members.user", "name email")
    .exec();

  if (!team) throw new Error("Invite not found or already used.");

  const invite = team.invites.find((inv) => inv.inviteToken === token);
  if (!invite) throw new Error("Invite not found.");
  if (invite.status !== "pending") throw new Error(`Invite already ${invite.status}.`);
  if (invite.tokenExpiry && new Date() > invite.tokenExpiry)
    throw new Error("Invite link has expired. Please ask the team admin to resend.");

  return {
    team: {
      _id: team._id,
      name: team.name,
      description: team.description,
      avatar: team.avatar,
      location: team.location,
      category: team.category,
      memberCount: team.members.length,
      createdBy: team.createdBy,
    },
    invite: {
      email: invite.email,
      invitedAt: invite.invitedAt,
      tokenExpiry: invite.tokenExpiry,
    },
  };
};

// ─── Accept Invite (authenticated) ───────────────────────────────────────────
export const acceptInviteService = async ({ token, userId }) => {
  const team = await findTeamOrThrow(
    await Team.findOne({ "invites.inviteToken": token }).then((t) => {
      if (!t) throw new Error("Invite not found.");
      return t._id;
    })
  );

  const invite = team.invites.find((inv) => inv.inviteToken === token);
  if (!invite) throw new Error("Invite not found.");
  if (invite.status !== "pending") throw new Error(`Invite already ${invite.status}.`);
  if (invite.tokenExpiry && new Date() > invite.tokenExpiry)
    throw new Error("Invite link has expired. Please ask the team admin to resend.");

  if (team.status !== "active")
    throw new Error("This team is not active. You cannot join at this time.");

  const alreadyMember = team.members.some((m) => m.user.toString() === userId.toString());
  if (alreadyMember) {
    invite.status = "accepted";
    invite.inviteToken = null;
    await team.save();
    return populateTeam(Team.findById(team._id));
  }

  invite.status = "accepted";
  invite.inviteToken = null;
  team.members.push({ user: userId, role: "member" });
  await team.save();

  try {
    const user = await User.findById(userId);
    if (user?.email) {
      await sendThemedEmail(
        user.email,
        `Welcome to ${team.name}!`,
        "You've joined the team!",
        `Hi ${user.name}, you've successfully joined <strong>${team.name}</strong> on Setu.`,
        "<p style='margin:0'>You can now participate in team campaigns, chat with members, and collaborate.</p>",
        "Go to Team",
        `${FRONTEND_URL}/teams/${team._id}`
      );
    }
  } catch (err) {
    console.error("Failed to send join confirmation email:", err);
  }

  return populateTeam(Team.findById(team._id));
};

export const addCampaignToTeamService = async ({ id, campaignId, userId }) => {
  const team = await findTeamOrThrow(id);

  const isMember =
    team.members.some((m) => m.user.toString() === userId.toString()) ||
    team.createdBy.toString() === userId.toString();

  if (!isMember) throw new Error("Only team members can add campaigns.");
  if (team.campaigns.map((c) => c.toString()).includes(campaignId))
    throw new Error("Campaign already added to this team.");

  team.campaigns.push(campaignId);
  await team.save();
  return populateTeam(Team.findById(id));
};

export const getTeamLeaderboardService = async (limit = 10) => {
  const teams = await Team.find({ status: "active", privacy: "public" })
    .sort({ raisedAmount: -1 })
    .limit(Number(limit))
    .populate("createdBy", "name email")
    .select("name avatar location category raisedAmount goalAmount members campaigns badge createdBy");

  return teams.map((t, i) => ({ ...t.toObject(), rank: i + 1 }));
};

export const approveTeamService = async ({ id, adminId }) => {
  const team = await findTeamOrThrow(id);
  if (team.status !== "pending")
    throw new Error(`Only pending teams can be approved. Current status: "${team.status}".`);

  const updatedTeam = await populateTeam(
    Team.findByIdAndUpdate(id, { status: "active", approvedBy: adminId, approvedAt: new Date(), rejectionReason: null, suspendedReason: null }, { new: true }),
  );

  try {
    const user = await User.findById(team.createdBy);
    if (user && user.email) {
      await sendThemedEmail(
        user.email,
        "Team Approved!",
        "Your Team is Live!",
        `Great news, ${user.name}! Your team "${team.name}" has been approved.`,
        "<p style='margin:0'>Your team is now live on Setu. You can start inviting members and adding campaigns.</p>",
        "View Team",
        `${FRONTEND_URL}/teams/${team._id}`
      );
    }
  } catch (error) {
    console.error("Failed to send team approval email:", error);
  }

  return updatedTeam;
};

export const rejectTeamService = async ({ id, rejectionReason, adminId }) => {
  if (!rejectionReason?.trim()) throw new Error("Rejection reason is required.");
  const team = await findTeamOrThrow(id);
  if (!["pending", "active"].includes(team.status))
    throw new Error(`Team with status "${team.status}" cannot be rejected.`);

  const updatedTeam = await populateTeam(
    Team.findByIdAndUpdate(id, { status: "rejected", rejectionReason: rejectionReason.trim(), approvedBy: adminId, approvedAt: new Date() }, { new: true }),
  );

  try {
    const user = await User.findById(team.createdBy);
    if (user && user.email) {
      await sendThemedEmail(
        user.email,
        "Team Update",
        "Action Required for Your Team",
        `Hi ${user.name}, we've reviewed your team "${team.name}".`,
        `<p style='margin:0;color:#b91c1c;'>Unfortunately, it could not be approved at this time.</p><p style='margin-top:12px;'><strong>Reason:</strong> ${rejectionReason.trim()}</p>`,
        "Go to Dashboard",
        `${FRONTEND_URL}/dashboard`
      );
    }
  } catch (error) {
    console.error("Failed to send team rejection email:", error);
  }

  return updatedTeam;
};

export const suspendTeamService = async ({ id, suspendedReason, adminId }) => {
  if (!suspendedReason?.trim()) throw new Error("Suspension reason is required.");
  const team = await findTeamOrThrow(id);
  if (team.status !== "active")
    throw new Error(`Only active teams can be suspended. Current status: "${team.status}".`);

  return populateTeam(
    Team.findByIdAndUpdate(id, { status: "suspended", suspendedReason: suspendedReason.trim(), approvedBy: adminId, approvedAt: new Date() }, { new: true }),
  );
};

export const unsuspendTeamService = async ({ id, adminId }) => {
  const team = await findTeamOrThrow(id);
  if (team.status !== "suspended")
    throw new Error(`Only suspended teams can be reactivated. Current status: "${team.status}".`);

  return populateTeam(
    Team.findByIdAndUpdate(id, { status: "active", suspendedReason: null, approvedBy: adminId, approvedAt: new Date() }, { new: true }),
  );
};
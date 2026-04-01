import Team from "./team.model.js";
import cloudinary from "../../config/cloudinary.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    .populate("campaigns", "title status raisedAmount goalAmount images");

// ─── Create Team ─────────────────────────────────────────────────────────────
// Status defaults to "pending" — admin must approve before it goes live
export const createTeamService = async ({ body, file, userId }) => {
  const {
    name,
    description,
    location,
    privacy,
    category,
    goalAmount,
    website,
    inviteEmails,
  } = body;

  let emails = [];
  if (inviteEmails) {
    try {
      emails = JSON.parse(inviteEmails);
    } catch {
      emails = inviteEmails
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
    }
  }

  let avatar = null;
  if (file) avatar = { url: file.path, publicId: file.filename };

  const team = await Team.create({
    name,
    description,
    location,
    privacy: privacy ?? "public",
    category,
    goalAmount: Number(goalAmount),
    website: website || null,
    createdBy: userId,
    avatar,
    status: "pending", // ← always starts pending
    invites: emails.map((email) => ({ email })),
    members: [{ user: userId, role: "admin" }], // creator auto-joins as admin
  });

  return team;
};

// ─── Get All Teams (public — only active) ────────────────────────────────────
export const getAllTeamsService = async (query) => {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    privacy,
    sortBy = "raisedAmount",
    order = "desc",
  } = query;

  const filter = { status: "active" }; // public always sees only active
  if (privacy) filter.privacy = privacy;
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [teams, total] = await Promise.all([
    populateTeam(
      Team.find(filter)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(parseInt(limit)),
    ),
    Team.countDocuments(filter),
  ]);

  return {
    teams,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

// ─── Get All Teams for Admin (all statuses) ───────────────────────────────────
export const getAllTeamsAdminService = async (query) => {
  const {
    page = 1,
    limit = 20,
    search,
    category,
    status,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [teams, total] = await Promise.all([
    populateTeam(
      Team.find(filter)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(parseInt(limit)),
    ),
    Team.countDocuments(filter),
  ]);

  return {
    teams,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

// ─── Get Team By ID ───────────────────────────────────────────────────────────
export const getTeamByIdService = async (id) => {
  const team = await populateTeam(Team.findById(id));
  if (!team) throw new Error("Team not found.");
  return team;
};

// ─── Get My Teams ─────────────────────────────────────────────────────────────
export const getMyTeamsService = async ({ userId, query }) => {
  const { page = 1, limit = 10 } = query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {
    $or: [{ createdBy: userId }, { "members.user": userId }],
  };

  const [teams, total] = await Promise.all([
    populateTeam(
      Team.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
    ),
    Team.countDocuments(filter),
  ]);

  return {
    teams,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

// ─── Update Team ──────────────────────────────────────────────────────────────
export const updateTeamService = async ({
  id,
  body,
  file,
  userId,
  userRole,
}) => {
  const team = await findTeamOrThrow(id);

  const isAdmin =
    userRole === "admin" ||
    team.createdBy.toString() === userId.toString() ||
    team.members.some(
      (m) => m.user.toString() === userId.toString() && m.role === "admin",
    );

  if (!isAdmin) throw new Error("Not authorized to update this team.");

  const {
    name,
    description,
    location,
    privacy,
    category,
    goalAmount,
    website,
  } = body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (location !== undefined) updates.location = location;
  if (privacy !== undefined) updates.privacy = privacy;
  if (category !== undefined) updates.category = category;
  if (goalAmount !== undefined) updates.goalAmount = Number(goalAmount);
  if (website !== undefined) updates.website = website;

  if (file) {
    if (team.avatar?.publicId)
      await cloudinary.uploader.destroy(team.avatar.publicId);
    updates.avatar = { url: file.path, publicId: file.filename };
  }

  return populateTeam(
    Team.findByIdAndUpdate(id, updates, { new: true, runValidators: true }),
  );
};

// ─── Delete Team ──────────────────────────────────────────────────────────────
export const deleteTeamService = async ({ id, userId, userRole }) => {
  const team = await findTeamOrThrow(id);

  const isOwner =
    userRole === "admin" || team.createdBy.toString() === userId.toString();

  if (!isOwner) throw new Error("Not authorized to delete this team.");

  if (team.avatar?.publicId)
    await cloudinary.uploader.destroy(team.avatar.publicId);
  await team.deleteOne();
  return { message: "Team deleted successfully." };
};

// ─── Join Team ────────────────────────────────────────────────────────────────
export const joinTeamService = async ({ id, userId }) => {
  const team = await findTeamOrThrow(id);

  if (team.status !== "active")
    throw new Error("This team is not active and cannot be joined.");
  if (team.privacy === "private")
    throw new Error("This team is private. You need an invite to join.");

  const alreadyMember = team.members.some(
    (m) => m.user.toString() === userId.toString(),
  );
  if (alreadyMember) throw new Error("You are already a member of this team.");

  team.members.push({ user: userId, role: "member" });
  await team.save();
  return populateTeam(Team.findById(id));
};

// ─── Leave Team ───────────────────────────────────────────────────────────────
export const leaveTeamService = async ({ id, userId }) => {
  const team = await findTeamOrThrow(id);

  if (team.createdBy.toString() === userId.toString())
    throw new Error(
      "Team owner cannot leave. Transfer ownership or delete the team.",
    );

  const before = team.members.length;
  team.members = team.members.filter(
    (m) => m.user.toString() !== userId.toString(),
  );
  if (team.members.length === before)
    throw new Error("You are not a member of this team.");

  await team.save();
  return { message: "You have left the team." };
};

// ─── Remove Member ────────────────────────────────────────────────────────────
export const removeMemberService = async ({
  id,
  memberId,
  userId,
  userRole,
}) => {
  const team = await findTeamOrThrow(id);

  const isAdmin =
    userRole === "admin" ||
    team.createdBy.toString() === userId.toString() ||
    team.members.some(
      (m) => m.user.toString() === userId.toString() && m.role === "admin",
    );

  if (!isAdmin) throw new Error("Not authorized to remove members.");
  if (team.createdBy.toString() === memberId)
    throw new Error("Cannot remove the team owner.");

  const before = team.members.length;
  team.members = team.members.filter((m) => m.user.toString() !== memberId);
  if (team.members.length === before)
    throw new Error("Member not found in this team.");

  await team.save();
  return populateTeam(Team.findById(id));
};

// ─── Invite Members ───────────────────────────────────────────────────────────
export const inviteMembersService = async ({ id, emails, userId }) => {
  const team = await findTeamOrThrow(id);

  const isAdmin =
    team.createdBy.toString() === userId.toString() ||
    team.members.some(
      (m) => m.user.toString() === userId.toString() && m.role === "admin",
    );

  if (!isAdmin) throw new Error("Not authorized to invite members.");

  const existingEmails = new Set(team.invites.map((inv) => inv.email));
  const newInvites = emails
    .filter((email) => !existingEmails.has(email))
    .map((email) => ({ email, status: "pending" }));

  team.invites.push(...newInvites);
  await team.save();
  return {
    message: `${newInvites.length} invite(s) sent.`,
    invites: team.invites,
  };
};

// ─── Add Campaign to Team ─────────────────────────────────────────────────────
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

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export const getTeamLeaderboardService = async (limit = 10) => {
  const teams = await Team.find({ status: "active", privacy: "public" })
    .sort({ raisedAmount: -1 })
    .limit(Number(limit))
    .populate("createdBy", "name email")
    .select(
      "name avatar location category raisedAmount goalAmount members campaigns badge createdBy",
    );

  return teams.map((t, i) => ({ ...t.toObject(), rank: i + 1 }));
};

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN APPROVAL SERVICES
// ═════════════════════════════════════════════════════════════════════════════

// ─── Approve Team ─────────────────────────────────────────────────────────────
export const approveTeamService = async ({ id, adminId }) => {
  const team = await findTeamOrThrow(id);

  if (team.status !== "pending")
    throw new Error(
      `Only pending teams can be approved. Current status: "${team.status}".`,
    );

  return populateTeam(
    Team.findByIdAndUpdate(
      id,
      {
        status: "active",
        approvedBy: adminId,
        approvedAt: new Date(),
        rejectionReason: null,
        suspendedReason: null,
      },
      { new: true },
    ),
  );
};

// ─── Reject Team ──────────────────────────────────────────────────────────────
export const rejectTeamService = async ({ id, rejectionReason, adminId }) => {
  if (!rejectionReason?.trim())
    throw new Error("Rejection reason is required.");

  const team = await findTeamOrThrow(id);

  if (!["pending", "active"].includes(team.status))
    throw new Error(`Team with status "${team.status}" cannot be rejected.`);

  return populateTeam(
    Team.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
        approvedBy: adminId,
        approvedAt: new Date(),
      },
      { new: true },
    ),
  );
};

// ─── Suspend Team ─────────────────────────────────────────────────────────────
export const suspendTeamService = async ({ id, suspendedReason, adminId }) => {
  if (!suspendedReason?.trim())
    throw new Error("Suspension reason is required.");

  const team = await findTeamOrThrow(id);

  if (team.status !== "active")
    throw new Error(
      `Only active teams can be suspended. Current status: "${team.status}".`,
    );

  return populateTeam(
    Team.findByIdAndUpdate(
      id,
      {
        status: "suspended",
        suspendedReason: suspendedReason.trim(),
        approvedBy: adminId,
        approvedAt: new Date(),
      },
      { new: true },
    ),
  );
};

// ─── Unsuspend Team ───────────────────────────────────────────────────────────
export const unsuspendTeamService = async ({ id, adminId }) => {
  const team = await findTeamOrThrow(id);

  if (team.status !== "suspended")
    throw new Error(
      `Only suspended teams can be reactivated. Current status: "${team.status}".`,
    );

  return populateTeam(
    Team.findByIdAndUpdate(
      id,
      {
        status: "active",
        suspendedReason: null,
        approvedBy: adminId,
        approvedAt: new Date(),
      },
      { new: true },
    ),
  );
};

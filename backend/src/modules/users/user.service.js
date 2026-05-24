import User from "./user.model.js";

// ─── Get All Users (Admin) ──────────────────────────────────────────────────
export const getAllUsersAdminService = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    status,
    accountType,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (accountType) filter.accountType = accountType;
  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-password -confirmPassword -__v"),
    User.countDocuments(filter),
  ]);

  const formattedUsers = users.map((user) => {
    const userObj = user.toObject();
    if (!userObj.createdAt) {
      userObj.createdAt = user._id.getTimestamp();
    }
    return userObj;
  });

  return {
    users: formattedUsers,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

// ─── Get User By ID ─────────────────────────────────────────────────────────
export const getUserByIdService = async (id) => {
  const user = await User.findById(id).select("-password").lean();
  if (!user) throw new Error("User not found.");
  return user;
};

// ─── Update User Status ─────────────────────────────────────────────────────
export const updateUserStatusService = async (id, statusData) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found.");

  if (statusData.status) user.status = statusData.status;

  await user.save();
  return user;
};

// ─── Get Overview Stats ─────────────────────────────────────────────────────
export const getDonorStatsService = async () => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalDonors: { $sum: 1 },
        totalDonated: { $sum: "$totalDonated" },
        totalDonations: { $sum: "$donationsCount" },
      },
    },
  ]);

  return stats[0] || { totalDonors: 0, totalDonated: 0, totalDonations: 0 };
};
// ─── Update User Profile ───────────────────────────────────────────────────
export const updateUserProfileService = async (id, updateData) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found.");

  // Update allowed fields
  const allowedFields = ['name', 'phone', 'accountType', 'status'];
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field];
    }
  });

  await user.save();
  return user.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } });
};

// ─── Delete User ────────────────────────────────────────────────────────────
export const deleteUserService = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found.");

  // Soft delete by updating status instead of hard delete to preserve data integrity
  // This is safer for audit trails and prevents orphaned references
  user.status = "deleted";
  user.email = `deleted_${Date.now()}_${user.email}`; // Prevent email conflicts
  await user.save();

  // Alternatively, for hard delete (use with caution):
  // await User.findByIdAndDelete(id);
  
  return { message: "User deleted successfully" };
};
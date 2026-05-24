import User from "./user.model.js";
import Payment from "../payment/payment.model.js";
import Campaign from "../campaigns/campaign.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// ─── Get User Profile with Stats ────────────────────────────────────────────
export const getUserProfileService = async (userId) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  const user = await User.findById(objectId).select("-password").lean();
  if (!user) throw new Error("User not found");

  // Get donation statistics directly from payments
  const donationStats = await Payment.aggregate([
    {
      $match: {
        donor: objectId,
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        totalDonated: { $sum: "$amount" },
        donationsCount: { $sum: 1 },
      },
    },
  ]);

  const totalDonated = donationStats[0]?.totalDonated || 0;
  const donationsCount = donationStats[0]?.donationsCount || 0;

  // Get campaigns created by user
  const campaignsCount = await Campaign.countDocuments({ createdBy: objectId });

  // Rank: how many users have donated more (using live payment data via User.totalDonated)
  // Sync the user's totalDonated first if it differs
  if (user.totalDonated !== totalDonated && totalDonated > 0) {
    await User.findByIdAndUpdate(objectId, {
      totalDonated,
      donationsCount,
    });
  }

  const usersWithMoreDonations = await User.countDocuments({
    totalDonated: { $gt: totalDonated },
  });
  const impactRank = usersWithMoreDonations + 1;

  return {
    user,
    stats: {
      totalDonated,
      donationsCount,
      campaignsCount,
      impactRank,
    },
  };
};

// ─── Update User Profile ────────────────────────────────────────────────────
export const updateUserProfileService = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (updateData.name) user.name = updateData.name;
  if (updateData.phone) user.phone = updateData.phone;
  if (updateData.location) user.location = updateData.location;

  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await User.findOne({ email: updateData.email });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      throw new Error("Email already in use");
    }
    user.email = updateData.email;
  }

  await user.save();
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

// ─── Change Password ────────────────────────────────────────────────────────
export const changePasswordService = async (userId, passwordData) => {
  const { currentPassword, newPassword } = passwordData;

  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required");
  }

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return { message: "Password changed successfully" };
};

// ─── Upload Profile Picture ─────────────────────────────────────────────────
export const uploadProfilePictureService = async (userId, file) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Delete old avatar if exists
  if (user.avatar?.publicId) {
    const cloudinary = (await import("../../config/cloudinary.js")).default;
    await cloudinary.uploader.destroy(user.avatar.publicId);
  }

  // Update with new avatar
  user.avatar = {
    url: file.path,
    publicId: file.filename,
  };

  await user.save();
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

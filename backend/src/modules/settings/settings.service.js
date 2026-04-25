import Settings from "./settings.model.js";
import User from "../users/user.model.js";
import bcrypt from "bcryptjs";

// ─── Get User Settings ──────────────────────────────────────────────────────
export const getUserSettingsService = async (userId) => {
  let settings = await Settings.findOne({ user: userId }).populate(
    "user",
    "name email phone role accountType"
  );

  // Create default settings if they don't exist
  if (!settings) {
    settings = await Settings.create({ user: userId });
    settings = await Settings.findById(settings._id).populate(
      "user",
      "name email phone role accountType"
    );
  }

  return settings;
};

// ─── Update Organization Settings ───────────────────────────────────────────
export const updateOrganizationSettingsService = async (userId, data) => {
  let settings = await Settings.findOne({ user: userId });

  if (!settings) {
    settings = await Settings.create({ user: userId });
  }

  // Update organization fields
  if (data.name !== undefined) settings.organization.name = data.name;
  if (data.email !== undefined) settings.organization.email = data.email;
  if (data.phone !== undefined) settings.organization.phone = data.phone;
  if (data.website !== undefined) settings.organization.website = data.website;
  if (data.address !== undefined) settings.organization.address = data.address;
  if (data.description !== undefined)
    settings.organization.description = data.description;

  await settings.save();
  return settings;
};

// ─── Update Notification Settings ───────────────────────────────────────────
export const updateNotificationSettingsService = async (userId, data) => {
  let settings = await Settings.findOne({ user: userId });

  if (!settings) {
    settings = await Settings.create({ user: userId });
  }

  // Update notification fields
  Object.keys(data).forEach((key) => {
    if (settings.notifications[key] !== undefined) {
      settings.notifications[key] = data[key];
    }
  });

  await settings.save();
  return settings;
};

// ─── Update Security Settings ───────────────────────────────────────────────
export const updateSecuritySettingsService = async (userId, data) => {
  let settings = await Settings.findOne({ user: userId });

  if (!settings) {
    settings = await Settings.create({ user: userId });
  }

  // Update security fields
  if (data.twoFactorAuth !== undefined)
    settings.security.twoFactorAuth = data.twoFactorAuth;
  if (data.sessionTimeout !== undefined)
    settings.security.sessionTimeout = data.sessionTimeout;
  if (data.passwordChangeRequired !== undefined)
    settings.security.passwordChangeRequired = data.passwordChangeRequired;

  await settings.save();
  return settings;
};

// ─── Update Display Settings ────────────────────────────────────────────────
export const updateDisplaySettingsService = async (userId, data) => {
  let settings = await Settings.findOne({ user: userId });

  if (!settings) {
    settings = await Settings.create({ user: userId });
  }

  // Update display fields
  if (data.theme !== undefined) settings.display.theme = data.theme;
  if (data.language !== undefined) settings.display.language = data.language;
  if (data.dateFormat !== undefined)
    settings.display.dateFormat = data.dateFormat;
  if (data.currency !== undefined) settings.display.currency = data.currency;

  await settings.save();
  return settings;
};

// ─── Update Privacy Settings ────────────────────────────────────────────────
export const updatePrivacySettingsService = async (userId, data) => {
  let settings = await Settings.findOne({ user: userId });

  if (!settings) {
    settings = await Settings.create({ user: userId });
  }

  // Update privacy fields
  Object.keys(data).forEach((key) => {
    if (settings.privacy[key] !== undefined) {
      settings.privacy[key] = data[key];
    }
  });

  await settings.save();
  return settings;
};

// ─── Change Password ────────────────────────────────────────────────────────
export const changePasswordService = async (userId, data) => {
  const { currentPassword, newPassword } = data;

  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  // Update last password change in settings
  let settings = await Settings.findOne({ user: userId });
  if (!settings) {
    settings = await Settings.create({ user: userId });
  }
  settings.security.lastPasswordChange = new Date();
  await settings.save();

  return { message: "Password changed successfully" };
};

// ─── Delete Account ─────────────────────────────────────────────────────────
export const deleteAccountService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if user is admin
  if (user.role === "admin") {
    throw new Error("Admin accounts cannot be deleted");
  }

  // Check for active campaigns
  const Campaign = (await import("../campaigns/campaign.model.js")).default;
  const activeCampaigns = await Campaign.countDocuments({
    createdBy: userId,
    status: { $in: ["active", "pending"] },
  });

  if (activeCampaigns > 0) {
    throw new Error(
      "Cannot delete account with active campaigns. Please complete or cancel them first."
    );
  }

  // Soft delete
  user.status = "deleted";
  user.email = `deleted_${Date.now()}_${user.email}`;
  await user.save();

  // Delete settings
  await Settings.deleteOne({ user: userId });

  return { message: "Account deleted successfully" };
};

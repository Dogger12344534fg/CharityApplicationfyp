import {
  getUserSettingsService,
  updateOrganizationSettingsService,
  updateNotificationSettingsService,
  updateSecuritySettingsService,
  updateDisplaySettingsService,
  updatePrivacySettingsService,
  changePasswordService,
  deleteAccountService,
} from "./settings.service.js";

// ─── Get User Settings ──────────────────────────────────────────────────────
export const getUserSettings = async (req, res) => {
  try {
    const settings = await getUserSettingsService(req.user._id);
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Organization Settings ───────────────────────────────────────────
export const updateOrganizationSettings = async (req, res) => {
  try {
    const settings = await updateOrganizationSettingsService(
      req.user._id,
      req.body
    );
    return res.status(200).json({
      success: true,
      data: settings,
      message: "Organization settings updated successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Update Notification Settings ───────────────────────────────────────────
export const updateNotificationSettings = async (req, res) => {
  try {
    const settings = await updateNotificationSettingsService(
      req.user._id,
      req.body
    );
    return res.status(200).json({
      success: true,
      data: settings,
      message: "Notification settings updated successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Update Security Settings ───────────────────────────────────────────────
export const updateSecuritySettings = async (req, res) => {
  try {
    const settings = await updateSecuritySettingsService(
      req.user._id,
      req.body
    );
    return res.status(200).json({
      success: true,
      data: settings,
      message: "Security settings updated successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Update Display Settings ────────────────────────────────────────────────
export const updateDisplaySettings = async (req, res) => {
  try {
    const settings = await updateDisplaySettingsService(req.user._id, req.body);
    return res.status(200).json({
      success: true,
      data: settings,
      message: "Display settings updated successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Update Privacy Settings ────────────────────────────────────────────────
export const updatePrivacySettings = async (req, res) => {
  try {
    const settings = await updatePrivacySettingsService(req.user._id, req.body);
    return res.status(200).json({
      success: true,
      data: settings,
      message: "Privacy settings updated successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Change Password ────────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const result = await changePasswordService(req.user._id, req.body);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Delete Account ─────────────────────────────────────────────────────────
export const deleteAccount = async (req, res) => {
  try {
    const result = await deleteAccountService(req.user._id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

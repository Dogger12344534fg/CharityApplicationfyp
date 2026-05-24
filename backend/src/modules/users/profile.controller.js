import {
  getUserProfileService,
  updateUserProfileService,
  changePasswordService,
  uploadProfilePictureService,
} from "./profile.service.js";

// ─── Get User Profile ───────────────────────────────────────────────────────
export const getUserProfile = async (req, res) => {
  try {
    const data = await getUserProfileService(req.user._id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update User Profile ────────────────────────────────────────────────────
export const updateUserProfile = async (req, res) => {
  try {
    const user = await updateUserProfileService(req.user._id, req.body);
    return res.status(200).json({
      success: true,
      data: user,
      message: "Profile updated successfully",
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

// ─── Upload Profile Picture ─────────────────────────────────────────────────
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await uploadProfilePictureService(req.user._id, req.file);
    return res.status(200).json({
      success: true,
      data: user,
      message: "Profile picture updated successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

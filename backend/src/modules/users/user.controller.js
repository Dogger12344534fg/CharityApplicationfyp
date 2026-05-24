import {
  getAllUsersAdminService,
  getUserByIdService,
  updateUserStatusService,
  getDonorStatsService,
  updateUserProfileService,
  deleteUserService,
} from "./user.service.js";

export const getAllUsersAdmin = async (req, res) => {
  try {
    const result = await getAllUsersAdminService(req.query);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const user = await updateUserStatusService(req.params.id, req.body);
    return res.status(200).json({ success: true, data: user, message: "Status updated successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getDonorStats = async (req, res) => {
  try {
    const stats = await getDonorStatsService();
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData.role;
    delete updateData.totalDonated;
    delete updateData.donationsCount;

    const user = await updateUserProfileService(id, updateData);
    return res.status(200).json({ 
      success: true, 
      data: user, 
      message: "Profile updated successfully" 
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has active campaigns or donations
    const user = await getUserByIdService(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent deletion of admin users
    if (user.role === "admin") {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot delete admin users" 
      });
    }

    // Check for active campaigns
    const Campaign = (await import("../campaigns/campaign.model.js")).default;
    const activeCampaigns = await Campaign.countDocuments({ 
      createdBy: id, 
      status: { $in: ["active", "pending"] } 
    });

    if (activeCampaigns > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot delete user with active campaigns. Please suspend or complete campaigns first." 
      });
    }

    await deleteUserService(id);
    return res.status(200).json({ 
      success: true, 
      message: "User deleted successfully" 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
import {
  createGoodsDonationService,
  getAllGoodsDonationsService,
  getGoodsDonationsByCampaignService,
  getMyGoodsDonationsService,
  getGoodsDonationByIdService,
  updateGoodsDonationService,
  deleteGoodsDonationService,
  verifyGoodsDonationService,
  rejectGoodsDonationService,
  schedulePickupService,
  markAsCollectedService,
  markAsDeliveredService,
  markAsCompletedService,
  getGoodsDonationStatsService,
} from "./goods.service.js";

// ─── Shared error status resolver ────────────────────────────────────────────
const resolveStatus = (message) => {
  if (message.includes("not found")) return 404;
  if (message.includes("Not authorized")) return 403;
  if (message.includes("not active")) return 403;
  if (message.includes("Cannot update") || message.includes("Cannot delete")) return 422;
  if (message.includes("Only") || message.includes("required")) return 400;
  return 400;
};

// ─── Create Goods Donation ───────────────────────────────────────────────────
export const createGoodsDonation = async (req, res) => {
  try {
    const donation = await createGoodsDonationService({
      body: req.body,
      files: req.files,
      userId: req.user._id,
    });
    
    return res.status(201).json({
      success: true,
      message: "Goods donation submitted successfully. It will be reviewed by our team.",
      data: donation,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Get All Goods Donations (Admin) ─────────────────────────────────────────
export const getAllGoodsDonations = async (req, res) => {
  try {
    const result = await getAllGoodsDonationsService(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Goods Donations by Campaign ─────────────────────────────────────────
export const getGoodsDonationsByCampaign = async (req, res) => {
  try {
    const result = await getGoodsDonationsByCampaignService(req.params.campaignId, req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get My Goods Donations ──────────────────────────────────────────────────
export const getMyGoodsDonations = async (req, res) => {
  try {
    const result = await getMyGoodsDonationsService({
      userId: req.user._id,
      query: req.query,
    });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Goods Donation By ID ────────────────────────────────────────────────
export const getGoodsDonationById = async (req, res) => {
  try {
    const donation = await getGoodsDonationByIdService(req.params.id);
    return res.status(200).json({ success: true, data: donation });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Update Goods Donation ───────────────────────────────────────────────────
export const updateGoodsDonation = async (req, res) => {
  try {
    const donation = await updateGoodsDonationService({
      id: req.params.id,
      body: req.body,
      files: req.files,
      userId: req.user._id,
      userRole: req.user.role,
    });
    
    return res.status(200).json({
      success: true,
      message: "Goods donation updated successfully.",
      data: donation,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Delete Goods Donation ───────────────────────────────────────────────────
export const deleteGoodsDonation = async (req, res) => {
  try {
    const result = await deleteGoodsDonationService({
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

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN MANAGEMENT CONTROLLERS
// ═════════════════════════════════════════════════════════════════════════════

// ─── Verify Goods Donation ───────────────────────────────────────────────────
export const verifyGoodsDonation = async (req, res) => {
  try {
    const donation = await verifyGoodsDonationService({
      id: req.params.id,
      adminId: req.user._id,
    });
    
    return res.status(200).json({
      success: true,
      message: "Goods donation verified successfully.",
      data: donation,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Reject Goods Donation ───────────────────────────────────────────────────
export const rejectGoodsDonation = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const donation = await rejectGoodsDonationService({
      id: req.params.id,
      rejectionReason,
      adminId: req.user._id,
    });
    
    return res.status(200).json({
      success: true,
      message: "Goods donation rejected.",
      data: donation,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Schedule Pickup ─────────────────────────────────────────────────────────
export const schedulePickup = async (req, res) => {
  try {
    const { scheduledPickupDate, courierInfo } = req.body;
    const donation = await schedulePickupService({
      id: req.params.id,
      scheduledPickupDate,
      courierInfo,
      adminId: req.user._id,
    });
    
    return res.status(200).json({
      success: true,
      message: "Pickup scheduled successfully.",
      data: donation,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Mark as Collected ───────────────────────────────────────────────────────
export const markAsCollected = async (req, res) => {
  try {
    const { actualPickupDate } = req.body;
    const donation = await markAsCollectedService({
      id: req.params.id,
      actualPickupDate,
      adminId: req.user._id,
    });
    
    return res.status(200).json({
      success: true,
      message: "Goods marked as collected.",
      data: donation,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Mark as Delivered ───────────────────────────────────────────────────────
export const markAsDelivered = async (req, res) => {
  try {
    const { deliveryDate } = req.body;
    const donation = await markAsDeliveredService({
      id: req.params.id,
      deliveryDate,
      adminId: req.user._id,
    });
    
    return res.status(200).json({
      success: true,
      message: "Goods marked as delivered.",
      data: donation,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Mark as Completed ───────────────────────────────────────────────────────
export const markAsCompleted = async (req, res) => {
  try {
    const donation = await markAsCompletedService({
      id: req.params.id,
      adminId: req.user._id,
    });
    
    return res.status(200).json({
      success: true,
      message: "Goods donation completed.",
      data: donation,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

// ─── Get Goods Donation Statistics ───────────────────────────────────────────
export const getGoodsDonationStats = async (req, res) => {
  try {
    const stats = await getGoodsDonationStatsService();
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
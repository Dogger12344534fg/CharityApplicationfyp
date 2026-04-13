import { v4 as uuidv4 } from "uuid";
import Payment from "./payment.model.js";
import Campaign from "../campaigns/campaign.model.js";
import User from "../users/user.model.js";
import {
  buildEsewaPayload,
  verifyEsewaPayment,
  decodeEsewaResponse,
  verifyResponseSignature,
  ESEWA_CONFIG,
} from "../../services/esewa.service.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export const initiateEsewaPayment = async (req, res) => {
  try {
    const { campaignId, amount, tipAmount = 0, anonymous = false } = req.body;
    const donorId = req.user?._id;

    if (!campaignId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID and amount are required.",
      });
    }
    if (amount < 10) {
      return res.status(400).json({
        success: false,
        message: "Minimum donation amount is NPR 10.",
      });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found." });
    }
    if (campaign.status !== "active") {
      return res.status(422).json({
        success: false,
        message: "This campaign is not accepting donations.",
      });
    }

    const totalAmount = Number(amount) + Number(tipAmount);
    const transactionUuid = uuidv4();

    const payment = await Payment.create({
      campaign: campaignId,
      donor: donorId || null,
      amount: Number(amount),
      tipAmount: Number(tipAmount),
      totalAmount,
      transactionUuid,
      gateway: "esewa",
      anonymous,
      status: "initiated",
    });

    const successUrl = `${FRONTEND_URL}/campaigns/${campaignId}/donate/success`;
    const failureUrl = `${FRONTEND_URL}/campaigns/${campaignId}/donate/failed`;

    const esewaPayload = buildEsewaPayload({
      totalAmount,
      transactionUuid,
      successUrl,
      failureUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Payment initiated.",
      paymentId: payment._id,
      esewaUrl: ESEWA_CONFIG.paymentUrl,
      esewaPayload,
    });
  } catch (error) {
    console.error("initiateEsewaPayment error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEsewaCallback = async (req, res) => {
  try {
    const { data } = req.query;
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "No payment data received from eSewa.",
      });
    }

    const decoded = decodeEsewaResponse(data);
    const isSignatureValid = verifyResponseSignature(decoded);
    if (!isSignatureValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature." });
    }

    const { transaction_uuid, total_amount, status } = decoded;

    if (status !== "COMPLETE") {
      await Payment.findOneAndUpdate(
        { transactionUuid: transaction_uuid },
        { status: "failed", gatewayResponse: decoded },
      );
      return res
        .status(400)
        .json({ success: false, message: "Payment was not completed." });
    }

    const verificationData = await verifyEsewaPayment({
      totalAmount: total_amount,
      transactionUuid: transaction_uuid,
    });

    if (verificationData.status !== "COMPLETE") {
      await Payment.findOneAndUpdate(
        { transactionUuid: transaction_uuid },
        { status: "failed", gatewayResponse: verificationData },
      );
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed." });
    }

    const payment = await Payment.findOneAndUpdate(
      { transactionUuid: transaction_uuid },
      {
        status: "completed",
        esewaRefId: verificationData.ref_id || decoded.transaction_code,
        gatewayResponse: verificationData,
        paidAt: new Date(),
      },
      { new: true },
    );

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found." });
    }

    await Campaign.findByIdAndUpdate(payment.campaign, {
      $inc: {
        raisedAmount: payment.amount,
        donorsCount: 1,
      },
    });

    if (payment.donor) {
      const user = await User.findById(payment.donor);
      if (user) {
        user.totalDonated += payment.amount;
        user.donationsCount += 1;

        const campaignId = payment.campaign.toString();
        if (
          !user.supportedCampaignIds
            .map((id) => id.toString())
            .includes(campaignId)
        ) {
          user.supportedCampaignIds.push(payment.campaign);
          user.campaignsSupported += 1;
        }

        user.updateStreak();

        user.badge = user.computeBadge();

        await user.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      payment: {
        id: payment._id,
        amount: payment.amount,
        tipAmount: payment.tipAmount,
        totalAmount: payment.totalAmount,
        transactionUuid: payment.transactionUuid,
        esewaRefId: payment.esewaRefId,
        status: payment.status,
        paidAt: payment.paidAt,
      },
    });
  } catch (error) {
    console.error("verifyEsewaCallback error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const esewaFailure = async (req, res) => {
  try {
    const { data } = req.query;
    if (data) {
      const decoded = decodeEsewaResponse(data);
      await Payment.findOneAndUpdate(
        { transactionUuid: decoded.transaction_uuid },
        { status: "failed", gatewayResponse: decoded },
      );
    }
    return res
      .status(200)
      .json({ success: false, message: "Payment was cancelled or failed." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("campaign", "title images raisedAmount goalAmount")
      .populate("donor", "name email");

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found." });
    }

    const isOwner =
      req.user?._id?.toString() === payment.donor?._id?.toString();
    const isAdmin = req.user?.role === "admin";
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized." });
    }

    return res.status(200).json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [payments, total] = await Promise.all([
      Payment.find({ donor: req.user._id })
        .populate("campaign", "title images status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Payment.countDocuments({ donor: req.user._id }),
    ]);

    return res.status(200).json({
      success: true,
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCampaignPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [payments, total] = await Promise.all([
      Payment.find({ campaign: req.params.campaignId, status: "completed" })
        .populate("donor", "name email avatar badge")
        .sort({ paidAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Payment.countDocuments({
        campaign: req.params.campaignId,
        status: "completed",
      }),
    ]);

    return res.status(200).json({
      success: true,
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let filter = {};
    if (search) {
      filter = { transactionUuid: { $regex: search, $options: "i" } };
    }

    // Calculate date ranges for trend comparison (current month vs previous month)
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [payments, total, stats, trends] = await Promise.all([
      Payment.find(filter)
        .populate("campaign", "title images status")
        .populate("donor", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Payment.countDocuments(filter),
      Payment.aggregate([
        {
          $facet: {
            revenueStats: [
              { $match: { status: "completed" } },
              {
                $group: {
                  _id: null,
                  totalRevenue: { $sum: "$amount" },
                  completedCount: { $sum: 1 },
                },
              },
            ],
            pendingStats: [
              { $match: { status: { $in: ["pending", "initiated"] } } },
              { $group: { _id: null, pendingAmount: { $sum: "$amount" } } },
            ],
            statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
            methodRevenue: [
              { $match: { status: "completed" } },
              {
                $group: {
                  _id: "$gateway",
                  amount: { $sum: "$amount" },
                  count: { $sum: 1 },
                },
              },
            ],
            methodCounts: [{ $group: { _id: "$gateway", count: { $sum: 1 } } }],
          },
        },
      ]),
      // Trend calculation: current month vs previous month
      Payment.aggregate([
        {
          $facet: {
            currentMonth: [
              { 
                $match: { 
                  status: "completed",
                  paidAt: { $gte: currentMonthStart }
                }
              },
              {
                $group: {
                  _id: null,
                  revenue: { $sum: "$amount" },
                  count: { $sum: 1 },
                  avgTransaction: { $avg: "$amount" }
                }
              }
            ],
            previousMonth: [
              { 
                $match: { 
                  status: "completed",
                  paidAt: { 
                    $gte: previousMonthStart,
                    $lte: previousMonthEnd
                  }
                }
              },
              {
                $group: {
                  _id: null,
                  revenue: { $sum: "$amount" },
                  count: { $sum: 1 },
                  avgTransaction: { $avg: "$amount" }
                }
              }
            ],
            currentMonthPending: [
              { 
                $match: { 
                  status: { $in: ["pending", "initiated"] },
                  createdAt: { $gte: currentMonthStart }
                }
              },
              {
                $group: {
                  _id: null,
                  pendingAmount: { $sum: "$amount" }
                }
              }
            ],
            previousMonthPending: [
              { 
                $match: { 
                  status: { $in: ["pending", "initiated"] },
                  createdAt: { 
                    $gte: previousMonthStart,
                    $lte: previousMonthEnd
                  }
                }
              },
              {
                $group: {
                  _id: null,
                  pendingAmount: { $sum: "$amount" }
                }
              }
            ]
          }
        }
      ])
    ]);

    const formattedStats = {
      totalRevenue: stats[0]?.revenueStats[0]?.totalRevenue || 0,
      completedCount: stats[0]?.revenueStats[0]?.completedCount || 0,
      pendingAmount: stats[0]?.pendingStats[0]?.pendingAmount || 0,
      statusCounts: stats[0]?.statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      methodRevenue: stats[0]?.methodRevenue.reduce((acc, curr) => {
        acc[curr._id] = curr.amount;
        return acc;
      }, {}),
      methodCounts: stats[0]?.methodCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
    };
    formattedStats.averageTransaction =
      formattedStats.completedCount > 0
        ? Math.round(
            formattedStats.totalRevenue / formattedStats.completedCount,
          )
        : 0;

    // Calculate trend percentages
    const currentMonth = trends[0]?.currentMonth[0] || { revenue: 0, count: 0, avgTransaction: 0 };
    const previousMonth = trends[0]?.previousMonth[0] || { revenue: 0, count: 0, avgTransaction: 0 };
    const currentPending = trends[0]?.currentMonthPending[0]?.pendingAmount || 0;
    const previousPending = trends[0]?.previousMonthPending[0]?.pendingAmount || 0;

    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    formattedStats.trends = {
      revenue: calculateTrend(currentMonth.revenue, previousMonth.revenue),
      completedCount: calculateTrend(currentMonth.count, previousMonth.count),
      averageTransaction: calculateTrend(currentMonth.avgTransaction, previousMonth.avgTransaction),
      pendingAmount: calculateTrend(currentPending, previousPending)
    };

    return res.status(200).json({
      success: true,
      payments,
      stats: formattedStats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Update Payment Status (Admin Only) ──────────────────────────────────────
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, refundReason } = req.body;

    const validStatuses = ["initiated", "pending", "completed", "failed", "refunded"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(", ")
      });
    }

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found."
      });
    }

    // Prevent certain status changes
    if (payment.status === "completed" && status !== "refunded") {
      return res.status(400).json({
        success: false,
        message: "Completed payments can only be refunded."
      });
    }

    if (status === "refunded" && !refundReason) {
      return res.status(400).json({
        success: false,
        message: "Refund reason is required for refunded payments."
      });
    }

    const oldStatus = payment.status;
    payment.status = status;
    
    if (status === "refunded") {
      payment.refundReason = refundReason;
      payment.refundedAt = new Date();
    }

    if (status === "completed" && oldStatus !== "completed") {
      payment.paidAt = new Date();
    }

    await payment.save();

    return res.status(200).json({
      success: true,
      message: `Payment status updated to ${status}.`,
      data: payment
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ─── Delete Payment (Admin Only) ─────────────────────────────────────────────
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found."
      });
    }

    // Prevent deletion of completed payments
    if (payment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete completed payments. Use refund instead."
      });
    }

    await Payment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Payment deleted successfully."
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ─── Create Manual Payment (Admin Only) ──────────────────────────────────────
export const createManualPayment = async (req, res) => {
  try {
    const { 
      campaignId, 
      donorId, 
      amount, 
      tipAmount = 0, 
      gateway = "manual", 
      anonymous = false,
      notes 
    } = req.body;

    if (!campaignId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID and valid amount are required."
      });
    }

    // Verify campaign exists
    const Campaign = (await import("../campaigns/campaign.model.js")).default;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found."
      });
    }

    // Verify donor exists if provided
    if (donorId) {
      const User = (await import("../users/user.model.js")).default;
      const donor = await User.findById(donorId);
      if (!donor) {
        return res.status(404).json({
          success: false,
          message: "Donor not found."
        });
      }
    }

    const totalAmount = amount + tipAmount;
    const transactionUuid = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const payment = await Payment.create({
      campaign: campaignId,
      donor: donorId || null,
      amount,
      tipAmount,
      totalAmount,
      transactionUuid,
      gateway,
      status: "completed",
      anonymous,
      notes,
      paidAt: new Date(),
      createdBy: req.user._id // Admin who created it
    });

    // Update campaign raised amount
    campaign.raisedAmount += amount;
    campaign.donorsCount += 1;
    await campaign.save();

    // Update donor stats if donor provided
    if (donorId) {
      const User = (await import("../users/user.model.js")).default;
      await User.findByIdAndUpdate(donorId, {
        $inc: { 
          totalDonated: amount,
          donationsCount: 1 
        }
      });
    }

    await payment.populate([
      { path: "campaign", select: "title" },
      { path: "donor", select: "name email" }
    ]);

    return res.status(201).json({
      success: true,
      message: "Manual payment created successfully.",
      data: payment
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
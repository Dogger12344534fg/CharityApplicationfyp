import Campaign from "../campaigns/campaign.model.js";
import Payment from "../payment/payment.model.js";
import User from "../users/user.model.js";
import Category from "../category/category.model.js";

// ─── Get Dashboard Overview Stats ────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    // Calculate date ranges for trend comparison (current month vs previous month)
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [
      campaignStats,
      paymentStats,
      userStats,
      categoryStats,
      monthlyTrends,
      recentTransactions
    ] = await Promise.all([
      // Campaign statistics
      Campaign.aggregate([
        {
          $facet: {
            statusCounts: [
              { $group: { _id: "$status", count: { $sum: 1 } } }
            ],
            totalStats: [
              {
                $group: {
                  _id: null,
                  totalCampaigns: { $sum: 1 },
                  totalRaised: { $sum: "$raisedAmount" },
                  totalGoal: { $sum: "$goalAmount" },
                  avgDonorsPerCampaign: { $avg: "$donorsCount" }
                }
              }
            ],
            currentMonthCampaigns: [
              { $match: { createdAt: { $gte: currentMonthStart } } },
              { $group: { _id: null, count: { $sum: 1 } } }
            ],
            previousMonthCampaigns: [
              { 
                $match: { 
                  createdAt: { 
                    $gte: previousMonthStart,
                    $lte: previousMonthEnd
                  }
                }
              },
              { $group: { _id: null, count: { $sum: 1 } } }
            ]
          }
        }
      ]),

      // Payment statistics with trends
      Payment.aggregate([
        {
          $facet: {
            totalStats: [
              { $match: { status: "completed" } },
              {
                $group: {
                  _id: null,
                  totalRevenue: { $sum: "$amount" },
                  completedCount: { $sum: 1 },
                  avgTransaction: { $avg: "$amount" }
                }
              }
            ],
            pendingStats: [
              { $match: { status: { $in: ["pending", "initiated"] } } },
              { $group: { _id: null, pendingAmount: { $sum: "$amount" } } }
            ],
            currentMonthPayments: [
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
                  count: { $sum: 1 }
                }
              }
            ],
            previousMonthPayments: [
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
                  count: { $sum: 1 }
                }
              }
            ]
          }
        }
      ]),

      // User statistics
      User.aggregate([
        {
          $facet: {
            totalStats: [
              {
                $group: {
                  _id: null,
                  totalUsers: { $sum: 1 },
                  totalDonors: {
                    $sum: {
                      $cond: [{ $gt: ["$donationsCount", 0] }, 1, 0]
                    }
                  }
                }
              }
            ],
            currentMonthUsers: [
              { $match: { createdAt: { $gte: currentMonthStart } } },
              { $group: { _id: null, count: { $sum: 1 } } }
            ],
            previousMonthUsers: [
              { 
                $match: { 
                  createdAt: { 
                    $gte: previousMonthStart,
                    $lte: previousMonthEnd
                  }
                }
              },
              { $group: { _id: null, count: { $sum: 1 } } }
            ]
          }
        }
      ]),

      // Category distribution
      Campaign.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo"
          }
        },
        { $unwind: "$categoryInfo" },
        {
          $group: {
            _id: "$categoryInfo.name",
            campaigns: { $sum: 1 },
            donors: { $sum: "$donorsCount" },
            raised: { $sum: "$raisedAmount" }
          }
        },
        { $sort: { campaigns: -1 } }
      ]),

      // Monthly trends (last 6 months)
      Payment.aggregate([
        {
          $match: {
            status: "completed",
            paidAt: {
              $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1)
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$paidAt" },
              month: { $month: "$paidAt" }
            },
            amount: { $sum: "$amount" },
            donors: { $addToSet: "$donor" }
          }
        },
        {
          $project: {
            _id: 1,
            amount: 1,
            donorCount: { $size: "$donors" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),

      // Recent transactions (last 10)
      Payment.find({ status: "completed" })
        .populate("campaign", "title")
        .populate("donor", "name")
        .sort({ paidAt: -1 })
        .limit(10)
        .lean()
    ]);

    // Calculate trends
    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Format campaign stats
    const campaignStatusCounts = campaignStats[0]?.statusCounts?.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}) || {};

    const totalCampaignStats = campaignStats[0]?.totalStats[0] || {};
    const currentCampaigns = campaignStats[0]?.currentMonthCampaigns[0]?.count || 0;
    const previousCampaigns = campaignStats[0]?.previousMonthCampaigns[0]?.count || 0;

    // Format payment stats
    const totalPaymentStats = paymentStats[0]?.totalStats[0] || {};
    const pendingPaymentStats = paymentStats[0]?.pendingStats[0] || {};
    const currentPayments = paymentStats[0]?.currentMonthPayments[0] || {};
    const previousPayments = paymentStats[0]?.previousMonthPayments[0] || {};

    // Format user stats
    const totalUserStats = userStats[0]?.totalStats[0] || {};
    const currentUsers = userStats[0]?.currentMonthUsers[0]?.count || 0;
    const previousUsers = userStats[0]?.previousMonthUsers[0]?.count || 0;

    // Format monthly trends
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyTrends = monthlyTrends.map(trend => ({
      month: monthNames[trend._id.month - 1],
      amount: trend.amount,
      donors: trend.donorCount
    }));

    // Format recent transactions
    const formattedRecentTransactions = recentTransactions.map(txn => ({
      id: txn.transactionUuid || txn._id,
      donorName: txn.anonymous ? "Anonymous" : (txn.donor?.name || "Unknown"),
      campaignTitle: txn.campaign?.title || "Unknown Campaign",
      amount: txn.amount,
      date: txn.paidAt || txn.createdAt,
      status: txn.status
    }));

    const dashboardData = {
      overview: {
        totalDonations: totalPaymentStats.totalRevenue || 0,
        activeCampaigns: (campaignStatusCounts.active || 0) + (campaignStatusCounts.approved || 0),
        totalDonors: totalUserStats.totalDonors || 0,
        completedTransactions: totalPaymentStats.completedCount || 0,
        trends: {
          donations: calculateTrend(currentPayments.revenue || 0, previousPayments.revenue || 0),
          campaigns: calculateTrend(currentCampaigns, previousCampaigns),
          donors: calculateTrend(currentUsers, previousUsers),
          transactions: calculateTrend(currentPayments.count || 0, previousPayments.count || 0)
        }
      },
      campaignStats: {
        statusDistribution: Object.entries(campaignStatusCounts).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count,
          fill: getStatusColor(status)
        })),
        totalCampaigns: totalCampaignStats.totalCampaigns || 0,
        totalRaised: totalCampaignStats.totalRaised || 0,
        totalGoal: totalCampaignStats.totalGoal || 0,
        avgDonorsPerCampaign: Math.round(totalCampaignStats.avgDonorsPerCampaign || 0)
      },
      categoryDistribution: categoryStats,
      monthlyTrends: formattedMonthlyTrends,
      recentTransactions: formattedRecentTransactions,
      quickStats: {
        averageDonation: Math.round(totalPaymentStats.avgTransaction || 0),
        fundingProgress: totalCampaignStats.totalGoal > 0 
          ? Math.round((totalCampaignStats.totalRaised / totalCampaignStats.totalGoal) * 100)
          : 0,
        pendingAmount: pendingPaymentStats.pendingAmount || 0
      }
    };

    return res.status(200).json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Helper function to get status colors
const getStatusColor = (status) => {
  const colors = {
    active: "#2aa558",
    approved: "#87d8a6", 
    completed: "#1e8745",
    rejected: "#d4a017",
    pending: "#3b82f6",
    suspended: "#f59e0b"
  };
  return colors[status] || "#6b7280";
};
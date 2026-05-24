import Campaign from "../campaigns/campaign.model.js";
import Payment from "../payment/payment.model.js";
import User from "../users/user.model.js";
import Category from "../category/category.model.js";
import GoodsDonation from "../goods/goods.model.js";
import Team from "../teams/team.model.js";

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
      recentTransactions,
      goodsStats,
      recentGoodsDonations
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
                  totalTips: { $sum: "$tipAmount" },
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
                  tips: { $sum: "$tipAmount" },
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
                  tips: { $sum: "$tipAmount" },
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
        .lean(),

      // Goods Donation statistics and trends
      GoodsDonation.aggregate([
        {
          $facet: {
            totalStats: [
              { $group: { _id: null, count: { $sum: 1 }, items: { $sum: "$totalItems" } } }
            ],
            currentMonthStats: [
              { $match: { createdAt: { $gte: currentMonthStart } } },
              { $group: { _id: null, count: { $sum: 1 }, items: { $sum: "$totalItems" } } }
            ],
            previousMonthStats: [
              { 
                $match: { 
                  createdAt: { 
                    $gte: previousMonthStart,
                    $lte: previousMonthEnd
                  }
                }
              },
              { $group: { _id: null, count: { $sum: 1 }, items: { $sum: "$totalItems" } } }
            ],
            monthlyTrends: [
              {
                $match: {
                  createdAt: {
                    $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1)
                  }
                }
              },
              {
                $group: {
                  _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                  },
                  count: { $sum: 1 },
                  items: { $sum: "$totalItems" }
                }
              },
              { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]
          }
        }
      ]),

      // Recent Goods Donations
      GoodsDonation.find()
        .populate("campaign", "title")
        .populate("donor", "name")
        .sort({ createdAt: -1 })
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

    const totalGoods = goodsStats[0]?.totalStats[0] || { count: 0, items: 0 };
    const currentGoods = goodsStats[0]?.currentMonthStats[0] || { count: 0, items: 0 };
    const previousGoods = goodsStats[0]?.previousMonthStats[0] || { count: 0, items: 0 };

    const formattedGoodsMonthlyTrends = (goodsStats[0]?.monthlyTrends || []).map(trend => ({
      month: monthNames[trend._id.month - 1],
      count: trend.count,
      items: trend.items
    }));

    const formattedRecentGoodsDonations = recentGoodsDonations.map(donation => ({
      id: donation._id,
      donorName: donation.donor?.name || "Unknown",
      campaignTitle: donation.campaign?.title || "Unknown Campaign",
      items: donation.totalItems,
      date: donation.createdAt,
      status: donation.status
    }));

    const totalCampaigns = totalCampaignStats.totalCampaigns || 0;
    const completedCampaigns = campaignStatusCounts.completed || 0;

    const dashboardData = {
      overview: {
        totalDonations: totalPaymentStats.totalRevenue || 0,
        activeCampaigns: (campaignStatusCounts.active || 0) + (campaignStatusCounts.approved || 0),
        totalDonors: totalUserStats.totalDonors || 0,
        completedTransactions: totalPaymentStats.completedCount || 0,
        totalGoodsDonations: totalGoods.count,
        totalGoodsItems: totalGoods.items,
        setuRevenue: totalPaymentStats.totalTips || 0,
        reportsGenerated: 0,
        completionRate: totalCampaigns > 0 ? Math.round((completedCampaigns / totalCampaigns) * 100) : 0,
        totalDistribution: 0,
        operatingCost: 0,
        efficiencyRate: 0,
        trends: {
          donations: calculateTrend(currentPayments.revenue || 0, previousPayments.revenue || 0),
          campaigns: calculateTrend(currentCampaigns, previousCampaigns),
          donors: calculateTrend(currentUsers, previousUsers),
          transactions: calculateTrend(currentPayments.count || 0, previousPayments.count || 0),
          goodsDonations: calculateTrend(currentGoods.count, previousGoods.count),
          goodsItems: calculateTrend(currentGoods.items, previousGoods.items),
          setuRevenue: calculateTrend(currentPayments.tips || 0, previousPayments.tips || 0),
          reports: 0,
          completionRate: 0 // Could calculate if we tracked historical data
        }
      },
      campaignStats: {
        statusDistribution: Object.entries(campaignStatusCounts).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count,
          fill: getStatusColor(status)
        })),
        totalCampaigns: totalCampaigns,
        totalRaised: totalCampaignStats.totalRaised || 0,
        totalGoal: totalCampaignStats.totalGoal || 0,
        avgDonorsPerCampaign: Math.round(totalCampaignStats.avgDonorsPerCampaign || 0)
      },
      categoryDistribution: categoryStats,
      monthlyTrends: formattedMonthlyTrends,
      goodsMonthlyTrends: formattedGoodsMonthlyTrends,
      recentTransactions: formattedRecentTransactions,
      recentGoodsDonations: formattedRecentGoodsDonations,
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

// ─── Public Stats (no auth) ───────────────────────────────────────────────────
export const getPublicStats = async (req, res) => {
  try {
    const [campaignAgg, totalDonors, teamAgg, goodsPackages] = await Promise.all([
      Campaign.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalRaised: { $sum: "$raisedAmount" },
          },
        },
      ]),
      User.countDocuments({ donationsCount: { $gt: 0 } }),
      Team.aggregate([
        { $match: { status: "active" } },
        {
          $project: {
            campaignCount: { $size: "$campaigns" },
            raisedAmount: 1,
          },
        },
        {
          $group: {
            _id: null,
            activeTeams: { $sum: 1 },
            teamCampaigns: { $sum: "$campaignCount" },
            teamRaised: { $sum: "$raisedAmount" },
          },
        },
      ]),
      GoodsDonation.countDocuments(),
    ]);

    const statusMap = campaignAgg.reduce((acc, s) => {
      acc[s._id] = { count: s.count, raised: s.totalRaised };
      return acc;
    }, {});

    const totalRaised = Object.values(statusMap).reduce(
      (sum, s) => sum + s.raised,
      0,
    );
    const activeCampaigns = statusMap.active?.count ?? 0;
    const completedCampaigns = statusMap.completed?.count ?? 0;
    const teamData = teamAgg[0] ?? { activeTeams: 0, teamCampaigns: 0, teamRaised: 0 };

    return res.status(200).json({
      success: true,
      data: {
        activeCampaigns,
        completedCampaigns,
        totalRaised,
        totalDonors,
        activeTeams: teamData.activeTeams,
        teamCampaigns: teamData.teamCampaigns,
        teamRaised: teamData.teamRaised,
        goodsPackages,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
import User from "../users/user.model.js";
import Team from "../teams/team.model.js";

// ── Top Individual Donors ─────────────────────────────────────────────────────
export const getTopDonors = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const donors = await User.find({ totalDonated: { $gt: 0 } })
      .select(
        "name email avatar location totalDonated donationsCount campaignsSupported donationStreak badge accountType createdAt",
      )
      .sort({ totalDonated: -1 })
      .limit(parseInt(limit));

    const ranked = donors.map((user, i) => ({
      rank: i + 1,
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar?.url ?? null,
      location: user.location ?? "Nepal",
      totalDonated: user.totalDonated,
      donationsCount: user.donationsCount,
      campaignsSupported: user.campaignsSupported,
      donationStreak: user.donationStreak,
      badge: user.badge,
      category: user.accountType || "individual",
      joinedDate: user.createdAt || user._id.getTimestamp(),
      impact: `Supported ${user.campaignsSupported} campaigns with a total of ${user.donationsCount} donations.`,
    }));

    return res.status(200).json({ success: true, donors: ranked });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── Top Teams ─────────────────────────────────────────────────────────────────
export const getTopTeams = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const teams = await Team.find({ status: "active", totalRaised: { $gt: 0 } })
      .select("name avatar totalRaised memberCount")
      .sort({ totalRaised: -1 })
      .limit(parseInt(limit))
      .populate("members.user", "name");

    const ranked = teams.map((team, i) => ({
      rank: i + 1,
      id: team._id,
      name: team.name,
      avatar: team.avatar?.url ?? null,
      totalRaised: team.totalRaised ?? 0,
      members: team.members?.length ?? 0,
    }));

    return res.status(200).json({ success: true, teams: ranked });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── Full leaderboard (donors + teams together) ────────────────────────────────
export const getLeaderboard = async (req, res) => {
  try {
    const { donorLimit = 10, teamLimit = 5 } = req.query;

    const [donors, teams] = await Promise.all([
      User.find({ totalDonated: { $gt: 0 } })
        .select(
          "name email avatar location totalDonated donationsCount campaignsSupported donationStreak badge accountType createdAt",
        )
        .sort({ totalDonated: -1 })
        .limit(parseInt(donorLimit)),
      Team.find({ status: "active", totalRaised: { $gt: 0 } })
        .select("name avatar totalRaised members")
        .sort({ totalRaised: -1 })
        .limit(parseInt(teamLimit)),
    ]);

    return res.status(200).json({
      success: true,
      donors: donors.map((u, i) => ({
        rank: i + 1,
        id: u._id,
        name: u.name,
        avatar: u.avatar?.url ?? null,
        location: u.location ?? "Nepal",
        totalDonated: u.totalDonated,
        donationsCount: u.donationsCount,
        campaignsSupported: u.campaignsSupported,
        donationStreak: u.donationStreak,
        badge: u.badge,
        category: u.accountType || "individual",
        joinedDate: u.createdAt || u._id.getTimestamp(),
        impact: `Supported ${u.campaignsSupported} campaigns with a total of ${u.donationsCount} donations.`,
      })),
      teams: teams.map((t, i) => ({
        rank: i + 1,
        id: t._id,
        name: t.name,
        avatar: t.avatar?.url ?? null,
        totalRaised: t.totalRaised ?? 0,
        members: t.members?.length ?? 0,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    // ── Google OAuth ──────────────────────────────────────────
    googleId: {
      type: String,
      default: null,
    },
    // ─────────────────────────────────────────────────────────
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    accountType: {
      type: String,
      enum: ["individual", "organization"],
      default: "individual",
    },
    phone: {
      type: String,
      default: null,
    },
    avatar: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    location: {
      type: String,
      default: null,
    },
    totalDonated: {
      type: Number,
      default: 0,
    },
    donationsCount: {
      type: Number,
      default: 0,
    },
    campaignsSupported: {
      type: Number,
      default: 0,
    },
    supportedCampaignIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Campaign",
      default: [],
    },
    donationStreak: {
      type: Number,
      default: 0,
    },
    lastDonationMonth: {
      type: String,
      default: null,
    },
    badge: {
      type: String,
      enum: ["gold", "silver", "bronze", null],
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.methods.computeBadge = function () {
  if (this.totalDonated >= 200000) return "gold";
  if (this.totalDonated >= 100000) return "silver";
  if (this.totalDonated >= 50000) return "bronze";
  return null;
};

userSchema.methods.updateStreak = function () {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  if (!this.lastDonationMonth) {
    this.donationStreak = 1;
    this.lastDonationMonth = currentMonth;
    return;
  }

  const [ly, lm] = this.lastDonationMonth.split("-").map(Number);
  const [cy, cm] = currentMonth.split("-").map(Number);
  const monthDiff = (cy - ly) * 12 + (cm - lm);

  if (monthDiff === 0) {
    return;
  } else if (monthDiff === 1) {
    this.donationStreak += 1;
  } else {
    this.donationStreak = 1;
  }
  this.lastDonationMonth = currentMonth;
};

userSchema.index({ totalDonated: -1 });
userSchema.index({ donationsCount: -1 });

const User = mongoose.model("User", userSchema);
export default User;

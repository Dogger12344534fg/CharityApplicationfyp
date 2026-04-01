import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: {
      type: {
        url: String,
        publicId: String,
      },
      default: null,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    category: {
      type: String,
      enum: [
        "emergency",
        "medical",
        "education",
        "charity",
        "animals",
        "environment",
      ],
      required: true,
    },

    goalAmount: {
      type: Number,
      required: true,
      min: 10000,
    },

    raisedAmount: {
      type: Number,
      default: 0,
    },

    website: {
      type: String,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    invites: [
      {
        email: { type: String, required: true },
        invitedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "accepted", "declined"],
          default: "pending",
        },
      },
    ],

    campaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],

    // ── Admin approval ────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "suspended", "disbanded"],
      default: "pending",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    suspendedReason: {
      type: String,
      default: null,
    },

    badge: {
      type: String,
      enum: ["Top Team", "Verified", null],
      default: null,
    },
  },
  { timestamps: true },
);

teamSchema.virtual("memberCount").get(function () {
  return this.members.length;
});
teamSchema.virtual("campaignCount").get(function () {
  return this.campaigns.length;
});

teamSchema.set("toJSON", { virtuals: true });
teamSchema.set("toObject", { virtuals: true });

export default mongoose.model("Team", teamSchema);

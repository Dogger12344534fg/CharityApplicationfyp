import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goalAmount: {
      type: Number,
      required: true,
    },

    raisedAmount: {
      type: Number,
      default: 0,
    },

    images: {
      type: {
        url: String,
        publicId: String,
      },
      required: true,
    },

    // ── Verification Documents ────────────────────────────────
    // Wada registration papers, NGO certificates, etc.
    documents: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        name: { type: String, default: "Document" },
        type: {
          type: String,
          enum: [
            "wada_registration",
            "ngo_certificate",
            "tax_clearance",
            "bank_details",
            "identity",
            "other",
          ],
          default: "other",
        },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // ── Reaction counts (denormalized for fast reads) ──────────
    reactions: {
      love: { type: Number, default: 0 },
      support: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      grateful: { type: Number, default: 0 },
      urgent: { type: Number, default: 0 },
    },

    urgent: {
      type: Boolean,
      default: false,
    },

    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["pending", "active", "completed", "rejected", "suspended"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },

    suspendedReason: {
      type: String,
    },

    donorsCount: {
      type: Number,
      default: 0,
    },

    // ── Payout Details (admin-only, for sending raised funds) ─────
    phoneNumber: {
      type: String,
      trim: true,
    },
    esewaId: {
      type: String,
      trim: true,
    },

    // ── Goods Donations Tracking ──────────────────────────────
    goodsDonations: {
      totalValue: {
        type: Number,
        default: 0,
      },
      totalItems: {
        type: Number,
        default: 0,
      },
      donationsCount: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Campaign", campaignSchema);

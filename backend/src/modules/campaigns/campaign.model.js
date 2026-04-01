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
      enum: [
        "pending",
        "active",
        "completed",
        "rejected",
        "suspended",
      ],
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
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", campaignSchema);
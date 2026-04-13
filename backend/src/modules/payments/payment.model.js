import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
      min: 10,
    },
    tipAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    transactionUuid: {
      type: String,
      required: true,
      unique: true,
    },
    gateway: {
      type: String,
      enum: ["esewa", "khalti", "card", "bank", "manual"],
      default: "esewa",
    },
    status: {
      type: String,
      enum: ["initiated", "pending", "completed", "failed", "refunded"],
      default: "initiated",
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    esewaRefId: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    refundReason: {
      type: String,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

paymentSchema.index({ campaign: 1, status: 1 });
paymentSchema.index({ donor: 1 });

export default mongoose.model("Payment", paymentSchema);

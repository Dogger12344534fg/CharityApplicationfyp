import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  // For password reset — user already exists
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  // For registration — user doesn't exist yet, store email directly
  email: {
    type: String,
    default: null,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  // What this OTP is for
  purpose: {
    type: String,
    enum: ["password_reset", "email_verification"],
    default: "password_reset",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Otp", otpSchema);

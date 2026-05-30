import Otp from "./otp.model.js";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../../services/mail.service.js";
import { StatusCodes } from "http-status-codes";
import User from "../users/user.model.js";

// ─── Generate OTP for Registration (email verification) ───────────────────────
// Does NOT require user to exist — checks email is NOT already taken
export const generateEmailVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Email is required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "This email is already registered. Please login instead.",
      });
    }

    // Invalidate any previous unused email verification OTPs for this email
    await Otp.updateMany(
      {
        email: email.toLowerCase(),
        purpose: "email_verification",
        used: { $ne: true },
      },
      { $set: { used: true } },
    );

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    const otpDoc = await Otp.create({
      user: null,
      email: email.toLowerCase(),
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      purpose: "email_verification",
    });

    await sendOtpEmail(email, "SETU — Verify Your Email", {
      title: "Verify Your Email",
      subText: "Use this OTP to complete your registration on SETU.",
      otpCode: otp,
    });

    console.log(`Email verification OTP sent to ${email}: ${otp}`);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP sent to your email. Please verify to continue.",
      otpId: otpDoc._id,
    });
  } catch (error) {
    console.error("generateEmailVerificationOtp error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal server error." });
  }
};

// ─── Generate OTP for Password Reset (user must exist) ────────────────────────
export const generateOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "No account found with this email." });
    }

    await Otp.updateMany(
      { user: user._id, purpose: "password_reset", used: { $ne: true } },
      { $set: { used: true } },
    );

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    const otpDoc = await Otp.create({
      user: user._id,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      purpose: "password_reset",
    });

    const isAdmin = user.role === "admin";
    const accountType = isAdmin ? "Admin Account" : "Account";
    const greeting = isAdmin
      ? `Hello, ${user.name} (Admin)`
      : `Hello, ${user.name}`;

    await sendOtpEmail(email, "SETU — Password Reset OTP", {
      title: "Password Reset OTP",
      greeting,
      subText: `Use the One-Time Password below to reset your SETU ${accountType.toLowerCase()} password.`,
      otpCode: otp,
      badge: isAdmin ? "ADMIN ACCOUNT" : "",
    });

    console.log(`OTP sent to ${email} [${user.role}]: ${otp}`);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP sent successfully. Please check your email.",
      otpRequested: otpDoc._id,
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    console.error("generateOtp error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal server error." });
  }
};

// ─── Verify OTP & Reset Password ──────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { otpRequested, otp, newPassword } = req.body;

    if (!otpRequested || !otp || !newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "OTP, request ID, and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const otpDoc = await Otp.findOne({
      _id: otpRequested,
      purpose: "password_reset",
      used: { $ne: true },
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid or expired OTP. Please request a new one.",
      });
    }

    const isOtpValid = await bcrypt.compare(otp.toString(), otpDoc.otp);
    if (!isOtpValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Incorrect OTP. Please try again." });
    }

    const user = await User.findById(otpDoc.user);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "User not found." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    otpDoc.used = true;
    await otpDoc.save();

    console.log(`Password reset for ${user.email} [${user.role}]`);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Password reset successfully. You can now log in${user.role === "admin" ? " to the admin dashboard" : ""}.`,
      role: user.role,
    });
  } catch (error) {
    console.error("verifyOtp error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal server error." });
  }
};

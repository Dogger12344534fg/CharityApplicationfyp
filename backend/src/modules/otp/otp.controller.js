import Otp from "./otp.model.js";
import bcrypt from "bcrypt";
import sendEmail from "../../services/mail.service.js";
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

    await sendEmail(
      email,
      "SETU — Verify Your Email",
      `Your email verification OTP is: ${otp}. Valid for 10 minutes.`,
      `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.06); background-color: #ffffff;">
  <div style="background: linear-gradient(135deg, #0f9d58, #16a34a); color: #ffffff; text-align: center; padding: 28px 20px;">
    <h1 style="margin: 0; font-size: 30px; letter-spacing: 1px; font-weight: 700;">SETU</h1>
    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Connecting Donors. Empowering Communities.</p>
  </div>
  <div style="padding: 40px 28px; text-align: center; color: #1f2937;">
    <h2 style="margin: 0 0 14px; font-size: 22px; color: #16a34a;">Verify Your Email</h2>
    <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4b5563;">
      Use this OTP to complete your registration on SETU.
    </p>
    <div style="display: inline-block; background: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 18px 48px; margin: 20px 0;">
      <span style="font-size: 38px; font-weight: 700; color: #16a34a; letter-spacing: 6px;">${otp}</span>
    </div>
    <p style="margin: 18px 0 0; font-size: 14px; color: #6b7280;">
      This OTP is valid for <strong style="color: #16a34a;">10 minutes</strong>.
    </p>
    <p style="margin: 8px 0 0; font-size: 13px; color: #9ca3af;">
      If you didn't request this, please ignore this email.
    </p>
  </div>
  <div style="height: 1px; background: #e5e7eb;"></div>
  <div style="background-color: #f9fafb; text-align: center; padding: 18px; font-size: 13px; color: #6b7280;">
    &copy; 2026 <span style="color: #16a34a; font-weight: 600;">SETU</span>. All rights reserved.
  </div>
</div>
      `,
    );

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

    await sendEmail(
      email,
      "SETU — Password Reset OTP",
      `Your OTP is: ${otp}. Valid for 10 minutes.`,
      `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.06); background-color: #ffffff;">
  <div style="background: linear-gradient(135deg, #0f9d58, #16a34a); color: #ffffff; text-align: center; padding: 28px 20px;">
    <h1 style="margin: 0; font-size: 30px; letter-spacing: 1px; font-weight: 700;">SETU</h1>
    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Connecting Donors. Empowering Communities.</p>
  </div>
  <div style="padding: 40px 28px; text-align: center; color: #1f2937;">
    <p style="margin: 0 0 4px; font-size: 15px; color: #4b5563;">${greeting}</p>
    ${isAdmin ? `<div style="display: inline-block; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 6px 16px; margin: 8px 0 16px;"><span style="font-size: 12px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.08em;">🔐 ${accountType}</span></div>` : ""}
    <h2 style="margin: 0 0 14px; font-size: 22px; color: #16a34a;">Password Reset OTP</h2>
    <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4b5563;">
      Use the One-Time Password below to reset your SETU ${accountType.toLowerCase()} password.
    </p>
    <div style="display: inline-block; background: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 18px 48px; margin: 20px 0;">
      <span style="font-size: 38px; font-weight: 700; color: #16a34a; letter-spacing: 6px;">${otp}</span>
    </div>
    <p style="margin: 18px 0 0; font-size: 14px; color: #6b7280;">This OTP is valid for <strong style="color: #16a34a;">10 minutes</strong>.</p>
    <p style="margin: 8px 0 0; font-size: 13px; color: #9ca3af;">Do not share this code with anyone. SETU will never ask for your OTP.</p>
  </div>
  <div style="height: 1px; background: #e5e7eb;"></div>
  <div style="background-color: #f9fafb; text-align: center; padding: 18px; font-size: 13px; color: #6b7280;">
    &copy; 2026 <span style="color: #16a34a; font-weight: 600;">SETU</span>. All rights reserved.
  </div>
</div>
      `,
    );

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

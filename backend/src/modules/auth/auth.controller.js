import User from "../users/user.model.js";
import Otp from "../otp/otp.model.js";
import Team from "../teams/team.model.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendThemedEmail } from "../../services/mail.service.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ─── Validation Helpers ───────────────────────────────────────────────────────

const validateEmail = (email) => {

  const strictEmailRegex =
    /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.com$/;
  return strictEmailRegex.test(email);
};

const validateName = (name) => {
  if (!name || typeof name !== "string") return { valid: false, message: "Name is required." };

  const trimmed = name.trim();

  if (trimmed.length < 2)
    return { valid: false, message: "Name must be at least 2 characters." };

  if (trimmed.length > 50)
    return { valid: false, message: "Name must not exceed 50 characters." };

  if (/\d/.test(trimmed))
    return { valid: false, message: "Name must not contain numbers." };

  if (!/^[a-zA-Z][a-zA-Z\s'-]*[a-zA-Z]$/.test(trimmed) && trimmed.length > 1)
    return {
      valid: false,
      message: "Name can only contain letters, spaces, hyphens, or apostrophes.",
    };

  if (/\s{2,}/.test(trimmed))
    return { valid: false, message: "Name must not contain consecutive spaces." };

  return { valid: true };
};

const validatePassword = (password) => {
  if (!password) return { valid: false, message: "Password is required." };

  if (password.length < 8)
    return { valid: false, message: "Password must be at least 8 characters." };

  if (password.length > 32)
    return { valid: false, message: "Password must not exceed 32 characters." };

  if (/\s/.test(password))
    return { valid: false, message: "Password must not contain spaces." };

  if (!/[A-Z]/.test(password))
    return { valid: false, message: "Password must contain at least one uppercase letter." };

  if (!/[a-z]/.test(password))
    return { valid: false, message: "Password must contain at least one lowercase letter." };

  if (!/\d/.test(password))
    return { valid: false, message: "Password must contain at least one number." };

  if (!/[@$!%*?&_#^()\-+=]/.test(password))
    return {
      valid: false,
      message: "Password must contain at least one special character (@$!%*?&_#^()-+=).",
    };

  return { valid: true };
};

const validateOtp = (otp) => {
  if (!otp) return { valid: false, message: "OTP is required." };
  const otpStr = otp.toString().trim();
  if (!/^\d{6}$/.test(otpStr))
    return { valid: false, message: "OTP must be exactly 6 digits." };
  return { valid: true };
};

// ─── generate JWT ─────────────────────────────────────────────────────
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });

// ─── Register ─────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, otp, otpId, password, confirmPassword, inviteToken } = req.body;

    if (!name || !email || !otp || !otpId || !password || !confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const nameCheck = validateName(name);
    if (!nameCheck.valid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: nameCheck.message,
      });
    }

    if (!validateEmail(email)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please enter a valid email address ending with .com",
      });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: passwordCheck.message,
      });
    }

    if (password !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const otpCheck = validateOtp(otp);
    if (!otpCheck.valid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: otpCheck.message,
      });
    }

    if (!/^[a-f\d]{24}$/i.test(otpId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid OTP session. Please request a new OTP.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "This email is already registered. Please login.",
      });
    }

    const otpDoc = await Otp.findOne({
      _id: otpId,
      email: email.toLowerCase(),
      purpose: "email_verification",
      used: { $ne: true },
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "OTP is invalid or expired. Please request a new one.",
      });
    }

    const isOtpValid = await bcrypt.compare(otp.toString(), otpDoc.otp);
    if (!isOtpValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Incorrect OTP. Please try again.",
      });
    }

    otpDoc.used = true;
    await otpDoc.save();

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashPass,
    });

    const userObj = user.toObject();
    delete userObj.password;

    // ── Auto-join team if a valid invite token was provided ────────────────────
    let joinedTeamId = null;
    if (inviteToken && typeof inviteToken === "string" && inviteToken.trim()) {
      try {
        const team = await Team.findOne({ "invites.inviteToken": inviteToken.trim() });
        if (team) {
          const invite = team.invites.find((inv) => inv.inviteToken === inviteToken.trim());
          const isValid =
            invite &&
            invite.status === "pending" &&
            (!invite.tokenExpiry || new Date() < invite.tokenExpiry);

          if (isValid && team.status === "active") {
            invite.status = "accepted";
            invite.inviteToken = null;
            const alreadyMember = team.members.some(
              (m) => m.user.toString() === user._id.toString()
            );
            if (!alreadyMember) {
              team.members.push({ user: user._id, role: "member" });
            }
            await team.save();
            joinedTeamId = team._id;
          }
        }
      } catch (err) {
        console.error("Auto-join on register failed (non-fatal):", err);
      }
    }

    sendThemedEmail(
      user.email,
      "Welcome to Setu!",
      "Welcome to Setu!",
      `Hi ${user.name}, welcome to Setu! We are thrilled to have you join our platform.`,
      "<p style='margin:0'>You can now support campaigns, start your own fundraisers, and track your impact directly from your dashboard.</p>",
      "Explore Campaigns",
      `${FRONTEND_URL}/campaigns`
    ).catch(err => console.error("Welcome email failed:", err));

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Account created successfully. You can now log in.",
      data: userObj,
      joinedTeamId,
    });
  } catch (error) {
    console.error("register error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (!validateEmail(email)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please enter a valid email address ending with .com",
      });
    }

    if (typeof password !== "string" || password.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Password is required.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    if (user.googleId && user.password?.startsWith("google_oauth_")) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "This account was created with Google. Please sign in with Google.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid password.",
      });
    }

    const token = generateToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User logged in successfully.",
      data: userObj,
      token,
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ─── Google OAuth Callback ────────────────────────────────────────────────────
export const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user);

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.googleId;

    const params = new URLSearchParams({
      token,
      user: JSON.stringify(userObj),
    });

    return res.redirect(`${FRONTEND_URL}/auth/callback?${params.toString()}`);
  } catch (error) {
    console.error("googleAuthCallback error:", error);
    return res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const nameCheck = validateName(name);
    if (!nameCheck.valid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: nameCheck.message,
      });
    }

    if (!validateEmail(email)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please enter a valid email address ending with .com",
      });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: passwordCheck.message,
      });
    }

    if (password !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashPass,
      role: "admin",
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Admin created successfully.",
      data: userObj,
    });
  } catch (error) {
    console.error("createAdmin error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
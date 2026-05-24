import express from "express";
import passport from "../../config/passport.config.js";
import {
  register,
  login,
  createAdmin,
  googleAuthCallback,
} from "./auth.controller.js";

const router = express.Router();

// ─── Email / Password Auth ────────────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);
router.post("/create-admin", createAdmin);

// ─── Google OAuth ─────────────────────────────────────────────────────────────

// Step 1: Redirect user to Google consent screen
// GET /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  googleAuthCallback,
);

export default router;

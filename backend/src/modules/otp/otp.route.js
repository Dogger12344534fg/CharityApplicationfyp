import express from "express";
import {
  generateOtp,
  verifyOtp,
  generateEmailVerificationOtp,
} from "./otp.controller.js";

const router = express.Router();

router.post("/generate", generateOtp);
router.post("/verify", verifyOtp);

router.post("/generate-email", generateEmailVerificationOtp);

export default router;

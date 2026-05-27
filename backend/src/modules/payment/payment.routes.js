import express from "express";
import {
  initiateEsewaPayment,
  verifyEsewaCallback,
  esewaFailure,
  getPaymentById,
  getMyPayments,
  getCampaignPayments,
  getRecentCampaignDonors,
  getAllPayments,
  updatePaymentStatus,
  deletePayment,
  createManualPayment,
} from "./payment.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";
const router = express.Router();

// GET /api/payments -> admin gets all payments + stats
router.get("/", authMiddleware, verifyRole("admin"), getAllPayments);

// POST /api/payments/manual -> admin creates manual payment
router.post("/manual", authMiddleware, verifyRole("admin"), createManualPayment);

// ─── eSewa ────────────────────────────────────────────────────────────────────
// POST /api/payments/esewa/initiate  → start payment (auth optional for guests)
router.post("/esewa/initiate", authMiddleware, initiateEsewaPayment);
router.post("/teams/esewa/initiate", authMiddleware, initiateEsewaPayment); // Fallback for cached frontends

// GET  /api/payments/esewa/verify    → eSewa success redirect callback
router.get("/esewa/verify", verifyEsewaCallback);

// GET  /api/payments/esewa/failure   → eSewa failure redirect callback
router.get("/esewa/failure", esewaFailure);


// ─── Khalti ───────────────────────────────────────────────────────────────────
import {
  initiateKhaltiPaymentController,
  verifyKhaltiCallback,
} from "./payment.controller.js";

// ─── Khalti ───────────────────────────────────────────────────────────────────
router.post("/khalti/initiate", authMiddleware, initiateKhaltiPaymentController);
router.get("/khalti/verify", verifyKhaltiCallback);

// ─── User ─────────────────────────────────────────────────────────────────────
// GET  /api/payments/my              → donor's own payment history
router.get("/my", authMiddleware, getMyPayments);

// GET  /api/payments/:id             → single payment (owner or admin)
router.get("/:id", authMiddleware, getPaymentById);

// PUT  /api/payments/:id             → update payment status (admin only)
router.put("/:id", authMiddleware, verifyRole("admin"), updatePaymentStatus);

// DELETE /api/payments/:id           → delete payment (admin only)
router.delete("/:id", authMiddleware, verifyRole("admin"), deletePayment);

// ─── Public: recent donors for a campaign (no auth needed) ──────────────────
// GET  /api/payments/campaign/:campaignId/donors
router.get("/campaign/:campaignId/donors", getRecentCampaignDonors);

// ─── Campaign payments (admin only) ─────────────────────────────────────────
// GET  /api/payments/campaign/:campaignId
router.get(
  "/campaign/:campaignId",
  authMiddleware,
  verifyRole("admin"),
  getCampaignPayments,
);

export default router;

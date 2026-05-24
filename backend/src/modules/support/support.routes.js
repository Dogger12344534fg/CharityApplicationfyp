import express from "express";
import {
	submitSupportTicket,
	getAllSupportTickets,
	replyToSupportTicket,
} from "./support.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";

const router = express.Router();

// Public endpoint
router.post("/", submitSupportTicket);

// Admin endpoints
router.use(authMiddleware);
router.use(verifyRole("admin"));

router.get("/", getAllSupportTickets);
router.patch("/:id/reply", replyToSupportTicket);

export default router;

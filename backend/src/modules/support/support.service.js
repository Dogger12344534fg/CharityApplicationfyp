import SupportTicket from "./support.model.js";
import { sendThemedEmail } from "../../services/mail.service.js";

// ─── Submit a Support/Report Ticket ──────────────────────────────────────────
export const submitSupportTicketService = async (data) => {
	const { type, name, email, subject, message, campaignUrl } = data;

	if (!type || !["contact", "report"].includes(type)) {
		throw new Error("Invalid ticket type.");
	}

	if (!email || !subject || !message) {
		throw new Error("Email, subject, and message are required.");
	}

	const ticket = await SupportTicket.create({
		type,
		name: name || "Anonymous",
		email,
		subject,
		message,
		campaignUrl,
		status: "open",
	});

	// Optionally send an auto-reply acknowledging receipt
	try {
		await sendThemedEmail(
			email,
			"We received your message",
			"Message Received",
			`Hi ${ticket.name}, we've successfully received your ${type === "report" ? "report" : "message"}.`,
			`<p style="margin:0">Our team will review your message regarding <strong>${subject}</strong> and get back to you within 24 hours.</p>`,
			"Go to Setu",
			process.env.FRONTEND_URL || "http://localhost:3000"
		);
	} catch (err) {
		console.error("Failed to send auto-reply email for support ticket:", err);
	}

	return ticket;
};

// ─── Get All Tickets (Admin) ─────────────────────────────────────────────────
export const getAllSupportTicketsService = async (query) => {
	const { page = 1, limit = 20, status, type, sortBy = "createdAt", order = "desc" } = query;

	const filter = {};
	if (status) filter.status = status;
	if (type) filter.type = type;

	const skip = (parseInt(page) - 1) * parseInt(limit);

	const [tickets, total] = await Promise.all([
		SupportTicket.find(filter)
			.populate("resolvedBy", "name email")
			.sort({ [sortBy]: order === "asc" ? 1 : -1 })
			.skip(skip)
			.limit(parseInt(limit)),
		SupportTicket.countDocuments(filter),
	]);

	return {
		tickets,
		pagination: {
			total,
			page: parseInt(page),
			limit: parseInt(limit),
			totalPages: Math.ceil(total / parseInt(limit)),
		},
	};
};

// ─── Reply and Resolve Ticket (Admin) ────────────────────────────────────────
export const replyToSupportTicketService = async (id, adminId, replyMessage) => {
	if (!replyMessage || !replyMessage.trim()) {
		throw new Error("Reply message cannot be empty.");
	}

	const ticket = await SupportTicket.findById(id);
	if (!ticket) {
		throw new Error("Support ticket not found.");
	}

	if (ticket.status === "resolved") {
		throw new Error("This ticket is already resolved.");
	}

	ticket.status = "resolved";
	ticket.replyMessage = replyMessage.trim();
	ticket.resolvedBy = adminId;
	ticket.resolvedAt = new Date();

	await ticket.save();

	// Send the reply email to the user
	try {
		await sendThemedEmail(
			ticket.email,
			`Re: ${ticket.subject}`,
			"Response to your message",
			`Hi ${ticket.name}, our team has reviewed your ${ticket.type} regarding "${ticket.subject}".`,
			`<p style="margin:0">${ticket.replyMessage}</p><br/><p style="margin:0; font-size: 13px; color: #666;">Original Message:<br/>${ticket.message}</p>`,
			"Visit Setu",
			process.env.FRONTEND_URL || "http://localhost:3000"
		);
	} catch (err) {
		console.error("Failed to send reply email for support ticket:", err);
	}

	return ticket;
};

import {
	submitSupportTicketService,
	getAllSupportTicketsService,
	replyToSupportTicketService,
} from "./support.service.js";

// ─── Submit a Support/Report Ticket (Public) ─────────────────────────────────
export const submitSupportTicket = async (req, res, next) => {
	try {
		const ticket = await submitSupportTicketService(req.body);
		res.status(201).json({
			success: true,
			message: "Message submitted successfully. Our team will get back to you.",
			data: ticket,
		});
	} catch (error) {
		next(error);
	}
};

// ─── Get All Tickets (Admin) ─────────────────────────────────────────────────
export const getAllSupportTickets = async (req, res, next) => {
	try {
		const result = await getAllSupportTicketsService(req.query);
		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

// ─── Reply to Ticket (Admin) ─────────────────────────────────────────────────
export const replyToSupportTicket = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { replyMessage } = req.body;
		const adminId = req.user._id; // from protect middleware

		const ticket = await replyToSupportTicketService(id, adminId, replyMessage);

		res.status(200).json({
			success: true,
			message: "Reply sent and ticket resolved successfully.",
			data: ticket,
		});
	} catch (error) {
		next(error);
	}
};

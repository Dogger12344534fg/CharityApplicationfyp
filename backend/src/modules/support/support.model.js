import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["contact", "report"],
			required: true,
		},
		name: {
			type: String,
			trim: true,
			default: "Anonymous",
		},
		email: {
			type: String,
			trim: true,
			required: true,
		},
		subject: {
			type: String,
			required: true,
			trim: true,
		},
		message: {
			type: String,
			required: true,
			trim: true,
		},
		campaignUrl: {
			type: String,
			trim: true,
		},
		status: {
			type: String,
			enum: ["open", "resolved"],
			default: "open",
		},
		replyMessage: {
			type: String,
			trim: true,
		},
		resolvedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		resolvedAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

// Indexes for better query performance
supportTicketSchema.index({ status: 1, createdAt: -1 });
supportTicketSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model("SupportTicket", supportTicketSchema);

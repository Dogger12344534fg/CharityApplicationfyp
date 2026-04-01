import {
	createCampaignService,
	deleteCampaignService,
	getAllCampaignsService,
	getCampaignByIdService,
	getMyCampaignsService,
	updateCampaignService,
	approveCampaignService,
	rejectCampaignService,
	suspendCampaignService,
	unsuspendCampaignService,
} from "./campaign.service.js";

import User from "../users/user.model.js";

// ─── Shared error status resolver ─────────────────────────────────────────────
const resolveStatus = (message) => {
	if (message.includes("not found")) return 404;
	if (message.includes("Not authorized")) return 403;
	if (
		message.includes("Cannot") ||
		message.includes("cannot") ||
		message.includes("Only")
	)
		return 422;
	return 400;
};

// ─── Create Campaign ──────────────────────────────────────────────────────────
export const createCampaign = async (req, res) => {
	try {
		const campaign = await createCampaignService({
			body: req.body,
			file: req.file,
			userId: req.user._id,
		});

		const user = await User.findById(req.user._id);

		if (user.role === "admin") {
			campaign.status = "active";
			await campaign.save();
		}

		return res.status(201).json({
			success: true,
			message: "Campaign created successfully.",
			data: campaign,
		});
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message });
	}
};

// ─── Get All Campaigns ────────────────────────────────────────────────────────
export const getAllCampaigns = async (req, res) => {
	try {
		const result = await getAllCampaignsService(req.query);
		return res.status(200).json({ success: true, ...result });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

// ─── Get Campaign By ID ───────────────────────────────────────────────────────
export const getCampaignById = async (req, res) => {
	try {
		const campaign = await getCampaignByIdService(req.params.id);
		return res.status(200).json({ success: true, data: campaign });
	} catch (error) {
		return res
			.status(resolveStatus(error.message))
			.json({ success: false, message: error.message });
	}
};

// ─── Update Campaign ──────────────────────────────────────────────────────────
export const updateCampaign = async (req, res) => {
	try {
		const campaign = await updateCampaignService({
			id: req.params.id,
			body: req.body,
			file: req.file,
			userId: req.user._id,
			userRole: req.user.role,
		});

		return res.status(200).json({
			success: true,
			message: "Campaign updated successfully.",
			data: campaign,
		});
	} catch (error) {
		return res
			.status(resolveStatus(error.message))
			.json({ success: false, message: error.message });
	}
};

// ─── Delete Campaign ──────────────────────────────────────────────────────────
export const deleteCampaign = async (req, res) => {
	try {
		const result = await deleteCampaignService({
			id: req.params.id,
			userId: req.user._id,
			userRole: req.user.role,
		});

		return res.status(200).json({ success: true, ...result });
	} catch (error) {
		return res
			.status(resolveStatus(error.message))
			.json({ success: false, message: error.message });
	}
};

// ─── Get My Campaigns ─────────────────────────────────────────────────────────
export const getMyCampaigns = async (req, res) => {
	try {
		const result = await getMyCampaignsService({
			userId: req.user._id,
			query: req.query,
		});

		return res.status(200).json({ success: true, ...result });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

// ─── Approve Campaign ─────────────────────────────────────────────────────────
export const approveCampaign = async (req, res) => {
	try {
		const campaign = await approveCampaignService({
			id: req.params.id,
			adminId: req.user._id,
		});

		return res.status(200).json({
			success: true,
			message: "Campaign approved and set to active.",
			data: campaign,
		});
	} catch (error) {
		return res
			.status(resolveStatus(error.message))
			.json({ success: false, message: error.message });
	}
};

// ─── Reject Campaign ──────────────────────────────────────────────────────────
export const rejectCampaign = async (req, res) => {
	try {
		const { rejectionReason } = req.body;

		const campaign = await rejectCampaignService({
			id: req.params.id,
			rejectionReason,
			adminId: req.user._id,
		});

		return res.status(200).json({
			success: true,
			message: "Campaign has been rejected.",
			data: campaign,
		});
	} catch (error) {
		return res
			.status(resolveStatus(error.message))
			.json({ success: false, message: error.message });
	}
};

// ─── Suspend Campaign ─────────────────────────────────────────────────────────
export const suspendCampaign = async (req, res) => {
	try {
		const { suspendedReason } = req.body;

		const campaign = await suspendCampaignService({
			id: req.params.id,
			suspendedReason,
			adminId: req.user._id,
		});

		return res.status(200).json({
			success: true,
			message: "Campaign has been suspended.",
			data: campaign,
		});
	} catch (error) {
		return res
			.status(resolveStatus(error.message))
			.json({ success: false, message: error.message });
	}
};

// ─── Unsuspend (Reactivate) Campaign ─────────────────────────────────────────
export const unsuspendCampaign = async (req, res) => {
	try {
		const campaign = await unsuspendCampaignService({
			id: req.params.id,
			adminId: req.user._id,
		});

		return res.status(200).json({
			success: true,
			message: "Campaign has been reactivated.",
			data: campaign,
		});
	} catch (error) {
		return res
			.status(resolveStatus(error.message))
			.json({ success: false, message: error.message });
	}
};

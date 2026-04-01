import Campaign from "./campaign.model.js";
import Location from "./location.model.js";
import cloudinary from "../../config/cloudinary.js";

// ─── Helper: find campaign or throw ──────────────────────────────────────────
const findCampaignOrThrow = async (id) => {
	const campaign = await Campaign.findById(id);
	if (!campaign) throw new Error("Campaign not found.");
	return campaign;
};

// ─── Helper: populate campaign query ─────────────────────────────────────────
const populateCampaign = (query) =>
	query
		.populate("category", "name")
		.populate("createdBy", "name email")
		.populate("location")
		.populate("approvedBy", "name email");

// ─── Create Campaign ──────────────────────────────────────────────────────────
export const createCampaignService = async ({ body, file, userId }) => {
	const {
		title,
		description,
		category,
		goalAmount,
		urgent,
		endDate,
		locationName,
		longitude,
		latitude,
		address,
		city,
		state,
		country,
		zipCode,
		locationId,
	} = body;

	if (!file) throw new Error("Campaign image is required.");

	let resolvedLocationId = locationId;
	if (!locationId) {
		if (!longitude || !latitude)
			throw new Error(
				"Longitude and latitude are required to create a location.",
			);

		const location = await Location.create({
			name: locationName,
			type: "Point",
			coordinates: [parseFloat(longitude), parseFloat(latitude)],
			address,
			city,
			state,
			country,
			zipCode,
		});
		resolvedLocationId = location._id;
	}

	const campaign = await Campaign.create({
		title,
		description,
		category,
		createdBy: userId,
		goalAmount,
		urgent: urgent === "true" || urgent === true,
		endDate,
		location: resolvedLocationId,
		images: { url: file.path, publicId: file.filename },
	});

	return campaign;
};

// ─── Get All Campaigns ────────────────────────────────────────────────────────
export const getAllCampaignsService = async (query) => {
	const {
		page = 1,
		limit = 10,
		status,
		category,
		urgent,
		search,
		sortBy = "createdAt",
		order = "desc",
	} = query;

	const filter = {};
	if (status) filter.status = status;
	if (category) filter.category = category;
	if (urgent !== undefined) filter.urgent = urgent === "true";
	if (search) filter.title = { $regex: search, $options: "i" };

	const skip = (parseInt(page) - 1) * parseInt(limit);

	const [campaigns, total] = await Promise.all([
		populateCampaign(
			Campaign.find(filter)
				.sort({ [sortBy]: order === "asc" ? 1 : -1 })
				.skip(skip)
				.limit(parseInt(limit)),
		),
		Campaign.countDocuments(filter),
	]);

	return {
		campaigns,
		pagination: {
			total,
			page: parseInt(page),
			limit: parseInt(limit),
			totalPages: Math.ceil(total / parseInt(limit)),
		},
	};
};

// ─── Get Campaign By ID ───────────────────────────────────────────────────────
export const getCampaignByIdService = async (id) => {
	const campaign = await populateCampaign(Campaign.findById(id));
	if (!campaign) throw new Error("Campaign not found.");
	return campaign;
};

// ─── Update Campaign ──────────────────────────────────────────────────────────
export const updateCampaignService = async ({
	id,
	body,
	file,
	userId,
	userRole,
}) => {
	const campaign = await findCampaignOrThrow(id);

	const isOwner = campaign.createdBy.toString() === userId.toString();
	if (!isOwner && userRole !== "admin")
		throw new Error("Not authorized to update this campaign.");

	const {
		title,
		description,
		category,
		goalAmount,
		urgent,
		endDate,
		locationId,
		locationName,
		longitude,
		latitude,
		address,
		city,
		state,
		country,
		zipCode,
	} = body;

	const updates = {};
	if (title !== undefined) updates.title = title;
	if (description !== undefined) updates.description = description;
	if (category !== undefined) updates.category = category;
	if (goalAmount !== undefined) updates.goalAmount = goalAmount;
	if (urgent !== undefined)
		updates.urgent = urgent === "true" || urgent === true;
	if (endDate !== undefined) updates.endDate = endDate;

	if (locationId) {
		updates.location = locationId;
	} else if (longitude && latitude) {
		const location = await Location.create({
			name: locationName,
			type: "Point",
			coordinates: [parseFloat(longitude), parseFloat(latitude)],
			address,
			city,
			state,
			country,
			zipCode,
		});
		updates.location = location._id;
	}

	if (file) {
		if (campaign.images?.publicId)
			await cloudinary.uploader.destroy(campaign.images.publicId);
		updates.images = { url: file.path, publicId: file.filename };
	}

	return populateCampaign(
		Campaign.findByIdAndUpdate(id, updates, { new: true, runValidators: true }),
	);
};

// ─── Delete Campaign ──────────────────────────────────────────────────────────
export const deleteCampaignService = async ({ id, userId, userRole }) => {
	const campaign = await findCampaignOrThrow(id);

	const isOwner = campaign.createdBy.toString() === userId.toString();
	if (!isOwner && userRole !== "admin")
		throw new Error("Not authorized to delete this campaign.");

	if (campaign.images?.publicId)
		await cloudinary.uploader.destroy(campaign.images.publicId);

	await campaign.deleteOne();
	return { message: "Campaign deleted successfully." };
};

// ─── Get My Campaigns ─────────────────────────────────────────────────────────
export const getMyCampaignsService = async ({ userId, query }) => {
	const { page = 1, limit = 10, status } = query;

	const filter = { createdBy: userId };
	if (status) filter.status = status;

	const skip = (parseInt(page) - 1) * parseInt(limit);

	const [campaigns, total] = await Promise.all([
		Campaign.find(filter)
			.populate("category", "name")
			.populate("location")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit)),
		Campaign.countDocuments(filter),
	]);

	return {
		campaigns,
		pagination: {
			total,
			page: parseInt(page),
			limit: parseInt(limit),
			totalPages: Math.ceil(total / parseInt(limit)),
		},
	};
};

// ─── Approve Campaign ─────────────────────────────────────────────────────────
export const approveCampaignService = async ({ id, adminId }) => {
	const campaign = await findCampaignOrThrow(id);

	if (campaign.status !== "pending") {
		throw new Error(
			`Only pending campaigns can be approved. Current status: "${campaign.status}".`,
		);
	}

	return populateCampaign(
		Campaign.findByIdAndUpdate(
			id,
			{
				status: "active",
				approvedBy: adminId,
				approvedAt: new Date(),
				rejectionReason: null,
				suspendedReason: null,
			},
			{ new: true },
		),
	);
};

// ─── Reject Campaign ──────────────────────────────────────────────────────────
export const rejectCampaignService = async ({
	id,
	rejectionReason,
	adminId,
}) => {
	if (!rejectionReason?.trim())
		throw new Error("Rejection reason is required.");

	const campaign = await findCampaignOrThrow(id);

	if (!["pending", "active"].includes(campaign.status)) {
		throw new Error(
			`Campaign with status "${campaign.status}" cannot be rejected.`,
		);
	}

	return populateCampaign(
		Campaign.findByIdAndUpdate(
			id,
			{
				status: "rejected",
				rejectionReason: rejectionReason.trim(),
				approvedBy: adminId,
				approvedAt: new Date(),
			},
			{ new: true },
		),
	);
};

// ─── Suspend Campaign ─────────────────────────────────────────────────────────
export const suspendCampaignService = async ({
	id,
	suspendedReason,
	adminId,
}) => {
	if (!suspendedReason?.trim())
		throw new Error("Suspension reason is required.");

	const campaign = await findCampaignOrThrow(id);

	if (campaign.status !== "active") {
		throw new Error(
			`Only active campaigns can be suspended. Current status: "${campaign.status}".`,
		);
	}

	return populateCampaign(
		Campaign.findByIdAndUpdate(
			id,
			{
				status: "suspended",
				suspendedReason: suspendedReason.trim(),
				approvedBy: adminId,
				approvedAt: new Date(),
			},
			{ new: true },
		),
	);
};

// ─── Unsuspend (Reactivate) Campaign ─────────────────────────────────────────
export const unsuspendCampaignService = async ({ id, adminId }) => {
	const campaign = await findCampaignOrThrow(id);

	if (campaign.status !== "suspended") {
		throw new Error(
			`Only suspended campaigns can be reactivated. Current status: "${campaign.status}".`,
		);
	}

	return populateCampaign(
		Campaign.findByIdAndUpdate(
			id,
			{
				status: "active",
				suspendedReason: null,
				approvedBy: adminId,
				approvedAt: new Date(),
			},
			{ new: true },
		),
	);
};

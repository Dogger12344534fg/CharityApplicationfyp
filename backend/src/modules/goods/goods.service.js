import GoodsDonation from "./goods.model.js";
import Campaign from "../campaigns/campaign.model.js";
import Location from "../campaigns/location.model.js";
import cloudinary from "../../config/cloudinary.js";
import mongoose from "mongoose";
import User from "../users/user.model.js";
import { sendThemedEmail } from "../../services/mail.service.js";
// ─── Helpers ──────────────────────────────────────────────────────────────────

const findGoodsDonationOrThrow = async (id) => {
	const donation = await GoodsDonation.findById(id);
	if (!donation) throw new Error("Goods donation not found.");
	return donation;
};

const populateGoodsDonation = (query) =>
	query
		.populate({
			path: "campaign",
			select: "title status goalAmount raisedAmount images location",
			options: { strictPopulate: false }
		})
		.populate({
			path: "donor",
			select: "name email phone",
			options: { strictPopulate: false }
		})
		.populate({
			path: "verifiedBy",
			select: "name email",
			options: { strictPopulate: false }
		})
		.populate({
			path: "pickupLocation",
			select: "name address city state coordinates",
			options: { strictPopulate: false }
		});
		

// ─── Create Goods Donation ───────────────────────────────────────────────────
export const createGoodsDonationService = async ({ body, files, userId }) => {
	console.log(body);

	const {
		campaignId,
		items,
		pickupLocation,
		deliveryMethod,
		preferredPickupTime,
		contactInfo,
		donorNotes,
	} = body;

	// Verify campaign exists and is active
	const campaign = await Campaign.findById(campaignId);
	if (!campaign) throw new Error("Campaign not found.");
	if (campaign.status !== "active") throw new Error("Campaign is not active.");

	// Parse items if it's a string
	let parsedItems;
	try {
		parsedItems = typeof items === "string" ? JSON.parse(items) : items;
	} catch (error) {
		throw new Error("Invalid items format.");
	}

	if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
		throw new Error("At least one item is required.");
	}

	// Process uploaded images for items
	const processedItems = parsedItems.map((item, index) => {
		let itemImages = [];

		// Handle file uploads (multipart/form-data)
		if (files && files.length > 0) {
			const itemFiles = files.filter((file) =>
				file.fieldname.startsWith(`items[${index}][images]`) ||
				file.fieldname === `item_${index}_image` ||
				file.fieldname === `images_${index}`
			);

			itemFiles.forEach((file) => {
				itemImages.push({
					url: file.path,
					publicId: file.filename,
				});
			});
		}

		// Handle images provided as URLs in the item data (for testing/API)
		if (item.images && Array.isArray(item.images)) {
			item.images.forEach((image) => {
				if (typeof image === "string") {
					// If it's just a URL string
					itemImages.push({
						url: image,
						publicId: `goods/item_${index}_${Date.now()}`,
					});
				} else if (image.url) {
					// If it's an object with url and publicId
					itemImages.push({
						url: image.url,
						publicId: image.publicId || `goods/item_${index}_${Date.now()}`,
					});
				}
			});
		}

		return {
			...item,
			images: itemImages,
			estimatedValue: Number(item.estimatedValue) || 0,
			quantity: Number(item.quantity) || 1,
		};
	});

	// Parse and create location
	const parsedPickupLocation =
		typeof pickupLocation === "string"
			? JSON.parse(pickupLocation)
			: pickupLocation;

	// Create location document
	const locationDoc = await Location.create({
		name:
			parsedPickupLocation.name ||
			`${parsedPickupLocation.address}, ${parsedPickupLocation.city}`,
		coordinates: parsedPickupLocation.coordinates || [0, 0], // [longitude, latitude]
		address: parsedPickupLocation.address,
		city: parsedPickupLocation.city,
		state: parsedPickupLocation.state,
		country: parsedPickupLocation.country || "Nepal",
		zipCode: parsedPickupLocation.zipCode,
	});

	// Parse contact info
	const parsedContactInfo =
		typeof contactInfo === "string" ? JSON.parse(contactInfo) : contactInfo;

	const goodsDonation = await GoodsDonation.create({
		campaign: campaignId,
		donor: userId,
		items: processedItems,
		pickupLocation: locationDoc._id,
		deliveryMethod,
		preferredPickupTime: preferredPickupTime
			? new Date(preferredPickupTime)
			: null,
		contactInfo: parsedContactInfo,
		donorNotes,
		status: "pending",
	});

	try {
		const user = await User.findById(userId);
		if (user && user.email) {
			const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
			await sendThemedEmail(
				user.email,
				"Goods Donation Received",
				"Thank you for your generosity!",
				`Hi ${user.name}, we've successfully received your goods donation request for "${campaign.title}".`,
				"<p style='margin:0'>Our team will review your request and contact you shortly to coordinate the next steps.</p>",
				"View My Donations",
				`${FRONTEND_URL}/my-donations`
			);
		}
	} catch (error) {
		console.error("Failed to send goods donation email:", error);
	}

	return populateGoodsDonation(GoodsDonation.findById(goodsDonation._id));
};

// ─── Get All Goods Donations (Admin) ─────────────────────────────────────────
export const getAllGoodsDonationsService = async (query) => {
	const {
		page = 1,
		limit = 20,
		status,
		campaign,
		city,
		category,
		deliveryMethod,
		search,
		sortBy = "createdAt",
		order = "desc",
	} = query;

	const filter = {};
	if (status) filter.status = status;
	if (campaign) filter.campaign = campaign;
	if (deliveryMethod) filter.deliveryMethod = deliveryMethod;
	if (category) filter["items.category"] = category;

	// For city filtering, we need to use a separate query since it's in a referenced document
	let locationIds = [];
	if (city) {
		const locations = await Location.find({
			city: { $regex: city, $options: "i" },
		}).select("_id");
		locationIds = locations.map((loc) => loc._id);
		filter.pickupLocation = { $in: locationIds };
	}

	// Search functionality
	if (search) {
		const searchRegex = { $regex: search, $options: "i" };
		
		// Find matching users (donors)
		const User = mongoose.model('User');
		const matchingUsers = await User.find({
			$or: [
				{ name: searchRegex },
				{ email: searchRegex }
			]
		}).select("_id");
		
		// Find matching campaigns
		const matchingCampaigns = await Campaign.find({
			title: searchRegex
		}).select("_id");
		
		// Find matching locations
		const matchingLocations = await Location.find({
			$or: [
				{ name: searchRegex },
				{ city: searchRegex },
				{ address: searchRegex }
			]
		}).select("_id");

		// Combine search criteria
		const searchCriteria = [];
		
		if (matchingUsers.length > 0) {
			searchCriteria.push({ donor: { $in: matchingUsers.map(u => u._id) } });
		}
		
		if (matchingCampaigns.length > 0) {
			searchCriteria.push({ campaign: { $in: matchingCampaigns.map(c => c._id) } });
		}
		
		if (matchingLocations.length > 0) {
			searchCriteria.push({ pickupLocation: { $in: matchingLocations.map(l => l._id) } });
		}

		// Search in items
		searchCriteria.push({ "items.name": searchRegex });
		searchCriteria.push({ "items.description": searchRegex });
		
		// Search in notes
		searchCriteria.push({ donorNotes: searchRegex });
		searchCriteria.push({ adminNotes: searchRegex });

		if (searchCriteria.length > 0) {
			filter.$or = searchCriteria;
		}
	}

	const skip = (parseInt(page) - 1) * parseInt(limit);

	const [donations, total] = await Promise.all([
		populateGoodsDonation(
			GoodsDonation.find(filter)
				.sort({ [sortBy]: order === "asc" ? 1 : -1 })
				.skip(skip)
				.limit(parseInt(limit)),
		),
		GoodsDonation.countDocuments(filter),
	]);

	return {
		donations,
		pagination: {
			total,
			page: parseInt(page),
			limit: parseInt(limit),
			totalPages: Math.ceil(total / parseInt(limit)),
		},
	};
};

// ─── Get Goods Donations by Campaign ─────────────────────────────────────────
export const getGoodsDonationsByCampaignService = async (campaignId, query) => {
	const { page = 1, limit = 10, status = "completed" } = query;

	const filter = {
		campaign: campaignId,
		status: { $in: Array.isArray(status) ? status : [status] },
	};

	const skip = (parseInt(page) - 1) * parseInt(limit);

	const [donations, total] = await Promise.all([
		populateGoodsDonation(
			GoodsDonation.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(parseInt(limit)),
		),
		GoodsDonation.countDocuments(filter),
	]);

	return {
		donations,
		pagination: {
			total,
			page: parseInt(page),
			limit: parseInt(limit),
			totalPages: Math.ceil(total / parseInt(limit)),
		},
	};
};

// ─── Get My Goods Donations ──────────────────────────────────────────────────
export const getMyGoodsDonationsService = async ({ userId, query }) => {
	const { page = 1, limit = 10 } = query;
	const skip = (parseInt(page) - 1) * parseInt(limit);

	const filter = { donor: userId };

	const [donations, total] = await Promise.all([
		populateGoodsDonation(
			GoodsDonation.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(parseInt(limit)),
		),
		GoodsDonation.countDocuments(filter),
	]);

	return {
		donations,
		pagination: {
			total,
			page: parseInt(page),
			limit: parseInt(limit),
			totalPages: Math.ceil(total / parseInt(limit)),
		},
	};
};

// ─── Get Goods Donation By ID ────────────────────────────────────────────────
export const getGoodsDonationByIdService = async (id) => {
	const donation = await populateGoodsDonation(GoodsDonation.findById(id));
	if (!donation) throw new Error("Goods donation not found.");
	return donation;
};

// ─── Update Goods Donation ───────────────────────────────────────────────────
export const updateGoodsDonationService = async ({
	id,
	body,
	files,
	userId,
	userRole,
}) => {
	const donation = await findGoodsDonationOrThrow(id);

	// Check permissions
	const isOwner = donation.donor.toString() === userId.toString();
	const isAdmin = userRole === "admin";

	if (!isOwner && !isAdmin) {
		throw new Error("Not authorized to update this donation.");
	}

	// Only allow updates if status is pending or verified (not yet collected)
	if (!["pending", "verified"].includes(donation.status) && !isAdmin) {
		throw new Error(
			"Cannot update donation after it has been scheduled for pickup.",
		);
	}

	const updates = {};
	const {
		items,
		pickupLocation,
		deliveryMethod,
		preferredPickupTime,
		contactInfo,
		donorNotes,
		adminNotes,
	} = body;

	// Update fields based on user role
	if (isOwner) {
		if (items) {
			let parsedItems = typeof items === "string" ? JSON.parse(items) : items;

			// Process new images if provided
			const processedItems = parsedItems.map((item, index) => {
				let itemImages = item.images || [];

				// Handle file uploads
				if (files && files.length > 0) {
					const itemFiles = files.filter((file) =>
						file.fieldname.startsWith(`items[${index}][images]`) ||
						file.fieldname === `item_${index}_image` ||
						file.fieldname === `images_${index}`
					);

					itemFiles.forEach((file) => {
						itemImages.push({
							url: file.path,
							publicId: file.filename,
						});
					});
				}

				// Handle images provided as URLs in the item data
				if (item.images && Array.isArray(item.images)) {
					const newImages = [];
					item.images.forEach((image) => {
						if (typeof image === "string") {
							newImages.push({
								url: image,
								publicId: `goods/item_${index}_${Date.now()}`,
							});
						} else if (image.url) {
							newImages.push({
								url: image.url,
								publicId: image.publicId || `goods/item_${index}_${Date.now()}`,
							});
						}
					});
					itemImages = newImages; // Replace existing images
				}

				return {
					...item,
					images: itemImages,
					estimatedValue: Number(item.estimatedValue) || 0,
					quantity: Number(item.quantity) || 1,
				};
			});

			updates.items = processedItems;
		}

		if (pickupLocation) {
			const parsedPickupLocation =
				typeof pickupLocation === "string"
					? JSON.parse(pickupLocation)
					: pickupLocation;

			// Update existing location or create new one
			if (donation.pickupLocation) {
				await Location.findByIdAndUpdate(donation.pickupLocation, {
					name:
						parsedPickupLocation.name ||
						`${parsedPickupLocation.address}, ${parsedPickupLocation.city}`,
					coordinates: parsedPickupLocation.coordinates || [0, 0],
					address: parsedPickupLocation.address,
					city: parsedPickupLocation.city,
					state: parsedPickupLocation.state,
					country: parsedPickupLocation.country || "Nepal",
					zipCode: parsedPickupLocation.zipCode,
				});
			} else {
				const locationDoc = await Location.create({
					name:
						parsedPickupLocation.name ||
						`${parsedPickupLocation.address}, ${parsedPickupLocation.city}`,
					coordinates: parsedPickupLocation.coordinates || [0, 0],
					address: parsedPickupLocation.address,
					city: parsedPickupLocation.city,
					state: parsedPickupLocation.state,
					country: parsedPickupLocation.country || "Nepal",
					zipCode: parsedPickupLocation.zipCode,
				});
				updates.pickupLocation = locationDoc._id;
			}
		}

		if (deliveryMethod) updates.deliveryMethod = deliveryMethod;
		if (preferredPickupTime)
			updates.preferredPickupTime = new Date(preferredPickupTime);
		if (contactInfo)
			updates.contactInfo =
				typeof contactInfo === "string" ? JSON.parse(contactInfo) : contactInfo;
		if (donorNotes !== undefined) updates.donorNotes = donorNotes;
	}

	if (isAdmin && adminNotes !== undefined) {
		updates.adminNotes = adminNotes;
	}

	const updatedDonation = await populateGoodsDonation(
		GoodsDonation.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		}),
	);

	return updatedDonation;
};

// ─── Delete Goods Donation ───────────────────────────────────────────────────
export const deleteGoodsDonationService = async ({ id, userId, userRole }) => {
	const donation = await findGoodsDonationOrThrow(id);

	const isOwner = donation.donor.toString() === userId.toString();
	const isAdmin = userRole === "admin";

	if (!isOwner && !isAdmin) {
		throw new Error("Not authorized to delete this donation.");
	}

	// Only allow deletion if status is pending
	if (donation.status !== "pending" && !isAdmin) {
		throw new Error("Cannot delete donation after it has been verified.");
	}

	// Delete associated images from cloudinary
	for (const item of donation.items) {
		if (item.images && item.images.length > 0) {
			for (const image of item.images) {
				if (image.publicId) {
					await cloudinary.uploader.destroy(image.publicId);
				}
			}
		}
	}

	// Delete associated location
	if (donation.pickupLocation) {
		await Location.findByIdAndDelete(donation.pickupLocation);
	}

	await donation.deleteOne();
	return { message: "Goods donation deleted successfully." };
};

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN MANAGEMENT SERVICES
// ═════════════════════════════════════════════════════════════════════════════

// ─── Verify Goods Donation ───────────────────────────────────────────────────
export const verifyGoodsDonationService = async ({ id, adminId }) => {
	const donation = await findGoodsDonationOrThrow(id);

	if (donation.status !== "pending") {
		throw new Error(
			`Only pending donations can be verified. Current status: "${donation.status}".`,
		);
	}

	return populateGoodsDonation(
		GoodsDonation.findByIdAndUpdate(
			id,
			{
				status: "verified",
				verifiedBy: adminId,
				verifiedAt: new Date(),
				rejectionReason: null,
			},
			{ new: true },
		),
	);
};

// ─── Reject Goods Donation ───────────────────────────────────────────────────
export const rejectGoodsDonationService = async ({
	id,
	rejectionReason,
	adminId,
}) => {
	if (!rejectionReason?.trim()) {
		throw new Error("Rejection reason is required.");
	}

	const donation = await findGoodsDonationOrThrow(id);

	if (!["pending", "verified"].includes(donation.status)) {
		throw new Error(
			`Donation with status "${donation.status}" cannot be rejected.`,
		);
	}

	return populateGoodsDonation(
		GoodsDonation.findByIdAndUpdate(
			id,
			{
				status: "rejected",
				rejectionReason: rejectionReason.trim(),
				verifiedBy: adminId,
				verifiedAt: new Date(),
			},
			{ new: true },
		),
	);
};

// ─── Schedule Pickup ─────────────────────────────────────────────────────────
export const schedulePickupService = async ({
	id,
	scheduledPickupDate,
	courierInfo,
	adminId,
}) => {
	const donation = await findGoodsDonationOrThrow(id);

	if (donation.status !== "verified") {
		throw new Error(
			`Only verified donations can be scheduled. Current status: "${donation.status}".`,
		);
	}

	const updates = {
		status: "scheduled",
		scheduledPickupDate: new Date(scheduledPickupDate),
	};

	if (courierInfo) {
		updates.courierInfo = courierInfo;
	}

	return populateGoodsDonation(
		GoodsDonation.findByIdAndUpdate(id, updates, { new: true }),
	);
};

// ─── Mark as Collected ───────────────────────────────────────────────────────
export const markAsCollectedService = async ({
	id,
	actualPickupDate,
	adminId,
}) => {
	const donation = await findGoodsDonationOrThrow(id);

	if (donation.status !== "scheduled") {
		throw new Error(
			`Only scheduled donations can be marked as collected. Current status: "${donation.status}".`,
		);
	}

	return populateGoodsDonation(
		GoodsDonation.findByIdAndUpdate(
			id,
			{
				status: "collected",
				actualPickupDate: actualPickupDate
					? new Date(actualPickupDate)
					: new Date(),
			},
			{ new: true },
		),
	);
};

// ─── Mark as Delivered ───────────────────────────────────────────────────────
export const markAsDeliveredService = async ({ id, deliveryDate, adminId }) => {
	const donation = await findGoodsDonationOrThrow(id);

	if (donation.status !== "collected") {
		throw new Error(
			`Only collected donations can be marked as delivered. Current status: "${donation.status}".`,
		);
	}

	return populateGoodsDonation(
		GoodsDonation.findByIdAndUpdate(
			id,
			{
				status: "delivered",
				deliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(),
			},
			{ new: true },
		),
	);
};

// ─── Mark as Completed ───────────────────────────────────────────────────────
export const markAsCompletedService = async ({ id, adminId }) => {
	const donation = await findGoodsDonationOrThrow(id);

	if (donation.status !== "delivered") {
		throw new Error(
			`Only delivered donations can be marked as completed. Current status: "${donation.status}".`,
		);
	}

	// Update campaign goods donation stats
	await Campaign.findByIdAndUpdate(donation.campaign, {
		$inc: {
			"goodsDonations.totalValue": donation.totalEstimatedValue,
			"goodsDonations.totalItems": donation.totalItems,
			"goodsDonations.donationsCount": 1,
		},
	});

	return populateGoodsDonation(
		GoodsDonation.findByIdAndUpdate(id, { status: "completed" }, { new: true }),
	);
};

// ─── Get Goods Donation Statistics ───────────────────────────────────────────
export const getGoodsDonationStatsService = async () => {
	const stats = await GoodsDonation.aggregate([
		{
			$group: {
				_id: "$status",
				count: { $sum: 1 },
				totalValue: { $sum: "$totalEstimatedValue" },
				totalItems: { $sum: "$totalItems" },
			},
		},
	]);

	const categoryStats = await GoodsDonation.aggregate([
		{ $unwind: "$items" },
		{
			$group: {
				_id: "$items.category",
				count: { $sum: 1 },
				totalValue: { $sum: "$items.estimatedValue" },
				totalQuantity: { $sum: "$items.quantity" },
			},
		},
	]);

	return {
		statusStats: stats,
		categoryStats,
	};
};

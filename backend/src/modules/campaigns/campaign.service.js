import Campaign from "./campaign.model.js";
import Location from "./location.model.js";
import cloudinary from "../../config/cloudinary.js";
import User from "../users/user.model.js";
import { sendThemedEmail } from "../../services/mail.service.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

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
export const createCampaignService = async ({ body, files, userId }) => {
  const {
    title,
    description,
    category,
    goalAmount,
    urgent,
    endDate,
    phoneNumber,
    esewaId,
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

  // files.image → campaign cover image (required)
  // files.documents → verification documents (optional, up to 5)
  const imageFile = files?.image?.[0];
  const docFiles = files?.documents ?? [];

  if (!imageFile) throw new Error("Campaign image is required.");

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

  // Parse document metadata sent alongside files
  // Frontend sends documentNames[] and documentTypes[] arrays
  let documentNames = [];
  let documentTypes = [];
  try {
    documentNames = body.documentNames ? JSON.parse(body.documentNames) : [];
    documentTypes = body.documentTypes ? JSON.parse(body.documentTypes) : [];
  } catch {
    documentNames = Array.isArray(body.documentNames) ? body.documentNames : [];
    documentTypes = Array.isArray(body.documentTypes) ? body.documentTypes : [];
  }

  const documents = docFiles.map((file, i) => ({
    url: file.path,
    publicId: file.filename,
    name: documentNames[i] ?? `Document ${i + 1}`,
    type: documentTypes[i] ?? "other",
  }));

  const campaign = await Campaign.create({
    title,
    description,
    category,
    createdBy: userId,
    goalAmount,
    urgent: urgent === "true" || urgent === true,
    endDate,
    phoneNumber,
    esewaId,
    location: resolvedLocationId,
    images: { url: imageFile.path, publicId: imageFile.filename },
    documents,
  });

  try {
    const user = await User.findById(userId);
    if (user && user.email) {
      await sendThemedEmail(
        user.email,
        "Campaign Created - Pending Approval",
        "Your Campaign is Under Review",
        `Hi ${user.name}, your campaign "${title}" has been successfully created and is currently pending admin approval.`,
        "<p style='margin:0'>We will review your campaign details and verify any provided documents shortly. You will be notified once it is approved and goes live.</p>",
        "View Campaigns",
        `${FRONTEND_URL}/campaigns/my-campaigns`
      );
    }
  } catch (error) {
    console.error("Failed to send campaign creation email:", error);
  }

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
export const getCampaignByIdService = async (id, userRole) => {
  // phoneNumber and esewaId are payout details — visible to admins only
  const projection = userRole === "admin" ? {} : { phoneNumber: 0, esewaId: 0 };
  const campaign = await populateCampaign(Campaign.findById(id, projection));
  if (!campaign) throw new Error("Campaign not found.");
  return campaign;
};

// ─── Update Campaign ──────────────────────────────────────────────────────────
export const updateCampaignService = async ({
  id,
  body,
  files,
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
    phoneNumber,
    esewaId,
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
  if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
  if (esewaId !== undefined) updates.esewaId = esewaId;
  if (endDate !== undefined) {
    updates.endDate = endDate;
    // Re-activate a completed campaign when the owner extends the end date to the future
    if (campaign.status === "completed" && new Date(endDate) > new Date()) {
      updates.status = "active";
    }
  }

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

  const imageFile = files?.image?.[0];
  if (imageFile) {
    if (campaign.images?.publicId)
      await cloudinary.uploader.destroy(campaign.images.publicId);
    updates.images = { url: imageFile.path, publicId: imageFile.filename };
  }

  // Append new documents if uploaded (does not replace existing)
  const docFiles = files?.documents ?? [];
  if (docFiles.length > 0) {
    let documentNames = [];
    let documentTypes = [];
    try {
      documentNames = body.documentNames ? JSON.parse(body.documentNames) : [];
      documentTypes = body.documentTypes ? JSON.parse(body.documentTypes) : [];
    } catch {
      documentNames = Array.isArray(body.documentNames)
        ? body.documentNames
        : [];
      documentTypes = Array.isArray(body.documentTypes)
        ? body.documentTypes
        : [];
    }

    const newDocs = docFiles.map((file, i) => ({
      url: file.path,
      publicId: file.filename,
      name: documentNames[i] ?? `Document ${i + 1}`,
      type: documentTypes[i] ?? "other",
    }));

    updates.$push = { documents: { $each: newDocs } };
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

  // Delete all verification documents from cloudinary
  for (const doc of campaign.documents) {
    await cloudinary.uploader.destroy(doc.publicId, { resource_type: "raw" });
  }

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

  const updatedCampaign = await populateCampaign(
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

  try {
    const user = await User.findById(campaign.createdBy);
    if (user && user.email) {
      await sendThemedEmail(
        user.email,
        "Campaign Approved!",
        "Your Campaign is Live!",
        `Great news, ${user.name}! Your campaign "${campaign.title}" has been approved.`,
        "<p style='margin:0'>Your campaign is now live on Setu and open for donations. You can start sharing the link with your network.</p>",
        "View Campaign",
        `${FRONTEND_URL}/campaigns/${campaign._id}`
      );
    }
  } catch (error) {
    console.error("Failed to send campaign approval email:", error);
  }

  return updatedCampaign;
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

  const updatedCampaign = await populateCampaign(
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

  try {
    const user = await User.findById(campaign.createdBy);
    if (user && user.email) {
      await sendThemedEmail(
        user.email,
        "Campaign Update",
        "Action Required for Your Campaign",
        `Hi ${user.name}, we've reviewed your campaign "${campaign.title}".`,
        `<p style='margin:0;color:#b91c1c;'>Unfortunately, it could not be approved at this time.</p><p style='margin-top:12px;'><strong>Reason:</strong> ${rejectionReason.trim()}</p>`,
        "Go to Dashboard",
        `${FRONTEND_URL}/dashboard`
      );
    }
  } catch (error) {
    console.error("Failed to send campaign rejection email:", error);
  }

  return updatedCampaign;
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

// ─── Expire Overdue Campaigns (scheduled job) ─────────────────────────────────
export const expireOverdueCampaignsService = async () => {
  const now = new Date();

  const expired = await Campaign.find({
    status: "active",
    endDate: { $exists: true, $ne: null, $lt: now },
  }).populate("createdBy", "name email");

  if (expired.length === 0) return 0;

  const ids = expired.map((c) => c._id);
  await Campaign.updateMany({ _id: { $in: ids } }, { status: "completed" });

  for (const campaign of expired) {
    try {
      const user = campaign.createdBy;
      if (user?.email) {
        await sendThemedEmail(
          user.email,
          "Your Campaign Has Ended",
          `Campaign "${campaign.title}" Has Ended`,
          `Hi ${user.name}, your campaign "${campaign.title}" has reached its end date and is now closed.`,
          `<p style='margin:0'>Thank you for running your campaign on Setu. It has been marked as <strong>completed</strong>. You raised <strong>NPR ${campaign.raisedAmount.toLocaleString()}</strong>.</p><p style='margin-top:12px;'>If you'd like to extend the campaign, you can update the end date from your dashboard.</p>`,
          "My Campaigns",
          `${FRONTEND_URL}/my-campaigns`
        );
      }
    } catch (err) {
      console.error(`Failed to send expiry email for campaign ${campaign._id}:`, err);
    }
  }

  console.log(`[Campaign Expiry] Marked ${expired.length} campaign(s) as completed.`);
  return expired.length;
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

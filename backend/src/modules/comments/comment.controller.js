import Comment from "./comment.model.js";
import Campaign from "../campaigns/campaign.model.js";
import cloudinary from "../../config/cloudinary.js";

// ─── Add Comment ──────────────────────────────────────────────────────────────
export const addComment = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;
    const files = req.files ?? [];

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found." });
    }

    // Build media array from uploaded files
    const media = files.map((file) => {
      const isVideo =
        file.mimetype?.startsWith("video") || file.path?.includes("video");
      return {
        url: file.path,
        publicId: file.filename,
        type: isVideo ? "video" : "image",
      };
    });

    if (!text?.trim() && media.length === 0) {
      return res.status(400).json({
        success: false,
        message: "A comment must have text or at least one photo/video.",
      });
    }

    const comment = await Comment.create({
      campaign: campaignId,
      author: userId,
      text: text?.trim() || undefined,
      media,
    });

    await comment.populate("author", "name avatar");

    return res.status(201).json({
      success: true,
      message: "Comment added.",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Comments for a Campaign ─────────────────────────────────────────────
export const getCampaignComments = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { campaign: campaignId, deleted: false };

    const [comments, total] = await Promise.all([
      Comment.find(filter)
        .populate("author", "name avatar")
        .sort({ pinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Comment.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      comments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Delete Comment ───────────────────────────────────────────────────────────
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found." });
    }

    const isOwner = comment.author.toString() === userId.toString();
    if (!isOwner && userRole !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to delete this comment.",
        });
    }

    // Delete media from cloudinary
    for (const item of comment.media) {
      await cloudinary.uploader.destroy(item.publicId, {
        resource_type: item.type === "video" ? "video" : "image",
      });
    }

    // Soft delete
    comment.deleted = true;
    await comment.save();

    return res.status(200).json({ success: true, message: "Comment deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Pin / Unpin Comment (campaign organizer only) ────────────────────────────
export const togglePinComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId).populate(
      "campaign",
      "createdBy",
    );
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found." });
    }

    const isOrganizer =
      comment.campaign.createdBy.toString() === userId.toString() ||
      req.user.role === "admin";

    if (!isOrganizer) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only the campaign organizer can pin comments.",
        });
    }

    comment.pinned = !comment.pinned;
    await comment.save();

    return res.status(200).json({
      success: true,
      message: comment.pinned ? "Comment pinned." : "Comment unpinned.",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Like a Comment ───────────────────────────────────────────────────────────
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likesCount: 1 } },
      { new: true },
    );

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found." });
    }

    return res.status(200).json({
      success: true,
      likesCount: comment.likesCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

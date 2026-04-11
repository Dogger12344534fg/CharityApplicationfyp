import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
      // not required if media is provided
    },
    // Photos and videos attached to this comment
    media: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        type: { type: String, enum: ["image", "video"], required: true },
      },
    ],
    // Simple like count on comments
    likesCount: {
      type: Number,
      default: 0,
    },
    // Whether the campaign organizer pinned this comment
    pinned: {
      type: Boolean,
      default: false,
    },
    // Soft delete
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Validate: must have text OR at least one media item
commentSchema.pre("validate", function (next) {
  if (!this.text?.trim() && this.media.length === 0) {
    return next(
      new Error("A comment must have text or at least one media attachment."),
    );
  }
  next();
});

commentSchema.index({ campaign: 1, createdAt: -1 });
commentSchema.index({ campaign: 1, pinned: -1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema);

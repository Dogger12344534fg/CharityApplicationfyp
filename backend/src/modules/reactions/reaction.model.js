import mongoose from "mongoose";

const REACTION_TYPES = ["love", "support", "sad", "grateful", "urgent"];

const reactionSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: REACTION_TYPES,
      required: true,
    },
  },
  { timestamps: true },
);

// One reaction per user per campaign
reactionSchema.index({ campaign: 1, user: 1 }, { unique: true });
reactionSchema.index({ campaign: 1, type: 1 });

export { REACTION_TYPES };
export default mongoose.model("Reaction", reactionSchema);

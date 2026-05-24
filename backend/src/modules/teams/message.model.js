import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true,
            index: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
    },
    { timestamps: true },
);

// Index for efficient pagination (newest-first per team)
messageSchema.index({ team: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
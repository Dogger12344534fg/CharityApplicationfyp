import Reaction, { REACTION_TYPES } from "./reaction.model.js";
import Campaign from "../campaigns/campaign.model.js";

export const toggleReaction = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { type } = req.body;
    const userId = req.user._id;

    if (!REACTION_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid reaction type. Must be one of: ${REACTION_TYPES.join(", ")}`,
      });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found." });
    }

    const existing = await Reaction.findOne({
      campaign: campaignId,
      user: userId,
    });

    if (existing) {
      if (existing.type === type) {
        await existing.deleteOne();
        await Campaign.findByIdAndUpdate(campaignId, {
          $inc: { [`reactions.${type}`]: -1 },
        });
        return res.status(200).json({
          success: true,
          message: "Reaction removed.",
          action: "removed",
          reactionType: null,
          reactions: (await Campaign.findById(campaignId)).reactions,
        });
      } else {
        const oldType = existing.type;
        existing.type = type;
        await existing.save();
        await Campaign.findByIdAndUpdate(campaignId, {
          $inc: {
            [`reactions.${oldType}`]: -1,
            [`reactions.${type}`]: 1,
          },
        });
        return res.status(200).json({
          success: true,
          message: "Reaction updated.",
          action: "updated",
          reactionType: type,
          reactions: (await Campaign.findById(campaignId)).reactions,
        });
      }
    } else {
      // No existing reaction → add
      await Reaction.create({ campaign: campaignId, user: userId, type });
      await Campaign.findByIdAndUpdate(campaignId, {
        $inc: { [`reactions.${type}`]: 1 },
      });
      return res.status(201).json({
        success: true,
        message: "Reaction added.",
        action: "added",
        reactionType: type,
        reactions: (await Campaign.findById(campaignId)).reactions,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyReaction = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user._id;

    const reaction = await Reaction.findOne({
      campaign: campaignId,
      user: userId,
    });

    return res.status(200).json({
      success: true,
      reactionType: reaction?.type ?? null,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCampaignReactions = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findById(campaignId).select("reactions");
    if (!campaign) {
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found." });
    }

    return res.status(200).json({
      success: true,
      reactions: campaign.reactions,
      total: Object.values(campaign.reactions.toObject()).reduce(
        (a, b) => a + b,
        0,
      ),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

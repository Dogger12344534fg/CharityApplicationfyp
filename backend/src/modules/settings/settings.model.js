import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Organization/Profile Settings
    organization: {
      name: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
      description: {
        type: String,
        default: "",
      },
      logo: {
        url: { type: String, default: null },
        publicId: { type: String, default: null },
      },
    },

    // Notification Settings
    notifications: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsAlerts: {
        type: Boolean,
        default: false,
      },
      newCampaigns: {
        type: Boolean,
        default: true,
      },
      donationAlerts: {
        type: Boolean,
        default: true,
      },
      systemUpdates: {
        type: Boolean,
        default: true,
      },
      weeklyDigest: {
        type: Boolean,
        default: false,
      },
      monthlyReport: {
        type: Boolean,
        default: false,
      },
    },

    // Security Settings
    security: {
      twoFactorAuth: {
        type: Boolean,
        default: false,
      },
      sessionTimeout: {
        type: Number,
        default: 30, // minutes
      },
      passwordChangeRequired: {
        type: Boolean,
        default: false,
      },
      lastPasswordChange: {
        type: Date,
        default: null,
      },
    },

    // Display Settings
    display: {
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "light",
      },
      language: {
        type: String,
        enum: ["en", "ne"],
        default: "en",
      },
      dateFormat: {
        type: String,
        enum: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
        default: "MM/DD/YYYY",
      },
      currency: {
        type: String,
        enum: ["NPR", "USD"],
        default: "NPR",
      },
    },

    // Privacy Settings
    privacy: {
      profileVisibility: {
        type: String,
        enum: ["public", "private", "donors-only"],
        default: "public",
      },
      showDonationHistory: {
        type: Boolean,
        default: true,
      },
      showEmail: {
        type: Boolean,
        default: false,
      },
      showPhone: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

// Index for faster lookups and ensure uniqueness
settingsSchema.index({ user: 1 }, { unique: true });

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;

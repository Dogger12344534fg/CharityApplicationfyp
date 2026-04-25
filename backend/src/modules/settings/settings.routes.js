import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  getUserSettings,
  updateOrganizationSettings,
  updateNotificationSettings,
  updateSecuritySettings,
  updateDisplaySettings,
  updatePrivacySettings,
  changePassword,
  deleteAccount,
} from "./settings.controller.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user settings
router.get("/", getUserSettings);

// Update settings by category
router.put("/organization", updateOrganizationSettings);
router.put("/notifications", updateNotificationSettings);
router.put("/security", updateSecuritySettings);
router.put("/display", updateDisplaySettings);
router.put("/privacy", updatePrivacySettings);

// Password and account management
router.post("/change-password", changePassword);
router.delete("/account", deleteAccount);

export default router;

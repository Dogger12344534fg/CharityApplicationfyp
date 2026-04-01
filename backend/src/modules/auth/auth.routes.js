import { Router } from "express";
import { register, login, createAdmin } from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/create-admin", createAdmin);

export default router;

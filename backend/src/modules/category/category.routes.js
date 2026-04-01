import { Router } from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "./category.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";

const router = Router();

// Public — anyone can list/view categories
router.get("/", getAll);
router.get("/:id", getById);

// Protected — only authenticated admins can mutate categories
router.post("/", authMiddleware, verifyRole("admin"), create);
router.put("/:id", authMiddleware, verifyRole("admin"), update);
router.delete("/:id", authMiddleware, verifyRole("admin"), remove);

export default router;

import { Router } from "express";
import { getMenuItemById } from "../controllers/menu-items.controller.js";

const router = Router();

router.get("/:id", getMenuItemById);

export default router;

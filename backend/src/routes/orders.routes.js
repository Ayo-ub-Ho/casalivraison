import { Router } from "express";
import {
  createOrder,
  getOrderById,
  listOrders,
  updateOrderStatus,
} from "../controllers/orders.controller.js";

const router = Router();

router.post("/", createOrder);
router.get("/", listOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

export default router;

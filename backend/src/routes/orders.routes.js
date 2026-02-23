import { Router } from "express";
import {
  createOrder,
  getOrderById,
  listOrders,
  updateOrderStatus,
} from "../controllers/orders.controller.js";
import { validate } from "../middlewares/validate.js";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/orders.schema.js";

const router = Router();

router.post("/", validate(createOrderSchema), createOrder);
router.get("/", listOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", validate(updateOrderStatusSchema), updateOrderStatus);

export default router;

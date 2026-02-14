import { Router } from "express";
import {
  listRestaurants,
  getRestaurantMenu,
} from "../controllers/restaurants.controller.js";

const router = Router();

router.get("/", listRestaurants);
router.get("/:id/menu", getRestaurantMenu);

export default router;

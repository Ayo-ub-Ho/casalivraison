import { Router } from "express";
import { listRestaurants } from "../controllers/restaurants.controller.js";

const router = Router();

router.get("/", listRestaurants);

export default router;

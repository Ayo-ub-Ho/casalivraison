import { Router } from "express";
import { requestOtp, verifyOtp } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { requestOtpSchema, verifyOtpSchema } from "../validators/auth.schema.js";

const router = Router();

router.post("/request-otp", validate(requestOtpSchema), requestOtp);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);

export default router;

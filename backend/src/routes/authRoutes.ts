import { Router } from "express";
import { sendOtp, verifyOtp, register, login, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = Router();

// 3-Step Registration Flow
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);

// General Login
router.post("/login", login);

// Password Recovery
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;

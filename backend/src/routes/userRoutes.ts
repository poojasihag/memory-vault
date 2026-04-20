import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";

const router = Router();

router.use(authenticate);

router.get("/profile", getProfile);
router.put("/profile", upload.single("avatar"), updateProfile);

export default router;

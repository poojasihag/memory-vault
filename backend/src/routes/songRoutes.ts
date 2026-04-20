import { Router } from "express";
import { searchSongs } from "../controllers/songController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/search", searchSongs);

export default router;

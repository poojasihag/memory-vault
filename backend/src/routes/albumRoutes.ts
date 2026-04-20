import { Router } from "express";
import {
    createAlbum,
    getAlbums,
    getAlbumById,
    updateAlbum,
    toggleFavorite,
    getFavorites,
    softDeleteAlbum,
    getTrash,
    restoreAlbum,
    permanentDeleteAlbum,
    addImages,
    removeImage,
} from "../controllers/albumController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";

const router = Router();

router.use(authenticate);

// Album CRUD
router.post("/", upload.array("images", 20), createAlbum);
router.get("/", getAlbums);
router.get("/favorites", getFavorites);
router.get("/trash", getTrash);
router.get("/:id", getAlbumById);
router.put("/:id", updateAlbum);

// Favorite toggle
router.patch("/:id/favorite", toggleFavorite);

// Trash operations
router.delete("/:id", softDeleteAlbum);
router.post("/:id/restore", restoreAlbum);
router.delete("/:id/permanent", permanentDeleteAlbum);

// Image management
router.post("/:id/images", upload.array("images", 20), addImages);
router.delete("/images/:imageId", removeImage);

export default router;

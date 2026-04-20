import { Request, Response, NextFunction } from "express";
import * as albumService from "../services/albumService.js";

export const createAlbum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[] | undefined;
        const result = await albumService.createAlbum(req.userId!, req.body, files);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const getAlbums = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await albumService.getAlbums(req.userId!);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getAlbumById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string;
        const result = await albumService.getAlbumById(id, req.userId!);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateAlbum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string;
        const result = await albumService.updateAlbum(id, req.userId!, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const toggleFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string;
        const result = await albumService.toggleFavorite(id, req.userId!);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getFavorites = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await albumService.getFavorites(req.userId!);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const softDeleteAlbum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string;
        const result = await albumService.softDeleteAlbum(id, req.userId!);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getTrash = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await albumService.getTrash(req.userId!);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const restoreAlbum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string;
        const result = await albumService.restoreAlbum(id, req.userId!);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const permanentDeleteAlbum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string;
        const result = await albumService.permanentDeleteAlbum(id, req.userId!);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const addImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string;
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            res.status(400).json({ message: "At least one image is required" });
            return;
        }
        const result = await albumService.addImages(id, req.userId!, files);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const removeImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const imageId = req.params.imageId as string;
        const result = await albumService.removeImage(imageId, req.userId!);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

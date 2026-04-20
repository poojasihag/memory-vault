import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService.js";

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await userService.getProfile(req.userId!);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, bio } = req.body;
        const avatarFile = req.file;

        const result = await userService.updateProfile(
            req.userId!,
            { name, bio },
            avatarFile
        );
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

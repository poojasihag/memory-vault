import { Request, Response, NextFunction } from "express";
import * as songService from "../services/songService.js";

export const searchSongs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const query = req.query.q as string;
        if (!query) {
            res.status(400).json({ message: "Search query (q) is required" });
            return;
        }

        const results = await songService.searchSongs(query);
        res.status(200).json(results);
    } catch (error) {
        next(error);
    }
};

import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService.js";

// Send OTP (Step 1)
export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }

        const result = await authService.sendRegistrationOtp(email);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Verify OTP (Step 2)
export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ message: "Email and OTP are required" });
            return;
        }

        const result = await authService.verifyUserOtp(email, otp);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Complete Registration (Step 3)
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const result = await authService.registerVault(email, password, name);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

// Login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const result = await authService.loginUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }

        const result = await authService.forgotPassword(email);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            res.status(400).json({ message: "Email, OTP, and new password are required" });
            return;
        }

        const result = await authService.resetPassword(email, otp, newPassword);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

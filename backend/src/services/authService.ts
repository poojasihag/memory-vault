import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { generateOtp } from "../utils/sendOtp.js";
import { sendEmail, getHtmlTemplate } from "../config/mail.js";

// Service layer handles business logic

export const sendRegistrationOtp = async (email: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser && existingUser.isVerified && existingUser.password) {
        throw { statusCode: 400, message: "User already exists & verified" };
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Upsert user to store OTP
    const user = await prisma.user.upsert({
        where: { email },
        update: { otp, otpExpiry },
        create: { email, otp, otpExpiry, isVerified: false },
    });

    // Send OTP via Email
    const innerContent = `
        <p style="color: #5c5248; font-size: 16px;">Welcome to Memory Vault! We're thrilled to have you begin your digital heirloom journey.</p>
        <p style="color: #5c5248; font-size: 16px;">Please use the following One-Time Password (OTP) to verify your registration:</p>
        
        <div style="background-color: #e8ded2; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #8b3a3a; font-family: monospace;">\${otp}</span>
        </div>
        
        <p style="color: #7a6a5a; font-size: 14px; font-style: italic;">Note: This code will expire in 10 minutes.</p>
    `;
    const emailHtml = getHtmlTemplate("Your Registration OTP", innerContent);
    await sendEmail(email, "Your Registration OTP - Memory Vault", \`Your OTP is \${otp}\`, emailHtml);

    return { message: "OTP sent to email", userId: user.id };
};

export const verifyUserOtp = async (email: string, otp: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw { statusCode: 404, message: "User not found" };
    }

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
        throw { statusCode: 400, message: "Invalid or expired OTP" };
    }

    // Verify user and clear OTP
    await prisma.user.update({
        where: { email },
        data: {
            isVerified: true,
            otp: null,
            otpExpiry: null,
        },
    });

    return { message: "OTP verified successfully" };
};

export const registerVault = async (email: string, password: string, name?: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw { statusCode: 404, message: "User not found" };
    }

    if (!user.isVerified) {
        throw { statusCode: 403, message: "Please verify your OTP first" };
    }

    if (user.password) {
        throw { statusCode: 400, message: "User is already fully registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
        where: { email },
        data: { password: hashedPassword, name: name || null },
    });

    const token = jwt.sign(
        { id: updatedUser.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    );

    return {
        message: "Account setup successful",
        token,
        user: {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            avatarUrl: updatedUser.avatarUrl,
        },
    };
};

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
        throw { statusCode: 404, message: "User not found or not fully registered" };
    }

    if (!user.isVerified) {
        throw { statusCode: 403, message: "Please verify your account first" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw { statusCode: 400, message: "Invalid credentials" };
    }

    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    );

    return {
        message: "Login successful",
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
        },
    };
};

// Forgot Password — send OTP to email
export const forgotPassword = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isVerified || !user.password) {
        throw { statusCode: 404, message: "No registered account found with this email" };
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
        where: { email },
        data: { otp, otpExpiry },
    });

    const innerContent = `
        <p style="color: #5c5248; font-size: 16px;">We received a request to reset your password for your Memory Vault account.</p>
        <p style="color: #5c5248; font-size: 16px;">Please use the following One-Time Password (OTP) to proceed with your password reset:</p>
        
        <div style="background-color: #e8ded2; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #8b3a3a; font-family: monospace;">\${otp}</span>
        </div>
        
        <p style="color: #7a6a5a; font-size: 14px; font-style: italic;">Note: This code will expire in 10 minutes. If you did not request this, please secure your account.</p>
    `;
    const emailHtml = getHtmlTemplate("Password Reset OTP", innerContent);
    await sendEmail(email, "Password Reset OTP - Memory Vault", \`Your OTP is \${otp}\`, emailHtml);

    return { message: "Password reset OTP sent to email" };
};

// Reset Password — verify OTP and set new password
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw { statusCode: 404, message: "User not found" };
    }

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
        throw { statusCode: 400, message: "Invalid or expired OTP" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword,
            otp: null,
            otpExpiry: null,
        },
    });

    return { message: "Password reset successful" };
};

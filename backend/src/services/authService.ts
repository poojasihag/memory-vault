import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { generateOtp } from "../utils/sendOtp.js";
import { sendEmail } from "../config/mail.js";

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
    const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Welcome to Memory Vault</h2>
            <p>Your OTP for registration is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>
        </div>
    `;
    await sendEmail(email, "Your Registration OTP - Memory Vault", `Your OTP is ${otp}`, emailHtml);

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

export const registerVault = async (email: string, password: string) => {
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
        data: { password: hashedPassword },
    });

    const token = jwt.sign(
        { id: updatedUser.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    );

    return { message: "Account setup successful", token };
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

    return { message: "Login successful", token };
};

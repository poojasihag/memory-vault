import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/auth`,
});

// SEND OTP
export const sendOtpApi = (email: string) => {
    return API.post("/send-otp", { email });
};

// VERIFY OTP
export const verifyOtpApi = (email: string, otp: string) => {
    return API.post("/verify-otp", { email, otp });
};

// REGISTER
export const registerApi = (email: string, password: string, name?: string) => {
    return API.post("/register", { email, password, name });
};

// LOGIN
export const loginApi = (email: string, password: string) => {
    return API.post("/login", { email, password });
};

// FORGOT PASSWORD
export const forgotPasswordApi = (email: string) => {
    return API.post("/forgot-password", { email });
};

// RESET PASSWORD
export const resetPasswordApi = (email: string, otp: string, newPassword: string) => {
    return API.post("/reset-password", { email, otp, newPassword });
};
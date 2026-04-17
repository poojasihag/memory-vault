import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/auth"
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
export const registerApi = (email: string, password: string) => {
    return API.post("/register", { email, password });
};
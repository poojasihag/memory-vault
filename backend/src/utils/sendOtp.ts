import otpGenerator from "otp-generator";

export const generateOtp = (): string => {
    return otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false
    });
};
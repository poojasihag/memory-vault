import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Camera, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { forgotPasswordApi, resetPasswordApi } from "../api/auth";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        if (!email) { toast.error("Please enter your email"); return; }
        setLoading(true);
        try {
            await forgotPasswordApi(email);
            toast.success("Reset OTP sent to your email!");
            setStep(2);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally { setLoading(false); }
    };

    const handleResetPassword = async () => {
        if (!otp) { toast.error("Please enter the OTP"); return; }
        if (!newPassword || newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            await resetPasswordApi(email, otp, newPassword);
            toast.success("Password reset successful! Please login.");
            navigate("/login");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Reset failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#e8ded2] flex items-center justify-center px-6 py-10 relative overflow-hidden">
            <BookOpen className="absolute top-10 left-10 text-[#cbbfb1] opacity-40" size={120} />
            <Camera className="absolute bottom-10 right-10 text-[#cbbfb1] opacity-40" size={120} />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#fdfaf6] shadow-2xl rounded-md p-10 relative"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
            >
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-6 bg-[#e9dccb] rotate-3 opacity-80"></div>

                {/* Back button */}
                <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#8b3a3a] transition mb-4"
                >
                    <ArrowLeft size={16} /> Back to login
                </button>

                <h1 className="text-2xl text-center font-serif text-[#2d2d2d]">
                    🔑 Recover Your Key
                </h1>
                <p className="text-center text-sm text-gray-500 mt-1 italic">
                    {step === 1 ? "Enter your email to receive a reset code." : "Enter the OTP and your new password."}
                </p>

                <div className="mt-8 space-y-6 text-sm">
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div>
                                <p className="text-xs tracking-widest text-gray-400 mb-2">
                                    YOUR EMAIL
                                </p>
                                <input
                                    type="email"
                                    placeholder="curator@memoryvault.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                                    className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-1 text-[#2d2d2d]"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full bg-[#8b3a3a] text-white py-3 rounded shadow-md disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "SEND RESET CODE"}
                            </motion.button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div>
                                <p className="text-xs tracking-widest text-gray-400 mb-2">
                                    ENTER OTP
                                </p>
                                <input
                                    type="text"
                                    placeholder="••••••"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-1 text-center tracking-[10px] text-[#2d2d2d]"
                                />
                            </div>

                            <div>
                                <p className="text-xs tracking-widest text-gray-400 mb-2">
                                    NEW PASSWORD
                                </p>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                                        className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-1 pr-8 text-[#2d2d2d]"
                                    />
                                    <div
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-[#8b3a3a]"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleResetPassword}
                                disabled={loading}
                                className="w-full bg-[#8b3a3a] text-white py-3 rounded shadow-md disabled:opacity-50"
                            >
                                {loading ? "Resetting..." : "RESET PASSWORD"}
                            </motion.button>

                            <p
                                onClick={handleSendOtp}
                                className="text-center text-xs text-gray-400 cursor-pointer hover:text-[#8b3a3a]"
                            >
                                Resend OTP
                            </p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;

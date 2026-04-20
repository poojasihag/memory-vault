import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, Camera, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sendOtpApi, verifyOtpApi, registerApi } from "../api/auth";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState(1);
    const [input, setInput] = useState("");
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        if (!input) { toast.error("Please enter your email"); return; }
        setLoading(true);
        try {
            await sendOtpApi(input);
            toast.success("OTP sent to your email!");
            setStep(2);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally { setLoading(false); }
    };

    const handleVerifyOtp = async () => {
        if (!otp) { toast.error("Please enter OTP"); return; }
        setLoading(true);
        try {
            await verifyOtpApi(input, otp);
            toast.success("OTP verified!");
            setStep(3);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        } finally { setLoading(false); }
    };

    const handleRegister = async () => {
        if (!password || password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            const res = await registerApi(input, password, name);
            setAuth(res.data.token, res.data.user);
            toast.success("Account created! Welcome to your vault.");
            navigate("/dashboard");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#e8ded2] flex items-center justify-center px-6 py-10 relative overflow-hidden">

            {/* Background Icons */}
            <BookOpen className="absolute top-10 left-10 text-[#cbbfb1] opacity-40" size={120} />
            <Camera className="absolute bottom-10 right-10 text-[#cbbfb1] opacity-40" size={120} />

            {/* Paper Container */}
            <motion.div
                initial={{ opacity: 0, y: 40, rotate: -1 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                className="w-full max-w-md bg-[#fdfaf6] shadow-2xl rounded-md p-10 relative"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
            >

                {/* Tape */}
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-6 bg-[#e9dccb] rotate-3 opacity-80"></div>

                {/* Heading */}
                <h1 className="text-3xl text-center font-serif text-[#2d2d2d]">
                    Memory Vault
                </h1>
                <p className="text-center text-sm text-gray-500 mt-1 italic">
                    Begin preserving your memories.
                </p>

                {/* Tabs */}
                <div className="flex justify-center gap-6 mt-6 text-sm">
                    <motion.span
                        whileHover={{ scale: 1.1 }}
                        onClick={() => navigate("/login")}
                        className="text-gray-400 cursor-pointer"
                    >
                        Sign In
                    </motion.span>

                    <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="border-b border-[#8b3a3a] pb-1 text-[#8b3a3a] cursor-pointer"
                    >
                        Register
                    </motion.span>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                step >= s ? "bg-[#8b3a3a] text-white" : "bg-gray-200 text-gray-400"
                            }`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-8 h-[2px] ${step > s ? "bg-[#8b3a3a]" : "bg-gray-200"}`}></div>}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-6 mt-2 text-[10px] text-gray-400">
                    <span>Email</span>
                    <span>Verify</span>
                    <span>Setup</span>
                </div>

                {/* STEP CONTENT */}
                <div className="mt-6 space-y-6 text-sm">

                    {/* STEP 1: Email */}
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <p className="text-xs tracking-widest text-gray-400 mb-2">
                                    ENTER EMAIL
                                </p>
                                <input
                                    type="email"
                                    placeholder="example@email.com"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                                    className="w-full bg-transparent border-b border-gray-300 text-[#2d2d2d] focus:outline-none focus:border-[#8b3a3a] py-1"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full bg-[#8b3a3a] text-white py-3 rounded shadow-md disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "SEND OTP"}
                            </motion.button>
                        </motion.div>
                    )}

                    {/* STEP 2: OTP */}
                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
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
                                    onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                                    className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-1 text-center tracking-[10px] text-[#2d2d2d]"
                                />
                            </div>

                            <motion.p
                                whileHover={{ scale: 1.05 }}
                                onClick={handleSendOtp}
                                className="text-right text-xs text-gray-400 cursor-pointer hover:text-[#8b3a3a]"
                            >
                                Resend OTP
                            </motion.p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className="w-full bg-[#8b3a3a] text-white py-3 rounded shadow-md disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "VERIFY OTP"}
                            </motion.button>
                        </motion.div>
                    )}

                    {/* STEP 3: Name + Password */}
                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <p className="text-xs tracking-widest text-gray-400 mb-2">
                                    YOUR NAME
                                </p>
                                <input
                                    type="text"
                                    placeholder="The Curator"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-1 text-[#2d2d2d]"
                                />
                            </div>

                            <div>
                                <p className="text-xs tracking-widest text-gray-400 mb-2">
                                    CREATE PASSWORD
                                </p>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleRegister()}
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
                                className="w-full bg-[#8b3a3a] text-white py-3 rounded shadow-md disabled:opacity-50"
                                onClick={handleRegister}
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "CREATE VAULT"}
                            </motion.button>
                        </motion.div>
                    )}

                </div>

                {/* Footer Switch */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    Already have a vault?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-[#8b3a3a] cursor-pointer hover:underline"
                    >
                        Sign In
                    </span>
                </p>

            </motion.div>
        </div>
    );
};

export default Register;
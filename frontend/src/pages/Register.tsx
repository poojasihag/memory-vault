import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, Camera, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [input, setInput] = useState("");
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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

                {/* STEP CONTENT */}
                <div className="mt-8 space-y-6 text-sm">

                    {/* STEP 1: Email / Phone */}
                    {step === 1 && (
                        <>
                            <div>
                                <p className="text-xs tracking-widest text-gray-400 mb-2">
                                    ENTER EMAIL OR PHONE
                                </p>
                                <input
                                    type="text"
                                    placeholder="example@email.com or 9876543210"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-1"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setStep(2)}
                                className="w-full bg-[#8b3a3a] text-white py-3 rounded shadow-md"
                            >
                                SEND OTP
                            </motion.button>
                        </>
                    )}

                    {/* STEP 2: OTP */}
                    {step === 2 && (
                        <>
                            <div>
                                <p className="text-xs tracking-widest text-gray-400 mb-2">
                                    ENTER OTP
                                </p>
                                <input
                                    type="text"
                                    placeholder="••••••"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-1 text-center tracking-[10px]"
                                />
                            </div>

                            <motion.p
                                whileHover={{ scale: 1.05 }}
                                className="text-right text-xs text-gray-400 cursor-pointer hover:text-[#8b3a3a]"
                            >
                                Resend OTP
                            </motion.p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setStep(3)}
                                className="w-full bg-[#8b3a3a] text-white py-3 rounded shadow-md"
                            >
                                VERIFY OTP
                            </motion.button>
                        </>
                    )}

                    {/* STEP 3: Password */}
                    {step === 3 && (
                        <>
                            <div>
                                <p className="text-xs tracking-widest text-gray-400 mb-2">
                                    CREATE PASSWORD
                                </p>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-1 pr-8"
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
                                className="w-full bg-[#8b3a3a] text-white py-3 rounded shadow-md"
                            >
                                CREATE VAULT
                            </motion.button>
                        </>
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
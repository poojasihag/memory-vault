import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Camera, Eye, EyeOff } from "lucide-react";
import { loginApi } from "../api/auth";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            const res = await loginApi(email, password);
            setAuth(res.data.token, res.data.user);
            toast.success("Welcome back!");
            navigate("/dashboard");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#e8ded2] flex items-center justify-center px-6 py-10 relative overflow-hidden">

            {/* Background Icons */}
            <BookOpen
                className="absolute top-10 left-10 text-[#cbbfb1] opacity-40"
                size={120}
            />
            <Camera
                className="absolute bottom-10 right-10 text-[#cbbfb1] opacity-40"
                size={120}
            />

            {/* Paper Container */}
            <motion.div
                initial={{ opacity: 0, y: 40, rotate: -1 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.5 }}
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
                    Every moment is a leaf in your legacy.
                </p>

                {/* Tabs */}
                <div className="flex justify-center gap-6 mt-6 text-sm">
                    <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="border-b border-[#8b3a3a] pb-1 text-[#8b3a3a] cursor-pointer"
                    >
                        Sign In
                    </motion.span>

                    <motion.span
                        onClick={() => navigate("/register")}
                        whileHover={{ scale: 1.1, color: "#8b3a3a" }}
                        className="text-gray-400 cursor-pointer transition"
                    >
                        Register
                    </motion.span>
                </div>

                {/* Form */}
                <div className="mt-8 space-y-6 text-sm">

                    {/* Email */}
                    <div>
                        <p className="text-xs tracking-widest text-gray-400 mb-2">
                            THE CUSTODIAN'S IDENTITY (EMAIL)
                        </p>
                        <input
                            type="email"
                            placeholder="curator@memoryvault.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-1 transition text-[#2d2d2d]"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <p className="text-xs tracking-widest text-gray-400 mb-2">
                            THE VAULT'S KEY (PASSWORD)
                        </p>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-1 pr-8 transition text-[#2d2d2d]"
                            />

                            {/* Eye Icon */}
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-[#8b3a3a] transition"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>

                        {/* Forgot */}
                        <motion.p
                            whileHover={{ scale: 1.05 }}
                            onClick={() => navigate("/forgot-password")}
                            className="text-right text-xs text-gray-400 mt-1 cursor-pointer hover:text-[#8b3a3a] transition"
                        >
                            Misplaced your key?
                        </motion.p>
                    </div>

                    {/* Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-[#8b3a3a] text-white py-3 mt-4 rounded shadow-md tracking-wide disabled:opacity-50"
                    >
                        {loading ? "Opening..." : "🔒 OPEN YOUR VAULT"}
                    </motion.button>

                    {/* Terms */}
                    <p className="text-[10px] text-center text-gray-400 mt-4 tracking-wide">
                        ACCESSING THIS VAULT IMPLIES AGREEMENT TO THE TERMS OF TRANSIT
                    </p>
                </div>

                {/* Polaroids */}
                <div className="flex justify-center gap-4 mt-10">
                    <motion.div
                        whileHover={{ rotate: -10, scale: 1.05 }}
                        className="w-16 h-20 bg-white shadow rotate-[-6deg]"
                    ></motion.div>

                    <motion.div
                        whileHover={{ scale: 1.1, y: -5 }}
                        className="w-16 h-20 bg-white shadow rotate-[2deg]"
                    ></motion.div>

                    <motion.div
                        whileHover={{ rotate: 10, scale: 1.05 }}
                        className="w-16 h-20 bg-white shadow rotate-[6deg]"
                    ></motion.div>
                </div>

            </motion.div>
        </div>
    );
};

export default Login;
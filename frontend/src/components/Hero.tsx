import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#e8ded2] min-h-screen">

            {/* NAVBAR */}
            <div className="w-full flex items-center justify-between px-10 py-5 bg-[#ebe3d7] shadow-sm">
                <h1 className="font-serif text-xl text-[#2d2d2d]">
                    Memory Vault
                </h1>

                <div className="hidden md:flex gap-8 text-sm text-gray-600">
                    <span className="cursor-pointer hover:text-black">Explore</span>
                    <span className="cursor-pointer hover:text-black">Archive</span>
                    <span className="cursor-pointer hover:text-black">Our Story</span>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm cursor-pointer hover:text-[#8b3a3a] transition-colors">Login</Link>

                    <button 
                        onClick={() => navigate('/register')}
                        className="bg-[#8b3a3a] text-white px-5 py-2 rounded hover:bg-[#7a3232] transition-colors"
                    >
                        Create Your Vault
                    </button>
                </div>
            </div>

            {/* HERO */}
            <section className="px-10 md:px-20 py-16 grid md:grid-cols-2 items-center">

                {/* LEFT */}
                <div>

                    {/* Tag */}
                    <span className="bg-[#dce5d3] text-[#5a6b4d] text-xs px-4 py-1 tracking-widest">
                        EST. 1994 • YOUR LEGACY
                    </span>

                    {/* Heading */}
                    <h1 className="mt-6 text-6xl md:text-7xl font-serif text-[#8b3a3a] leading-tight">
                        Your <br />
                        Memories, <br />
                        Preserved <br />
                        Forever{" "}
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="inline-block"
                        >
                            ❤️
                        </motion.span>
                    </h1>

                    {/* Description */}
                    <p className="mt-6 text-gray-600 max-w-md">
                        Preserving your most precious photos, videos, and moments
                        in a digital heirloom that transcends generations.
                    </p>

                    {/* Buttons */}
                    <div className="flex items-center gap-4 mt-8">

                        {/* Create Vault */}
                        <motion.button
                            onClick={() => navigate('/register')}
                            whileHover={{ scale: 1.05 }}
                            className="relative bg-[#8b3a3a] text-white px-6 py-3 rounded shadow-md hover:bg-[#7a3232] transition-colors"
                        >
                            Create Your Vault

                            {/* Dot */}
                            <span className="absolute -right-2 -top-2 w-4 h-4 border-2 border-[#8b3a3a] rounded-full bg-[#e8ded2]"></span>
                        </motion.button>

                        {/* Explore */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 border border-gray-300 px-5 py-3 bg-white shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <BookOpen size={16} />
                            Explore
                        </motion.button>

                    </div>
                </div>

                {/* RIGHT IMAGES */}
                <div className="relative flex justify-center mt-10 md:mt-0">

                    {/* Floating Icon */}
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-10 left-1/2 text-[#8b3a3a]"
                    >
                        💠
                    </motion.div>

                    {/* Image 1 */}
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className="absolute top-0 right-10 rotate-[10deg]"
                    >
                        <div className="bg-white p-2 shadow-xl">
                            <img
                                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                                className="w-40 h-52 object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Image 2 (Main) */}
                    <motion.div
                        whileHover={{ scale: 1.1, y: -10 }}
                        className="rotate-[-2deg] z-10"
                    >
                        <div className="bg-white p-2 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1492724441997-5dc865305da7"
                                className="w-52 h-64 object-cover"
                            />
                            <p className="text-center text-xs mt-2 text-gray-600">
                                Summer of ‘98
                            </p>
                        </div>
                    </motion.div>

                    {/* Image 3 */}
                    <motion.div
                        whileHover={{ rotate: -15, scale: 1.1 }}
                        className="absolute bottom-0 left-10 rotate-[-10deg]"
                    >
                        <div className="bg-white p-2 shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                                className="w-36 h-44 object-cover"
                            />
                        </div>
                    </motion.div>

                </div>
            </section>
        </div>
    );
};

export default Hero;
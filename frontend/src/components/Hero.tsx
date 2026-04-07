import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[#e9dfd6] font-serif relative overflow-hidden ">
            {/* Navbar */}
            <div className="flex justify-between items-center px-10 py-6">
                <h1 className="text-2xl italic font-semibold text-gray-800">
                    Memory Vault
                </h1>

                <div className="hidden md:flex gap-10 text-gray-600">
                    <a href="#" className="hover:text-black transition">Explore</a>
                    <a href="#archive" className="hover:text-black transition">Archive</a>
                    <a href="#our-story" className="hover:text-black transition">Our Story</a>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="text-gray-600 hover:text-black transition">
                        Login
                    </button>
                    <button className="bg-[#8b3a3a] hover:bg-[#6f2d2d] transition-all duration-300 text-white px-6 py-2 rounded-lg shadow-md">
                        Create Your Vault
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="grid md:grid-cols-2 gap-10 items-center px-10 mt-10">
                {/* Left Content */}
                <div className="animate-fadeIn">
                    <span className="bg-green-100 text-green-800 px-3 py-1 text-sm rounded-md">
                        EST. 1994 • YOUR LEGACY
                    </span>

                    <h2 className="text-6xl md:text-7xl font-bold text-[#8b3a3a] mt-6 leading-tight">
                        Your <br /> Memories, <br /> Preserved <br /> Forever ❤️
                    </h2>

                    <p className="text-gray-600 mt-6 max-w-md">
                        Preserving your most precious photos, videos, and moments in a
                        digital heirloom that transcends generations.
                    </p>

                    <div className="flex gap-4 mt-8">
                        <button className="bg-[#8b3a3a] hover:scale-105 transition-all duration-300 text-white px-6 py-3 rounded-lg shadow-lg">
                            Create Your Vault
                        </button>

                        <button className="relative group border text-[#8b3a3a] px-6 py-3 rounded-lg bg-white shadow overflow-hidden">
                            <span className="relative z-10 group-hover:text-white transition">
                                Explore
                            </span>
                            <span className="absolute inset-0 bg-[#8b3a3a] translate-y-full group-hover:translate-y-0 transition-all duration-300"></span>
                        </button>
                    </div>
                </div>

                {/* Right Images */}
                <div className="relative h-[520px]">
                    {/* Right Top */}
                    <img
                        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                        className="absolute right-10 top-0 w-40 rotate-6 shadow-xl border-8 border-white transition-transform duration-500 hover:scale-105"
                    />

                    {/* Middle (Hover Move) */}
                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                        className="absolute right-40 top-40 w-40 -rotate-3 shadow-xl border-8 border-white transition-all duration-500 hover:-translate-y-6 hover:rotate-0 hover:scale-110 z-10"
                    />

                    {/* Bottom */}
                    <img
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                        className="absolute bottom-0 right-52 w-44 rotate-3 shadow-lg border-8 border-white transition-transform duration-500 hover:scale-105"
                    />
                </div>
            </div>

            {/* Tailwind Custom Animation */}
            <style>
                {`@keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }`}
            </style>
        </div>
    );
}

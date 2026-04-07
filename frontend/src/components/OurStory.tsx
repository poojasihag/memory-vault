import React from "react";

export default function OurStory() {
    return (
        <div
            id="our-story"
            className="bg-[#f4ece4] px-6 md:px-12 py-28 text-center relative overflow-hidden"
        >
            {/* Top soft wave line */}
            <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-r from-[#e9dfd6] via-[#f4ece4] to-[#e9dfd6] opacity-60"></div>

            {/* Icon */}
            <div className="flex justify-center mb-6 animate-fadeIn">
                <div className="bg-[#8b3a3a] text-white p-4 rounded-lg shadow-md">
                    📖
                </div>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 animate-fadeIn">
                The story of you starts here.
            </h2>

            {/* Subtitle */}
            <p className="mt-6 text-gray-600 italic max-w-xl mx-auto animate-fadeIn">
                \"We don't just store files; we preserve the texture of time.\"
            </p>

            {/* Button */}
            <div className="mt-10 animate-fadeIn">
                <button className="bg-[#8b3a3a] hover:scale-105 transition-all duration-300 text-white px-8 py-4 rounded-lg shadow-lg text-lg flex items-center gap-2 mx-auto">
                    Open Your Vault →
                </button>
            </div>

            {/* Floating Card */}
            <div className="absolute right-60 bottom-50 rotate-12 border-2 border-[#d8c7be] w-32 h-32 rounded-xl flex items-center justify-center text-xs text-gray-400 animate-float">
                CERTIFIED <br /> CURATION <br /> 2024
            </div>

            {/* Footer */}
            <div className="mt-40 pt-10  bg-red-900 text-sm text-gray-400 flex flex-col md:flex-row justify-between gap-4">
                <p>© 2024 MEMORY VAULT — A DIGITAL HEIRLOOM</p>

                <div className="flex gap-6 justify-center">
                    <span>TERMS OF TRANSIT</span>
                    <span>PRIVACY SCROLLS</span>
                    <span>CONTACT THE CURATOR</span>
                </div>
            </div>

            {/* Animations */}
            <style>
                {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        `}
            </style>
        </div>
    );
}
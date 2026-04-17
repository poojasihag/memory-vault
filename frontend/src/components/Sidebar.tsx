import React, { useState } from "react";

interface SidebarProps {
    open: boolean;
    active: string;
    setActive: (page: string) => void;
    onClose?: () => void;
}

export default function Sidebar({ open, active, setActive, onClose }: SidebarProps) {
    const [userOpen, setUserOpen] = useState(false);

    const handleClick = (page: string) => {
        setActive(page);
        onClose?.(); // close sidebar on mobile after clicking
    };

    return (
        /* SIDEBAR */
        <div
            className={`
        fixed md:static top-0 left-0 h-full w-64 bg-[#e8ded2] z-50
        flex flex-col justify-between 
        transform transition-transform duration-300 h-screen
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
        >

            {/* 🔝 HEADER (ALWAYS FIRST) */}
            <div className="p-6 border-b border-[#d8cfc4]">
                <h1 className="text-xl text-[#8b3a3a] font-serif">
                    The Vault
                </h1>
                <p className="text-xs text-gray-500">
                    EST. 1994
                </p>
            </div>

            {/* 📂 MENU */}
            <div className="flex-1 px-6 py-6  space-y-6 text-[#5c5248]">

                <p
                    onClick={() => handleClick("dashboard")}
                    className={`cursor-pointer ${active === "dashboard" && "bg-white px-3 py-2 rounded"
                        }`}
                >
                    Dashboard
                </p>

                <p onClick={() => handleClick("albums")} className={`cursor-pointer ${active === "albums" && "bg-white px-3 py-2 rounded"}`}>
                    Albums
                </p>

                <p onClick={() => handleClick("favorites")} className={`cursor-pointer ${active === "favorites" && "bg-white px-3 py-2 rounded"}`}>
                    Favorites
                </p>

                <p onClick={() => handleClick("templates")} className={`cursor-pointer ${active === "templates" && "bg-white px-3 py-2 rounded"}`}>
                    Templates
                </p>

                <p onClick={() => handleClick("trash")} className={`cursor-pointer ${active === "trash" && "bg-white px-3 py-2 rounded"}`}>
                    Trash
                </p>
            </div>

            <div className="border-t border-[#d8cfc4]">

                {/* USER */}
                <div
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-3 p-4 bg-[#e3d6c7] cursor-pointer"
                >
                    <img
                        src="https://i.pravatar.cc/40"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="text-sm text-[#3b2f2f]">Curator</p>
                        <p className="text-xs text-gray-500">Active Session</p>
                    </div>
                </div>

                {/* DROPDOWN */}
                {userOpen && (
                    <div className="bg-white px-4 py-3 text-sm text-[#3b2f2f] shadow">
                        <p className="cursor-pointer hover:text-black">
                            Switch Account
                        </p>
                        <p className="cursor-pointer text-red-500 mt-1">
                            Logout
                        </p>
                    </div>
                )}

                {/* BUTTON */}
                <div className="p-4 ">
                    <button className="w-full bg-[#8b3a3a] text-white py-2 rounded">
                        + Add New Leaf
                    </button>
                </div>

            </div>

        </div>
    );
}
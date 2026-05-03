import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderOpen, Heart, Grid3X3, Trash2, User, LogOut, RefreshCw, X, Plus } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";

interface SidebarProps {
    open: boolean;
    active: string;
    setActive: (page: string) => void;
    onClose?: () => void;
    onAddNew?: () => void;
}

const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "albums", label: "Albums", icon: FolderOpen },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "templates", label: "Templates", icon: Grid3X3 },
    { id: "trash", label: "Trash", icon: Trash2 },
];

export default function Sidebar({ open, active, setActive, onClose, onAddNew }: SidebarProps) {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [userOpen, setUserOpen] = useState(false);

    const handleClick = (page: string) => {
        setActive(page);
        onClose?.();
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
        toast.success("Logged out");
    };

    const handleSwitchAccount = () => {
        logout();
        navigate("/login");
        toast("Login with another account", { icon: "👤" });
    };

    return (
        <>
            {/* Mobile Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed md:sticky top-0 left-0 h-screen w-[260px] bg-[#e8ded2] z-50
                    flex flex-col justify-between
                    transform transition-transform duration-300 ease-in-out
                    ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                    shadow-xl md:shadow-none
                `}
            >
                {/* Header */}
                <div>
                    <div className="p-6 border-b border-[#d8cfc4] flex items-center justify-between">
                        <div>
                            <h1 className="text-xl text-[#8b3a3a] font-serif tracking-wide">
                                The Vault
                            </h1>
                            <p className="text-[10px] text-gray-400 tracking-widest mt-0.5">
                                EST. 1994
                            </p>
                        </div>
                        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-[#8b3a3a] transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Menu */}
                    <nav className="px-4 py-6 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = active === item.id;
                            return (
                                <motion.button
                                    key={item.id}
                                    onClick={() => handleClick(item.id)}
                                    whileHover={{ x: 4 }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                                        isActive
                                            ? "bg-white text-[#8b3a3a] shadow-sm font-medium"
                                            : "text-[#5c5248] hover:bg-white/50"
                                    }`}
                                >
                                    <Icon size={18} className={isActive ? "text-[#8b3a3a]" : "text-[#9c8e82]"} />
                                    {item.label}
                                    {item.id === "favorites" && isActive && (
                                        <Heart size={12} className="ml-auto text-red-400 fill-red-400" />
                                    )}
                                </motion.button>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-[#d8cfc4]">
                    {/* User */}
                    <div
                        onClick={() => setUserOpen(!userOpen)}
                        className="flex items-center gap-3 p-4 bg-[#e3d6c7] cursor-pointer hover:bg-[#ddd0c2] transition"
                    >
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} className="w-10 h-10 rounded-full object-cover shadow" alt="" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[#8b3a3a] flex items-center justify-center text-white text-sm font-semibold shadow">
                                {(user?.name?.[0] || user?.email?.[0] || "C").toUpperCase()}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#3b2f2f] font-medium truncate">
                                {user?.name || "Curator"}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate">{user?.email || "Active Session"}</p>
                        </div>
                    </div>

                    {/* User Dropdown */}
                    {userOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white px-2 py-2 shadow-inner space-y-1"
                        >
                            <button
                                onClick={() => { handleClick("profile"); setUserOpen(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#3b2f2f] hover:bg-[#f3efe7] rounded-lg transition"
                            >
                                <User size={14} /> My Profile
                            </button>
                            <button
                                onClick={handleSwitchAccount}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#3b2f2f] hover:bg-[#f3efe7] rounded-lg transition"
                            >
                                <RefreshCw size={14} /> Switch Account
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                                <LogOut size={14} /> Logout
                            </button>
                        </motion.div>
                    )}

                    {/* Add New Leaf Button */}
                    <div className="p-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onAddNew}
                            className="w-full bg-[#8b3a3a] text-white py-2.5 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <Plus size={16} />
                            Add New Leaf
                        </motion.button>
                    </div>
                </div>
            </div>
        </>
    );
}
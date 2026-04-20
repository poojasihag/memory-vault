import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2, User, LogOut, RefreshCw } from "lucide-react";
import { getProfileApi, updateProfileApi } from "../api/user";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProfileView() {
    const navigate = useNavigate();
    const { user, setUser, logout } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [saving, setSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await getProfileApi();
            setProfile(res.data);
            setName(res.data.name || "");
            setBio(res.data.bio || "");
        } catch {
            toast.error("Failed to load profile");
        } finally { setLoading(false); }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("bio", bio);
            if (avatarFile) formData.append("avatar", avatarFile);

            const res = await updateProfileApi(formData);
            setProfile({ ...profile, ...res.data });
            setUser({ ...user!, name: res.data.name, avatarUrl: res.data.avatarUrl });
            setEditing(false);
            setAvatarFile(null);
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(null);
            toast.success("Profile updated");
        } catch {
            toast.error("Failed to update profile");
        } finally { setSaving(false); }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
        toast.success("Logged out successfully");
    };

    const handleSwitchAccount = () => {
        logout();
        navigate("/login");
        toast("Please login with another account", { icon: "👤" });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-[#8b3a3a]" />
            </div>
        );
    }

    const avatarSrc = avatarPreview || profile?.avatarUrl;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-serif text-[#2d2d2d] mb-8">Your Profile</h1>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                    {avatarSrc ? (
                        <img
                            src={avatarSrc}
                            alt="Avatar"
                            className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white"
                        />
                    ) : (
                        <div className="w-28 h-28 rounded-full bg-[#e8ded2] flex items-center justify-center shadow-lg border-4 border-white">
                            <User size={40} className="text-[#8b3a3a]" />
                        </div>
                    )}

                    {editing && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                            <Camera size={24} className="text-white" />
                        </button>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                />
            </div>

            {/* Profile Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                {/* Name */}
                <div>
                    <label className="text-xs tracking-widest text-gray-400 mb-2 block">NAME</label>
                    {editing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-2 text-[#2d2d2d] font-serif text-lg"
                            placeholder="Your name"
                        />
                    ) : (
                        <p className="text-[#2d2d2d] font-serif text-lg">{profile?.name || "Not set"}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="text-xs tracking-widest text-gray-400 mb-2 block">EMAIL</label>
                    <p className="text-[#2d2d2d]">{profile?.email}</p>
                </div>

                {/* Bio */}
                <div>
                    <label className="text-xs tracking-widest text-gray-400 mb-2 block">BIO</label>
                    {editing ? (
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-2 text-[#2d2d2d] resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    ) : (
                        <p className="text-gray-600 italic">{profile?.bio || "No bio yet"}</p>
                    )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8 pt-4 border-t border-[#e8ded2]">
                    <div className="text-center">
                        <p className="text-2xl font-serif text-[#8b3a3a]">{profile?._count?.albums || 0}</p>
                        <p className="text-xs text-gray-400">Albums</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-serif text-[#8b3a3a]">
                            {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : "—"}
                        </p>
                        <p className="text-xs text-gray-400">Joined</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-[#e8ded2]">
                    {editing ? (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-[#8b3a3a] text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving && <Loader2 size={14} className="animate-spin" />}
                                {saving ? "Saving..." : "Save Changes"}
                            </motion.button>
                            <button
                                onClick={() => { setEditing(false); setAvatarFile(null); if (avatarPreview) URL.revokeObjectURL(avatarPreview); setAvatarPreview(null); }}
                                className="px-6 py-2 text-gray-500 text-sm"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="px-6 py-2 bg-[#e8ded2] text-[#5c5248] rounded-lg text-sm hover:bg-[#d8cfc4] transition"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Account Actions */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6 space-y-3">
                <h3 className="text-sm font-semibold text-[#2d2d2d] mb-4">Account</h3>

                <button
                    onClick={handleSwitchAccount}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f3efe7] transition text-left"
                >
                    <RefreshCw size={18} className="text-gray-400" />
                    <div>
                        <p className="text-sm text-[#2d2d2d]">Switch Account</p>
                        <p className="text-xs text-gray-400">Login with a different account</p>
                    </div>
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition text-left"
                >
                    <LogOut size={18} className="text-red-500" />
                    <div>
                        <p className="text-sm text-red-500">Logout</p>
                        <p className="text-xs text-gray-400">Sign out of your account</p>
                    </div>
                </button>
            </div>
        </div>
    );
}

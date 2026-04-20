import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, RotateCcw, Loader2, AlertTriangle } from "lucide-react";
import { getTrashApi, restoreAlbumApi, permanentDeleteApi } from "../api/albums";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function TrashView() {
    const [albums, setAlbums] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrash();
    }, []);

    const fetchTrash = async () => {
        setLoading(true);
        try {
            const res = await getTrashApi();
            setAlbums(res.data);
        } catch {
            toast.error("Failed to load trash");
        } finally { setLoading(false); }
    };

    const handleRestore = async (albumId: string) => {
        try {
            await restoreAlbumApi(albumId);
            setAlbums((prev) => prev.filter((a) => a.id !== albumId));
            toast.success("Album restored");
        } catch { toast.error("Failed to restore"); }
    };

    const handlePermanentDelete = async (albumId: string) => {
        if (!confirm("This will permanently delete this album and all its photos. This cannot be undone.")) return;
        try {
            await permanentDeleteApi(albumId);
            setAlbums((prev) => prev.filter((a) => a.id !== albumId));
            toast.success("Album permanently deleted");
        } catch { toast.error("Failed to delete"); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-[#8b3a3a]" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-3 mb-2">
                <Trash2 size={24} className="text-gray-400" />
                <h1 className="text-3xl font-serif text-[#2d2d2d]">Trash</h1>
            </div>
            <p className="text-gray-500 mb-8">Items in trash are automatically deleted after 30 days.</p>

            {albums.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <span className="text-6xl mb-4 opacity-40">🗑️</span>
                    <p className="text-gray-400 text-lg">Trash is empty</p>
                    <p className="text-gray-300 text-sm mt-1">Deleted albums will appear here</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albums.map((album) => {
                        const deletedDate = new Date(album.deletedAt);
                        const purgeDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                        const daysLeft = Math.max(0, Math.ceil((purgeDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

                        return (
                            <motion.div
                                key={album.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-md overflow-hidden opacity-75 hover:opacity-100 transition"
                            >
                                {/* Cover */}
                                <div className="relative">
                                    {album.coverUrl || album.images?.[0]?.url ? (
                                        <img
                                            src={album.coverUrl || album.images[0].url}
                                            alt={album.title}
                                            className="w-full h-40 object-cover grayscale-[50%]"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                                            <span className="text-3xl opacity-30">📷</span>
                                        </div>
                                    )}

                                    {/* Days left badge */}
                                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                        daysLeft <= 7 ? "bg-red-500 text-white" : "bg-orange-400 text-white"
                                    }`}>
                                        <AlertTriangle size={12} />
                                        {daysLeft}d until deleted
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-serif text-[#2d2d2d] font-semibold">{album.title}</h3>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Deleted {format(deletedDate, "MMM d, yyyy")}
                                    </p>

                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleRestore(album.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#e8ded2] text-[#5c5248] rounded-lg text-sm hover:bg-[#d8cfc4] transition"
                                        >
                                            <RotateCcw size={14} /> Restore
                                        </button>
                                        <button
                                            onClick={() => handlePermanentDelete(album.id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-500 rounded-lg text-sm hover:bg-red-100 transition"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

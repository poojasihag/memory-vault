import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Trash2, Edit3, Plus, Play, Pause, Calendar, Music, X, Loader2 } from "lucide-react";
import { getAlbumByIdApi, updateAlbumApi, toggleFavoriteApi, deleteAlbumApi, addImagesApi, removeImageApi } from "../api/albums";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface AlbumDetailProps {
    albumId: string;
    onBack: () => void;
    onDeleted: () => void;
    onOpenEditor?: (imageUrl: string) => void;
}

const AlbumDetail = ({ albumId, onBack, onDeleted, onOpenEditor }: AlbumDetailProps) => {
    const [album, setAlbum] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [playingSong, setPlayingSong] = useState(false);
    const [uploading, setUploading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchAlbum();
    }, [albumId]);

    const fetchAlbum = async () => {
        setLoading(true);
        try {
            const res = await getAlbumByIdApi(albumId);
            setAlbum(res.data);
            setEditTitle(res.data.title);
            setEditDesc(res.data.description || "");
        } catch {
            toast.error("Failed to load album");
            onBack();
        } finally { setLoading(false); }
    };

    const handleToggleFav = async () => {
        try {
            const res = await toggleFavoriteApi(albumId);
            setAlbum({ ...album, isFavorite: res.data.isFavorite });
            toast.success(res.data.isFavorite ? "Added to favorites" : "Removed from favorites");
        } catch { toast.error("Failed"); }
    };

    const handleDelete = async () => {
        if (!confirm("Move this album to trash?")) return;
        try {
            await deleteAlbumApi(albumId);
            toast.success("Moved to trash");
            onDeleted();
        } catch { toast.error("Failed to delete"); }
    };

    const handleSave = async () => {
        try {
            const res = await updateAlbumApi(albumId, { title: editTitle, description: editDesc });
            setAlbum(res.data);
            setEditing(false);
            toast.success("Album updated");
        } catch { toast.error("Failed to update"); }
    };

    const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setUploading(true);
        try {
            const formData = new FormData();
            files.forEach((f) => formData.append("images", f));
            const res = await addImagesApi(albumId, formData);
            setAlbum(res.data);
            toast.success(`${files.length} image(s) added`);
        } catch { toast.error("Upload failed"); }
        finally { setUploading(false); }
    };

    const handleRemoveImage = async (imageId: string) => {
        if (!confirm("Remove this image?")) return;
        try {
            await removeImageApi(imageId);
            setAlbum({
                ...album,
                images: album.images.filter((img: any) => img.id !== imageId),
            });
            toast.success("Image removed");
        } catch { toast.error("Failed to remove image"); }
    };

    const toggleSong = () => {
        if (!audioRef.current || !album.songUrl) return;
        if (playingSong) {
            audioRef.current.pause();
        } else {
            audioRef.current.src = album.songUrl;
            audioRef.current.play();
        }
        setPlayingSong(!playingSong);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-[#8b3a3a]" />
            </div>
        );
    }

    if (!album) return null;

    const dateStr = album.date ? format(new Date(album.date), "MMMM d, yyyy") : null;

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white rounded-lg transition"
                >
                    <ArrowLeft size={20} className="text-[#5c5248]" />
                </button>

                <div className="flex-1">
                    {editing ? (
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="text-3xl font-serif text-[#2d2d2d] bg-transparent border-b-2 border-[#8b3a3a] focus:outline-none w-full"
                        />
                    ) : (
                        <h1 className="text-3xl font-serif text-[#2d2d2d]">{album.title}</h1>
                    )}

                    {dateStr && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-400">
                            <Calendar size={14} />
                            {dateStr}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={handleToggleFav} className="p-2 hover:bg-white rounded-lg transition">
                        <Heart size={20} className={album.isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"} />
                    </button>
                    <button onClick={() => editing ? handleSave() : setEditing(true)} className="p-2 hover:bg-white rounded-lg transition">
                        <Edit3 size={20} className={editing ? "text-[#8b3a3a]" : "text-gray-400"} />
                    </button>
                    <button onClick={handleDelete} className="p-2 hover:bg-white rounded-lg transition">
                        <Trash2 size={20} className="text-gray-400 hover:text-red-500" />
                    </button>
                </div>
            </div>

            {/* Description */}
            {editing ? (
                <div className="mb-6">
                    <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={2}
                        placeholder="Add a description..."
                        className="w-full bg-white border border-[#e8ded2] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8b3a3a]/30 text-[#2d2d2d] resize-none"
                    />
                    <div className="flex gap-2 mt-2">
                        <button onClick={handleSave} className="px-4 py-1 bg-[#8b3a3a] text-white rounded text-sm">Save</button>
                        <button onClick={() => setEditing(false)} className="px-4 py-1 text-gray-500 text-sm">Cancel</button>
                    </div>
                </div>
            ) : (
                album.description && (
                    <p className="text-gray-600 mb-6 italic">{album.description}</p>
                )
            )}

            {/* Song Player */}
            {album.songTitle && (
                <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm mb-6">
                    {album.songCover && (
                        <img src={album.songCover} className="w-14 h-14 rounded-lg shadow" alt="" />
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <Music size={14} className="text-[#8b3a3a]" />
                            <p className="text-sm font-semibold text-[#2d2d2d] truncate">{album.songTitle}</p>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{album.songArtist}</p>
                    </div>
                    <button
                        onClick={toggleSong}
                        className="p-3 bg-[#8b3a3a] text-white rounded-full hover:scale-105 transition shadow-md"
                    >
                        {playingSong ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                </div>
            )}

            {/* Image Gallery */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-serif text-[#2d2d2d]">Photos ({album.images?.length || 0})</h2>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8b3a3a] text-white rounded-lg text-sm hover:scale-102 transition shadow-sm disabled:opacity-50"
                >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    {uploading ? "Uploading..." : "Add Photos"}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddImages}
                    className="hidden"
                />
            </div>

            <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {album.images?.map((img: any) => (
                    <motion.div
                        key={img.id}
                        whileHover={{ scale: 1.02 }}
                        className="relative group break-inside-avoid"
                    >
                        <img
                            src={img.url}
                            alt={img.caption || "Memory"}
                            className="w-full rounded-lg shadow-md cursor-pointer"
                            loading="lazy"
                            onClick={() => onOpenEditor?.(img.url)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all duration-200">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleRemoveImage(img.id); }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                            {onOpenEditor && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onOpenEditor(img.url); }}
                                    className="absolute bottom-2 right-2 p-1.5 bg-white/80 text-[#2d2d2d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs px-3"
                                >
                                    ✏️ Edit
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {(!album.images || album.images.length === 0) && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#d8c7be] rounded-xl p-16 text-center cursor-pointer hover:border-[#8b3a3a] transition"
                >
                    <Plus size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-400">Add your first photos to this album</p>
                </div>
            )}

            <audio ref={audioRef} onEnded={() => setPlayingSong(false)} />
        </div>
    );
};

export default AlbumDetail;

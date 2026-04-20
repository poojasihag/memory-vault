import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Trash2, Calendar } from "lucide-react";
import { toggleFavoriteApi } from "../api/albums";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface AlbumCardProps {
    album: any;
    onClick: () => void;
    onFavoriteToggle?: (albumId: string, newState: boolean) => void;
    showTrashBadge?: boolean;
}

const AlbumCard = ({ album, onClick, onFavoriteToggle, showTrashBadge }: AlbumCardProps) => {
    const [fav, setFav] = useState(album.isFavorite);
    const [toggling, setToggling] = useState(false);

    const handleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (toggling) return;
        setToggling(true);
        try {
            await toggleFavoriteApi(album.id);
            setFav(!fav);
            onFavoriteToggle?.(album.id, !fav);
            toast.success(fav ? "Removed from favorites" : "Added to favorites");
        } catch {
            toast.error("Failed to update favorite");
        } finally {
            setToggling(false);
        }
    };

    const coverImage = album.coverUrl || album.images?.[0]?.url;
    const dateStr = album.date ? format(new Date(album.date), "MMMM yyyy") : null;

    // Calculate days left for trash
    let daysLeft = null;
    if (showTrashBadge && album.deletedAt) {
        const deletedDate = new Date(album.deletedAt);
        const purgeDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        daysLeft = Math.max(0, Math.ceil((purgeDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    }

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl cursor-pointer group relative"
        >
            {/* Cover Image */}
            <div className="relative overflow-hidden">
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={album.title}
                        className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-[#e8ded2] to-[#d8c7be] flex items-center justify-center">
                        <span className="text-4xl opacity-40">📷</span>
                    </div>
                )}

                {/* Heart */}
                {!showTrashBadge && (
                    <button
                        onClick={handleFavorite}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm"
                    >
                        <Heart
                            size={16}
                            className={`transition-all duration-300 ${fav ? "text-red-500 fill-red-500 scale-110" : "text-gray-400"}`}
                        />
                    </button>
                )}

                {/* Image count badge */}
                {album.images && album.images.length > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                        {album.images.length} {album.images.length === 1 ? "photo" : "photos"}
                    </div>
                )}

                {/* Trash badge */}
                {showTrashBadge && daysLeft !== null && (
                    <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Trash2 size={12} />
                        {daysLeft}d left
                    </div>
                )}

                {/* Song indicator */}
                {album.songTitle && (
                    <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                        🎵 {album.songTitle}
                    </div>
                )}
            </div>

            {/* Text */}
            <div className="p-4">
                <h3 className="font-serif text-[#2d2d2d] font-semibold truncate">{album.title}</h3>
                {album.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{album.description}</p>
                )}
                {dateStr && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Calendar size={12} />
                        {dateStr}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AlbumCard;
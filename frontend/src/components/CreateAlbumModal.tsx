import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Music, Image, Loader2, Search, Play, Pause } from "lucide-react";
import { createAlbumApi } from "../api/albums";
import { searchSongsApi } from "../api/songs";
import type { SongResult } from "../api/songs";
import toast from "react-hot-toast";

interface CreateAlbumModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

const CreateAlbumModal = ({ open, onClose, onCreated }: CreateAlbumModalProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Song search
    const [songQuery, setSongQuery] = useState("");
    const [songResults, setSongResults] = useState<SongResult[]>([]);
    const [selectedSong, setSelectedSong] = useState<SongResult | null>(null);
    const [searchingMusic, setSearchingMusic] = useState(false);
    const [playingPreview, setPlayingPreview] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);
        const newFiles = [...files, ...selected];
        setFiles(newFiles);

        const newPreviews = selected.map((f) => URL.createObjectURL(f));
        setPreviews((p) => [...p, ...newPreviews]);
    };

    const removeFile = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setFiles((f) => f.filter((_, i) => i !== index));
        setPreviews((p) => p.filter((_, i) => i !== index));
    };

    const handleSongSearch = useCallback((query: string) => {
        setSongQuery(query);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        if (!query.trim()) { setSongResults([]); return; }

        searchTimeoutRef.current = setTimeout(async () => {
            setSearchingMusic(true);
            try {
                const res = await searchSongsApi(query);
                setSongResults(res.data);
            } catch {
                toast.error("Song search failed");
            } finally { setSearchingMusic(false); }
        }, 500);
    }, []);

    const selectSong = (song: SongResult) => {
        setSelectedSong(song);
        setSongResults([]);
        setSongQuery("");
        if (audioRef.current) { audioRef.current.pause(); }
    };

    const togglePreview = () => {
        if (!selectedSong || !audioRef.current) return;
        if (playingPreview) {
            audioRef.current.pause();
        } else {
            audioRef.current.src = selectedSong.previewUrl;
            audioRef.current.play();
        }
        setPlayingPreview(!playingPreview);
    };

    const handleSubmit = async () => {
        if (!title.trim()) { toast.error("Title is required"); return; }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            if (description) formData.append("description", description);
            if (date) formData.append("date", date);
            if (selectedSong) {
                formData.append("songUrl", selectedSong.previewUrl);
                formData.append("songTitle", selectedSong.title);
                formData.append("songArtist", selectedSong.artist);
                formData.append("songCover", selectedSong.coverUrl);
            }
            files.forEach((file) => formData.append("images", file));

            await createAlbumApi(formData);
            toast.success("Album created!");
            resetForm();
            onCreated();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to create album");
        } finally { setLoading(false); }
    };

    const resetForm = () => {
        setTitle(""); setDescription(""); setDate("");
        previews.forEach((p) => URL.revokeObjectURL(p));
        setFiles([]); setPreviews([]);
        setSelectedSong(null); setSongQuery(""); setSongResults([]);
        if (audioRef.current) audioRef.current.pause();
        setPlayingPreview(false);
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#fdfaf6] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-[#fdfaf6] border-b border-[#e8ded2] p-6 flex items-center justify-between z-10">
                        <h2 className="text-xl font-serif text-[#2d2d2d]">🍃 New Memory Leaf</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-[#8b3a3a] transition">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="text-xs tracking-widest text-gray-400 mb-2 block">TITLE</label>
                            <input
                                type="text"
                                placeholder="Summer of '24..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-2 text-[#2d2d2d] font-serif text-lg"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs tracking-widest text-gray-400 mb-2 block">DESCRIPTION</label>
                            <textarea
                                placeholder="A weekend where time stood still..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-2 text-[#2d2d2d] resize-none"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="text-xs tracking-widest text-gray-400 mb-2 block">DATE</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-2 text-[#2d2d2d]"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="text-xs tracking-widest text-gray-400 mb-3 block">
                                <Image size={14} className="inline mr-1" /> PHOTOS
                            </label>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-[#d8c7be] rounded-lg p-8 text-center cursor-pointer hover:border-[#8b3a3a] transition-colors group"
                            >
                                <Upload size={32} className="mx-auto text-gray-300 group-hover:text-[#8b3a3a] transition" />
                                <p className="text-sm text-gray-400 mt-2">Click to upload photos</p>
                                <p className="text-xs text-gray-300 mt-1">PNG, JPG up to 10MB each</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {/* Previews */}
                            {previews.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {previews.map((p, i) => (
                                        <div key={i} className="relative group/img">
                                            <img src={p} className="w-20 h-20 object-cover rounded-lg shadow" alt="" />
                                            <button
                                                onClick={() => removeFile(i)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover/img:opacity-100 transition"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Song Search */}
                        <div>
                            <label className="text-xs tracking-widest text-gray-400 mb-2 block">
                                <Music size={14} className="inline mr-1" /> ADD A SONG (OPTIONAL)
                            </label>

                            {selectedSong ? (
                                <div className="flex items-center gap-3 bg-[#e8ded2] rounded-lg p-3">
                                    <img src={selectedSong.coverUrl} className="w-12 h-12 rounded" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[#2d2d2d] truncate">{selectedSong.title}</p>
                                        <p className="text-xs text-gray-500 truncate">{selectedSong.artist}</p>
                                    </div>
                                    <button onClick={togglePreview} className="text-[#8b3a3a] hover:scale-110 transition">
                                        {playingPreview ? <Pause size={20} /> : <Play size={20} />}
                                    </button>
                                    <button
                                        onClick={() => { setSelectedSong(null); if (audioRef.current) audioRef.current.pause(); setPlayingPreview(false); }}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                    <input
                                        type="text"
                                        placeholder="Search for a song..."
                                        value={songQuery}
                                        onChange={(e) => handleSongSearch(e.target.value)}
                                        className="w-full bg-[#f3efe7] pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b3a3a]/30 text-sm text-[#2d2d2d]"
                                    />
                                    {searchingMusic && (
                                        <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                                    )}
                                </div>
                            )}

                            {/* Song Results */}
                            {songResults.length > 0 && (
                                <div className="mt-2 bg-white border border-[#e8ded2] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {songResults.map((song) => (
                                        <div
                                            key={song.id}
                                            onClick={() => selectSong(song)}
                                            className="flex items-center gap-3 p-3 hover:bg-[#f3efe7] cursor-pointer transition"
                                        >
                                            <img src={song.coverUrl} className="w-10 h-10 rounded" alt="" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-[#2d2d2d] truncate">{song.title}</p>
                                                <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-[#fdfaf6] border-t border-[#e8ded2] p-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-sm text-gray-500 hover:text-[#2d2d2d] transition"
                        >
                            Cancel
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 bg-[#8b3a3a] text-white rounded-lg shadow-md text-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && <Loader2 size={14} className="animate-spin" />}
                            {loading ? "Creating..." : "🍃 Create Album"}
                        </motion.button>
                    </div>

                    <audio ref={audioRef} onEnded={() => setPlayingPreview(false)} />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CreateAlbumModal;

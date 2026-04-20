import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { createAlbumApi } from "../api/albums";
import toast from "react-hot-toast";

// Template layout definitions
const TEMPLATES = [
    {
        id: "classic-2x2",
        name: "Classic Grid",
        description: "4 photos in a perfect square",
        slots: [
            { x: 0, y: 0, w: 50, h: 50 },
            { x: 50, y: 0, w: 50, h: 50 },
            { x: 0, y: 50, w: 50, h: 50 },
            { x: 50, y: 50, w: 50, h: 50 },
        ],
    },
    {
        id: "hero-trio",
        name: "Hero & Duo",
        description: "1 large with 2 smaller",
        slots: [
            { x: 0, y: 0, w: 60, h: 100 },
            { x: 60, y: 0, w: 40, h: 50 },
            { x: 60, y: 50, w: 40, h: 50 },
        ],
    },
    {
        id: "story-strip",
        name: "Story Strip",
        description: "3 photos in a cinematic row",
        slots: [
            { x: 0, y: 0, w: 33.33, h: 100 },
            { x: 33.33, y: 0, w: 33.34, h: 100 },
            { x: 66.67, y: 0, w: 33.33, h: 100 },
        ],
    },
    {
        id: "polaroid-stack",
        name: "Polaroid Stack",
        description: "2 overlapping memories",
        slots: [
            { x: 5, y: 5, w: 55, h: 90 },
            { x: 40, y: 5, w: 55, h: 90 },
        ],
    },
    {
        id: "mosaic",
        name: "Mosaic",
        description: "5 photos in a dynamic mosaic",
        slots: [
            { x: 0, y: 0, w: 66, h: 60 },
            { x: 66, y: 0, w: 34, h: 30 },
            { x: 66, y: 30, w: 34, h: 30 },
            { x: 0, y: 60, w: 34, h: 40 },
            { x: 34, y: 60, w: 66, h: 40 },
        ],
    },
    {
        id: "duo",
        name: "Side by Side",
        description: "2 photos side by side",
        slots: [
            { x: 0, y: 0, w: 50, h: 100 },
            { x: 50, y: 0, w: 50, h: 100 },
        ],
    },
    {
        id: "spotlight",
        name: "Spotlight",
        description: "1 hero + 3 small below",
        slots: [
            { x: 0, y: 0, w: 100, h: 60 },
            { x: 0, y: 60, w: 33.33, h: 40 },
            { x: 33.33, y: 60, w: 33.34, h: 40 },
            { x: 66.67, y: 60, w: 33.33, h: 40 },
        ],
    },
    {
        id: "diamond",
        name: "Diamond",
        description: "4 photos in diamond layout",
        slots: [
            { x: 25, y: 0, w: 50, h: 50 },
            { x: 0, y: 25, w: 50, h: 50 },
            { x: 50, y: 25, w: 50, h: 50 },
            { x: 25, y: 50, w: 50, h: 50 },
        ],
    },
];

interface TemplatesProps {
    onAlbumCreated: () => void;
}

export default function Templates({ onAlbumCreated }: TemplatesProps) {
    const [activeTemplate, setActiveTemplate] = useState<typeof TEMPLATES[0] | null>(null);
    const [slotImages, setSlotImages] = useState<(File | null)[]>([]);
    const [slotPreviews, setSlotPreviews] = useState<(string | null)[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);

    const openTemplate = (template: typeof TEMPLATES[0]) => {
        setActiveTemplate(template);
        setSlotImages(new Array(template.slots.length).fill(null));
        setSlotPreviews(new Array(template.slots.length).fill(null));
        setTitle("");
        setDescription("");
    };

    const handleSlotClick = (index: number) => {
        setActiveSlotIndex(index);
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const newImages = [...slotImages];
        const newPreviews = [...slotPreviews];

        if (newPreviews[activeSlotIndex]) {
            URL.revokeObjectURL(newPreviews[activeSlotIndex]!);
        }

        newImages[activeSlotIndex] = file;
        newPreviews[activeSlotIndex] = URL.createObjectURL(file);

        setSlotImages(newImages);
        setSlotPreviews(newPreviews);

        // Reset input
        e.target.value = "";
    };

    const handleSaveAsAlbum = async () => {
        if (!title.trim()) { toast.error("Please add a title"); return; }
        const validFiles = slotImages.filter((f) => f !== null) as File[];
        if (validFiles.length === 0) { toast.error("Please add at least one photo"); return; }

        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            if (description) formData.append("description", description);
            formData.append("templateId", activeTemplate!.id);
            validFiles.forEach((file) => formData.append("images", file));

            await createAlbumApi(formData);
            toast.success("Template saved as album!");
            setActiveTemplate(null);
            slotPreviews.forEach((p) => p && URL.revokeObjectURL(p));
            onAlbumCreated();
        } catch {
            toast.error("Failed to save album");
        } finally { setSaving(false); }
    };

    return (
        <div>
            <h1 className="text-3xl font-serif text-[#2d2d2d] mb-2">Templates</h1>
            <p className="text-gray-500 mb-8">Choose a layout, add your photos, and create a beautiful collage.</p>

            {/* Template Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {TEMPLATES.map((template) => (
                    <motion.div
                        key={template.id}
                        whileHover={{ y: -4, scale: 1.02 }}
                        onClick={() => openTemplate(template)}
                        className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-xl transition-shadow group"
                    >
                        {/* Template Preview */}
                        <div className="relative w-full aspect-square bg-[#f3efe7] rounded-lg overflow-hidden mb-3">
                            {template.slots.map((slot, i) => (
                                <div
                                    key={i}
                                    className="absolute border border-[#d8c7be] bg-white/60 flex items-center justify-center transition-colors group-hover:border-[#8b3a3a]/40"
                                    style={{
                                        left: `${slot.x}%`,
                                        top: `${slot.y}%`,
                                        width: `${slot.w}%`,
                                        height: `${slot.h}%`,
                                    }}
                                >
                                    <Plus size={14} className="text-gray-300 group-hover:text-[#8b3a3a] transition" />
                                </div>
                            ))}
                        </div>

                        <h3 className="font-serif text-[#2d2d2d] text-sm font-semibold">{template.name}</h3>
                        <p className="text-xs text-gray-400">{template.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* Template Editor Modal */}
            <AnimatePresence>
                {activeTemplate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setActiveTemplate(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#fdfaf6] rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-[#fdfaf6] border-b border-[#e8ded2] p-6 flex items-center justify-between z-10">
                                <div>
                                    <h2 className="text-xl font-serif text-[#2d2d2d]">{activeTemplate.name}</h2>
                                    <p className="text-sm text-gray-400">{activeTemplate.description}</p>
                                </div>
                                <button onClick={() => setActiveTemplate(null)} className="text-gray-400 hover:text-[#8b3a3a]">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Title & Description */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs tracking-widest text-gray-400 mb-2 block">TITLE</label>
                                        <input
                                            type="text"
                                            placeholder="My memory collage..."
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-2 text-[#2d2d2d] font-serif"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs tracking-widest text-gray-400 mb-2 block">DESCRIPTION</label>
                                        <input
                                            type="text"
                                            placeholder="A beautiful moment..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#8b3a3a] py-2 text-[#2d2d2d]"
                                        />
                                    </div>
                                </div>

                                {/* Template Canvas */}
                                <div className="relative w-full aspect-[4/3] bg-[#f3efe7] rounded-xl overflow-hidden shadow-inner">
                                    {activeTemplate.slots.map((slot, i) => (
                                        <div
                                            key={i}
                                            onClick={() => handleSlotClick(i)}
                                            className="absolute border-2 border-dashed border-[#d8c7be] hover:border-[#8b3a3a] rounded-lg flex items-center justify-center cursor-pointer transition-all overflow-hidden group"
                                            style={{
                                                left: `calc(${slot.x}% + 4px)`,
                                                top: `calc(${slot.y}% + 4px)`,
                                                width: `calc(${slot.w}% - 8px)`,
                                                height: `calc(${slot.h}% - 8px)`,
                                            }}
                                        >
                                            {slotPreviews[i] ? (
                                                <>
                                                    <img
                                                        src={slotPreviews[i]!}
                                                        className="w-full h-full object-cover"
                                                        alt=""
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                                                        <Upload size={20} className="text-white opacity-0 group-hover:opacity-100 transition" />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 text-gray-300 group-hover:text-[#8b3a3a] transition">
                                                    <Plus size={24} />
                                                    <span className="text-xs">Add Photo</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 bg-[#fdfaf6] border-t border-[#e8ded2] p-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setActiveTemplate(null)}
                                    className="px-6 py-2 text-sm text-gray-500 hover:text-[#2d2d2d]"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSaveAsAlbum}
                                    disabled={saving}
                                    className="px-6 py-2 bg-[#8b3a3a] text-white rounded-lg shadow-md text-sm disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving && <Loader2 size={14} className="animate-spin" />}
                                    {saving ? "Saving..." : "Save as Album"}
                                </motion.button>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

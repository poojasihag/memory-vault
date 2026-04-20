import { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Text as KonvaText } from "react-konva";
import { motion } from "framer-motion";
import { X, Type, Smile, Download, RotateCcw, Trash2 } from "lucide-react";
import Konva from "konva";

interface ImageEditorProps {
    imageUrl: string;
    onClose: () => void;
}

const STICKERS = ["❤️", "⭐", "🌟", "🎉", "🎵", "🦋", "🌸", "🔥", "💫", "✨", "🍃", "📸", "💕", "🌈", "🎀", "🌺"];

const COLORS = ["#ffffff", "#000000", "#8b3a3a", "#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#e91e63", "#ff9800"];

interface TextNode {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fill: string;
    fontFamily: string;
}

interface StickerNode {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
}

const ImageEditor = ({ imageUrl, onClose }: ImageEditorProps) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [stageSize, setStageSize] = useState({ width: 600, height: 450 });
    const [texts, setTexts] = useState<TextNode[]>([]);
    const [stickers, setStickers] = useState<StickerNode[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [currentColor, setCurrentColor] = useState("#ffffff");
    const [currentFontSize, setCurrentFontSize] = useState(24);
    const stageRef = useRef<Konva.Stage | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.onload = () => {
            setImage(img);

            // Fit image to container
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const maxHeight = window.innerHeight * 0.6;
                const ratio = Math.min(containerWidth / img.width, maxHeight / img.height);
                setStageSize({
                    width: Math.floor(img.width * ratio),
                    height: Math.floor(img.height * ratio),
                });
            }
        };
    }, [imageUrl]);

    const addText = () => {
        const newText: TextNode = {
            id: `text-${Date.now()}`,
            text: "Your text here",
            x: stageSize.width / 2 - 60,
            y: stageSize.height / 2 - 12,
            fontSize: currentFontSize,
            fill: currentColor,
            fontFamily: "Arial",
        };
        setTexts([...texts, newText]);
        setSelectedId(newText.id);
    };

    const addSticker = (emoji: string) => {
        const newSticker: StickerNode = {
            id: `sticker-${Date.now()}`,
            text: emoji,
            x: Math.random() * (stageSize.width - 60) + 30,
            y: Math.random() * (stageSize.height - 60) + 30,
            fontSize: 40,
        };
        setStickers([...stickers, newSticker]);
        setSelectedId(newSticker.id);
    };

    const handleDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
        const pos = { x: e.target.x(), y: e.target.y() };
        setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, ...pos } : t)));
        setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, ...pos } : s)));
    };

    const handleDoubleClick = (id: string) => {
        const textNode = texts.find((t) => t.id === id);
        if (textNode) {
            setEditingText(id);
            setEditValue(textNode.text);
        }
    };

    const finishEditing = () => {
        if (editingText) {
            setTexts((prev) => prev.map((t) => (t.id === editingText ? { ...t, text: editValue } : t)));
            setEditingText(null);
            setEditValue("");
        }
    };

    const deleteSelected = () => {
        if (selectedId) {
            setTexts((prev) => prev.filter((t) => t.id !== selectedId));
            setStickers((prev) => prev.filter((s) => s.id !== selectedId));
            setSelectedId(null);
        }
    };

    const handleExport = () => {
        if (!stageRef.current) return;
        const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
        const link = document.createElement("a");
        link.download = "edited-memory.png";
        link.href = uri;
        link.click();
    };

    const reset = () => {
        setTexts([]);
        setStickers([]);
        setSelectedId(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-[#fdfaf6] rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="sticky top-0 bg-[#fdfaf6] border-b border-[#e8ded2] p-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-serif text-[#2d2d2d]">✏️ Edit Image</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={reset} className="p-2 hover:bg-[#e8ded2] rounded-lg transition" title="Reset">
                            <RotateCcw size={18} className="text-gray-500" />
                        </button>
                        <button onClick={deleteSelected} disabled={!selectedId} className="p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-30" title="Delete selected">
                            <Trash2 size={18} className="text-red-500" />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-[#e8ded2] rounded-lg transition">
                            <X size={18} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-3 bg-[#f3efe7] rounded-xl p-3">
                        {/* Add Text */}
                        <button
                            onClick={addText}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition text-sm"
                        >
                            <Type size={16} className="text-[#8b3a3a]" /> Add Text
                        </button>

                        {/* Font Size */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Size:</span>
                            <input
                                type="range"
                                min="12"
                                max="72"
                                value={currentFontSize}
                                onChange={(e) => {
                                    const size = parseInt(e.target.value);
                                    setCurrentFontSize(size);
                                    if (selectedId) {
                                        setTexts((prev) => prev.map((t) => (t.id === selectedId ? { ...t, fontSize: size } : t)));
                                    }
                                }}
                                className="w-20 accent-[#8b3a3a]"
                            />
                            <span className="text-xs text-gray-500 w-6">{currentFontSize}</span>
                        </div>

                        {/* Colors */}
                        <div className="flex items-center gap-1">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        setCurrentColor(color);
                                        if (selectedId) {
                                            setTexts((prev) => prev.map((t) => (t.id === selectedId ? { ...t, fill: color } : t)));
                                        }
                                    }}
                                    className={`w-6 h-6 rounded-full border-2 transition ${
                                        currentColor === color ? "border-[#8b3a3a] scale-110" : "border-gray-200"
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Stickers */}
                    <div className="flex flex-wrap items-center gap-2 bg-[#f3efe7] rounded-xl p-3">
                        <Smile size={16} className="text-[#8b3a3a]" />
                        <span className="text-xs text-gray-400 mr-1">Stickers:</span>
                        {STICKERS.map((emoji, i) => (
                            <button
                                key={i}
                                onClick={() => addSticker(emoji)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition text-lg hover:scale-125"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>

                    {/* Canvas */}
                    <div
                        ref={containerRef}
                        className="flex justify-center bg-gray-100 rounded-xl overflow-hidden"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setSelectedId(null);
                        }}
                    >
                        {image && (
                            <Stage
                                ref={stageRef}
                                width={stageSize.width}
                                height={stageSize.height}
                                onClick={(e) => {
                                    if (e.target === e.target.getStage()) setSelectedId(null);
                                }}
                            >
                                <Layer>
                                    <KonvaImage
                                        image={image}
                                        width={stageSize.width}
                                        height={stageSize.height}
                                    />

                                    {texts.map((t) => (
                                        <KonvaText
                                            key={t.id}
                                            id={t.id}
                                            text={t.text}
                                            x={t.x}
                                            y={t.y}
                                            fontSize={t.fontSize}
                                            fill={t.fill}
                                            fontFamily={t.fontFamily}
                                            draggable
                                            onClick={() => setSelectedId(t.id)}
                                            onTap={() => setSelectedId(t.id)}
                                            onDblClick={() => handleDoubleClick(t.id)}
                                            onDblTap={() => handleDoubleClick(t.id)}
                                            onDragEnd={(e) => handleDragEnd(t.id, e)}
                                            stroke={selectedId === t.id ? "#8b3a3a" : undefined}
                                            strokeWidth={selectedId === t.id ? 1 : 0}
                                            shadowColor={t.fill === "#000000" ? "transparent" : "rgba(0,0,0,0.5)"}
                                            shadowBlur={4}
                                            shadowOffsetX={1}
                                            shadowOffsetY={1}
                                        />
                                    ))}

                                    {stickers.map((s) => (
                                        <KonvaText
                                            key={s.id}
                                            id={s.id}
                                            text={s.text}
                                            x={s.x}
                                            y={s.y}
                                            fontSize={s.fontSize}
                                            draggable
                                            onClick={() => setSelectedId(s.id)}
                                            onTap={() => setSelectedId(s.id)}
                                            onDragEnd={(e) => handleDragEnd(s.id, e)}
                                        />
                                    ))}
                                </Layer>
                            </Stage>
                        )}
                    </div>

                    {/* Text Edit Input */}
                    {editingText && (
                        <div className="flex items-center gap-2 bg-[#f3efe7] rounded-lg p-3">
                            <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && finishEditing()}
                                autoFocus
                                className="flex-1 bg-white px-4 py-2 rounded-lg border border-[#d8c7be] focus:outline-none focus:border-[#8b3a3a] text-[#2d2d2d]"
                                placeholder="Enter text..."
                            />
                            <button onClick={finishEditing} className="px-4 py-2 bg-[#8b3a3a] text-white rounded-lg text-sm">
                                Done
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-[#fdfaf6] border-t border-[#e8ded2] p-4 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 text-sm text-gray-500">Close</button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExport}
                        className="flex items-center gap-2 px-6 py-2 bg-[#8b3a3a] text-white rounded-lg shadow-md text-sm"
                    >
                        <Download size={14} /> Save Image
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ImageEditor;

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const AlbumCard = ({ album }: any) => {
    const [fav, setFav] = useState(false);

    return (
        <motion.div
            whileHover={{ rotate: [0, 2, -2, 0], scale: 1.05 }}
            className="bg-white p-3 shadow-lg relative cursor-pointer"
        >

            {/* Image */}
            <div className="h-40 bg-gray-200"></div>

            {/* Heart */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setFav(!fav);
                }}
                className="absolute top-3 right-3 cursor-pointer"
            >
                <Heart
                    size={18}
                    className={fav ? "text-red-500 fill-red-500" : "text-gray-400"}
                />
            </div>

            {/* Text */}
            <div className="mt-3">
                <p className="text-sm font-semibold">{album.title}</p>
                <p className="text-xs text-gray-400">{album.year}</p>
            </div>

        </motion.div>
    );
};

export default AlbumCard;
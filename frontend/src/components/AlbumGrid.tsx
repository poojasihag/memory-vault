import Masonry from "react-masonry-css";
import AlbumCard from "./AlbumCard";

interface AlbumGridProps {
    albums: any[];
    onAlbumClick: (album: any) => void;
    onFavoriteToggle?: (albumId: string, newState: boolean) => void;
    showTrashBadge?: boolean;
    emptyMessage?: string;
    emptyIcon?: string;
}

const breakpointColumns = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1,
};

const AlbumGrid = ({
    albums,
    onAlbumClick,
    onFavoriteToggle,
    showTrashBadge,
    emptyMessage = "No albums yet",
    emptyIcon = "📷",
}: AlbumGridProps) => {
    if (albums.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-6xl mb-4 opacity-40">{emptyIcon}</span>
                <p className="text-gray-400 text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
        >
            {albums.map((album) => (
                <AlbumCard
                    key={album.id}
                    album={album}
                    onClick={() => onAlbumClick(album)}
                    onFavoriteToggle={onFavoriteToggle}
                    showTrashBadge={showTrashBadge}
                />
            ))}
        </Masonry>
    );
};

export default AlbumGrid;

import { useState, useEffect } from "react";
import { Menu, Loader2, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AlbumGrid from "../components/AlbumGrid";
import AlbumDetail from "../components/AlbumDetail";
import CreateAlbumModal from "../components/CreateAlbumModal";
import Templates from "../components/Templates";
import TrashView from "../components/TrashView";
import ProfileView from "../components/ProfileView";
import ImageEditor from "../components/ImageEditor";
import { getAlbumsApi, getFavoritesApi } from "../api/albums";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";

const Dashboard = () => {
    const { user } = useAuthStore();
    const [activePage, setActivePage] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    // Album data
    const [albums, setAlbums] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Album detail
    const [selectedAlbum, setSelectedAlbum] = useState<any>(null);

    // Image editor
    const [editorImage, setEditorImage] = useState<string | null>(null);

    // Search
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [albumsRes, favsRes] = await Promise.all([
                getAlbumsApi(),
                getFavoritesApi(),
            ]);
            setAlbums(albumsRes.data);
            setFavorites(favsRes.data);
        } catch {
            toast.error("Failed to load albums");
        } finally { setLoading(false); }
    };

    const handleAlbumClick = (album: any) => {
        setSelectedAlbum(album);
    };

    const handleFavoriteToggle = (albumId: string, newState: boolean) => {
        // Update local state
        setAlbums((prev) => prev.map((a) => (a.id === albumId ? { ...a, isFavorite: newState } : a)));
        if (newState) {
            const album = albums.find((a) => a.id === albumId);
            if (album && !favorites.find((f) => f.id === albumId)) {
                setFavorites((prev) => [{ ...album, isFavorite: true }, ...prev]);
            }
        } else {
            setFavorites((prev) => prev.filter((a) => a.id !== albumId));
        }
    };

    const handleAlbumCreated = () => {
        fetchData();
        setActivePage("albums");
    };

    const handleAlbumDeleted = () => {
        setSelectedAlbum(null);
        fetchData();
    };

    const filteredAlbums = searchQuery
        ? albums.filter((a) =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : albums;

    const recentAlbums = albums.slice(0, 6);

    const renderContent = () => {
        // If viewing album detail
        if (selectedAlbum) {
            return (
                <AlbumDetail
                    albumId={selectedAlbum.id}
                    onBack={() => setSelectedAlbum(null)}
                    onDeleted={handleAlbumDeleted}
                    onOpenEditor={(url) => setEditorImage(url)}
                />
            );
        }

        switch (activePage) {
            case "dashboard":
                return (
                    <div className="animate-fadeIn">
                        <p className="text-[#8b3a3a] text-lg" style={{ fontFamily: "cursive" }}>
                            Welcome back, {user?.name || "curator"}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-serif text-[#2d2d2d] mt-1">
                            Your Recent Collections
                        </h1>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 size={32} className="animate-spin text-[#8b3a3a]" />
                            </div>
                        ) : (
                            <div className="mt-8">
                                <AlbumGrid
                                    albums={recentAlbums}
                                    onAlbumClick={handleAlbumClick}
                                    onFavoriteToggle={handleFavoriteToggle}
                                    emptyMessage="No memories yet. Create your first album!"
                                    emptyIcon="🍃"
                                    onAddNew={() => setCreateModalOpen(true)}
                                />
                            </div>
                        )}
                    </div>
                );

            case "albums":
                return (
                    <div className="animate-fadeIn">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h1 className="text-3xl font-serif text-[#2d2d2d]">All Albums</h1>

                            {/* Search */}
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="text"
                                    placeholder="Search albums..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b3a3a]/30 text-sm text-[#2d2d2d] shadow-sm w-full sm:w-64"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 size={32} className="animate-spin text-[#8b3a3a]" />
                            </div>
                        ) : (
                            <AlbumGrid
                                albums={filteredAlbums}
                                onAlbumClick={handleAlbumClick}
                                onFavoriteToggle={handleFavoriteToggle}
                                emptyMessage={searchQuery ? "No albums match your search" : "No albums yet"}
                                emptyIcon={searchQuery ? "🔍" : "📷"}
                                onAddNew={!searchQuery ? () => setCreateModalOpen(true) : undefined}
                            />
                        )}
                    </div>
                );

            case "favorites":
                return (
                    <div className="animate-fadeIn">
                        <h1 className="text-3xl font-serif text-[#2d2d2d] mb-6">
                            ❤️ Favorites
                        </h1>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 size={32} className="animate-spin text-[#8b3a3a]" />
                            </div>
                        ) : (
                            <AlbumGrid
                                albums={favorites}
                                onAlbumClick={handleAlbumClick}
                                onFavoriteToggle={handleFavoriteToggle}
                                emptyMessage="No favorites yet. Tap the heart on an album!"
                                emptyIcon="💕"
                            />
                        )}
                    </div>
                );

            case "templates":
                return <Templates onAlbumCreated={handleAlbumCreated} />;

            case "trash":
                return <TrashView />;

            case "profile":
                return <ProfileView />;

            default:
                return null;
        }
    };

    return (
        <div className="flex bg-[#f3efe7] min-h-screen">
            {/* Sidebar */}
            <Sidebar
                open={sidebarOpen}
                active={activePage}
                setActive={(page) => { setActivePage(page); setSelectedAlbum(null); }}
                onClose={() => setSidebarOpen(false)}
                onAddNew={() => setCreateModalOpen(true)}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {/* Mobile Header */}
                <div className="sticky top-0 bg-[#f3efe7]/80 backdrop-blur-md z-30 px-4 py-3 flex items-center justify-between md:hidden border-b border-[#e8ded2]">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 hover:bg-white rounded-lg transition"
                    >
                        <Menu size={20} className="text-[#5c5248]" />
                    </button>
                    <h1 className="font-serif text-[#8b3a3a]">The Vault</h1>
                    <div className="w-9" /> {/* Spacer */}
                </div>

                {/* Content */}
                <div className="px-4 sm:px-8 md:px-12 py-6 md:py-8">
                    {renderContent()}
                </div>
            </div>

            {/* Create Album Modal */}
            <CreateAlbumModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreated={handleAlbumCreated}
            />

            {/* Image Editor */}
            {editorImage && (
                <ImageEditor
                    imageUrl={editorImage}
                    onClose={() => setEditorImage(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;
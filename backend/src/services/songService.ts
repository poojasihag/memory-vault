import axios from "axios";

interface DeezerTrack {
    id: number;
    title: string;
    artist: { name: string };
    album: { title: string; cover_medium: string };
    preview: string; // 30-second preview URL
    duration: number;
}

interface SongResult {
    id: number;
    title: string;
    artist: string;
    album: string;
    coverUrl: string;
    previewUrl: string;
    duration: number;
}

export const searchSongs = async (query: string): Promise<SongResult[]> => {
    if (!query || query.trim().length === 0) {
        return [];
    }

    const response = await axios.get(`https://api.deezer.com/search`, {
        params: { q: query, limit: 10 },
    });

    const tracks: DeezerTrack[] = response.data.data || [];

    return tracks.map((track) => ({
        id: track.id,
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        coverUrl: track.album.cover_medium,
        previewUrl: track.preview,
        duration: track.duration,
    }));
};

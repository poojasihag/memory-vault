import axios from "axios";

interface iTunesTrack {
    trackId: number;
    trackName: string;
    artistName: string;
    collectionName: string;
    artworkUrl100: string;
    previewUrl: string; // 30-second preview URL (.m4a)
    trackTimeMillis: number;
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

    const response = await axios.get(`https://itunes.apple.com/search`, {
        params: {
            term: query,
            media: "music",
            entity: "song",
            limit: 10,
        },
    });

    const tracks: iTunesTrack[] = (response.data.results || []).filter(
        (item: iTunesTrack) => item.previewUrl
    );

    return tracks.map((track) => ({
        id: track.trackId,
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName || "Unknown Album",
        coverUrl: track.artworkUrl100,
        previewUrl: track.previewUrl,
        duration: Math.round((track.trackTimeMillis || 0) / 1000),
    }));
};

import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/songs`,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface SongResult {
    id: number;
    title: string;
    artist: string;
    album: string;
    coverUrl: string;
    previewUrl: string;
    duration: number;
}

export const searchSongsApi = (query: string) => {
    return API.get<SongResult[]>("/search", { params: { q: query } });
};

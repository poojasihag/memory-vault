import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/albums`,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Create album with images
export const createAlbumApi = (formData: FormData) => {
    return API.post("/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// Get all albums
export const getAlbumsApi = () => {
    return API.get("/");
};

// Get single album
export const getAlbumByIdApi = (id: string) => {
    return API.get(`/${id}`);
};

// Update album metadata
export const updateAlbumApi = (id: string, data: any) => {
    return API.put(`/${id}`, data);
};

// Toggle favorite
export const toggleFavoriteApi = (id: string) => {
    return API.patch(`/${id}/favorite`);
};

// Get favorites
export const getFavoritesApi = () => {
    return API.get("/favorites");
};

// Soft delete (move to trash)
export const deleteAlbumApi = (id: string) => {
    return API.delete(`/${id}`);
};

// Get trash
export const getTrashApi = () => {
    return API.get("/trash");
};

// Restore from trash
export const restoreAlbumApi = (id: string) => {
    return API.post(`/${id}/restore`);
};

// Permanent delete
export const permanentDeleteApi = (id: string) => {
    return API.delete(`/${id}/permanent`);
};

// Add images to album
export const addImagesApi = (id: string, formData: FormData) => {
    return API.post(`/${id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// Remove single image
export const removeImageApi = (imageId: string) => {
    return API.delete(`/images/${imageId}`);
};

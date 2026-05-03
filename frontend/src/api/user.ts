import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/user`,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getProfileApi = () => {
    return API.get("/profile");
};

export const updateProfileApi = (formData: FormData) => {
    return API.put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

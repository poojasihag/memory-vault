import { create } from "zustand";

interface User {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: User) => void;
    setUser: (user: User) => void;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,

    setAuth: (token: string, user: User) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({ token, user, isAuthenticated: true });
    },

    setUser: (user: User) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null, isAuthenticated: false });
    },

    initialize: () => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                set({ token, user, isAuthenticated: true });
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
    },
}));

import type { User } from "../types/auth.types";
import {create} from 'zustand';

interface AuthState {
    user : User | null;
    isLoading: boolean;

    setUser: (user: User) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({

    user: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user) => {
        set({
            user,
        });
    },

    clearAuth: () => {
        set({
            user: null,
        });
    },

    setLoading: (loading) => {
        set({
            isLoading: loading
        });
    }
}));
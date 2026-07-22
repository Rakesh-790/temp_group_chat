import type { User } from "../types/auth.types";
import {create} from 'zustand';

interface AuthState {
    user : User | null;
    isAuthenticated: boolean;
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
            isAuthenticated: true
        });
    },

    clearAuth: () => {
        set({
            user: null,
            isAuthenticated: false
        });
    },

    setLoading: (loading) => {
        set({
            isLoading: loading
        });
    }
}));
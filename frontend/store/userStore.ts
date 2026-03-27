import { create } from 'zustand';
import type { User, UserRole } from '@/lib/types';
import { MOCK_USERS } from '@/lib/mockService';

interface UserState {
    users: User[];
    /** Currently authenticated simulated user (separate from AuthContext) */
    currentUser: User | null;

    // ── Actions ─────────────────────────────────────────────────────────────
    hydrate: (users: User[]) => void;
    setCurrentUser: (user: User | null) => void;
    updateUserRole: (id: string, role: UserRole) => void;
    removeUser: (id: string) => void;
}

export const useUserStore = create<UserState>()((set) => ({
    users: MOCK_USERS,
    currentUser: null,

    hydrate: (users) => set({ users }),

    setCurrentUser: (user) => set({ currentUser: user }),

    updateUserRole: (id, role) =>
        set(state => ({
            users: state.users.map(u => u.id === id ? { ...u, role } : u),
        })),

    removeUser: (id) =>
        set(state => ({
            users: state.users.filter(u => u.id !== id),
        })),
}));

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectUsersByRole = (role: UserRole) => (s: UserState) =>
    s.users.filter(u => u.role === role);

export const selectUserCount = (s: UserState) => s.users.length;

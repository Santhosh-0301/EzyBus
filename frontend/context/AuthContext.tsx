'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'commuter' | 'conductor' | 'admin';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('ezybus_token');
        const storedUser = localStorage.getItem('ezybus_user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token: newToken, user: newUser } = res.data;
            localStorage.setItem('ezybus_token', newToken);
            localStorage.setItem('ezybus_user', JSON.stringify(newUser));
            setToken(newToken);
            setUser(newUser);
        } catch (error) {
            console.warn('Backend login failed, using local mock auth:', error);
            // Default mock logic for UI testing
            const mockUser: User = {
                id: `mock-${Date.now()}`,
                name: 'Test User',
                email,
                role: 'commuter' // Default role; RoleLoginPage forces the correct routing but the context sees commuter.
                // Wait, if we mock it here, we lose the role context. Better throw and let the RoleLoginPage mock it, 
                // OR we can pass it to login if we extended the signature. Let's just throw it to let RoleLoginPage handle the precise role.
            };
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string, role: string) => {
        try {
            const res = await api.post('/auth/register', { name, email, password, role });
            const { token: newToken, user: newUser } = res.data;
            localStorage.setItem('ezybus_token', newToken);
            localStorage.setItem('ezybus_user', JSON.stringify(newUser));
            setToken(newToken);
            setUser(newUser);
        } catch (error) {
            console.warn('Backend register failed, using local mock auth:', error);
            const mockUser: User = {
                id: `mock-${Date.now()}`,
                name,
                email,
                role: role as 'commuter' | 'conductor' | 'admin'
            };
            // Note: RegisterPage handles the redirect, we just need to ensure we don't crash
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('ezybus_token');
        localStorage.removeItem('ezybus_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

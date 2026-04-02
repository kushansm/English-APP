'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface User {
    id: number;
    name: string;
    email: string;
    profile_completed?: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfileStatus: (completed: boolean) => void;
    updateUser: (name: string) => void;
    restartOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Restore session from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        if (storedToken && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
            // Sync cookies for middleware
            document.cookie = `auth_token=${storedToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
            document.cookie = `profile_completed=${parsedUser.profile_completed ? 'true' : 'false'}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
        setIsLoading(false);
    }, []);

    const persistSession = (user: User, token: string, profile_completed: boolean) => {
        const userWithProfile = { ...user, profile_completed };
        setUser(userWithProfile);
        setToken(token);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(userWithProfile));
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        document.cookie = `profile_completed=${profile_completed ? 'true' : 'false'}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    };

    const updateProfileStatus = (completed: boolean) => {
        if (user) {
            const updatedUser = { ...user, profile_completed: completed };
            setUser(updatedUser);
            localStorage.setItem('auth_user', JSON.stringify(updatedUser));
            document.cookie = `profile_completed=${completed ? 'true' : 'false'}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
    };

    const updateUser = (name: string) => {
        if (user) {
            const updatedUser = { ...user, name };
            setUser(updatedUser);
            localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        }
    };

    const clearSession = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        document.cookie = 'auth_token=; path=/; max-age=0';
        document.cookie = 'profile_completed=; path=/; max-age=0';
    };

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.errors?.email?.[0] || 'Login failed');
        persistSession(data.user, data.token, data.profile_completed);

        if (data.profile_completed) {
            router.push('/dashboard');
        } else {
            router.push('/onboarding');
        }
    };

    const register = async (name: string, email: string, password: string) => {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ name, email, password, password_confirmation: password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.errors?.email?.[0] || 'Registration failed');
        persistSession(data.user, data.token, data.profile_completed);
        router.push('/onboarding');
    };

    const logout = async () => {
        if (token) {
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
            }).catch(() => { });
        }
        clearSession();
        router.push('/login');
    };

    const restartOnboarding = async () => {
        if (token) {
            await fetch(`${API_BASE}/onboarding/restart`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
            });
            updateProfileStatus(false);
            router.push('/onboarding');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateProfileStatus, updateUser, restartOnboarding }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

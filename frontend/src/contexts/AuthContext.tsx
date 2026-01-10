'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    email: string;
    role: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API URL for auth requests (uses Next.js proxy)
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Refresh 5 minutes before token expires
const REFRESH_BUFFER_MS = 5 * 60 * 1000;

// Helper to read cookie value
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setIsAuthenticated(true);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        }
    }, []);

    // Refresh token and schedule next refresh
    const refreshSession = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setIsAuthenticated(true);
                scheduleRefresh();
                fetchUser();
            } else {
                setIsAuthenticated(false);
                setUser(null);
                clearScheduledRefresh();
            }
        } catch {
            setIsAuthenticated(false);
            setUser(null);
            clearScheduledRefresh();
        }
    }, [fetchUser]);

    // Schedule next refresh based on tokenExpiresAt cookie
    const scheduleRefresh = useCallback(() => {
        clearScheduledRefresh();

        const expiresAtStr = getCookie('tokenExpiresAt');
        if (!expiresAtStr) return;

        const expiresAt = parseInt(expiresAtStr, 10);
        const now = Date.now();
        const timeUntilRefresh = expiresAt - now - REFRESH_BUFFER_MS;

        if (timeUntilRefresh > 0) {
            // Schedule refresh 5 minutes before expiration
            refreshTimerRef.current = setTimeout(() => {
                refreshSession();
            }, timeUntilRefresh);
        } else if (expiresAt > now) {
            // Token still valid but less than buffer time left, refresh now
            refreshSession();
        }
    }, [refreshSession]);

    const clearScheduledRefresh = () => {
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
        }
    };

    // Initial session validation and timer setup
    useEffect(() => {
        const initializeAuth = async () => {
            const expiresAtStr = getCookie('tokenExpiresAt');

            if (!expiresAtStr) {
                // No token, try to refresh (maybe refreshToken cookie exists)
                await refreshSession();
                return;
            }

            const expiresAt = parseInt(expiresAtStr, 10);
            const now = Date.now();

            if (expiresAt > now) {
                // Token still valid, just set authenticated and schedule refresh
                setIsAuthenticated(true);
                scheduleRefresh();
                fetchUser(); 
            } else {
                // Token expired, try to refresh with refreshToken
                await refreshSession();
            }
        };

        initializeAuth();
        return () => clearScheduledRefresh();
    }, [refreshSession, scheduleRefresh, fetchUser]);

    const logout = async () => {
        clearScheduledRefresh();
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            router.push('/admin/login');
            router.refresh();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

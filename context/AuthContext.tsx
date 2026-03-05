'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import api from '@/services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    console.log('AuthProvider State:', { user: user?.email, loading, isAuthenticated: !!user });

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/users/me');
                if (response.data.status === 'success') {
                    setUser(response.data.data.user);
                }
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem('token', token);
        setUser(user);
    };

    const logout = () => {
        // 1. Immediate UI update (Optimistic)
        localStorage.removeItem('token');
        setUser(null);

        // 2. Background cleanup (non-blocking)
        api.get('/auth/logout').catch(err => {
            console.error('Logout background cleanup failed', err);
        });

        // 3. Handle redirects instantly
        if (typeof window !== 'undefined') {
            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/login';
            } else {
                // For store pages, we can either stay on home or redirect to home if on a protected route
                const protectedRoutes = ['/profile', '/orders', '/wishlist', '/checkout'];
                if (protectedRoutes.some(route => window.location.pathname.startsWith(route))) {
                    window.location.href = '/';
                }
            }
        }
    };

    const updateUser = (user: User) => {
        setUser(user);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

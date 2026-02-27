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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

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

    const logout = async () => {
        // Optimistic update: clear state immediately for better perceived performance
        localStorage.removeItem('token');
        setUser(null);

        try {
            await api.get('/auth/logout');
        } catch (err) {
            console.error('Logout error (background)', err);
            // We don't need to revert state here as logout is a terminal operation for the session
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

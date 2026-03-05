'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '@/services/api';
import { toast } from 'react-hot-toast';

interface WishlistContextType {
    wishlist: any[];
    loading: boolean;
    toggleWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setWishlist([]);
            setWishlistIds([]);
        }
    }, [isAuthenticated]);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/wishlist');
            if (response.data.status === 'success') {
                const items = response.data.data.wishlist;
                setWishlist(items);
                setWishlistIds(items.map((item: any) => item._id));
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async (productId: string) => {
        if (!isAuthenticated) {
            toast.error('Please login to manage wishlist');
            return;
        }

        try {
            const response = await api.patch('/users/wishlist', { productId });
            if (response.data.status === 'success') {
                const newIds = response.data.data.wishlist;
                const wasAdded = newIds.length > wishlistIds.length;

                setWishlistIds(newIds);

                if (wasAdded) {
                    toast.success('Added to wishlist');
                } else {
                    toast.success('Removed from wishlist');
                }

                // Refresh full wishlist data to keep UI in sync
                fetchWishlist();
            }
        } catch (error) {
            toast.error('Failed to update wishlist');
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlistIds.includes(productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
    return context;
};

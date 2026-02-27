'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService, CartItem, CartData } from '@/services/cartService';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface CartContextType {
    items: CartItem[];
    totalPrice: number;
    totalQuantity: number;
    loading: boolean;
    addItem: (productId: string, quantity: number, size?: string, color?: string) => Promise<void>;
    updateItemQuantity: (productId: string, quantity: number, size?: string, color?: string) => Promise<void>;
    removeItem: (productId: string, size?: string, color?: string) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [loading, setLoading] = useState(true);

    const updateLocalState = (cart: CartData) => {
        setItems(cart.items);
        setTotalPrice(cart.totalPrice);
        const qty = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        setTotalQuantity(qty);
    };

    const refreshCart = useCallback(async () => {
        if (!isAuthenticated) {
            // guest cart persistence in localStorage could be added here
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await cartService.getCart();
            updateLocalState(response.data.cart);
        } catch (error) {
            console.error('Failed to fetch cart', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addItem = async (productId: string, quantity: number, size?: string, color?: string) => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            return;
        }

        try {
            const response = await cartService.addToCart(productId, quantity, size, color);
            updateLocalState(response.data.cart);
            toast.success('Added to cart');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add item');
        }
    };

    const updateItemQuantity = async (productId: string, quantity: number, size?: string, color?: string) => {
        try {
            const response = await cartService.updateQuantity(productId, quantity, size, color);
            updateLocalState(response.data.cart);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update quantity');
        }
    };

    const removeItem = async (productId: string, size?: string, color?: string) => {
        try {
            const response = await cartService.removeItem(productId, size, color);
            updateLocalState(response.data.cart);
            toast.success('Removed from cart');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to remove item');
        }
    };

    const clearCart = async () => {
        try {
            await cartService.clearCart();
            setItems([]);
            setTotalPrice(0);
            setTotalQuantity(0);
        } catch (error: any) {
            toast.error('Failed to clear cart');
        }
    };

    return (
        <CartContext.Provider
            value={{
                items,
                totalPrice,
                totalQuantity,
                loading,
                addItem,
                updateItemQuantity,
                removeItem,
                clearCart,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};

import api from './api';
import { Product, ApiResponse } from '@/types';

export interface CartItem {
    product: Product;
    quantity: number;
    size?: string;
    color?: string;
    price: number;
}

export interface CartData {
    items: CartItem[];
    totalPrice: number;
}

export const cartService = {
    /**
     * Get user's cart
     */
    async getCart() {
        const response = await api.get<ApiResponse<{ cart: CartData }>>('/cart');
        return response.data;
    },

    /**
     * Add item to cart
     */
    async addToCart(productId: string, quantity: number, size?: string, color?: string) {
        const response = await api.post<ApiResponse<{ cart: CartData }>>('/cart/add', {
            productId,
            quantity,
            size,
            color,
        });
        return response.data;
    },

    /**
     * Update item quantity
     */
    async updateQuantity(productId: string, quantity: number, size?: string, color?: string) {
        const response = await api.patch<ApiResponse<{ cart: CartData }>>('/cart/update', {
            productId,
            quantity,
            size,
            color,
        });
        return response.data;
    },

    /**
     * Remove item from cart
     */
    async removeItem(productId: string, size?: string, color?: string) {
        const response = await api.delete<ApiResponse<{ cart: CartData }>>('/cart/remove', {
            data: { productId, size, color },
        });
        return response.data;
    },

    /**
     * Clear cart
     */
    async clearCart() {
        await api.delete('/cart/clear');
    },
};

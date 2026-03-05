import api from './api';
import { ApiResponse } from '@/types';

export interface OrderItem {
    name: string;
    quantity: number;
    image: string;
    price: number;
    size?: string;
    color?: string;
    product: string;
}

export interface ShippingAddress {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface Order {
    _id: string;
    user: string;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    orderStatus: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    createdAt: string;
}

export const orderService = {
    /**
     * Create new order
     */
    async createOrder(orderData: {
        shippingAddress: ShippingAddress;
        paymentMethod: string;
        couponCode?: string;
        deliveryOption?: string;
    }) {
        const response = await api.post<ApiResponse<{ order: Order }>>('/orders', orderData);
        return response.data;
    },

    /**
     * Get user's order history
     */
    async getMyOrders() {
        const response = await api.get<ApiResponse<{ orders: Order[] }>>('/orders/myorders');
        return response.data;
    },

    /**
     * Get order details by ID
     */
    async getOrderById(id: string) {
        const response = await api.get<ApiResponse<{ order: Order }>>(`/orders/${id}`);
        return response.data;
    },

    /**
     * Cancel an order
     */
    async cancelOrder(id: string, reason?: string) {
        const response = await api.patch<ApiResponse<{ order: Order }>>(`/orders/${id}/cancel`, { reason });
        return response.data;
    },

    /**
     * Request a return for an order
     */
    async requestReturn(id: string, reason?: string) {
        const response = await api.patch<ApiResponse<{ order: Order }>>(`/orders/${id}/return`, { reason });
        return response.data;
    }
};

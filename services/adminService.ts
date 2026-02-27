import api from './api';
import { Product, Category, ApiResponse } from '@/types';
import { Order } from './orderService';

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    recentOrders: Order[];
}

export const adminService = {
    /**
     * Dashboard stats
     */
    async getStats() {
        const response = await api.get<ApiResponse<DashboardStats>>('/admin/stats');
        return response.data;
    },

    /**
     * Product Management
     */
    async createProduct(productData: any) {
        // If productData is FormData, axios handles everything automatically
        const response = await api.post<ApiResponse<{ product: Product }>>('/products', productData, {
            headers: productData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
        });
        return response.data;
    },

    async updateProduct(id: string, productData: any) {
        const response = await api.patch<ApiResponse<{ product: Product }>>(`/products/${id}`, productData, {
            headers: productData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
        });
        return response.data;
    },

    async deleteProduct(id: string) {
        await api.delete(`/products/${id}`);
    },

    /**
     * Category Management
     */
    async getCategories() {
        const response = await api.get<ApiResponse<{ categories: Category[] }>>('/categories');
        return response.data;
    },

    async createCategory(name: string) {
        const response = await api.post<ApiResponse<{ category: Category }>>('/categories', { name });
        return response.data;
    },

    async updateCategory(id: string, name: string) {
        const response = await api.patch<ApiResponse<{ category: Category }>>(`/categories/${id}`, { name });
        return response.data;
    },

    async deleteCategory(id: string) {
        await api.delete(`/categories/${id}`);
    },

    /**
     * Order Management
     */
    async getAllOrders() {
        const response = await api.get<ApiResponse<{ orders: Order[] }>>('/orders');
        return response.data;
    },

    async updateOrderStatus(id: string, statusData: any) {
        const response = await api.patch<ApiResponse<{ order: Order }>>(`/orders/${id}/status`, statusData);
        return response.data;
    },

    /**
     * User/Customer Management
     */
    async getUsers() {
        const response = await api.get<ApiResponse<{ users: any[] }>>('/users');
        return response.data;
    }
};

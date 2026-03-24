import api from '@/services/api';
import { Product, ApiResponse } from '@/types';

export const productService = {
    /**
     * Get all products with query features
     */
    async getAllProducts(query: string = '') {
        const response = await api.get<ApiResponse<{ products: Product[] }>>(`/products?${query}`);
        return response.data;
    },

    /**
     * Get a single product by slug (SEO friendly)
     */
    async getProductBySlug(slug: string) {
        const response = await api.get<ApiResponse<{ product: Product }>>(`/products/slug/${slug}`);
        return response.data;
    },

    /**
     * Get a single product by ID
     */
    async getProductById(id: string) {
        const response = await api.get<ApiResponse<{ product: Product }>>(`/products/${id}`);
        return response.data;
    },

    /**
     * Get all categories
     */
    async getCategories() {
        const response = await api.get<ApiResponse<{ categories: any[] }>>('/categories');
        return response.data;
    },
    /**
     * Get unique filter options
     */
    async getFilterOptions() {
        const response = await api.get<ApiResponse<{
            categories: string[],
            brands: string[],
            colors: string[],
            fabric: string[],
            sizes: string[],
            occasion: string[]
        }>>('/products/filters');
        return response.data;
    }
};

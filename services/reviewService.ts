import api from './api';
import { ApiResponse } from '@/types';

export interface Review {
    _id: string;
    review: string;
    rating: number;
    images: string[];
    user: {
        _id: string;
        name: string;
    };
    product: {
        _id: string;
        name: string;
    } | string;
    isApproved: boolean;
    createdAt: string;
}

export const reviewService = {
    /**
     * Get all reviews for a product
     */
    async getProductReviews(productId: string) {
        const response = await api.get<ApiResponse<{ reviews: Review[] }>>(`/reviews/product/${productId}`);
        return response.data;
    },

    /**
     * Create a new review
     */
    async createReview(reviewData: { product: string; rating: number; review: string; images?: string[] }) {
        const response = await api.post<ApiResponse<{ review: Review }>>('/reviews', reviewData);
        return response.data;
    },

    /**
     * Delete a review
     */
    async deleteReview(reviewId: string) {
        const response = await api.delete<ApiResponse<null>>(`/reviews/${reviewId}`);
        return response.data;
    },

    /**
     * Get all reviews (Admin only)
     */
    async getAllReviews() {
        const response = await api.get<ApiResponse<{ reviews: Review[] }>>('/reviews');
        return response.data;
    },

    /**
     * Toggle approval status (Admin only)
     */
    async toggleApproval(reviewId: string) {
        const response = await api.patch<ApiResponse<{ review: Review }>>(`/reviews/${reviewId}/toggle-approval`);
        return response.data;
    }
};

import api from './api';
import { ApiResponse } from '@/types';

export interface Coupon {
    _id: string;
    code: string;
    discountType: 'percentage' | 'flat';
    discount: number;
    discountAmount?: number; // Calculated absolute discount value from backend
    minCartValue?: number;
    expiryDate: string;
    usageLimit: number;
    usageCount: number;
    isActive: boolean;
}

export const couponService = {
    validateCoupon: async (code: string, cartTotal: number) => {
        const response = await api.post<ApiResponse<Coupon>>('/coupons/validate', { code, cartTotal });
        return response.data;
    },
    getAllCoupons: async () => {
        const response = await api.get<ApiResponse<{ coupons: Coupon[] }>>('/coupons');
        return response.data;
    },
    createCoupon: async (couponData: Partial<Coupon>) => {
        const response = await api.post<ApiResponse<{ coupon: Coupon }>>('/coupons', couponData);
        return response.data;
    },
    deleteCoupon: async (id: string) => {
        const response = await api.delete<ApiResponse<null>>(`/coupons/${id}`);
        return response.data;
    }
};

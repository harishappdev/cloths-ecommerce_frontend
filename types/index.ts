export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    isActive: boolean;
}

export interface Product {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    discountPrice?: number;
    category: string;
    sizes?: string[];
    colors?: string[];
    stock?: number;
    images: string[];
    ratings: number;
    numReviews: number;
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
    size?: string;
    color?: string;
    price: number;
}

export interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
    totalPrice: number;
}

export interface ApiResponse<T> {
    status: 'success' | 'error';
    results?: number;
    data: T;
    message?: string;
}

export interface AuthResponse {
    status: 'success';
    token: string;
    data: {
        user: User;
    };
}

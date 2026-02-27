import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/productService';
import { Product } from '@/types';

export function useProducts(query: string = '') {
    const [products, setProducts] = useState<Product[]>([]);
    const [results, setResults] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await productService.getAllProducts(query);
            console.log('useProducts: SUCCESS', response.data.products?.length, 'products');
            setProducts(response.data.products || []);
            setResults(response.results || 0);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, results, loading, error, refetch: fetchProducts };
}

export function useProduct(slug: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await productService.getProductBySlug(slug);
                setProduct(response.data.product);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    return { product, loading, error };
}

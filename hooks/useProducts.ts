import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/productService';
import { Product } from '@/types';

export function useProducts(query: string = '') {
    const [products, setProducts] = useState<Product[]>([]);
    const [results, setResults] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async (isAppend: boolean = false) => {
        if (isAppend) setIsFetchingMore(true);
        else setLoading(true);

        try {
            const response = await productService.getAllProducts(query);
            if (isAppend) {
                setProducts(prev => [...prev, ...(response.data.products || [])]);
            } else {
                setProducts(response.data.products || []);
            }
            setResults(response.results || 0);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    }, [query]);

    useEffect(() => {
        // If query has page=1 or no page, it's a new search/filter
        const isNewSearch = !query.includes('page=') || query.includes('page=1');
        fetchProducts(!isNewSearch && products.length > 0);
    }, [query]);

    return { products, results, loading, isFetchingMore, error, refetch: fetchProducts };
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

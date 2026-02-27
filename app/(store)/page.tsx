'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    ShoppingCart
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import HomeHero from '@/components/home/HomeHero';
import CategoryGrid from '@/components/home/CategoryGrid';
import FlashSale from '@/components/home/FlashSale';
import { productService } from '@/services/productService';
import { Product } from '@/types';

export default function Home() {
    const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            setLoading(true);
            try {
                const trendingRes = await productService.getAllProducts('limit=4&sort=-createdAt');
                const bestSellersRes = await productService.getAllProducts('limit=4&sort=-ratings');

                if (trendingRes.status === 'success' && trendingRes.data?.products) {
                    setTrendingProducts(trendingRes.data.products);
                }
                if (bestSellersRes.status === 'success' && bestSellersRes.data?.products) {
                    setBestSellers(bestSellersRes.data.products);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <div className="bg-white min-h-screen">
            {/* 1. Hero Section */}
            <HomeHero />

            {/* 2. Shop by Category */}
            <CategoryGrid />

            {/* 3. Trending Now */}
            <section className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold text-black tracking-tight">Trending Now</h2>
                    <Link
                        href="/shop"
                        className="flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:text-blue-700 transition-colors"
                    >
                        <span>View All</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {loading
                        ? Array(4).fill(0).map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl" />
                        ))
                        : trendingProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    }
                </div>
            </section>

            {/* 4. Flash Sale */}
            <FlashSale />

            {/* 5. Best Sellers */}
            <section className="container mx-auto px-4 py-20 pb-40">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold text-black tracking-tight">Best Sellers</h2>
                    <div className="flex items-center gap-3">
                        <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-black hover:border-black transition-all">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-black hover:border-black transition-all">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {loading
                        ? Array(4).fill(0).map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl" />
                        ))
                        : bestSellers.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    }
                </div>
            </section>
        </div>
    );
}

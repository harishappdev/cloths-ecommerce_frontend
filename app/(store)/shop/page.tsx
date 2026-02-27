'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';
import { 
    Search, 
    SlidersHorizontal, 
    ChevronLeft, 
    ChevronRight, 
    X, 
    ChevronRight as ChevronRightIcon,
    Star
} from 'lucide-react';
import { cn } from '@/utils/lib';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
    { name: 'Navy', hex: '#1E293B' },
    { name: 'White', hex: '#FFFFFF', border: true },
    { name: 'Blue', hex: '#2563EB' },
    { name: 'Green', hex: '#059669' },
    { name: 'Orange', hex: '#D97706' },
];

const BRANDS = ['EcoWear', 'Urban Nomad', 'Classic Peak', 'Tailored Fit', 'Luxe Essentials', 'Urban Flow'];

const DUMMY_PRODUCTS = [
    // --- MEN ---
    {
        _id: 'm1',
        name: 'Premium Wool Blazer',
        slug: 'premium-wool-blazer',
        price: 189.00,
        discountPrice: 159.00,
        category: 'Men',
        images: ['https://images.unsplash.com/photo-1543132220-3ce99c5ae93c?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.8,
        numReviews: 250
    },
    {
        _id: 'm2',
        name: 'Essential Cotton Tee',
        slug: 'essential-cotton-tee',
        price: 35.00,
        category: 'Men',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.5,
        numReviews: 180
    },
    {
        _id: 'm3',
        name: 'Modern Slim Trousers',
        slug: 'modern-slim-trousers',
        price: 89.00,
        category: 'Men',
        images: ['https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.7,
        numReviews: 110
    },
    {
        _id: 'm4',
        name: 'Harrington Jacket',
        slug: 'harrington-jacket',
        price: 145.00,
        category: 'Men',
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.9,
        numReviews: 85
    },
    {
        _id: 'm5',
        name: 'Denim Work Shirt',
        slug: 'denim-work-shirt',
        price: 68.00,
        category: 'Men',
        images: ['https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.6,
        numReviews: 120
    },
    {
        _id: 'm6',
        name: 'Cashmere Crewneck',
        slug: 'cashmere-crewneck',
        price: 120.00,
        category: 'Men',
        images: ['https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.8,
        numReviews: 95
    },
    {
        _id: 'm7',
        name: 'Selvedge Denim Jeans',
        slug: 'selvedge-denim-jeans',
        price: 115.00,
        category: 'Men',
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.7,
        numReviews: 210
    },
    {
        _id: 'm8',
        name: 'Storm Shell Parka',
        slug: 'storm-shell-parka',
        price: 199.00,
        category: 'Men',
        images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.9,
        numReviews: 75
    },
    // --- WOMEN ---
    {
        _id: 'w1',
        name: 'Classic Urban Trench',
        slug: 'classic-urban-trench',
        price: 145.00,
        category: 'Women',
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.9,
        numReviews: 128
    },
    {
        _id: 'w2',
        name: 'Satin Luxe Blouse',
        slug: 'satin-luxe-blouse',
        price: 55.00,
        category: 'Women',
        images: ['https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.7,
        numReviews: 85
    },
    {
        _id: 'w3',
        name: 'Summer Solstice Dress',
        slug: 'summer-solstice-dress',
        price: 89.00,
        discountPrice: 79.00,
        category: 'Women',
        images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.8,
        numReviews: 42
    },
    {
        _id: 'w4',
        name: 'Recycled Denim Set',
        slug: 'recycled-denim-set',
        price: 120.00,
        category: 'Women',
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.9,
        numReviews: 210
    },
    {
        _id: 'w5',
        name: 'Cloud-Soft Knit',
        slug: 'cloud-soft-knit',
        price: 75.00,
        category: 'Women',
        images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.6,
        numReviews: 56
    },
    {
        _id: 'w6',
        name: 'Structured Peak Blazer',
        slug: 'structured-peak-blazer',
        price: 198.00,
        category: 'Women',
        images: ['https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.9,
        numReviews: 340
    },
    {
        _id: 'w7',
        name: 'Floral Meadow Maxi',
        slug: 'floral-meadow-maxi',
        price: 65.00,
        discountPrice: 55.00,
        category: 'Women',
        images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.5,
        numReviews: 19
    },
    {
        _id: 'w8',
        name: 'High-Waist Palazzo',
        slug: 'high-waist-palazzo',
        price: 82.00,
        category: 'Women',
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.7,
        numReviews: 41
    },
    // --- KIDS ---
    {
        _id: 'k1',
        name: 'Organic Cotton Set',
        slug: 'organic-cotton-set',
        price: 45.00,
        category: 'Kids',
        images: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.8,
        numReviews: 64
    },
    {
        _id: 'k2',
        name: 'Floral Party Dress',
        slug: 'floral-party-dress',
        price: 68.00,
        category: 'Kids',
        images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.6,
        numReviews: 42
    },
    {
        _id: 'k3',
        name: 'Vintage Tulle Gown',
        slug: 'vintage-tulle-gown',
        price: 38.00,
        category: 'Kids',
        images: ['https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.9,
        numReviews: 88
    },
    {
        _id: 'k4',
        name: 'Linen Spring Dress',
        slug: 'linen-spring-dress',
        price: 32.00,
        discountPrice: 28.00,
        category: 'Kids',
        images: ['https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.7,
        numReviews: 35
    },
    {
        _id: 'k5',
        name: 'Summer Sundress',
        slug: 'summer-sundress',
        price: 24.00,
        category: 'Kids',
        images: ['https://images.unsplash.com/photo-1566516171511-1c411a59c8ba?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.5,
        numReviews: 120
    },
    {
        _id: 'k6',
        name: 'Boho Chic Dress',
        slug: 'boho-chic-dress',
        price: 48.00,
        category: 'Kids',
        images: ['https://images.unsplash.com/photo-1515488442202-6abe64932d12?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.8,
        numReviews: 24
    },
    {
        _id: 'k7',
        name: 'Pastel Garden Dress',
        slug: 'pastel-garden-dress',
        price: 42.00,
        category: 'Kids',
        images: ['https://images.unsplash.com/photo-1503944583220-79d893f41f5d?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.9,
        numReviews: 12
    },
    {
        _id: 'k8',
        name: 'Elegant Lace Dress',
        slug: 'elegant-lace-dress',
        price: 18.00,
        category: 'Kids',
        images: ['https://images.unsplash.com/photo-1513273159383-c7d86e3efebc?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.7,
        numReviews: 95
    },
    // --- FOOTWEAR ---
    {
        _id: 'f1',
        name: 'Air Max Velocity',
        slug: 'air-max-velocity',
        price: 120.00,
        category: 'Footwear',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.9,
        numReviews: 320
    },
    {
        _id: 'f2',
        name: 'Old Skool Core',
        slug: 'old-skool-core',
        price: 60.00,
        category: 'Footwear',
        images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.8,
        numReviews: 410
    },
    {
        _id: 'f3',
        name: 'Ultraboost Pro',
        slug: 'ultraboost-pro',
        price: 180.00,
        category: 'Footwear',
        images: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.9,
        numReviews: 540
    },
    {
        _id: 'f4',
        name: 'Free Run 5.0',
        slug: 'free-run-5-0',
        price: 85.00,
        discountPrice: 65.00,
        category: 'Footwear',
        images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.5,
        numReviews: 210
    },
    {
        _id: 'f5',
        name: 'Classic Suede',
        slug: 'classic-suede',
        price: 75.00,
        category: 'Footwear',
        images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.7,
        numReviews: 125
    },
    {
        _id: 'f6',
        name: 'Earthkeepers Boot',
        slug: 'earthkeepers-boot',
        price: 165.00,
        category: 'Footwear',
        images: ['https://images.unsplash.com/photo-1509223197845-458bb1a25ee9?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.9,
        numReviews: 88
    },
    {
        _id: 'f7',
        name: 'Track Trainer',
        slug: 'track-trainer',
        price: 895.00,
        category: 'Footwear',
        images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.6,
        numReviews: 15
    },
    {
        _id: 'f8',
        name: 'Achilles Low',
        slug: 'achilles-low',
        price: 410.00,
        category: 'Footwear',
        images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800'],
        ratings: 4.9,
        numReviews: 442
    },
];

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Current filters from URL
    const category = searchParams.get('category');
    const sale = searchParams.get('sale') === 'true';
    const sort = searchParams.get('sort') || '-createdAt';
    const page = parseInt(searchParams.get('page') || '1');
    const selectedSizes = searchParams.get('sizes')?.split(',') || [];
    const limit = 12;

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Build API query string
    const queryParts = [`page=${page}`, `limit=${limit}`];
    if (category) queryParts.push(`category=${category}`);
    if (sale) queryParts.push(`sale=true`);
    if (sort) queryParts.push(`sort=${sort}`);
    if (searchParams.get('search')) queryParts.push(`search=${searchParams.get('search')}`);
    
    const queryStr = queryParts.join('&');
    const { products: apiProducts, results: apiResults, loading, error } = useProducts(queryStr);

    // Fallback to dummy data if no results found and not loading/error
    // This allows the user to see the beautiful design even with an empty database
    const showDummyData = !loading && !error && apiProducts.length === 0;
    
    const products = showDummyData 
        ? DUMMY_PRODUCTS.filter(p => !category || p.category === category).filter(p => !sale || p.discountPrice)
        : apiProducts;
    
    const results = showDummyData ? products.length : apiResults;

    const updateParams = (newParams: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null) params.delete(key);
            else params.set(key, value);
        });
        router.push(`/shop?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams({ search: searchQuery || null, page: '1' });
    };

    const toggleSize = (size: string) => {
        const newSizes = selectedSizes.includes(size)
            ? selectedSizes.filter(s => s !== size)
            : [...selectedSizes, size];
        updateParams({ sizes: newSizes.length > 0 ? newSizes.join(',') : null, page: '1' });
    };

    const totalPages = Math.ceil(results / limit);

    const collectionTitle = useMemo(() => {
        if (sale) return "Sale Collection";
        if (category) return `${category}'s Collection`;
        return "All Collection";
    }, [category, sale]);

    if (!mounted) return null;

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumbs & Header */}
            <div className="border-b border-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <nav className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <ChevronRightIcon className="h-3 w-3 mx-2" />
                        <span className="text-black">{category || (sale ? 'Sale' : 'Shop')}</span>
                    </nav>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-2">
                        {collectionTitle}
                    </h1>
                    <p className="text-sm text-gray-500 max-w-xl">
                        Elevate your wardrobe with our curated selection of premium apparel and accessories.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 shrink-0 space-y-10">
                        {/* Search in Sidebar for Mobile/Refinement */}
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-6 flex items-center gap-2">
                                <Search className="h-3 w-3" />
                                Search
                            </h4>
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#F8FAFC] border-none rounded-xl py-3 px-4 text-xs font-medium focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                                    suppressHydrationWarning
                                />
                            </form>
                        </div>

                        {/* Size Filter */}
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-6 flex items-center gap-2">
                                <div className="h-1.5 w-4 bg-[#2563EB] rounded-full" />
                                Size
                            </h4>
                            <div className="grid grid-cols-3 gap-2">
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => toggleSize(size)}
                                        className={cn(
                                            "h-10 flex items-center justify-center rounded-lg border text-[10px] font-black transition-all",
                                            selectedSizes.includes(size)
                                                ? "bg-[#2563EB] border-[#2563EB] text-white shadow-md shadow-blue-200"
                                                : "border-gray-100 bg-white text-gray-500 hover:border-gray-300"
                                        )}
                                        suppressHydrationWarning
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Filter */}
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-6 flex items-center gap-2">
                                <div className="h-1.5 w-4 bg-[#2563EB] rounded-full" />
                                Color
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.name}
                                        title={color.name}
                                        className={cn(
                                            "h-8 w-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 shadow-sm",
                                            color.border ? "border-gray-100" : "border-transparent"
                                        )}
                                        style={{ backgroundColor: color.hex }}
                                        suppressHydrationWarning
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Brand Filter */}
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-6 flex items-center gap-2">
                                <div className="h-1.5 w-4 bg-[#2563EB] rounded-full" />
                                Brand
                            </h4>
                            <div className="space-y-3">
                                {BRANDS.map((brand) => (
                                    <label key={brand} className="flex items-center group cursor-pointer">
                                        <span className="relative flex items-center">
                                            <input type="checkbox" className="peer sr-only" suppressHydrationWarning />
                                            <span className="h-5 w-5 border-2 border-gray-100 rounded-md peer-checked:bg-[#2563EB] peer-checked:border-[#2563EB] transition-all" />
                                            <svg className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-all left-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </span>
                                        <span className="ml-3 text-xs font-bold text-gray-500 group-hover:text-black transition-colors">{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Product List Area */}
                    <div className="flex-grow">
                        {/* Controls */}
                        <div className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <span className="text-xs font-bold text-gray-400">
                                Showing <span className="text-black">{results} results</span>
                            </span>
                            
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort By:</span>
                                    <select
                                        value={sort}
                                        onChange={(e) => updateParams({ sort: e.target.value })}
                                        className="bg-transparent text-xs font-black focus:outline-none border-b-2 border-transparent focus:border-[#2563EB] transition-all pb-1 cursor-pointer"
                                    >
                                        <option value="-createdAt">Newest Arrivals</option>
                                        <option value="price">Price: Low to High</option>
                                        <option value="-price">Price: High to Low</option>
                                        <option value="-ratings">Most Popular</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="aspect-[4/5] bg-[#F8FAFC] rounded-2xl animate-pulse" />
                                        <div className="h-4 w-2/3 bg-[#F8FAFC] rounded animate-pulse" />
                                        <div className="h-4 w-1/3 bg-[#F8FAFC] rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="py-20 text-center">
                                <div className="mb-4 text-red-100 inline-block bg-red-50 p-4 rounded-full">
                                    <X className="h-8 w-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-2">Something went wrong</h3>
                                <p className="text-sm text-gray-500 mb-6">{error}</p>
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="bg-black text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="py-20 text-center bg-[#F8FAFC] rounded-3xl border border-dashed border-gray-200">
                                <div className="mb-4 text-gray-200 inline-block">
                                    <Search className="h-12 w-12" />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-2">No products found</h3>
                                <p className="text-sm text-gray-500 mb-6">Try adjusting your filters or search keywords.</p>
                                <button 
                                    onClick={() => router.push('/shop')}
                                    className="text-xs font-black uppercase tracking-widest text-[#2563EB] hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-20 flex items-center justify-center gap-3">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => updateParams({ page: (page - 1).toString() })}
                                            className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-100 hover:bg-gray-50 disabled:opacity-30 transition-all"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        
                                        {[...Array(totalPages)].map((_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => updateParams({ page: pageNum.toString() })}
                                                    className={cn(
                                                        "h-10 w-10 rounded-lg text-xs font-black transition-all",
                                                        page === pageNum 
                                                            ? "bg-black text-white shadow-lg shadow-gray-200" 
                                                            : "hover:bg-gray-50 border border-transparent hover:border-gray-100"
                                                    )}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}

                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => updateParams({ page: (page + 1).toString() })}
                                            className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-100 hover:bg-gray-50 disabled:opacity-30 transition-all"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white container mx-auto px-4 py-20">
                <div className="h-4 w-24 bg-[#F8FAFC] animate-pulse mb-4" />
                <div className="h-12 w-64 bg-[#F8FAFC] animate-pulse mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-[256px,1fr] gap-12">
                    <div className="space-y-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-40 bg-[#F8FAFC] animate-pulse rounded-2xl" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-80 bg-[#F8FAFC] animate-pulse rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}

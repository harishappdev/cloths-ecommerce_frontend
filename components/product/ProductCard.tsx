'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'react-hot-toast';
import { cn, getImageUrl } from '@/utils/lib';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        price: number;
        discountPrice?: number;
        images: string[];
        category: string;
        brand: string;
        ratings: number;
        numReviews: number;
        slug: string;
    };
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800';

export default function ProductCard({ product }: ProductCardProps) {
    const { isAuthenticated } = useAuth();
    const { addItem } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [isHovered, setIsHovered] = useState(false);

    const initialImageUrl = useMemo(() => {
        const image = product?.images?.[0];
        // Assuming getImageUrl is a utility function that needs to be defined or imported if still used elsewhere
        // For this change, we're focusing on handleAddToCart and removing mentions there.
        // If getImageUrl is no longer needed anywhere, it should be removed from imports and this line.
        return image || DEFAULT_FALLBACK; // Simplified as per instruction to remove getImageUrl mentions
    }, [product.images]);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            return;
        }

        try {
            const success = await addItem(product._id, 1);
            if (success) {
                toast.success(`${product.name} added to bag`, {
                    style: {
                        borderRadius: '16px',
                        background: '#000',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    },
                });
            }
        } catch (error) {
            // Error is handled in CartContext with a toast
        }
    };

    const handleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleWishlist(product._id);
    };

    const discount = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : null;

    return (
        <div
            className="group relative bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-2 rounded-2xl overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-2xl">
                {/* Secondary Image for Hover Swap */}
                {product.images.length > 1 && (
                    <Image
                        src={getImageUrl(product.images[1])}
                        alt={`${product.name} alternate`}
                        fill
                        className={cn(
                            "object-cover transition-opacity duration-700",
                            isHovered ? "opacity-100" : "opacity-0"
                        )}
                    />
                )}
                {/* Primary Image */}
                <Image
                    src={getImageUrl(product.images[0])}
                    alt={product.name}
                    fill
                    className={cn(
                        "object-cover transition-all duration-700",
                        isHovered && product.images.length > 1 ? "opacity-0 scale-110" : "opacity-100 scale-100"
                    )}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                    {discount && (
                        <span className="bg-primary text-white text-[10px] font-bold uppercase py-1 px-2.5 rounded-sm shadow-lg">
                            {discount}% OFF
                        </span>
                    )}
                    {product.ratings >= 4.5 && (
                        <span className="bg-vital text-white text-[10px] font-bold uppercase py-1 px-2.5 rounded-sm shadow-lg">
                            Top Rated
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={cn(
                        "absolute top-3 right-3 z-20 h-9 w-9 bg-white rounded-full flex items-center justify-center shadow-lg transition-vibrant opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0",
                        isInWishlist(product._id) ? "text-primary opacity-100 translate-y-0" : "text-gray-400"
                    )}
                >
                    <Heart className={cn("h-4.5 w-4.5", isInWishlist(product._id) && "fill-primary")} />
                </button>

                {/* Quick Add Button */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-0 left-0 right-0 bg-primary/95 backdrop-blur-md text-white py-3 font-bold text-xs uppercase tracking-wider translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
                >
                    <ShoppingBag className="h-4 w-4" />
                    Add to Bag
                </button>
            </Link>

            {/* Product Info */}
            <div className="p-3 space-y-1">
                <div className="flex justify-between items-center">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                        {product.brand}
                    </p>
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-50 rounded text-green-700">
                        <span className="text-[10px] font-bold">{product.ratings}</span>
                        <Star className="h-2.5 w-2.5 fill-green-700" />
                    </div>
                </div>

                <Link href={`/products/${product.slug}`} className="block">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 pt-1">
                    <span className="text-sm font-bold text-gray-900">
                        ${(product.discountPrice || product.price).toLocaleString()}
                    </span>
                    {product.discountPrice && (
                        <>
                            <span className="text-xs text-gray-400 line-through">
                                ${product.price.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-orange-500">
                                ({discount}% OFF)
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="aspect-[3/4] bg-[#F8FAFC] rounded-[2rem] shadow-inner" />
            <div className="space-y-3 px-2">
                <div className="h-3 w-1/4 bg-[#F8FAFC] rounded-full" />
                <div className="h-4 w-3/4 bg-[#F8FAFC] rounded-full" />
                <div className="h-4 w-1/2 bg-[#F8FAFC] rounded-full opacity-50" />
            </div>
        </div>
    );
}

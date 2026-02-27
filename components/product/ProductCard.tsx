'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import { cn, getImageUrl } from '@/utils/lib';

interface ProductCardProps {
    product: Product;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1594932224010-3343a41b2a95?auto=format&fit=crop&q=80&w=800';

export default function ProductCard({ product }: ProductCardProps) {
    const { isAuthenticated } = useAuth();
    const { addItem } = useCart();
    const [isHovered, setIsHovered] = useState(false);

    const initialImageUrl = useMemo(() => {
        const image = product?.images?.[0];
        return getImageUrl(image) || DEFAULT_FALLBACK;
    }, [product.images]);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product._id, 1);
        toast.success('Added to cart');
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error('Please login to add to wishlist');
            return;
        }
        toast.success('Added to wishlist');
    };

    const discount = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : null;

    return (
        <div 
            className="group relative flex flex-col bg-white overflow-hidden transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] w-full overflow-hidden bg-[#F8FAFC]">
                <Image
                    src={initialImageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={cn(
                        "absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 transform active:scale-90 z-20",
                        isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                    )}
                >
                    <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                    {discount ? (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-wider">
                            -{discount}%
                        </div>
                    ) : (
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-wider translate-y-[-2px]">
                            New
                        </div>
                    )}
                </div>

                {/* Quick Add Overlay */}
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 transform z-20",
                    isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                )}>
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-black text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Quick Add
                    </button>
                </div>
            </Link>

            {/* Product Info */}
            <div className="py-4 space-y-1">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                            {product?.category || 'General'}
                        </p>
                        <Link href={`/products/${product.slug}`}>
                            <h3 className="text-sm font-bold text-gray-900 hover:text-[#2563EB] transition-colors line-clamp-1">
                                {product?.name || 'Premium Product'}
                            </h3>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-black">
                        ${product.discountPrice?.toFixed(2) || product.price.toFixed(2)}
                    </span>
                    {product.discountPrice && (
                        <span className="text-xs font-medium text-gray-400 line-through">
                            ${product.price.toFixed(2)}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1 pt-1">
                    <div className="flex text-yellow-500">
                        {Array(5).fill(0).map((_, i) => (
                            <Star key={i} className={cn("h-3 w-3 fill-current", i >= Math.floor(product.ratings || 4.5) && "text-gray-200 fill-gray-200")} />
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold ml-1">({product.numReviews || 120})</span>
                </div>
            </div>
        </div>
    );
}

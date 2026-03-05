'use client';

import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/product/ProductCard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
    const { wishlist, loading } = useWishlist();

    return (
        <ProtectedRoute>
            <div className="bg-[#F8F9FA] min-h-screen pb-20">
                <div className="container mx-auto px-4 py-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                                <Heart className="h-3 w-3 fill-primary" />
                                <span>Personal Collection</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tight">
                                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Wishlist</span>
                            </h1>
                            <p className="text-sm font-medium text-gray-500 italic">
                                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
                            </p>
                        </div>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
                            <div className="h-12 w-12 rounded-full border-4 border-gray-100 border-t-primary animate-spin mb-4" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Syncing with server...</p>
                        </div>
                    ) : wishlist.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {wishlist.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2.5rem] p-12 md:p-20 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto">
                            <div className="relative inline-block mb-8">
                                <div className="h-24 w-24 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
                                    <Heart className="h-12 w-12" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg border-2 border-gray-50">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight mb-4">Your wishlist is empty</h2>
                            <p className="text-sm font-medium text-gray-500 italic mb-8 max-w-sm mx-auto">
                                Browsing but not ready to buy? Save your favorites here and they'll be waiting for you when you are.
                            </p>
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center bg-gradient-to-r from-primary to-purple-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-pink-100 hover:shadow-pink-200 hover:-translate-y-1 transition-all active:scale-95"
                            >
                                Start Exploring
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Trash2,
    Plus,
    Minus,
    ShoppingBag,
    ChevronRight,
    ArrowLeft,
    Truck,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react';
import { cn, getImageUrl } from '@/utils/lib';
import { toast } from 'react-hot-toast';

export default function CartPage() {
    const { items, totalPrice, updateItemQuantity, removeItem, loading } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [promoCode, setPromoCode] = useState('');

    const handleCheckout = () => {
        if (!isAuthenticated) {
            toast.error('Please login to proceed to checkout');
            router.push('/login?redirect=/cart');
            return;
        }
        router.push('/checkout');
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#2563EB] border-t-transparent"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 text-gray-300 mb-8">
                    <ShoppingBag className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">Discover our latest collections and find something you love. Your cart is waiting for its first item!</p>
                <Link href="/shop" className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#0F172A] px-10 font-black text-white hover:bg-black transition-all active:scale-95 shadow-xl shadow-black/10">
                    Start Shopping
                </Link>
            </div>
        );
    }

    const estimatedTax = totalPrice * 0.08;
    const finalTotal = totalPrice + estimatedTax;


    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <nav className="mb-10 flex items-center space-x-2 text-[10px] font-bold text-gray-400">
                    <Link href="/" className="hover:text-black">Home</Link>
                    <ChevronRight className="h-2.5 w-2.5" />
                    <span className="text-gray-900 font-black">Shopping Cart</span>
                </nav>

                <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-12">Your Cart</h1>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        {items.map((item, index) => (
                            <div key={`${item.product?._id || index}-${item.size}-${item.color}`} className="group relative flex items-center gap-8 rounded-[2rem] border border-gray-100 bg-white p-6 transition-all hover:shadow-2xl hover:shadow-gray-100">
                                <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-2xl bg-[#F3F4F6] border border-gray-100">
                                    <Image
                                        src={getImageUrl(item.product?.images?.[0] || '')}
                                        alt={item.product?.name || 'Product'}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                <div className="flex flex-grow flex-col justify-between py-2">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">{item.product?.name || 'Premium Item'}</h3>
                                            <p className="text-xs font-bold text-gray-400">
                                                Color: <span className="text-gray-900 capitalize">{item.color || 'N/A'}</span> • Size: <span className="text-gray-900 uppercase">{item.size || 'N/A'}</span>
                                            </p>
                                        </div>
                                        <span className="text-2xl font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between">
                                        <div className="flex items-center rounded-xl border border-gray-100 bg-gray-50/50 p-1">
                                            <button
                                                onClick={() => item.product && updateItemQuantity(item.product._id, Math.max(1, item.quantity - 1), item.size, item.color)}
                                                className="p-2 text-gray-400 hover:text-black transition-colors"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-10 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => item.product && updateItemQuantity(item.product._id, item.quantity + 1, item.size, item.color)}
                                                className="p-2 text-gray-400 hover:text-black transition-colors"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => item.product && removeItem(item.product._id, item.size, item.color)}
                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Link href="/shop" className="inline-flex items-center gap-2 mt-8 text-sm font-black text-[#2563EB] hover:gap-3 transition-all">
                            <ArrowLeft className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="rounded-[2rem] border border-gray-100 bg-white p-10 space-y-8 sticky top-32">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                                    <span className="text-lg font-black text-gray-900">${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Shipping Estimate</span>
                                    <span className="text-sm font-black text-green-500 uppercase">Free</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Estimated Tax</span>
                                    <span className="text-lg font-black text-gray-900">${estimatedTax.toFixed(2)}</span>
                                </div>
                                <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                                    <span className="text-xl font-black text-gray-900">Order Total</span>
                                    <span className="text-4xl font-black text-gray-900 tracking-tight">${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full h-16 rounded-2xl bg-[#2563EB] font-black text-white hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-200"
                            >
                                Proceed to Checkout
                            </button>

                            <p className="text-center text-[10px] font-bold text-gray-400 leading-relaxed max-w-[240px] mx-auto">
                                Secure checkout powered by Stripe. All taxes included.
                            </p>

                            <div className="pt-8 border-t border-gray-50 space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">PROMO CODE</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        className="flex-1 h-12 px-4 rounded-xl border border-gray-100 bg-gray-50 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                    <button className="h-12 px-6 rounded-xl bg-gray-100 font-bold text-sm hover:bg-gray-200 transition-colors">Apply</button>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 flex items-center justify-center gap-3">
                                <Truck className="h-5 w-5 text-[#2563EB]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Fast Delivery</span>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 flex items-center justify-center gap-3">
                                <ShieldCheck className="h-5 w-5 text-[#2563EB]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Attribution (from screen) */}
            <div className="container mx-auto px-4 py-8 mt-12 border-t border-gray-50 flex justify-center">
                <p className="text-[10px] font-bold text-gray-300">© 2024 Luxe Clothing Co. All rights reserved.</p>
            </div>
        </div>
    );
}

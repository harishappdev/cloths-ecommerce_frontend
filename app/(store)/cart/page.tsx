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
    CheckCircle2,
    X
} from 'lucide-react';
import { cn, getImageUrl } from '@/utils/lib';
import { toast } from 'react-hot-toast';

export default function CartPage() {
    const {
        items,
        totalPrice,
        updateItemQuantity,
        removeItem,
        loading,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountedTotal
    } = useCart();
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
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-pink-50 text-pink-400 mb-10 animate-bounce cursor-default">
                    <ShoppingBag className="h-16 w-16" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Your bag is light!</h2>
                <p className="text-gray-500 font-medium mb-12 max-w-sm mx-auto leading-relaxed">It's waiting to be filled with the season's hottest trends. Let's find something incredible.</p>
                <Link href="/shop" className="group relative inline-flex items-center gap-3 h-16 px-12 rounded-2xl bg-[#FF2C79] font-black text-white overflow-hidden shadow-xl shadow-pink-200 transition-all hover:scale-105 active:scale-95">
                    <span className="relative z-10 uppercase tracking-widest text-xs">Start Exploring</span>
                    <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
            </div>
        );
    }

    const estimatedTax = totalPrice * 0.08;
    const finalTotal = totalPrice + estimatedTax;

    return (
        <div className="bg-[#FCFCFD] min-h-screen">
            <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
                {/* Modern Breadcrumbs */}
                <nav className="mb-12 flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    <Link href="/" className="hover:text-[#FF2C79] transition-colors">VibrantHub</Link>
                    <span className="h-[2px] w-4 bg-pink-100" />
                    <span className="text-gray-900">Your Bag</span>
                </nav>

                <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="h-2 w-10 bg-gradient-to-r from-[#FF2C79] to-purple-600 rounded-full" />
                            <p className="text-[10px] font-black text-[#FF2C79] uppercase tracking-widest">Selection Terminal</p>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter leading-[0.8] mb-4">MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2C79] to-purple-600">BAG</span></h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{items.length} Premium {items.length === 1 ? 'Selection' : 'Selections'}</p>
                    </div>
                    <Link href="/shop" className="group h-12 px-6 flex items-center gap-3 rounded-xl bg-white border border-pink-100 text-[10px] font-black uppercase tracking-widest text-pink-600 shadow-sm hover:shadow-md hover:bg-pink-50 transition-all active:scale-95">
                        Add More Pieces <Plus className="h-3 w-3 group-hover:rotate-90 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="space-y-6">
                            {items.map((item, index) => (
                                <div key={`${item.product?._id || index}-${item.size}-${item.color}`} className="group relative bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 flex flex-col sm:flex-row gap-8 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500">
                                    {/* Image Section */}
                                    <div className="relative h-72 sm:h-64 w-full sm:w-52 shrink-0 overflow-hidden rounded-[2rem] bg-gray-50 border border-gray-50">
                                        <Image
                                            src={getImageUrl(item.product?.images?.[0] || '')}
                                            alt={item.product?.name || 'Product'}
                                            fill
                                            unoptimized
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm cursor-pointer" onClick={() => item.product && removeItem(item.product._id, item.size, item.color)}>
                                            <Trash2 className="h-4 w-4" />
                                        </div>
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex flex-grow flex-col justify-between py-2">
                                        <div>
                                            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Premium Quality</p>
                                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight group-hover:text-[#FF2C79] transition-colors">{item.product?.name}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-3xl font-black text-gray-900 tracking-tighter block leading-none">₹{(item.price * item.quantity).toLocaleString()}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 block">Value Added</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                <div className="flex items-center gap-3 px-4 py-2 bg-pink-50 rounded-xl border border-pink-100/50">
                                                    <div className="h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-700">{item.color}</span>
                                                </div>
                                                <div className="flex items-center gap-3 px-4 py-2 bg-purple-50 rounded-xl border border-purple-100/50">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-700">Size: {item.size}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-10 flex items-center justify-between gap-6">
                                            <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                                                <button
                                                    onClick={() => item.product && updateItemQuantity(item.product._id, Math.max(1, item.quantity - 1), item.size, item.color)}
                                                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-[#FF2C79] hover:shadow-sm transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-14 text-center text-base font-black text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => item.product && updateItemQuantity(item.product._id, item.quantity + 1, item.size, item.color)}
                                                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-[#FF2C79] hover:shadow-sm transition-all shadow-[0_4px_10px_rgba(0,0,0,0.03)]"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Available for priority shipping</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Benefits - Enhanced */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12">
                            <div className="p-8 rounded-[2.5rem] bg-pink-50/20 border border-pink-100/30 flex gap-6 items-center group hover:bg-white hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-500">
                                <div className="h-16 w-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg shadow-pink-200 text-white">
                                    <Truck className="h-7 w-7" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">Vibrant Express</h4>
                                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase">Free shipping on orders above ₹10k</p>
                                </div>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-purple-50/20 border border-purple-100/30 flex gap-6 items-center group hover:bg-white hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-500">
                                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-200 text-white">
                                    <ShieldCheck className="h-7 w-7" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">Encrypted Pay</h4>
                                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase">100% Secure Transaction Protocols</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar - Redesigned */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32">
                        <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-xl shadow-gray-200/50 space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 h-40 w-40 bg-pink-50/50 rounded-full -translate-y-20 translate-x-20 blur-3xl opacity-50" />

                            <div className="relative">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-6">Order Summary</h2>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        <span>Items Base</span>
                                        <span className="text-gray-900">₹{totalPrice.toLocaleString()}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-pink-600">
                                            <span>Coupon ({appliedCoupon.code})</span>
                                            <span>- ₹{(totalPrice - discountedTotal).toLocaleString()}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-pink-600 font-black">COMPLIMENTARY</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pb-8 border-b border-gray-50">
                                        <span>Tax (IGST)</span>
                                        <span className="text-gray-900">₹{estimatedTax.toLocaleString()}</span>
                                    </div>

                                    <div className="pt-4 flex justify-between items-center">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF2C79] block">Order Total</span>
                                            <span className="text-5xl font-black text-gray-900 tracking-tighter leading-none">₹{(discountedTotal + estimatedTax).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="group relative w-full h-20 mt-10 rounded-3xl bg-gray-900 text-white font-black text-[11px] uppercase tracking-[0.3em] overflow-hidden shadow-2xl transition-all duration-500 active:scale-95 flex items-center justify-center gap-4"
                                >
                                    <span className="relative z-10 flex items-center gap-4">
                                        Secure Checkout
                                        <ChevronRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF2C79] to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_4px_20px_rgba(255,255,255,0.2)]" />
                                </button>

                                <div className="mt-12 space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block pb-2 border-b border-gray-50">Promo Code</label>
                                    {!appliedCoupon ? (
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                placeholder="ENTER CODE"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                className="flex-1 h-16 px-8 rounded-2xl bg-gray-50 border-none font-black text-[11px] tracking-widest focus:ring-2 focus:ring-pink-100 transition-all uppercase placeholder:text-gray-300"
                                            />
                                            <button
                                                onClick={() => applyCoupon(promoCode)}
                                                className="h-16 px-8 rounded-2xl bg-gray-900 font-black text-[11px] uppercase tracking-widest text-white hover:bg-[#FF2C79] shadow-lg shadow-gray-200 transition-all active:scale-95"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 bg-pink-50 border border-pink-100 rounded-2xl">
                                            <div className="flex items-center gap-3 text-pink-600">
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{appliedCoupon.code} ACTIVE</span>
                                            </div>
                                            <button onClick={removeCoupon} className="text-gray-400 hover:text-pink-600 transition-colors">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-center gap-8 pt-10">
                                    {['VISA', 'MC', 'AMEX'].map(brand => (
                                        <div key={brand} className="h-8 w-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                                            <span className="text-[8px] font-black text-gray-900">{brand}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { orderService } from '@/services/orderService';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { toast } from 'react-hot-toast';
import {
    ChevronLeft,
    ChevronRight,
    Lock,
    CheckCircle2,
    CreditCard,
    ShieldCheck,
    RotateCcw,
    Check
} from 'lucide-react';
import Image from 'next/image';
import { cn, getImageUrl } from '@/utils/lib';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalPrice, clearCart, loading: cartLoading } = useCart();

    const [loading, setLoading] = useState(false);
    const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple'>('card');

    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        zipCode: '',
        phoneNumber: '',
        cardNumber: '',
        expiryDate: '',
        cvc: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const shippingCost = deliveryOption === 'express' ? 15.00 : 0.00;
    const tax = totalPrice * 0.08;
    const finalTotal = totalPrice + shippingCost + tax;

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.address || !formData.city || !formData.zipCode) {
            toast.error('Please fill in all shipping details');
            return;
        }

        setLoading(true);
        try {
            // Map frontend selection to backend enum
            const backendPaymentMethod =
                paymentMethod === 'paypal' ? 'PayPal' :
                    paymentMethod === 'apple' ? 'Credit Card' : 'Credit Card';

            const response = await orderService.createOrder({
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.zipCode,
                    country: 'Worldwide'
                },
                paymentMethod: backendPaymentMethod,
            });

            if (response.status === 'success') {
                toast.success('Order placed successfully!');
                await clearCart();
                setTimeout(() => {
                    router.push(`/order-success/${response.data.order._id}`);
                }, 500);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!cartLoading && items.length === 0) {
            router.push('/cart');
        }
    }, [items.length, cartLoading, router]);

    if (cartLoading) return null;
    if (items.length === 0) return null;


    return (
        <ProtectedRoute>
            <div className="bg-white min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* Breadcrumbs */}
                    <nav className="mb-10 flex items-center space-x-2 text-[10px] font-bold text-gray-400">
                        <span className="hover:text-black cursor-pointer" onClick={() => router.push('/cart')}>Cart</span>
                        <ChevronRight className="h-2.5 w-2.5" />
                        <span className="text-gray-900 font-black tracking-tight underline underline-offset-4 decoration-2 decoration-[#2563EB]">Checkout</span>
                        <ChevronRight className="h-2.5 w-2.5" />
                        <span className="text-gray-400">Payment</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Checkout Form */}
                        <div className="lg:col-span-8 space-y-16 pb-20">
                            {/* Step 1: Shipping Address */}
                            <section className="space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-sm font-black text-white">1</div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Shipping Address</h2>
                                </div>

                                <div className="grid grid-cols-1 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-900 uppercase">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className="w-full h-14 px-6 rounded-xl border border-gray-100 bg-[#F9FAFB] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-900 uppercase">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="123 Fashion Ave"
                                            className="w-full h-14 px-6 rounded-xl border border-gray-100 bg-[#F9FAFB] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-900 uppercase">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="New York"
                                                className="w-full h-14 px-6 rounded-xl border border-gray-100 bg-[#F9FAFB] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-900 uppercase">ZIP Code</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                placeholder="10001"
                                                className="w-full h-14 px-6 rounded-xl border border-gray-100 bg-[#F9FAFB] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-900 uppercase">Phone Number</label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full h-14 px-6 rounded-xl border border-gray-100 bg-[#F9FAFB] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Step 2: Delivery Options */}
                            <section className="space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-sm font-black text-white">2</div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Delivery Options</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <button
                                        onClick={() => setDeliveryOption('standard')}
                                        className={cn(
                                            "relative flex flex-col items-start p-8 rounded-2xl border-2 transition-all text-left",
                                            deliveryOption === 'standard' ? "border-[#2563EB] bg-blue-50/10 shadow-lg shadow-blue-50" : "border-gray-100 bg-white hover:border-gray-200"
                                        )}
                                    >
                                        <div className="flex w-full items-center justify-between mb-4">
                                            <span className="text-sm font-black text-gray-900">Standard Delivery</span>
                                            {deliveryOption === 'standard' && (
                                                <div className="h-5 w-5 rounded-full bg-[#2563EB] flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 mb-6 tracking-widest uppercase">3-5 business days</p>
                                        <span className="text-sm font-black text-[#2563EB]">Free</span>
                                    </button>

                                    <button
                                        onClick={() => setDeliveryOption('express')}
                                        className={cn(
                                            "relative flex flex-col items-start p-8 rounded-2xl border-2 transition-all text-left",
                                            deliveryOption === 'express' ? "border-[#2563EB] bg-blue-50/10 shadow-lg shadow-blue-50" : "border-gray-100 bg-white hover:border-gray-200"
                                        )}
                                    >
                                        <div className="flex w-full items-center justify-between mb-4">
                                            <span className="text-sm font-black text-gray-900">Express Delivery</span>
                                            {deliveryOption === 'express' && (
                                                <div className="h-5 w-5 rounded-full bg-[#2563EB] flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 mb-6 tracking-widest uppercase">Next business day</p>
                                        <span className="text-sm font-black text-gray-900">$15.00</span>
                                    </button>
                                </div>
                            </section>

                            {/* Step 3: Payment Method */}
                            <section className="space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-sm font-black text-white">3</div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Payment Method</h2>
                                </div>

                                <div className="space-y-10">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            className={cn(
                                                "flex-1 h-14 flex items-center justify-center gap-2 rounded-xl border-2 font-bold text-sm transition-all",
                                                paymentMethod === 'card' ? "border-[#2563EB] text-[#2563EB]" : "border-gray-100 text-gray-400 hover:border-gray-200"
                                            )}
                                        >
                                            <CreditCard className="h-4 w-4" />
                                            Card
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('paypal')}
                                            className={cn(
                                                "flex-1 h-14 flex items-center justify-center gap-2 rounded-xl border-2 font-bold text-sm transition-all",
                                                paymentMethod === 'paypal' ? "border-[#2563EB] text-[#2563EB]" : "border-gray-100 text-gray-400 hover:border-gray-200"
                                            )}
                                        >
                                            <span className="font-black italic">PayPal</span>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('apple')}
                                            className={cn(
                                                "flex-1 h-14 flex items-center justify-center gap-2 rounded-xl border-2 font-bold text-sm transition-all",
                                                paymentMethod === 'apple' ? "border-[#2563EB] text-[#2563EB]" : "border-gray-100 text-gray-400 hover:border-gray-200"
                                            )}
                                        >
                                            <span className="font-black tracking-tight flex items-center gap-1">
                                                <div className="mb-0.5">●</div> Apple Pay
                                            </span>
                                        </button>
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="p-10 rounded-[2rem] border border-gray-100 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Card Number</label>
                                                <div className="relative">
                                                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        value={formData.cardNumber}
                                                        onChange={handleInputChange}
                                                        placeholder="0000 0000 0000 0000"
                                                        className="w-full h-14 pl-16 pr-6 rounded-xl border border-gray-100 bg-[#F9FAFB] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        name="expiryDate"
                                                        value={formData.expiryDate}
                                                        onChange={handleInputChange}
                                                        placeholder="MM/YY"
                                                        className="w-full h-14 px-6 rounded-xl border border-gray-100 bg-[#F9FAFB] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CVC</label>
                                                    <input
                                                        type="text"
                                                        name="cvc"
                                                        value={formData.cvc}
                                                        onChange={handleInputChange}
                                                        placeholder="123"
                                                        className="w-full h-14 px-6 rounded-xl border border-gray-100 bg-[#F9FAFB] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
                            <div className="rounded-[2rem] border border-gray-100 bg-white p-10 space-y-10">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order Summary</h2>

                                {/* Compact Items List */}
                                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map((item) => (
                                        <div key={`${item.product._id}-${item.size}-${item.color}`} className="flex gap-4">
                                            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-50">
                                                <Image
                                                    src={getImageUrl(item.product?.images?.[0] || '')}
                                                    alt={item.product?.name || 'Product'}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center flex-grow py-1">
                                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.product.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                    {item.color} • {item.size} • x{item.quantity}
                                                </p>
                                            </div>
                                            <div className="flex flex-col justify-center items-end py-1">
                                                <span className="text-sm font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                                        <span className="text-sm font-black text-gray-900">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shipping</span>
                                        <span className="text-xs font-black text-green-500 uppercase">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tax</span>
                                        <span className="text-sm font-black text-gray-900">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-6 border-t border-gray-50 flex justify-between items-baseline">
                                        <span className="text-xl font-black text-gray-900 tracking-tight">Total</span>
                                        <span className="text-3xl font-black text-[#2563EB] tracking-tight">${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="w-full h-16 rounded-2xl bg-[#2563EB] font-black text-white hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-100 disabled:opacity-50 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : (
                                        'Place Order'
                                    )}
                                </button>

                                <p className="text-center text-[10px] font-bold text-gray-400 leading-relaxed max-w-[280px] mx-auto">
                                    By clicking "Place Order" you agree to our <span className="underline cursor-pointer">Terms and Conditions</span>.
                                </p>
                            </div>

                            <div className="mt-8 flex justify-center gap-8">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-gray-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Secure SSL</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RotateCcw className="h-4 w-4 text-gray-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">30-Day Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Attribution */}
                <div className="container mx-auto px-4 py-8 mt-12 border-t border-gray-50 flex justify-center">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">© 2024 Fashion Store. All rights reserved.</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}

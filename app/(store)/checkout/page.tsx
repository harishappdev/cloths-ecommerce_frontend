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
    Check,
    X
} from 'lucide-react';
import Image from 'next/image';
import { cn, getImageUrl } from '@/utils/lib';

export default function CheckoutPage() {
    const router = useRouter();
    const {
        items,
        totalPrice,
        clearCart,
        loading: cartLoading,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountedTotal
    } = useCart();

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
                couponCode: appliedCoupon?.code,
                deliveryOption: deliveryOption
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
            <div className="bg-[#FCFCFD] min-h-screen">
                <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
                    {/* Modern Breadcrumbs */}
                    <nav className="mb-6 md:mb-12 flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <span className="hover:text-[#FF2C79] cursor-pointer transition-colors" onClick={() => router.push('/cart')}>Your Bag</span>
                        <span className="h-[2px] w-4 bg-pink-100" />
                        <span className="text-gray-900 leading-none">Final Settlement</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                        {/* Checkout Logistics */}
                        <div className="lg:col-span-8 space-y-8 md:space-y-16 pb-12 md:pb-20">
                            {/* Step 1: Destination Selection */}
                            <section className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm space-y-12">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-50 pb-6 md:pb-8 gap-4">
                                    <div className="flex items-center gap-4 md:gap-6">
                                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl md:rounded-3xl bg-pink-50 text-pink-500 flex items-center justify-center font-black text-xl md:text-2xl shadow-sm shrink-0">01</div>
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Destination</h2>
                                            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 md:mt-2">Logistics Coordination</p>
                                        </div>
                                    </div>
                                    <span className="self-start sm:self-auto text-[9px] font-black uppercase tracking-widest text-[#FF2C79] bg-pink-50 px-3 py-1 rounded-full border border-pink-100">Live Stage</span>
                                </div>

                                <div className="grid grid-cols-1 gap-8">
                                    <div className="space-y-3 md:space-y-4">
                                        <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Recipient Identity</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="LEGAL FULL NAME"
                                            className="w-full h-16 md:h-18 px-6 md:px-8 rounded-xl md:rounded-2xl bg-gray-50 border-none font-black text-[10px] md:text-[11px] tracking-widest focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-gray-200 uppercase"
                                        />
                                    </div>
                                    <div className="space-y-3 md:space-y-4">
                                        <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Delivery Vector</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="STREET ADDRESS / APT NUMBER"
                                            className="w-full h-16 md:h-18 px-6 md:px-8 rounded-xl md:rounded-2xl bg-gray-50 border-none font-black text-[10px] md:text-[11px] tracking-widest focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-gray-200 uppercase"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Locality</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="CITY / STATE"
                                                className="w-full h-18 px-8 rounded-2xl bg-gray-50 border-none font-black text-[11px] tracking-widest focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-gray-200 uppercase"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Postal Node</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                placeholder="ZIP / PIN CODE"
                                                className="w-full h-18 px-8 rounded-2xl bg-gray-50 border-none font-black text-[11px] tracking-widest focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-gray-200 uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Communication Link</label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="+91 CONTACT NUMBER"
                                            className="w-full h-18 px-8 rounded-2xl bg-gray-50 border-none font-black text-[11px] tracking-widest focus:ring-2 focus:ring-pink-100 transition-all placeholder:text-gray-200"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Step 2: Transit Protocol */}
                            <section className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm space-y-12">
                                <div className="flex items-end justify-between border-b border-gray-50 pb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="h-14 w-14 rounded-3xl bg-purple-50 text-purple-500 flex items-center justify-center font-black text-2xl shadow-sm">02</div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Transit</h2>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Velocity Selection</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <button
                                        onClick={() => setDeliveryOption('standard')}
                                        className={cn(
                                            "relative flex flex-col items-start p-10 rounded-[2.5rem] border-2 transition-all duration-500 text-left group overflow-hidden",
                                            deliveryOption === 'standard' ? "border-[#FF2C79] bg-white shadow-xl shadow-pink-100" : "border-gray-50 bg-gray-50/50 hover:border-pink-100"
                                        )}
                                    >
                                        <div className="flex w-full items-center justify-between mb-10">
                                            <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", deliveryOption === 'standard' ? "text-[#FF2C79]" : "text-gray-400")}>Standard Protocol</span>
                                            {deliveryOption === 'standard' && (
                                                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-200">
                                                    <Check className="h-4 w-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="text-2xl font-black text-gray-900 tracking-tighter mb-2 uppercase">Balanced</h4>
                                        <p className="text-[10px] font-bold text-gray-400 mb-8 tracking-widest uppercase italic">3-5 Cycle Arrival window</p>
                                        <span className="text-[10px] font-black text-pink-600 bg-pink-50 px-4 py-2 rounded-full uppercase tracking-widest mt-auto border border-pink-100">Complementary</span>
                                    </button>

                                    <button
                                        onClick={() => setDeliveryOption('express')}
                                        className={cn(
                                            "relative flex flex-col items-start p-10 rounded-[2.5rem] border-2 transition-all duration-500 text-left group overflow-hidden",
                                            deliveryOption === 'express' ? "border-purple-600 bg-white shadow-xl shadow-purple-100" : "border-gray-50 bg-gray-50/50 hover:border-purple-100"
                                        )}
                                    >
                                        <div className="flex w-full items-center justify-between mb-10">
                                            <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", deliveryOption === 'express' ? "text-purple-600" : "text-gray-400")}>Priority Protocol</span>
                                            {deliveryOption === 'express' && (
                                                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-200">
                                                    <Check className="h-4 w-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="text-2xl font-black text-gray-900 tracking-tighter mb-2 uppercase">Supersonic</h4>
                                        <p className="text-[10px] font-bold text-gray-400 mb-8 tracking-widest uppercase italic">Next cycle arrival</p>
                                        <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-4 py-2 rounded-full uppercase tracking-widest mt-auto border border-purple-100">₹1,500 Additional</span>
                                    </button>
                                </div>
                            </section>

                            {/* Step 3: Settlement */}
                            <section className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm space-y-12">
                                <div className="flex items-end justify-between border-b border-gray-50 pb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="h-14 w-14 rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-black text-2xl shadow-sm">03</div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Settlement</h2>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Financial Coordination</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div className="flex flex-wrap gap-4">
                                        {['card', 'paypal', 'apple'].map((method) => (
                                            <button
                                                key={method}
                                                onClick={() => setPaymentMethod(method as any)}
                                                className={cn(
                                                    "h-16 px-10 flex items-center justify-center gap-4 rounded-2xl border transition-all duration-300 shadow-sm font-black text-[10px] uppercase tracking-widest",
                                                    paymentMethod === method
                                                        ? "border-transparent bg-gray-900 text-white shadow-xl shadow-gray-300"
                                                        : "border-gray-50 bg-white text-gray-400 hover:border-gray-200"
                                                )}
                                            >
                                                {method === 'card' && <CreditCard className="h-4 w-4 text-[#FF2C79]" />}
                                                {method === 'paypal' && <span className="italic normal-case font-black text-blue-500">PayPal</span>}
                                                {method === 'apple' && <span className="text-black">Apple Pay</span>}
                                                {method === 'card' && "Protected Card"}
                                            </button>
                                        ))}
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-inner space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest px-2">Credential Identification</label>
                                                <div className="relative">
                                                    <div className="absolute left-8 top-1/2 -translate-y-1/2 h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-300">
                                                        <CreditCard className="h-5 w-5" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        value={formData.cardNumber}
                                                        onChange={handleInputChange}
                                                        placeholder="0000 0000 0000 0000"
                                                        className="w-full h-20 pl-24 pr-8 rounded-3xl bg-white border-none font-black text-[12px] tracking-[0.35em] focus:ring-2 focus:ring-pink-100"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest px-2">Lifecycle End</label>
                                                    <input
                                                        type="text"
                                                        name="expiryDate"
                                                        value={formData.expiryDate}
                                                        onChange={handleInputChange}
                                                        placeholder="MM / YY"
                                                        className="w-full h-18 px-8 rounded-2xl bg-white border-none font-black text-[12px] tracking-widest focus:ring-2 focus:ring-pink-100"
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest px-2">Security Node</label>
                                                    <input
                                                        type="text"
                                                        name="cvc"
                                                        value={formData.cvc}
                                                        onChange={handleInputChange}
                                                        placeholder="000"
                                                        className="w-full h-18 px-8 rounded-2xl bg-white border-none font-black text-[12px] tracking-widest focus:ring-2 focus:ring-pink-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Order Recaps Sidebar */}
                        <div className="lg:col-span-4 lg:sticky lg:top-12 h-fit">
                            <div className="bg-white rounded-[3rem] border border-gray-100 p-10 space-y-10 shadow-2xl shadow-gray-200/50">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="h-2 w-8 bg-gradient-to-r from-[#FF2C79] to-purple-600 rounded-full" />
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Recap</h2>
                                </div>

                                {/* Industrial Items List */}
                                <div className="space-y-6 max-h-[350px] overflow-y-auto pr-4 no-scrollbar border-b border-gray-50 pb-10">
                                    {items.map((item) => (
                                        <div key={`${item.product._id}-${item.size}-${item.color}`} className="group flex gap-6">
                                            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[1.5rem] bg-gray-50 border border-gray-50 shadow-sm">
                                                <Image
                                                    src={getImageUrl(item.product?.images?.[0] || '')}
                                                    alt={item.product?.name || 'Item'}
                                                    fill
                                                    unoptimized
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center flex-grow py-1 space-y-2">
                                                <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight leading-none group-hover:text-[#FF2C79] transition-colors">{item.product.name}</p>
                                                <div className="flex gap-2">
                                                    <span className="text-[8px] font-black px-2 py-0.5 bg-gray-50 rounded text-gray-400 uppercase tracking-widest">{item.size}</span>
                                                    <span className="text-[8px] font-black px-2 py-0.5 bg-gray-50 rounded text-gray-400 uppercase tracking-widest">QTY: {item.quantity}</span>
                                                </div>
                                                <span className="text-[11px] font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Merchandise</span>
                                        <span className="text-gray-900">₹{totalPrice.toLocaleString()}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-pink-600">
                                            <span>Coupon ({appliedCoupon.code})</span>
                                            <span>- ₹{(totalPrice - discountedTotal).toLocaleString()}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Logistics</span>
                                        <span className={cn("font-black", shippingCost === 0 ? "text-pink-600" : "text-gray-900")}>
                                            {shippingCost === 0 ? 'GRATIS' : `₹${shippingCost.toLocaleString()}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 pb-8 border-b border-gray-50">
                                        <span>Regulatory</span>
                                        <span className="text-gray-900">₹{tax.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Coupon Sector */}
                                <div className="pt-2">
                                    {!appliedCoupon ? (
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                id="coupon-input"
                                                placeholder="VOUCHER CODE"
                                                className="flex-grow bg-gray-50 border-none rounded-xl px-5 text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-pink-100"
                                            />
                                            <button
                                                onClick={() => {
                                                    const code = (document.getElementById('coupon-input') as HTMLInputElement).value;
                                                    if (code) applyCoupon(code);
                                                }}
                                                className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
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

                                <div className="pt-4 flex justify-between items-end">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF2C79] block">Total Obligation</span>
                                        <span className="text-5xl font-black text-gray-900 tracking-tighter leading-none">₹{(discountedTotal + shippingCost + tax).toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="group relative w-full h-20 rounded-3xl bg-gray-900 text-white font-black text-[11px] uppercase tracking-[0.35em] overflow-hidden shadow-2xl transition-all duration-500 active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    <span className="relative z-10 flex items-center gap-4">
                                        {loading ? (
                                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        ) : (
                                            <>
                                                Execute Settlement
                                                <ChevronRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF2C79] to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </button>

                                <div className="flex flex-col items-center gap-6 pt-6 bg-pink-50/20 p-6 rounded-[2rem] border border-pink-100/30">
                                    <div className="flex items-center gap-6 text-pink-300">
                                        <ShieldCheck className="h-7 w-7" />
                                        <Lock className="h-7 w-7" />
                                        <CheckCircle2 className="h-7 w-7" />
                                    </div>
                                    <p className="text-center text-[9px] font-black uppercase text-pink-400 tracking-widest leading-relaxed">
                                        Encrypted terminal. Data subject to global privacy protocols.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Industrial Footer */}
                    <div className="container mx-auto py-16 mt-20 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        <div className="flex items-center gap-6">
                            <span className="text-gray-900">StyleNest Atelier</span>
                            <span className="h-1 w-1 bg-gray-100 rounded-full" />
                            <p className="leading-none">Global Operations © 2024</p>
                        </div>
                        <div className="flex gap-10">
                            <button className="hover:text-[#FF2C79] transition-colors">Privacy Protocal</button>
                            <button className="hover:text-[#FF2C79] transition-colors">Service Terms</button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

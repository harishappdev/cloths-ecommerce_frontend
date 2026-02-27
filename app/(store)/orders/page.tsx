'use client';

import { useEffect, useState } from 'react';
import { orderService, Order } from '@/services/orderService';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
    Package,
    ChevronRight,
    ChevronDown,
    MapPin,
    CreditCard,
    Download,
    ExternalLink,
    Filter,
    CheckCircle2,
    Clock,
    Truck
} from 'lucide-react';
import Image from 'next/image';
import { cn, getImageUrl } from '@/utils/lib';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function OrdersPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (authLoading || !isAuthenticated) return;

            try {
                const response = await orderService.getMyOrders();
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [isAuthenticated, authLoading]);

    if (loading) return (
        <div className="flex min-h-[60vh] items-center justify-center bg-[#F9FAFB]">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Orders...</p>
            </div>
        </div>
    );

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F9FAFB] pb-24">
                <div className="container mx-auto px-4 py-16">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-3">
                                Your <span className="text-[#2563EB]">Orders</span>
                            </h1>
                            <p className="text-gray-500 font-medium">Track and manage your purchases</p>
                        </div>
                        <button className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-sm font-bold text-gray-600">
                            <Filter className="h-4 w-4" />
                            Filter
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </button>
                    </div>

                    {orders.length === 0 ? (
                        <div className="rounded-[3rem] border-2 border-dashed border-gray-200 bg-white p-24 text-center">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                                <Package className="h-10 w-10" />
                            </div>
                            <h2 className="mt-8 text-2xl font-black text-gray-900">No orders found</h2>
                            <p className="mt-3 text-gray-500 max-w-sm mx-auto">Looks like you haven't placed any orders yet. Start exploring our premium collections!</p>
                            <Link href="/shop" className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-[#0F172A] px-10 py-4 font-black text-white hover:bg-black transition-all active:scale-95 shadow-xl shadow-black/10">
                                Start Shopping
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/50">
                                    {/* Order Card Header */}
                                    <div className="px-10 py-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-8 bg-[#FDFDFD]">
                                        <div className="flex items-center gap-12">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">ORDER ID</p>
                                                <p className="text-base font-black text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">PLACED ON</p>
                                                <p className="text-base font-bold text-gray-600">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black uppercase tracking-widest",
                                                order.isPaid ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                                            )}>
                                                {order.isPaid ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                                {order.isPaid ? 'Paid' : 'Pending'}
                                                <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Content */}
                                    <div className="p-10">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                            {/* Left: Product & Shipping */}
                                            <div className="lg:col-span-8 space-y-12">
                                                {/* Product Section */}
                                                <div className="space-y-8">
                                                    {order.orderItems.map((item, i) => (
                                                        <div key={i} className="flex gap-8 group">
                                                            <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-[#F9FAFB]">
                                                                <Image
                                                                    src={getImageUrl(item.image)}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col justify-center flex-grow">
                                                                <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">{item.name}</h3>
                                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                                                    Size: <span className="text-gray-900">{item.size || 'N/A'}</span> | Qty:<span className="text-gray-900">{item.quantity}</span>
                                                                </p>
                                                                <p className="text-2xl font-black text-gray-900 mb-6">${item.price.toFixed(2)}</p>
                                                                <Link
                                                                    href={`/products/${item.name.toLowerCase().replace(/ /g, '-')}`}
                                                                    className="inline-flex items-center gap-2 text-xs font-black text-[#2563EB] hover:gap-3 transition-all"
                                                                >
                                                                    View Product
                                                                    <ChevronRight className="h-3 w-3" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Shipping Segment */}
                                                <div className="pt-10 border-t border-gray-50 flex gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB] shrink-0">
                                                        <MapPin className="h-5 w-5" />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">SHIPPING TO</p>
                                                        <div className="text-sm font-bold text-gray-600 leading-relaxed">
                                                            <p className="text-gray-900">{order.shippingAddress.address}</p>
                                                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                                            <p>{order.shippingAddress.country}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Payment & Actions */}
                                            <div className="lg:col-span-4 space-y-8">
                                                <div className="p-8 rounded-[2rem] bg-gray-50/50 border border-gray-100 flex flex-col justify-between h-full">
                                                    <div className="space-y-6">
                                                        <div className="flex gap-4">
                                                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB] shrink-0">
                                                                <CreditCard className="h-5 w-5" />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">PAYMENT</p>
                                                                <p className="text-sm font-black text-gray-900">{order.paymentMethod}</p>
                                                                <div className="flex items-center gap-2">
                                                                    <div className={cn("h-2 w-2 rounded-full", order.isPaid ? "bg-green-500" : "bg-yellow-500")} />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                                        {order.isPaid ? 'Paid' : 'Payment Pending'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100">
                                                            <Download className="h-4 w-4" />
                                                            Download invoice
                                                        </button>
                                                    </div>

                                                    <div className="space-y-3 mt-12">
                                                        <button className="w-full h-14 bg-[#2563EB] text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100">
                                                            View Details
                                                        </button>
                                                        <button className="w-full h-14 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black text-sm hover:border-gray-200 transition-all active:scale-95">
                                                            Track Order
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

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
import { toast } from 'react-hot-toast';

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
            <div className="bg-[#FCFCFD] min-h-screen">
                <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
                    {/* Modern Breadcrumbs */}
                    <nav className="mb-12 flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <Link href="/" className="hover:text-[#FF2C79] transition-colors">VibrantHub</Link>
                        <span className="h-[2px] w-4 bg-pink-100" />
                        <span className="text-gray-900">Your Orders</span>
                    </nav>

                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="h-2 w-10 bg-gradient-to-r from-[#FF2C79] to-purple-600 rounded-full" />
                                <p className="text-[10px] font-black text-[#FF2C79] uppercase tracking-widest">Customer Terminal</p>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter leading-[0.8] mb-4">PURCHASE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2C79] to-purple-600">HISTORY</span></h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{orders.length} Authenticated Transactions</p>
                        </div>
                        <button className="group h-12 px-6 flex items-center gap-3 rounded-xl bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm hover:shadow-md transition-all active:scale-95">
                            Filter Records <ChevronRight className="h-3 w-3 group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-[3rem] border border-gray-100 p-20 text-center shadow-sm">
                            <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-pink-50 text-pink-500 mb-8 border border-pink-100">
                                <Package className="h-10 w-10" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase">No Records Found</h2>
                            <p className="text-gray-400 font-bold mb-10 max-w-sm mx-auto text-[10px] uppercase tracking-widest leading-relaxed">Your transaction log is currently empty. Initiate your first procurement at our storefront.</p>
                            <Link href="/shop" className="inline-flex h-14 items-center justify-center rounded-2xl bg-gray-900 px-10 font-black text-[11px] uppercase tracking-widest text-white hover:bg-[#FF2C79] transition-all active:scale-95 shadow-xl shadow-gray-200">
                                Browse Collection
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {orders.map((order) => (
                                <div key={order._id} className="group bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
                                    {/* Order Header - Gradient Impact */}
                                    <div className="bg-gray-50/50 p-8 md:p-10 flex flex-wrap items-center justify-between gap-8 border-b border-gray-50">
                                        <div className="flex flex-wrap items-center gap-10">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Ref</p>
                                                <p className="text-sm font-black text-gray-900 tracking-tight">#{order._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Procurement Date</p>
                                                <p className="text-sm font-black text-gray-900 tracking-tight">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Value</p>
                                                <p className="text-sm font-black text-pink-600 tracking-tight">₹{order.totalPrice.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={cn(
                                                "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                order.paymentStatus === 'paid'
                                                    ? "bg-green-50 text-green-600 border-green-100"
                                                    : "bg-orange-50 text-orange-600 border-orange-100"
                                            )}>
                                                {order.paymentStatus}
                                            </span>
                                            <span className="px-6 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest">
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Content */}
                                    <div className="p-8 md:p-12">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                            {/* Pieces Column */}
                                            <div className="lg:col-span-7 space-y-6">
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Procured Pieces</h4>
                                                <div className="space-y-4">
                                                    {order.orderItems.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-6 p-4 rounded-2xl bg-gray-50 border border-gray-50/50 group/item hover:bg-white hover:shadow-md transition-all">
                                                            <div className="relative h-20 w-16 overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                                                                <Image
                                                                    src={getImageUrl(item.image)}
                                                                    alt={item.name}
                                                                    fill
                                                                    unoptimized
                                                                    className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                                                                />
                                                            </div>
                                                            <div className="flex-grow space-y-1">
                                                                <h5 className="text-[11px] font-black text-gray-900 uppercase tracking-tight leading-none group-hover/item:text-[#FF2C79] transition-colors">{item.name}</h5>
                                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                                    {item.color} • SIZE: {item.size} • QTY: {item.quantity}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[11px] font-black text-gray-900 leading-none">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Logistics & Financial Column */}
                                            <div className="lg:col-span-5 space-y-10">
                                                <div className="p-8 rounded-[2rem] bg-pink-50/20 border border-pink-100/30 space-y-6">
                                                    <div className="flex items-center gap-3">
                                                        <Truck className="h-4 w-4 text-pink-400" />
                                                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Delivery Vector</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase">
                                                            {order.shippingAddress.address}<br />
                                                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                                            {order.shippingAddress.country}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="p-8 rounded-[2rem] bg-gray-900 text-white space-y-6 shadow-xl shadow-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <CreditCard className="h-4 w-4 text-[#FF2C79]" />
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest">Settlement Log</h4>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                                                            <span>Method</span>
                                                            <span className="text-white">{order.paymentMethod}</span>
                                                        </div>
                                                        <div className="flex justify-between text-[11px] font-black pt-3 border-t border-white/10 uppercase tracking-widest">
                                                            <span className="text-gray-400">Total Obligation</span>
                                                            <span className="text-[#FF2C79]">₹{order.totalPrice.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Order Actions */}
                                    <div className="px-8 md:px-12 pb-8 md:pb-12 flex flex-wrap gap-4">
                                        {(order.orderStatus === 'pending' || order.orderStatus === 'paid') && (
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Are you sure you want to cancel this order?')) {
                                                        try {
                                                            await orderService.cancelOrder(order._id);
                                                            toast.success('Order cancelled successfully');
                                                            // Reload orders
                                                            const response = await orderService.getMyOrders();
                                                            setOrders(response.data.orders);
                                                        } catch (error) {
                                                            toast.error('Failed to cancel order');
                                                        }
                                                    }
                                                }}
                                                className="px-6 py-3 rounded-xl border border-red-100 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                        {order.orderStatus === 'delivered' && (
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Request a return for this order?')) {
                                                        try {
                                                            await orderService.requestReturn(order._id);
                                                            toast.success('Return requested');
                                                            const response = await orderService.getMyOrders();
                                                            setOrders(response.data.orders);
                                                        } catch (error) {
                                                            toast.error('Failed to request return');
                                                        }
                                                    }
                                                }}
                                                className="px-6 py-3 rounded-xl border border-gray-900 text-gray-900 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                                            >
                                                Request Return
                                            </button>
                                        )}
                                        <Link
                                            href={`/orders/${order._id}`}
                                            className="px-6 py-3 rounded-xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
                                        >
                                            View Progress
                                        </Link>
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

'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { Order } from '@/services/orderService';
import {
    ShoppingBag,
    Eye,
    CheckCircle,
    Truck,
    Package,
    XCircle,
    MoreVertical,
    Calendar,
    Mail,
    Search,
    Filter,
    Plus,
    ChevronRight,
    ChevronLeft,
    Bell,
    Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/lib';
import Image from 'next/image';

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = async () => {
        try {
            const response = await adminService.getAllOrders();
            setOrders(response.data.orders);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await adminService.updateOrderStatus(id, { orderStatus: status });
            toast.success(`Order set to ${status}`);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredOrders = orders.filter(o =>
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.user as any)?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">

            {/* Header / Title & Primary Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Orders Management</h1>
                    <p className="text-sm font-bold text-gray-400 mt-2">View and manage all customer transactions.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-100 text-sm font-black text-gray-900 hover:bg-gray-50 transition-all shadow-sm">
                        <Download className="h-4 w-4" />
                        <span>Export Data</span>
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-sm font-black text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95">
                        <Plus className="h-5 w-5" />
                        <span>Create Order</span>
                    </button>
                </div>
            </div>

            {/* Filter Card */}
            <div className="rounded-[1.5rem] border border-gray-100 bg-white p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                    <div className="md:col-span-5 space-y-3">
                        <label className="text-xs font-black text-gray-900">Date Range</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Oct 01, 2023 - Oct 31, 2023"
                                className="w-full bg-[#F8FAFC] border-none rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-4 space-y-3">
                        <label className="text-xs font-black text-gray-900">Order Status</label>
                        <select className="w-full bg-[#F8FAFC] border-none rounded-xl py-3.5 px-5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/10 appearance-none cursor-pointer">
                            <option>All Statuses</option>
                            <option>Paid</option>
                            <option>Processing</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                            <option>Refunded</option>
                        </select>
                    </div>
                    <div className="md:col-span-3">
                        <button className="w-full bg-[#F8FAFC] text-gray-900 rounded-xl py-3.5 text-sm font-black hover:bg-gray-100 transition-all">
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-[1.5rem] border border-gray-100 bg-white shadow-sm overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50 bg-[#F8FAFC]/50">
                                <th className="py-5 px-8">Order ID</th>
                                <th className="py-5 px-6">Customer</th>
                                <th className="py-5 px-6">Amount</th>
                                <th className="py-5 px-6">Payment Status</th>
                                <th className="py-5 px-6">Order Status</th>
                                <th className="py-5 px-8 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="py-8 px-8 h-24 bg-gray-50/20"></td>
                                    </tr>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-200 mb-4" />
                                        <p className="text-sm font-bold text-gray-400">No orders found matching your search.</p>
                                    </td>
                                </tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order._id} className="group hover:bg-[#F8FAFC] transition-all">
                                    <td className="py-6 px-8">
                                        <span className="text-sm font-black text-[#2563EB]">#ORD-{order._id.slice(-4).toUpperCase()}</span>
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
                                                <Image
                                                    src={`https://i.pravatar.cc/150?u=${(order.user as any)?._id || order._id}`}
                                                    alt={(order.user as any)?.name || 'Guest'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-black text-gray-900 group-hover:text-[#2563EB] transition-colors">{(order.user as any)?.name || 'Guest User'}</p>
                                                <p className="text-[11px] font-bold text-gray-400 mt-1 lowercase italic">{(order.user as any)?.email || 'guest@example.com'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6">
                                        <span className="text-[14px] font-black text-gray-900">${order.totalPrice.toFixed(2)}</span>
                                    </td>
                                    <td className="py-6 px-6">
                                        <span className={cn(
                                            "inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider",
                                            order.orderStatus === 'delivered' ? "bg-green-100 text-green-600" :
                                                order.orderStatus === 'pending' ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"
                                        )}>
                                            {order.orderStatus === 'delivered' ? 'Paid' : order.orderStatus === 'cancelled' ? 'Refunded' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="py-6 px-6">
                                        <span className={cn(
                                            "inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider",
                                            order.orderStatus === 'pending' ? "bg-blue-50 text-blue-400" :
                                                order.orderStatus === 'shipped' ? "bg-blue-100 text-blue-600" :
                                                    order.orderStatus === 'delivered' ? "bg-green-100 text-green-600" :
                                                        "bg-red-100 text-red-600"
                                        )}>
                                            {order.orderStatus === 'pending' ? 'Processing' : order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <button className="px-6 py-2 rounded-lg bg-[#2563EB] text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-8 py-5 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-[12px] font-bold text-gray-400">
                        Showing <span className="text-gray-900 font-black">1-10</span> of <span className="text-gray-900 font-black">{orders.length}</span> entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#2563EB] text-white text-xs font-black shadow-lg shadow-blue-500/20">1</button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-600 text-xs font-black hover:bg-gray-50">2</button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-600 text-xs font-black hover:bg-gray-50">3</button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

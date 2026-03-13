'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { adminService } from '@/services/adminService';
import { Skeleton } from '@/components/ui/Skeleton';
import {
    ShoppingBag,
    Search,
    Filter,
    ChevronDown,
    MoreHorizontal,
    Eye,
    Truck,
    CheckCircle2,
    XCircle,
    Calendar,
    ArrowUpRight,
    Package,
    RotateCcw,
    Undo2,
    Plus,
    Download,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/lib';
import { Order } from '@/services/orderService';

export default function AdminOrders() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: ordersData, isLoading: ordersLoading } = useSWR('/orders');
    const orders = ordersData?.data?.orders || [];

    const updateStatus = async (orderId: string, status: string) => {
        try {
            await adminService.updateOrderStatus(orderId, { orderStatus: status });
            toast.success(`Order status updated to ${status}`);
            mutate('/orders');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleProcessReturn = async (orderId: string, status: 'returned' | 'delivered') => {
        try {
            await adminService.processReturn(orderId, status);
            toast.success(`Return processed as ${status}`);
            mutate('/orders');
        } catch (error) {
            toast.error('Failed to process return');
        }
    };

    const filteredOrders = orders.filter((o: Order) =>
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.user as any)?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">

            {/* Header / Title & Primary Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="h-2 w-10 bg-gradient-to-r from-[#FF2C79] to-purple-600 rounded-full" />
                        <p className="text-[10px] font-black text-[#FF2C79] uppercase tracking-[0.2em]">Order Management</p>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-[0.8] uppercase">Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2C79] to-purple-600">History</span></h1>
                    <p className="text-sm font-bold text-gray-400 mt-4 uppercase tracking-[0.1em]">Manage customer orders, shipping, and payments.</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-5 rounded-[1.5rem] border border-gray-100 bg-white text-[11px] font-black text-gray-900 hover:bg-gray-50 transition-all shadow-sm uppercase tracking-widest">
                        <Download className="h-4 w-4" />
                        <span>Export CSV</span>
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-5 rounded-[1.5rem] bg-gray-900 text-[11px] font-black text-white shadow-2xl shadow-gray-200 hover:bg-[#FF2C79] transition-all active:scale-95 uppercase tracking-widest">
                        <Plus className="h-4 w-4" />
                        <span>Manual Entry</span>
                    </button>
                </div>
            </div>

            {/* Filter Card */}
            <div className="rounded-[2.5rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                    <div className="md:col-span-4 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF2C79] ml-1">Date Range</label>
                        <div className="relative group">
                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-[#FF2C79] transition-colors" />
                            <input
                                type="text"
                                placeholder="SELECT DATE..."
                                className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-14 pr-6 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-pink-500/10 transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-3 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF2C79] ml-1">Order Status</label>
                        <div className="relative group">
                            <select 
                                className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 px-6 text-[11px] font-black uppercase tracking-widest text-gray-900 focus:ring-2 focus:ring-pink-500/10 appearance-none cursor-pointer"
                                suppressHydrationWarning
                            >
                                <option>ALL STATUSES</option>
                                <option>Paid</option>
                                <option>Processing</option>
                                <option>Shipped</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-hover:text-[#FF2C79] transition-colors" />
                        </div>
                    </div>
                    <div className="md:col-span-3 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF2C79] ml-1">Search Orders</label>
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-[#FF2C79] transition-colors" />
                            <input
                                type="text"
                                placeholder="NAME / ORDER ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-14 pr-6 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-pink-500/10 transition-all placeholder:text-gray-300"
                                suppressHydrationWarning
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <button className="w-full bg-[#F8FAFC] text-gray-400 rounded-2xl py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-pink-50 hover:text-[#FF2C79] transition-all">
                            RESET
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-[3rem] border border-gray-100 bg-white shadow-sm overflow-hidden p-2">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead>
                            <tr className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-50 bg-[#F8FAFC]/30">
                                <th className="py-8 px-10">ORDER ID</th>
                                <th className="py-8 px-8">CUSTOMER</th>
                                <th className="py-8 px-8">TOTAL PRICE</th>
                                <th className="py-8 px-8">PAYMENT STATUS</th>
                                <th className="py-8 px-8">SHIPPING STATUS</th>
                                <th className="py-8 px-10 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {ordersLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="py-8 px-10">
                                            <Skeleton className="h-16 w-full rounded-[1.5rem]" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-32 text-center">
                                        <div className="bg-gray-50 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                            <ShoppingBag className="h-8 w-8 text-gray-200" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No orders found</p>
                                    </td>
                                </tr>
                            ) : filteredOrders.map((order: Order) => (
                                <tr key={order._id} className="group hover:bg-pink-50/10 transition-all duration-300">
                                    <td className="py-8 px-10">
                                        <span className="text-[11px] font-black text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 uppercase tracking-tight">#{order._id.slice(-8).toUpperCase()}</span>
                                    </td>
                                    <td className="py-8 px-8">
                                        <div className="flex items-center gap-5">
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-gray-50 shadow-sm transition-transform group-hover:rotate-6">
                                                <Image
                                                    src={`https://ui-avatars.com/api/?name=${(order.user as any)?.name || 'Guest'}&background=FF2C79&color=fff&bold=true`}
                                                    alt={(order.user as any)?.name || 'Guest'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900 transition-colors group-hover:text-[#FF2C79] uppercase tracking-tight">{(order.user as any)?.name || 'Guest User'}</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-8">
                                        <span className="text-sm font-black text-gray-900 tracking-tight">₹{order.totalPrice.toLocaleString()}</span>
                                    </td>
                                    <td className="py-8 px-8">
                                        <span className={cn(
                                            "inline-flex items-center rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm",
                                            order.orderStatus === 'delivered' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                order.orderStatus === 'pending' ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-red-50 text-red-600 border border-red-100"
                                        )}>
                                            {order.orderStatus === 'delivered' ? 'Paid' : 
                                             order.orderStatus === 'cancelled' ? 'Cancelled' : 
                                             order.orderStatus === 'returned' ? 'Returned' :
                                             order.orderStatus === 'return_requested' ? 'Needs Review' : 'Processing'}
                                        </span>
                                    </td>
                                    <td className="py-8 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-2 w-2 rounded-full",
                                                order.orderStatus === 'pending' ? "bg-blue-400 animate-pulse" :
                                                    order.orderStatus === 'shipped' ? "bg-purple-500" :
                                                        order.orderStatus === 'delivered' ? "bg-emerald-500" : 
                                                        order.orderStatus === 'return_requested' ? "bg-orange-500 animate-bounce" : "bg-red-500"
                                            )} />
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                order.orderStatus === 'pending' ? "text-blue-400" :
                                                    order.orderStatus === 'shipped' ? "text-purple-500" :
                                                        order.orderStatus === 'delivered' ? "text-emerald-500" : "text-red-500"
                                            )}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-8 px-10 text-right">
                                        <div className="flex justify-end gap-2">
                                            {order.orderStatus === 'return_requested' ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleProcessReturn(order._id, 'returned')}
                                                        className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleProcessReturn(order._id, 'delivered')}
                                                        className="px-4 py-2 rounded-xl bg-red-500 text-white text-[9px] font-black uppercase tracking-wider hover:bg-red-600 transition-all shadow-lg shadow-red-100"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="px-6 py-3 rounded-2xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-[#FF2C79] hover:shadow-lg hover:shadow-pink-100 shadow-sm active:scale-95">
                                                    Inspect
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-10 py-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        SHOWING <span className="text-gray-900">01 — 10</span> OF {orders.length}
                    </p>
                    <div className="flex items-center gap-3">
                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gray-900 text-white text-[11px] font-black shadow-xl shadow-gray-200">01</button>
                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-900 text-[11px] font-black">02</button>
                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

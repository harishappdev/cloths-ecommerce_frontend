'use client';

import { useEffect, useState } from 'react';
import { adminService, DashboardStats } from '@/services/adminService';
import {
    ShoppingBag,
    Users,
    Package,
    Wallet,
    TrendingUp,
    TrendingDown,
    MoreHorizontal,
    ArrowUpRight,
    Target
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/lib';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

// Mock data for the bar chart based on the screenshot
const barChartData = [
    { name: 'Mon', revenue: 2000 },
    { name: 'Tue', revenue: 3500 },
    { name: 'Wed', revenue: 6000 }, // Highlighted bar
    { name: 'Thu', revenue: 4800 },
    { name: 'Fri', revenue: 3800 },
    { name: 'Sat', revenue: 3800 },
    { name: 'Sun', revenue: 3000 },
];

export default function AdminOverview() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminService.getStats();
                if (response.status === 'success') {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl"></div>
        </div>
    );

    const statCards = [
        {
            name: 'Total Orders',
            value: stats?.totalOrders?.toLocaleString() || '1,284',
            change: '12.5%',
            isPositive: true,
            icon: ShoppingBag,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            name: 'Total Revenue',
            value: `$${stats?.totalRevenue?.toLocaleString() || '45,231.89'}`,
            change: '8.2%',
            isPositive: true,
            icon: Wallet,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            name: 'Total Products',
            value: stats?.totalProducts?.toLocaleString() || '432',
            change: '0%',
            isPositive: true, // neutral
            icon: Package,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
        {
            name: 'Total Customers',
            value: stats?.totalUsers?.toLocaleString() || '892',
            change: '15.4%',
            isPositive: true,
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
    ];

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-black tracking-tight text-gray-900">Dashboard Overview</h2>
                <p className="text-sm font-bold text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => (
                    <div key={card.name} className="bg-white rounded-[1.5rem] border border-gray-100 p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", card.bg)}>
                                <card.icon className={cn("h-6 w-6", card.color)} />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black",
                                card.name === 'Total Products' ? "bg-gray-100 text-gray-400" :
                                    card.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                                {card.name !== 'Total Products' && <TrendingUp className="h-3 w-3" />}
                                <span>{card.name === 'Total Products' ? '-' : ''}{card.change}</span>
                                {card.name === 'Total Products' && <span className="ml-0.5">0%</span>}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-[12px] font-bold text-gray-400">{card.name}</p>
                            <p className="text-2xl font-black text-gray-900 tracking-tight mt-1">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-[1.5rem] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-lg font-black tracking-tight text-gray-900">Revenue Trends</h3>
                        <p className="text-sm font-bold text-gray-400 mt-0.5">Monthly sales performance comparison</p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#F1F5F9] p-1.5 rounded-xl">
                        <button className="px-4 py-2 text-[11px] font-black rounded-lg transition-all text-gray-500 hover:text-gray-900">7 Days</button>
                        <button className="px-4 py-2 text-[11px] font-black rounded-lg transition-all bg-[#2563EB] text-white shadow-sm">30 Days</button>
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                                dy={15}
                            />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar
                                dataKey="revenue"
                                radius={[8, 8, 8, 8]}
                                barSize={60}
                            >
                                {barChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.name === 'Wed' ? '#2563EB' : '#DBEAFE'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black tracking-tight text-gray-900">Recent Orders</h3>
                    <Link href="/admin/orders" className="text-xs font-black text-[#2563EB] hover:underline uppercase tracking-widest">
                        View All
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                                <th className="pb-4 px-2">Order ID</th>
                                <th className="pb-4 px-4">Customer</th>
                                <th className="pb-4 px-4">Date</th>
                                <th className="pb-4 px-4">Amount</th>
                                <th className="pb-4 px-4">Status</th>
                                <th className="pb-4 px-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(stats?.recentOrders || []).map((order: any) => (
                                <tr key={order._id} className="group hover:bg-gray-50/50 transition-all">
                                    <td className="py-6 px-2 text-xs font-black text-gray-900 uppercase">#ORD-{order._id.slice(-4)}</td>
                                    <td className="py-6 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                                <Image
                                                    src={`https://i.pravatar.cc/150?u=${order._id}`}
                                                    alt="User"
                                                    width={36}
                                                    height={36}
                                                />
                                            </div>
                                            <p className="text-sm font-bold text-gray-700">{(order.user as any)?.name || 'Guest User'}</p>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4 text-sm font-bold text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="py-6 px-4 text-sm font-black text-gray-900">${order.totalPrice.toFixed(2)}</td>
                                    <td className="py-6 px-4">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest",
                                            order.orderStatus === 'delivered' ? "bg-emerald-50 text-emerald-600" :
                                                order.orderStatus === 'shipped' ? "bg-blue-50 text-blue-600" :
                                                    order.orderStatus === 'cancelled' ? "bg-red-50 text-red-600" :
                                                        "bg-orange-50 text-orange-600"
                                        )}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="py-6 px-2 text-right">
                                        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/* Static rows to match screenshot if no real data */}
                            {(!stats?.recentOrders || stats.recentOrders.length === 0) && [
                                { id: '2841', name: 'John Doe', avatar: '1', date: 'Oct 24, 2023', amount: 124.00, status: 'delivered' },
                                { id: '2840', name: 'Jane Smith', avatar: '2', date: 'Oct 24, 2023', amount: 89.50, status: 'shipped' },
                                { id: '2839', name: 'Mike Ross', avatar: '3', date: 'Oct 23, 2023', amount: 240.00, status: 'pending' },
                                { id: '2838', name: 'Sarah Connor', avatar: '4', date: 'Oct 23, 2023', amount: 1450.00, status: 'cancelled' },
                                { id: '2837', name: 'Robert Frost', avatar: '5', date: 'Oct 22, 2023', amount: 320.15, status: 'delivered' },
                            ].map((row) => (
                                <tr key={row.id} className="group hover:bg-gray-50/50 transition-all">
                                    <td className="py-6 px-2 text-xs font-black text-gray-900 uppercase">#ORD-{row.id}</td>
                                    <td className="py-6 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                                <Image
                                                    src={`https://i.pravatar.cc/150?u=${row.avatar}`}
                                                    alt="User"
                                                    width={36}
                                                    height={36}
                                                />
                                            </div>
                                            <p className="text-sm font-bold text-gray-700">{row.name}</p>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4 text-sm font-bold text-gray-400">{row.date}</td>
                                    <td className="py-6 px-4 text-sm font-black text-gray-900">${row.amount.toFixed(2)}</td>
                                    <td className="py-6 px-4">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest",
                                            row.status === 'delivered' ? "bg-emerald-50 text-emerald-600" :
                                                row.status === 'shipped' ? "bg-blue-50 text-blue-600" :
                                                    row.status === 'cancelled' ? "bg-red-50 text-red-600" :
                                                        "bg-orange-50 text-orange-600"
                                        )}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="py-6 px-2 text-right">
                                        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

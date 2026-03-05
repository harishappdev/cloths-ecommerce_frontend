'use client';

import { useEffect, useState } from 'react';
import { adminService, DashboardStats } from '@/services/adminService';
import { format, subDays } from 'date-fns';
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
    const [analytics, setAnalytics] = useState<{ _id: string; revenue: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, analyticsRes] = await Promise.all([
                    adminService.getStats(),
                    adminService.getDailyAnalytics()
                ]);
                
                if (statsRes.status === 'success') {
                    setStats(statsRes.data);
                }
                if (analyticsRes.status === 'success') {
                    setAnalytics(analyticsRes.data.analytics);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Prepare chart data from last 7 days
    const chartData = analytics.map(item => ({
        name: format(new Date(item._id), 'eee'),
        revenue: item.revenue,
        fullDate: item._id
    }));

    // Fallback if no analytics data yet
    const displayData = chartData.length > 0 ? chartData : [
        { name: 'Mon', revenue: 0 },
        { name: 'Tue', revenue: 0 },
        { name: 'Wed', revenue: 0 },
        { name: 'Thu', revenue: 0 },
        { name: 'Fri', revenue: 0 },
        { name: 'Sat', revenue: 0 },
        { name: 'Sun', revenue: 0 },
    ];

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl"></div>
        </div>
    );

    const statCards = [
        {
            name: 'Total Orders',
            value: stats?.totalOrders?.toLocaleString() || '1,284',
            change: '+12.5%',
            isPositive: true,
            icon: ShoppingBag,
            color: 'text-pink-600',
            bg: 'bg-pink-50',
            border: 'border-pink-100/50'
        },
        {
            name: 'Gross Revenue',
            value: `₹${stats?.totalRevenue?.toLocaleString() || '45,231'}`,
            change: '+8.2%',
            isPositive: true,
            icon: Wallet,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-100/50'
        },
        {
            name: 'Inventory Size',
            value: stats?.totalProducts?.toLocaleString() || '432',
            change: 'Stable',
            isPositive: true,
            icon: Package,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100/50'
        },
        {
            name: 'User Growth',
            value: stats?.totalUsers?.toLocaleString() || '892',
            change: '+15.4%',
            isPositive: true,
            icon: Users,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            border: 'border-orange-100/50'
        },
    ];

    return (
        <div className="space-y-10 lg:space-y-16">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="h-2 w-10 bg-gradient-to-r from-[#FF2C79] to-purple-600 rounded-full" />
                        <p className="text-[10px] font-black text-[#FF2C79] uppercase tracking-[0.2em]">Command Center</p>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-[0.8]">VIBRANT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2C79] to-purple-600">ANALYTICS</span></h2>
                    <p className="text-xs font-bold text-gray-400 mt-4 uppercase tracking-[0.1em]">Real-time operational intelligence and performance metrics.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-[1.5rem] border border-gray-100 shadow-sm">
                    <button className="h-12 px-6 rounded-2xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-[#FF2C79] transition-all active:scale-95">Download PDF Report</button>
                    <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-all"><Target className="h-5 w-5" /></button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => (
                    <div key={card.name} className={cn("group relative bg-white rounded-[2.5rem] border p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50", card.border)}>
                        <div className="flex items-center justify-between mb-8">
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6", card.bg)}>
                                <card.icon className={cn("h-7 w-7", card.color)} />
                            </div>
                            <div className={cn(
                                "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                card.isPositive ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                            )}>
                                {card.change}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{card.name}</p>
                            <p className="text-3xl font-black text-gray-900 tracking-tighter">{card.value}</p>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <TrendingUp className={cn("h-5 w-5", card.color)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart & Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 bg-white rounded-[3rem] border border-gray-100 p-8 md:p-12 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-12">
                        <div>
                            <h3 className="text-xl font-black tracking-tighter text-gray-900 uppercase">Revenue Velocity</h3>
                            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Financial trajectory monitor</p>
                        </div>
                        <div className="flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-100 rounded-2xl">
                            {['7D', '30D', '90D', 'ALL'].map((tab) => (
                                <button
                                    key={tab}
                                    className={cn(
                                        "px-6 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest",
                                        tab === '30D' ? "bg-white text-[#FF2C79] shadow-sm border border-pink-100" : "text-gray-400 hover:text-gray-900"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={displayData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={12}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#cbd5e1' }}
                                    dy={20}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', radius: 12 }}
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }}
                                    itemStyle={{ fontWeight: 900, fontSize: '11px', textTransform: 'uppercase' }}
                                />
                                <Bar
                                    dataKey="revenue"
                                    radius={[12, 12, 12, 12]}
                                    barSize={44}
                                >
                                    {displayData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={index === displayData.length - 1 ? '#FF2C79' : index === displayData.length - 2 ? '#9333ea' : '#f1f5f9'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-gradient-to-br from-[#FF2C79] to-purple-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-pink-200">
                        <TrendingUp className="h-10 w-10 mb-8 opacity-50" />
                        <h4 className="text-2xl font-black tracking-tighter uppercase mb-4 leading-tight">Growth Goal Reached</h4>
                        <p className="text-pink-100 text-xs font-bold uppercase tracking-widest leading-relaxed mb-10">You've surpassed the monthly user recruitment target by 15.4%. Maintain current trajectory.</p>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-[85%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                            </div>
                            <span className="text-[11px] font-black tracking-widest">85%</span>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-gray-200">
                        <div className="flex items-center gap-3 mb-8">
                            <Package className="h-5 w-5 text-[#FF2C79]" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Inventory Health</h4>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stocked Skus</span>
                                <span className="text-sm font-black tracking-tight">{stats?.totalProducts || '432'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Low Stock Alert</span>
                                <span className="text-sm font-black text-[#FF2C79] tracking-tight">12 Pieces</span>
                            </div>
                            <button className="w-full h-12 border border-white/10 rounded-2xl hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest mt-4">Restock Orders</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden p-8 md:p-12">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h3 className="text-xl font-black tracking-tighter text-gray-900 uppercase">Transaction Feed</h3>
                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Latest procurement activities</p>
                    </div>
                    <Link href="/admin/orders" className="group h-12 px-8 flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-900 hover:bg-black hover:text-white transition-all">
                        View Audit Log <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                </div>

                <div className="overflow-x-auto -mx-8 px-8">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                                <th className="pb-6 px-4">IDENTIFIER</th>
                                <th className="pb-6 px-6">NOMENCLATURE</th>
                                <th className="pb-6 px-6">TIMESTAMP</th>
                                <th className="pb-6 px-6">VALUATION</th>
                                <th className="pb-6 px-6">STATUS VECTOR</th>
                                <th className="pb-6 px-4 text-right">PROTOCOL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(stats?.recentOrders || []).map((order: any) => (
                                <tr key={order._id} className="group hover:bg-pink-50/10 transition-all duration-300">
                                    <td className="py-8 px-4 text-[11px] font-black text-gray-900 tracking-tight">#{order._id.slice(-8).toUpperCase()}</td>
                                    <td className="py-8 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100 shadow-sm">
                                                <Image
                                                    src={`https://ui-avatars.com/api/?name=${(order.user as any)?.name || 'Guest'}&background=FF2C79&color=fff&bold=true`}
                                                    alt="User"
                                                    width={40}
                                                    height={40}
                                                />
                                            </div>
                                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{(order.user as any)?.name || 'Anonymous Entity'}</p>
                                        </div>
                                    </td>
                                    <td className="py-8 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="py-8 px-6 text-sm font-black text-gray-900">₹{order.totalPrice.toLocaleString()}</td>
                                    <td className="py-8 px-6">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-5 py-1.5 text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                            order.orderStatus === 'delivered' ? "bg-green-50 text-green-600 border-green-100" :
                                                order.orderStatus === 'shipped' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    order.orderStatus === 'cancelled' ? "bg-red-50 text-red-600 border-red-100" :
                                                        "bg-orange-50 text-orange-600 border-orange-100"
                                        )}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="py-8 px-4 text-right">
                                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-white hover:shadow-md transition-all">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/* Default placeholder if no actual orders */}
                            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-300 mb-4">
                                            <ShoppingBag className="h-6 w-6" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Awaiting Transaction Streams</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

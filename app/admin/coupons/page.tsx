'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { 
    Ticket, 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Trash2, 
    Calendar, 
    Zap, 
    CheckCircle2, 
    XCircle,
    Copy,
    TrendingUp,
    Gift,
    Clock,
    X,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/utils/lib';
import { toast } from 'react-hot-toast';
import { couponService, Coupon } from '@/services/couponService';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/Skeleton';

export default function CouponsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountType: 'percentage' as 'percentage' | 'flat',
        discount: 0,
        minCartValue: 0,
        usageLimit: 100,
        expiryDate: '',
        isActive: true
    });
    const { data: couponsData, isLoading: couponsLoading } = useSWR('/coupons');
    const coupons = couponsData?.data?.coupons || [];

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await couponService.deleteCoupon(id);
            toast.success('Coupon deleted');
            mutate('/coupons');
        } catch (error) {
            toast.error('Failed to delete coupon');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await couponService.createCoupon(newCoupon);
            toast.success('Coupon created successfully', {
                icon: '🎫',
                style: {
                    borderRadius: '16px',
                    background: '#000',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }
            });
            setIsModalOpen(false);
            setNewCoupon({
                code: '',
                discountType: 'percentage',
                discount: 0,
                minCartValue: 0,
                usageLimit: 100,
                expiryDate: '',
                isActive: true
            });
            mutate('/coupons');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create coupon');
        }
    };

    const filteredCoupons = coupons.filter((c: Coupon) => 
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { label: 'Total Active', value: coupons.filter((c: Coupon) => c.isActive).length, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { label: 'Total Used', value: coupons.reduce((acc: number, curr: Coupon) => acc + curr.usageCount, 0), icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Expiring Soon', value: coupons.filter((c: Coupon) => new Date(c.expiryDate).getTime() - Date.now() < 86400000 * 7).length, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section with glass background */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-[#FF2C79] flex items-center justify-center text-white shadow-xl shadow-pink-100">
                            <Ticket className="h-5 w-5" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight uppercase">
                            Discount <span className="text-[#FF2C79]">Nexus</span>
                        </h1>
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                        Campaign Management & Intelligence
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group relative px-8 py-4 bg-gray-950 text-white rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-gray-200"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF2C79] to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center gap-3">
                            <Plus className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Generate Intel</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                        <div className="flex items-center gap-4">
                            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-gray-900 mt-0.5 tracking-tighter">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* List & Search */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/30">
                    <div className="relative flex-grow max-w-md group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#FF2C79] transition-colors" />
                        <input
                            type="text"
                            placeholder="FILTER BY CODE..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-pink-500/5 focus:border-pink-200 transition-all outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Campaign Asset</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Value Metric</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Usage Depth</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Time Horizon</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Asset Status</th>
                                <th className="px-8 py-6 text-right text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {couponsLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="py-8 px-10">
                                            <Skeleton className="h-16 w-full rounded-[1.5rem]" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredCoupons.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-32 text-center">
                                        <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Ticket className="h-8 w-8 text-gray-200" />
                                        </div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No Active Assets Found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredCoupons.map((coupon) => (
                                    <tr key={coupon._id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#FF2C79]">
                                                    <Gift className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 tracking-tight uppercase group-hover:text-[#FF2C79] transition-colors">{coupon.code}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Asset ID: {coupon._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-gray-950">
                                                    {coupon.discountType === 'flat' ? '₹' : ''}{coupon.discount}{coupon.discountType === 'percentage' ? '%' : ''}
                                                </span>
                                                <span className="px-2 py-0.5 bg-gray-100 text-[8px] font-black uppercase tracking-widest rounded text-gray-500 whitespace-nowrap">
                                                    {coupon.discountType}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5 min-w-[120px]">
                                                <div className="flex justify-between text-[9px] font-black tracking-widest uppercase">
                                                    <span className="text-gray-400">{coupon.usageCount} USED</span>
                                                    <span className="text-primary">{coupon.usageLimit} LIMIT</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full transition-all duration-1000"
                                                        style={{ width: `${Math.min((coupon.usageCount / coupon.usageLimit) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2.5">
                                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-[10px] font-black text-gray-600 uppercase">
                                                    {format(new Date(coupon.expiryDate), 'MMM dd, yyyy')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {coupon.isActive ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
                                                    <XCircle className="h-3 w-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Disabled</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => handleDelete(coupon._id)}
                                                className="h-10 w-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)} />
                    
                    <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-3xl p-10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-gray-100">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Deploy New <span className="text-primary">Asset</span></h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Configure Promotion Strategy</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-all">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Voucher Code</label>
                                    <div className="relative">
                                        <Ticket className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="E.G. SUMMER2024"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-black uppercase tracking-widest focus:bg-white focus:ring-4 focus:ring-pink-500/5 focus:border-primary transition-all active:scale-[0.99]"
                                            value={newCoupon.code}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:ring-4 focus:ring-pink-500/5 focus:border-primary transition-all outline-none"
                                        value={newCoupon.discountType}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as 'percentage' | 'flat' })}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="flat">Fixed Amount (₹)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Value</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-black focus:bg-white focus:ring-4 focus:ring-pink-500/5 focus:border-primary transition-all outline-none"
                                        value={newCoupon.discount}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discount: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Min Store Value (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-black focus:bg-white focus:ring-4 focus:ring-pink-500/5 focus:border-primary transition-all outline-none"
                                        value={newCoupon.minCartValue}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, minCartValue: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Usage Cap</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-black focus:bg-white focus:ring-4 focus:ring-pink-500/5 focus:border-primary transition-all outline-none"
                                        value={newCoupon.usageLimit}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Horizon</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="date"
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-[11px] font-black uppercase tracking-widest focus:bg-white focus:ring-4 focus:ring-pink-500/5 focus:border-primary transition-all outline-none"
                                            value={newCoupon.expiryDate}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    className="w-full py-5 bg-gray-950 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-gray-200 hover:bg-primary transition-all active:scale-95"
                                >
                                    Confirm Strategic Activation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

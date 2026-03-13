'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import { orderService } from '@/services/orderService';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'react-hot-toast';
import {
    User,
    Mail,
    Shield,
    ShieldCheck,
    Package,
    Heart,
    ChevronRight,
    MapPin,
    TrendingUp,
    Edit3
} from 'lucide-react';
import { cn } from '@/utils/lib';
import AddressManager from '@/components/profile/AddressManager';

export default function ProfilePage() {
    const { user, logout, updateUser } = useAuth();
    const { wishlist } = useWishlist();
    const [orderCount, setOrderCount] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeView, setActiveView] = useState<'profile' | 'addresses'>('profile');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+91 9999 000 000',
        dob: 'Not Provided'
    });

    useEffect(() => {
        const fetchOrderCount = async () => {
            try {
                const response = await orderService.getMyOrders();
                if (response.status === 'success') {
                    setOrderCount(response.data.orders.length);
                }
            } catch (error) {
                console.error('Failed to fetch orders for profile summary', error);
            }
        };
        if (user) fetchOrderCount();
    }, [user]);

    if (!user) return null;

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await userService.updateMe({
                name: formData.name,
                email: formData.email
            });
            if (response.status === 'success') {
                updateUser(response.data.user);
                setIsEditing(false);
                toast.success('Profile updated successfully!');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="bg-[#FAFAFB] min-h-screen">
                <div className="container mx-auto px-4 py-10 md:py-16">
                    <div className="max-w-5xl mx-auto">
                        {/* Header Section - Refined Compact Premium */}
                        <div className="mb-10 md:mb-16">
                            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
                                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                                    <div className="relative group">
                                        <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-tr from-[#FF2C79] to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-pink-100 transition-transform group-hover:rotate-6 group-hover:scale-105 duration-500">
                                            {user.name?.[0].toUpperCase() || 'U'}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#FF2C79] border border-gray-50">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div className="text-center md:text-left space-y-2">
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <span className="h-1 w-6 bg-[#FF2C79] rounded-full" />
                                            <p className="text-[9px] font-black text-[#FF2C79] uppercase tracking-[0.2em]">Member Profile</p>
                                        </div>
                                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">{user.name}</h1>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                            <div className="px-3 py-1.5 bg-white rounded-lg text-[9px] font-black text-gray-400 border border-gray-100 uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                                                <Mail className="h-3 w-3 text-gray-300" />
                                                {user.email}
                                            </div>
                                            <div className="px-3 py-1.5 bg-gray-900 rounded-lg text-[9px] font-black text-white uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                                                <ShieldCheck className="h-3 w-3" />
                                                {user.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => logout()}
                                        className="h-12 px-6 rounded-xl bg-white border border-gray-100 text-[9px] font-black text-red-500 uppercase tracking-[0.2em] hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
                                    >
                                        TERMINATE
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                            {/* Left Column: Premium Sidebar */}
                            <div className="lg:col-span-4 space-y-8">
                                <div className="bg-white rounded-[2.5rem] p-3 shadow-sm border border-gray-100 overflow-hidden">
                                    <p className="px-5 pt-5 pb-3 text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">Account Hub</p>
                                    <nav className="space-y-1">
                                        <button 
                                            onClick={() => setActiveView('profile')}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                activeView === 'profile' 
                                                    ? "bg-[#FF2C79] text-white shadow-lg shadow-pink-100" 
                                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                        >
                                            <User className={cn("h-4 w-4", activeView === 'profile' ? "text-white" : "text-gray-400")} />
                                            <span>Identity Intel</span>
                                            {activeView === 'profile' && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />}
                                        </button>

                                        <button 
                                            onClick={() => setActiveView('addresses')}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                activeView === 'addresses' 
                                                    ? "bg-[#FF2C79] text-white shadow-lg shadow-pink-100" 
                                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                        >
                                            <MapPin className={cn("h-4 w-4", activeView === 'addresses' ? "text-white" : "text-gray-400")} />
                                            <span>Locations</span>
                                            {activeView === 'addresses' && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />}
                                        </button>

                                        <Link 
                                            href="/orders"
                                            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] font-black text-gray-500 hover:bg-gray-50 hover:text-gray-900 uppercase tracking-widest transition-all"
                                        >
                                            <Package className="h-4 w-4 text-gray-400" />
                                            <span>Order Logs</span>
                                        </Link>

                                        <Link 
                                            href="/wishlist"
                                            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] font-black text-gray-500 hover:bg-gray-50 hover:text-gray-900 uppercase tracking-widest transition-all"
                                        >
                                            <Heart className="h-4 w-4 text-gray-400" />
                                            <span>Curated</span>
                                        </Link>
                                    </nav>
                                </div>

                                {/* Summary Card */}
                                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-gray-200 overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                        <TrendingUp className="h-16 w-16" />
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF2C79] mb-6">Activity Pulse</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end border-b border-white/10 pb-3">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Orders</span>
                                                <span className="text-2xl font-black italic tracking-tighter leading-none">{orderCount}</span>
                                            </div>
                                            <div className="flex justify-between items-end border-b border-white/10 pb-3">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Wishlist</span>
                                                <span className="text-2xl font-black italic tracking-tighter leading-none">{wishlist.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                             {/* Right Column: Dynamic Viewport */}
                            <div className="lg:col-span-8">
                                {activeView === 'profile' ? (
                                    <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-16">
                                            <div>
                                                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Identity Detail</h2>
                                                <p className="text-[10px] font-black text-gray-400 uppercase mt-2 tracking-widest">Core personal information and security context.</p>
                                            </div>
                                            {!isEditing && (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="h-12 px-8 rounded-2xl bg-gray-50 text-[10px] font-black text-gray-900 uppercase tracking-widest hover:bg-[#FF2C79] hover:text-white transition-all shadow-sm flex items-center gap-2"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                    Modify Data
                                                </button>
                                            )}
                                        </div>

                                        {isEditing ? (
                                            <form onSubmit={handleUpdateProfile} className="space-y-12">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black text-[#FF2C79] uppercase tracking-[0.2em] ml-1">Designation</label>
                                                        <div className="relative group">
                                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-[#FF2C79] transition-colors" />
                                                            <input
                                                                type="text"
                                                                value={formData.name}
                                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                className="w-full bg-gray-50 border border-gray-100 rounded-3xl py-5 pl-16 pr-6 text-sm font-black focus:bg-white focus:ring-4 focus:ring-pink-500/5 focus:border-pink-200 transition-all outline-none"
                                                                placeholder="Enter full name"
                                                                required
                                                                suppressHydrationWarning
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black text-[#FF2C79] uppercase tracking-[0.2em] ml-1">Digital Mail</label>
                                                        <div className="relative group">
                                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-[#FF2C79] transition-colors" />
                                                            <input
                                                                type="email"
                                                                value={formData.email}
                                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                                className="w-full bg-gray-50 border border-gray-100 rounded-3xl py-5 pl-16 pr-6 text-sm font-black focus:bg-white focus:ring-4 focus:ring-pink-500/5 focus:border-pink-200 transition-all outline-none"
                                                                placeholder="Enter email address"
                                                                required
                                                                suppressHydrationWarning
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-6 pt-8">
                                                    <button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className="flex-1 h-16 bg-gray-900 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-2xl shadow-gray-200 hover:bg-[#FF2C79] transition-all disabled:opacity-50"
                                                    >
                                                        {isLoading ? 'SYNCING...' : 'COMMIT CHANGES'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            setFormData({
                                                                name: user.name,
                                                                email: user.email,
                                                                phone: '+91 9999 000 000',
                                                                dob: 'Not Provided'
                                                            });
                                                        }}
                                                        className="flex-1 h-16 bg-white border-2 border-gray-100 text-gray-400 font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-gray-50 transition-all"
                                                    >
                                                        DISCARD
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="space-y-4 group">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-[#FF2C79] pl-3">Designation</p>
                                                    <p className="text-xl font-black text-gray-900 group-hover:text-[#FF2C79] transition-colors">{user.name}</p>
                                                </div>
                                                <div className="space-y-4 group">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-gray-200 pl-3">Digital Mail</p>
                                                    <p className="text-xl font-black text-gray-900 group-hover:text-[#FF2C79] transition-colors">{user.email}</p>
                                                </div>
                                                <div className="space-y-4 group">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-gray-200 pl-3">Mobile Vector</p>
                                                    <p className="text-xl font-black text-gray-900 group-hover:text-[#FF2C79] transition-colors uppercase italic">+91 9999 000 000</p>
                                                </div>
                                                <div className="space-y-4 group">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-gray-200 pl-3">Temporal Origin</p>
                                                    <p className="text-xl font-black text-gray-900 group-hover:text-[#FF2C79] transition-colors italic">UNSPECIFIED</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <AddressManager onBack={() => setActiveView('profile')} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

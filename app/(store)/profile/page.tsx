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
    Calendar,
    Package,
    Heart,
    ChevronRight,
    MapPin,
    LogOut,
    ExternalLink,
    Settings,
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
            <div className="bg-[#f8f9fa] min-h-screen">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Header Section */}
                        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl shadow-gray-200">
                            <div className="absolute inset-0 bg-gradient-vibrant opacity-90" />
                            <div className="relative px-8 py-12 flex flex-col md:flex-row items-center gap-8">
                                <div className="h-24 w-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-black text-white border-2 border-white/30 shadow-2xl">
                                    {user.name?.[0].toUpperCase() || 'U'}
                                </div>
                                <div className="text-center md:text-left">
                                    <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight mb-2">{user.name}</h1>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-bold text-white border border-white/20 flex items-center gap-1.5">
                                            <Mail className="h-3 w-3" />
                                            {user.email}
                                        </div>
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-bold text-white border border-white/20 flex items-center gap-1.5 uppercase">
                                            <Shield className="h-3 w-3" />
                                            {user.role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Stats & Quick Links */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Account Summary</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link href="/orders" className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 hover:bg-blue-100/50 transition-colors text-left">
                                            <Package className="h-5 w-5 text-blue-500 mb-2" />
                                            <p className="text-xl font-black text-blue-900">{orderCount}</p>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase">Orders</p>
                                        </Link>
                                        <Link href="/wishlist" className="bg-pink-50/50 p-4 rounded-xl border border-pink-100/50 hover:bg-pink-100/50 transition-colors text-left">
                                            <Heart className="h-5 w-5 text-primary mb-2" />
                                            <p className="text-xl font-black text-pink-900">{wishlist.length}</p>
                                            <p className="text-[10px] font-bold text-primary uppercase">Wishlist</p>
                                        </Link>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-2">
                                    <Link href="/orders" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group text-left">
                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5 text-gray-400" />
                                            <span className="text-sm font-bold text-gray-700">Orders & Returns</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
                                    </Link>
                                    <button 
                                        onClick={() => setActiveView('addresses')}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group text-left w-full",
                                            activeView === 'addresses' && "bg-primary/5 text-primary"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <MapPin className={cn("h-5 w-5", activeView === 'addresses' ? "text-primary" : "text-gray-400")} />
                                            <span className={cn("text-sm font-bold", activeView === 'addresses' ? "text-primary" : "text-gray-700")}>Saved Addresses</span>
                                        </div>
                                        <ChevronRight className={cn("h-4 w-4", activeView === 'addresses' ? "text-primary" : "text-gray-300 group-hover:text-primary transition-colors")} />
                                    </button>
                                    <button className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group text-left">
                                        <div className="flex items-center gap-3">
                                            <Settings className="h-5 w-5 text-gray-400" />
                                            <span className="text-sm font-bold text-gray-700">Account Settings</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => logout()}
                                    className="w-full bg-white text-red-500 border border-red-100 rounded-2xl p-4 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout Session
                                </button>
                            </div>

                             {/* Right Column: Details & Settings */}
                            <div className="lg:col-span-2 space-y-8">
                                {activeView === 'profile' ? (
                                    <>
                                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Personal Details</h2>
                                        {!isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="text-xs font-bold text-primary uppercase hover:underline"
                                            >
                                                Edit Info
                                            </button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                            placeholder="Enter your name"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                        <input
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                            placeholder="Enter your email"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 opacity-50">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Number (Fixed)</label>
                                                    <input
                                                        type="text"
                                                        value={formData.phone}
                                                        disabled
                                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-100 rounded-xl text-sm font-bold cursor-not-allowed"
                                                    />
                                                </div>
                                                <div className="space-y-2 opacity-50">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth (Fixed)</label>
                                                    <input
                                                        type="text"
                                                        value={formData.dob}
                                                        disabled
                                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-100 rounded-xl text-sm font-bold cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-4 pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="flex-1 bg-gradient-to-r from-primary to-purple-600 text-white font-black uppercase text-xs tracking-widest py-3 rounded-xl shadow-lg shadow-pink-100 hover:shadow-pink-200 transition-all disabled:opacity-50"
                                                >
                                                    {isLoading ? 'Updating...' : 'Save Changes'}
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
                                                    className="flex-1 bg-gray-100 text-gray-500 font-black uppercase text-xs tracking-widest py-3 rounded-xl hover:bg-gray-200 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</p>
                                                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                                                <p className="text-sm font-bold text-gray-900">{user.email}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Number</p>
                                                <p className="text-sm font-bold text-gray-900">+91 9999 000 000</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</p>
                                                <p className="text-sm font-bold text-gray-900">Not Provided</p>
                                            </div>
                                        </div>
                                    )}
                                        </div>

                                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight mb-8">Quick Actions</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-primary transition-colors cursor-pointer text-left">
                                                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors mb-4 border border-gray-100">
                                                        <ExternalLink className="h-5 w-5" />
                                                    </div>
                                                    <h4 className="text-sm font-black text-gray-900 uppercase mb-1">Verify Email</h4>
                                                    <p className="text-[11px] font-medium text-gray-500 italic">Secure your account with email verification.</p>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-primary transition-colors cursor-pointer text-left">
                                                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors mb-4 border border-gray-100">
                                                        <Calendar className="h-5 w-5" />
                                                    </div>
                                                    <h4 className="text-sm font-black text-gray-900 uppercase mb-1">Account History</h4>
                                                    <p className="text-[11px] font-medium text-gray-500 italic">View your login activity and sessions.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
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

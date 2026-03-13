'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SWRConfig } from 'swr';
import { swrConfig, prefetch } from '@/utils/swr-config';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    Package,
    Layers,
    ShoppingBag,
    Users,
    Settings,
    ChevronRight,
    Search,
    Bell,
    MessageSquare,
    LogOut,
    Ticket,
    BarChart3
} from 'lucide-react';
import { cn } from '@/utils/lib';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const AdminRoute = dynamic(() => import('@/components/auth/AdminRoute'), { ssr: false });

const sidebarLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, prefetchKey: '/admin/stats' },
    { name: 'Products', href: '/admin/products', icon: Package, prefetchKey: '/products' },
    { name: 'Categories', href: '/admin/categories', icon: Layers, prefetchKey: '/categories' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, prefetchKey: '/orders' },
    { name: 'Customers', href: '/admin/customers', icon: Users, prefetchKey: '/users' },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare, prefetchKey: '/reviews' },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket, prefetchKey: '/coupons' },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = React.useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { user, logout } = useAuth();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Close sidebar on route change on mobile
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    // We remove the !mounted guard to allow the sidebar and header to render on the server (SSR Shell)
    // This makes the UI feel much more responsive on initial load.

    return (
        <SWRConfig value={swrConfig}>
            <div className="flex min-h-screen bg-[#FAFAFB]">
                    {/* Mobile Sidebar Overlay */}
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[60] lg:hidden transition-all duration-500"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    {/* Sidebar */}
                    <aside className={cn(
                        "fixed left-0 top-0 h-full w-[280px] bg-white border-r border-gray-100 z-[70] flex flex-col transition-transform duration-500 ease-in-out lg:translate-x-0 shadow-2xl shadow-gray-200/50",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}>
                        <div className="p-8 pb-4">
                            <Link href="/admin" className="group">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#FF2C79] to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-200 group-hover:rotate-12 transition-transform">
                                        <LayoutDashboard className="h-4 w-4" />
                                    </div>
                                    <h1 className="text-xl font-black text-gray-900 tracking-tighter">Vibrant<span className="text-[#FF2C79]">Hub</span></h1>
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-11">Admin Terminal</p>
                            </Link>
                        </div>

                        <nav className="flex-grow px-4 mt-8 space-y-1.5 overflow-y-auto custom-scrollbar">
                            <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Core Logistics</p>
                            {sidebarLinks.map((link) => {
                                const isActive = pathname === link.href;
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onMouseEnter={() => {
                                            if (link.name === 'Dashboard') {
                                                prefetch('/admin/stats');
                                                prefetch('/admin/analytics/daily');
                                            } else if (link.prefetchKey) {
                                                prefetch(link.prefetchKey);
                                            }
                                        }}
                                        className={cn(
                                            "group flex items-center rounded-2xl px-4 py-3.5 text-[12px] font-black transition-all duration-300",
                                            isActive
                                                ? "bg-[#FF2C79] text-white shadow-xl shadow-pink-100"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <Icon className={cn("mr-3.5 h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-gray-400")} />
                                        <span className="uppercase tracking-widest">{link.name}</span>
                                        {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-auto p-4 border-t border-gray-50 space-y-1.5 bg-gray-50/50">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center px-4 py-4 text-[11px] font-black text-red-500 hover:bg-red-50 rounded-2xl transition-all uppercase tracking-widest"
                            >
                                <LogOut className="mr-3.5 h-5 w-5" />
                                Log Out Terminal
                            </button>

                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 font-bold">
                                        {(user?.name || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-gray-900 truncate uppercase mt-0.5">{user?.name || 'Admin'}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Access Level: High</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-grow flex flex-col min-w-0 lg:ml-[280px]">
                        {/* Header */}
                        <header className="sticky top-0 z-40 h-[80px] lg:h-[100px] bg-white/70 backdrop-blur-xl border-b border-gray-100 px-6 lg:px-12 flex items-center justify-between">
                            <div className="flex items-center gap-6 flex-1">
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="lg:hidden h-12 w-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-all border border-gray-100 shadow-sm"
                                >
                                    <LayoutDashboard className="h-5 w-5" />
                                </button>

                                <div className="relative w-full max-w-[460px] hidden md:block group">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#FF2C79] transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="SEARCH INTEL..."
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] py-3.5 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:bg-white focus:ring-4 focus:ring-pink-500/5 focus:border-pink-200 transition-all outline-none"
                                        suppressHydrationWarning
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 lg:gap-6">
                                <button className="h-12 w-12 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-3.5 right-3.5 h-2.5 w-2.5 rounded-full bg-[#FF2C79] border-2 border-white animate-pulse" />
                                </button>

                                <button className="h-12 w-12 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                                    <MessageSquare className="h-5 w-5" />
                                </button>

                                <div className="h-10 w-[1px] bg-gray-100 mx-2 hidden sm:block" />

                                <div className="items-center gap-4 hidden sm:flex">
                                    <div className="text-right">
                                        <p className="text-[12px] font-black text-gray-900 leading-none uppercase tracking-tighter">{user?.name || 'Administrator'}</p>
                                        <p className="text-[9px] font-black text-[#FF2C79] uppercase mt-1 tracking-widest">Master Control</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl overflow-hidden border-2 border-white shadow-xl shadow-gray-200 bg-gradient-to-tr from-[#FF2C79] to-purple-600 flex items-center justify-center">
                                        <span className="text-sm font-black text-white">
                                            {(user?.name || 'A').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Content Scroll Area */}
                        <main className="p-6 lg:p-12 max-w-[1700px] mx-auto w-full">
                            <AdminRoute>
                                {children}
                            </AdminRoute>
                        </main>
                    </div>
                </div>
            </SWRConfig>
    );
}

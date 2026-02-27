'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const AdminRoute = dynamic(() => import('@/components/auth/AdminRoute'), { ssr: false });
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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

const sidebarLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = React.useState(false);

    const { user, logout } = useAuth();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    if (!mounted) return null;

    return (
        <AdminRoute>
            <div className="flex min-h-screen bg-[#F8FAFB]">
                {/* Sidebar */}
                <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#111827] text-gray-400 z-50 flex flex-col">
                    <div className="p-6">
                        <Link href="/admin" className="block">
                            <h1 className="text-xl font-black text-white tracking-tight">Admin<span className="text-blue-500">Panel</span></h1>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Clothing E-commerce</p>
                        </Link>
                    </div>

                    <nav className="flex-grow px-3 mt-4 space-y-1 overflow-y-auto">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center rounded-xl px-4 py-3 text-[13px] font-bold transition-all duration-200",
                                        isActive
                                            ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/20"
                                            : "hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-gray-500")} />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto p-3 border-t border-white/5 space-y-1">
                        <Link
                            href="/admin/settings"
                            className="flex items-center rounded-xl px-4 py-3 text-[13px] font-bold hover:bg-white/5 hover:text-white transition-all"
                        >
                            <Settings className="mr-3 h-5 w-5 text-gray-500" />
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-3 text-[13px] font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="ml-[260px] flex-grow flex flex-col">
                    {/* Header */}
                    <header className="h-[88px] bg-white border-b px-8 flex items-center justify-between">
                        <div className="relative w-[500px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for anything..."
                                className="w-full bg-[#F1F5F9] border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <button className="relative h-10 w-10 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-full transition-all">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
                            </button>

                            <div className="flex items-center gap-4 pl-4 border-l">
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-900 leading-none">Alex Rivera</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Super Admin</p>
                                </div>
                                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm bg-orange-100 flex items-center justify-center">
                                    <Image
                                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100"
                                        alt="Profile"
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Scroll Area */}
                    <main className="p-10">
                        {children}
                    </main>
                </div>
            </div>
        </AdminRoute>
    );
}

'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
    ShoppingCart,
    User,
    Search,
    Heart,
    Package
} from 'lucide-react';
import { cn } from '@/utils/lib';

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const { totalQuantity } = useCart();

    const navLinks = [
        { name: 'Men', href: '/shop?category=Men' },
        { name: 'Women', href: '/shop?category=Women' },
        { name: 'Kids', href: '/shop?category=Kids' },
        { name: 'Footwear', href: '/shop?category=Footwear' },
        { name: 'Accessories', href: '/shop?category=Accessories' },
        { name: 'Sale', href: '/shop?sale=true', isSale: true },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
            {/* Top Bar / Brand */}
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 md:gap-8">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 shrink-0">
                    <div className="h-8 w-8 bg-[#2563EB] rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-black">FashionHub</span>
                </Link>

                {/* Search Bar (Centered) */}
                <div className="flex-grow max-w-xl relative hidden md:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for products, brands and more..."
                        className="w-full bg-[#f3f4f6] border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                        suppressHydrationWarning
                    />
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-2">
                            <Link href="/profile" className="p-2 text-gray-700 hover:text-[#2563EB] transition-colors">
                                <User className="h-6 w-6" />
                            </Link>
                            <button
                                onClick={logout}
                                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-[#2563EB] text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
                        >
                            <User className="h-4 w-4" />
                            <span>Login</span>
                        </Link>
                    )}

                    <Link href="/wishlist" className="p-2 text-gray-700 hover:text-[#2563EB] transition-colors relative">
                        <Heart className="h-6 w-6" />
                    </Link>

                    <Link href="/cart" className="relative p-2 text-gray-700 hover:text-[#2563EB] transition-colors">
                        <ShoppingCart className="h-6 w-6" />
                        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {totalQuantity || 0}
                        </span>
                    </Link>
                </div>
            </div>

            {/* Bottom Nav Links */}
            <div className="border-t border-gray-50 bg-white">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-center space-x-8 h-10 overflow-x-auto no-scrollbar">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-[#2563EB]",
                                    link.isSale ? "text-red-500" : "text-gray-500"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}

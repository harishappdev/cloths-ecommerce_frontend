'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, User, Search } from 'lucide-react';
import { cn } from '@/utils/lib';
import { useCart } from '@/context/CartContext';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { totalQuantity } = useCart();

    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Shop', href: '/shop', icon: Search },
        { name: 'Bag', href: '/cart', icon: ShoppingBag, count: totalQuantity },
        { name: 'Wishlist', href: '/wishlist', icon: Heart },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-[100] flex justify-between items-center">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-vibrant min-w-[64px]",
                            isActive ? "text-primary scale-110" : "text-gray-400"
                        )}
                    >
                        <div className="relative">
                            <Icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
                            {item.count !== undefined && item.count > 0 && (
                                <span className="absolute -top-1 -right-2 h-4 w-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                                    {item.count}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-bold">{item.name}</span>
                    </Link>
                );
            })}
        </div>
    );
}

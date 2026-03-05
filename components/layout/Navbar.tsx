'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
    ShoppingCart,
    User,
    Search,
    Heart,
    Package,
    Menu,
    X,
    ChevronDown,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/utils/lib';

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const { totalQuantity } = useCart();
    const { wishlist } = useWishlist();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentCategory = searchParams.get('category');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        setMounted(true);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        {
            name: 'Men',
            href: '/shop?category=Men',
            megaMenu: [
                { title: 'Clothing', items: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Jackets'] },
                { title: 'Footwear', items: ['Sneakers', 'Formal Shoes', 'Boots', 'Sandals'] },
                { title: 'Accessories', items: ['Watches', 'Belts', 'Wallets', 'Sunglasses'] },
                { title: 'Featured', items: ['New Arrivals', 'Best Sellers', 'Trending Now'], highlight: true }
            ]
        },
        {
            name: 'Women',
            href: '/shop?category=Women',
            megaMenu: [
                { title: 'Clothing', items: ['Dresses', 'Tops', 'Skirts', 'Trousers', 'Ethnic Wear'] },
                { title: 'Footwear', items: ['Heels', 'Flats', 'Sneakers', 'Boots'] },
                { title: 'Accessories', items: ['Handbags', 'Jewellery', 'Scarves', 'Belts'] },
                { title: 'Featured', items: ['Summer Collection', 'Editor\'s Pick', 'Sale'], highlight: true }
            ]
        },
        { name: 'Kids', href: '/shop?category=Kids' },
        { name: 'Offers', href: '/shop?sale=true', isSale: true },
    ];

    return (
        <header
            className={cn(
                "sticky top-0 z-[100] w-full transition-all duration-300",
                scrolled ? "bg-white shadow-marketplace" : "bg-white border-b border-gray-100"
            )}
        >
            {/* Main Navbar */}
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-20 md:h-24 gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 shrink-0 group">
                        <div className="h-9 w-9 bg-gradient-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-2xl font-heading font-black tracking-tighter text-gray-900">VibrantHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-10 h-full">
                        {navLinks.map((link) => {
                            const isActive = pathname === '/shop' && (
                                (link.href.includes('category=') && currentCategory === link.href.split('category=')[1])
                            );

                            return (
                                <div
                                    key={link.name}
                                    className="relative h-full flex items-center group"
                                    onMouseEnter={() => setActiveMegaMenu(link.megaMenu ? link.name : null)}
                                    onMouseLeave={() => setActiveMegaMenu(null)}
                                >
                                    <Link
                                        href={link.name === 'Offers' ? '/shop?sale=true' : link.href}
                                        className={cn(
                                            "relative text-xs font-bold uppercase tracking-wider transition-vibrant flex items-center gap-1",
                                            isActive ? "text-primary" : link.isSale ? "text-primary px-3 py-1 bg-primary/5 rounded-full" : "text-gray-700 hover:text-primary"
                                        )}
                                    >
                                        {link.name}
                                        {link.megaMenu && <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />}
                                        <span className={cn(
                                            "absolute -bottom-1 left-0 w-full h-[3px] bg-primary transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100",
                                            isActive && "scale-x-100"
                                        )} />
                                    </Link>

                                    {/* Mega Menu Dropdown */}
                                    {link.megaMenu && activeMegaMenu === link.name && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-white border border-gray-100 shadow-2xl rounded-3xl p-10 grid grid-cols-4 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
                                            {link.megaMenu.map((section) => (
                                                <div key={section.title} className="space-y-6">
                                                    <h4 className={cn(
                                                        "text-[10px] font-black uppercase tracking-[0.2em]",
                                                        section.highlight ? "text-blue-600" : "text-black"
                                                    )}>
                                                        {section.title}
                                                    </h4>
                                                    <ul className="space-y-4">
                                                        {section.items.map((item) => (
                                                            <li key={item}>
                                                                <Link
                                                                    href={`/shop?category=${link.name}&subcategory=${item}`}
                                                                    className="text-sm font-medium text-gray-400 hover:text-black transition-colors flex items-center group/item"
                                                                >
                                                                    {item}
                                                                    <ArrowRight className="h-3 w-3 ml-2 opacity-0 -translate-x-2 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0 text-blue-600" />
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                            {/* Featured Image placeholder in Mega Menu */}
                                            <div className="col-span-1 rounded-2xl bg-gray-50 flex items-center justify-center relative overflow-hidden group/img">
                                                <div className="absolute inset-0 bg-black/20 group-hover/img:bg-black/40 transition-colors z-10" />
                                                <div className="relative z-20 text-center p-4">
                                                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Editor's Choice</p>
                                                    <h5 className="text-white font-black text-sm">2024 Collection</h5>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-2 md:space-x-6">
                        {/* Search bar - Marketplace Style */}
                        <div className="relative hidden md:flex items-center group">
                            <input
                                type="text"
                                placeholder="Search for brands, products and more"
                                className="w-64 lg:w-96 bg-gray-100 border border-transparent rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none placeholder:text-gray-500"
                            />
                            <Search className="absolute left-3 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>

                        <div className="flex items-center space-x-1 md:space-x-4">
                            {isAuthenticated ? (
                                <Link href="/profile" className="flex flex-col items-center p-1 text-gray-700 hover:text-primary transition-vibrant">
                                    <User className="h-6 w-6" />
                                    <span className="text-[10px] font-bold mt-0.5">Profile</span>
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="hidden sm:flex flex-col items-center p-1 text-gray-700 hover:text-primary transition-vibrant"
                                >
                                    <User className="h-6 w-6" />
                                    <span className="text-[10px] font-bold mt-0.5">Login</span>
                                </Link>
                            )}

                            <Link href="/wishlist" className="hidden sm:flex flex-col items-center p-1 text-gray-700 hover:text-primary transition-vibrant relative">
                                <Heart className="h-6 w-6" />
                                <span className="text-[10px] font-bold mt-0.5">Wishlist</span>
                                {mounted && wishlist.length > 0 && (
                                    <span className="absolute -top-1 right-1 h-4 w-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>

                            <Link href="/cart" className="group flex flex-col items-center p-1 text-gray-700 hover:text-primary transition-vibrant relative">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="text-[10px] font-bold mt-0.5">Bag</span>
                                {mounted && totalQuantity > 0 && (
                                    <span className="absolute -top-1 right-0 h-4 w-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                                        {totalQuantity}
                                    </span>
                                )}
                            </Link>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2.5 text-black hover:bg-gray-50 rounded-full transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-20 bg-white z-[200] overflow-y-auto animate-in fade-in slide-in-from-right duration-300">
                    <div className="p-4 space-y-8">
                        {/* Mobile Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products, brands and more"
                                className="w-full bg-gray-100 border-none rounded-lg py-4 px-10 text-sm font-medium focus:ring-1 focus:ring-primary outline-none"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>

                        {/* Navigation Links */}
                        <div className="grid grid-cols-1 gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-4 rounded-lg text-sm font-bold tracking-wide transition-vibrant",
                                        link.isSale ? "text-primary bg-primary/5" : "text-gray-900 hover:bg-gray-50"
                                    )}
                                >
                                    <span>{link.name}</span>
                                    <ChevronRight className="h-4 w-4 text-gray-300" />
                                </Link>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                            <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-700">
                                <User className="h-5 w-5" />
                                My Account
                            </Link>
                            <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-700">
                                <Heart className="h-5 w-5" />
                                Wishlist
                            </Link>
                            {isAuthenticated && (
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        logout();
                                    }}
                                    className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-primary"
                                >
                                    <X className="h-5 w-5" />
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}

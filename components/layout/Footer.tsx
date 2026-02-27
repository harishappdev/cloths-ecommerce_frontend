import {
    Twitter,
    Instagram,
    Shirt,
    CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                                <Shirt className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-black">LUXELAYER</span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            Defining modern elegance through premium quality materials and timeless designs. Join our journey to redefine style.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="p-2 text-black hover:text-[#2563EB] transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="p-2 text-black hover:text-[#2563EB] transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-sm font-bold text-black mb-6">Shop</h4>
                        <ul className="space-y-3">
                            {['Men\'s Collection', 'Women\'s Collection', 'Shoes & Footwear', 'Accessories', 'Clearance Sale'].map(link => (
                                <li key={link}>
                                    <a href="#" className={link === 'Clearance Sale' ? "text-sm text-red-500 hover:text-red-600 transition-colors" : "text-sm text-gray-600 hover:text-black transition-colors"}>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-bold text-black mb-6">Company</h4>
                        <ul className="space-y-3">
                            {['About Us', 'Sustainability', 'Careers', 'Store Locator', 'Terms of Service'].map(link => (
                                <li key={link}><a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Stay Connected */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-black mb-6">Stay Connected</h4>
                        <p className="text-sm text-gray-500">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-[#f3f4f6] border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                                suppressHydrationWarning
                            />
                            <button
                                className="w-full bg-[#2563EB] text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all"
                                suppressHydrationWarning
                            >
                                Subscribe Now
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">
                        © 2024 LuxeLayer Fashion Inc. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center"><span className="text-[8px] font-bold text-gray-400">VISA</span></div>
                            <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center"><span className="text-[8px] font-bold text-gray-400">MC</span></div>
                            <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center"><span className="text-[8px] font-bold text-gray-400">AMEX</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

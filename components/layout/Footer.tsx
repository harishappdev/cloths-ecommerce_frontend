import {
    Twitter,
    Instagram,
    Shirt,
    ArrowRight,
    Mail,
    Globe,
    ShieldCheck,
    Truck,
    RefreshCcw
} from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full bg-[#f8f9fa] border-t border-gray-200 mt-20 pt-16 pb-32 md:pb-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                                <Shirt className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase italic text-gray-900">VibrantHub</span>
                        </Link>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-sm">
                            Your ultimate destination for the latest in vibrant, high-energy fashion. Discover trends that define you and styles that inspire.
                        </p>
                        <div className="flex items-center space-x-4">
                            {[Twitter, Instagram, Mail].map((Icon, i) => (
                                <a key={i} href="#" className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:shadow-md transition-vibrant border border-gray-100">
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 mb-6 font-poppins">ONLINE SHOPPING</h4>
                        <ul className="space-y-3">
                            {['Men', 'Women', 'Kids', 'Home & Living', 'Offers'].map(link => (
                                <li key={link}>
                                    <Link href="/shop" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 mb-6 font-poppins">CUSTOMER POLICIES</h4>
                        <ul className="space-y-3">
                            {['Contact Us', 'FAQ', 'T&C', 'Terms of Use', 'Track Orders', 'Shipping', 'Cancellation', 'Returns'].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-4 space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 mb-6 font-poppins">EXPERIENCE VIBRANTHUB APP</h4>
                        <div className="flex gap-4 mb-8">
                            <div className="h-12 w-32 bg-gray-900 rounded-lg flex items-center justify-center p-2 cursor-pointer hover:bg-black transition-colors">
                                <div className="text-white text-[10px] font-bold">GET IT ON <br /><span className="text-xs">Google Play</span></div>
                            </div>
                            <div className="h-12 w-32 bg-gray-900 rounded-lg flex items-center justify-center p-2 cursor-pointer hover:bg-black transition-colors">
                                <div className="text-white text-[10px] font-bold">Download on the <br /><span className="text-xs">App Store</span></div>
                            </div>
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 mb-4 font-poppins">KEEP IN TOUCH</h4>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full"
                            />
                            <button className="bg-primary text-white px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-vital transition-vibrant shadow-lg shadow-primary/20">
                                JOIN
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                        © 2024 VibrantHub. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <Truck className="h-4 w-4" />
                            100% ORIGINAL
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <RefreshCcw className="h-4 w-4" />
                            30 DAYS RETURN
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {['VISA', 'MC', 'AMEX', 'PAYPAL'].map(p => (
                            <div key={p} className="h-8 w-12 bg-white border border-gray-100 rounded flex items-center justify-center text-[8px] font-black text-gray-400">{p}</div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

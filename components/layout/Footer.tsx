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
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-12 lg:gap-20 mb-20 text-center md:text-left">
                    <div className="md:col-span-3 lg:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                                <Shirt className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase italic text-gray-900">StyleNest</span>
                        </Link>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-sm">
                            Your ultimate destination for the latest in premium, high-end fashion. Discover trends that define you and styles that inspire.
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
                    <div className="md:col-span-3 lg:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 italic">Curation</h4>
                        <ul className="space-y-4">
                            {['New Arrivals', 'Best Sellers', 'Trending Now', 'Limited Edition'].map((item) => (
                                <li key={item}>
                                    <Link href="/shop" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-pink-600 transition-colors inline-block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-3 lg:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 italic">Identity</h4>
                        <ul className="space-y-4">
                            {['Our Story', 'Sustainability', 'Ateliers', 'Careers'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-pink-600 transition-colors inline-block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-3 lg:col-span-4 space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 italic">Join the Elite</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto md:mx-0">
                                Be the first to witness our new seasonal edits.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full"
                                suppressHydrationWarning
                            />
                            <button 
                                className="bg-primary text-white px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-vital transition-vibrant shadow-lg shadow-primary/20"
                                suppressHydrationWarning
                            >
                                JOIN
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                            <div key={p} className="h-8 w-12 bg-white border border-gray-100 rounded flex items-center justify-center text-[8px] font-black text-gray-400">{p}</div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

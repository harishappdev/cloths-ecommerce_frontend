'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { cn } from '@/utils/lib';

const BANNERS = [
    {
        id: 1,
        title: "SEASON'S BIGGEST DROP",
        subtitle: "FLAT 50% OFF",
        description: "Explore the latest trends in street wear and casuals.",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
        cta: "Shop Now",
        color: "from-[#FF3F6C] to-[#FF6D3F]",
        tag: "TRENDING NOW",
        objectPosition: "center"
    },
    {
        id: 2,
        title: "PREMIUM ETHNIC WEAR",
        subtitle: "UNDER ₹2999",
        description: "Elegant styles for every celebration. Traditional yet modern.",
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop",
        cta: "Explore More",
        color: "from-[#8C52FF] to-[#FF3F6C]",
        tag: "NEW SEASON",
        objectPosition: "center 15%"
    },
    {
        id: 3,
        title: "URBAN ACTIVEWEAR",
        subtitle: "EXTRA 20% OFF",
        description: "Performance meets style. Gear up for your next move.",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop",
        cta: "Grab the Deal",
        color: "from-[#FFAD00] to-[#FF3F6C]",
        tag: "LIMITED OFFER",
        objectPosition: "center"
    }
];

export default function HomeHero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-gray-50">
            {BANNERS.map((banner, index) => (
                <div
                    key={banner.id}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                >
                    <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-[10000ms] ease-out",
                            index === currentSlide ? "scale-105" : "scale-100"
                        )}
                        style={{ objectPosition: banner.objectPosition }}
                        priority={index === 0}
                        sizes="100vw"
                        unoptimized
                    />
                    <div className={cn("absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent z-10")} />

                    <div className="container relative z-20 h-full mx-auto px-6 md:px-12 flex flex-col justify-end pb-24 md:pb-32">
                        <div className="max-w-3xl space-y-6 md:space-y-8">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 animate-in fade-in slide-in-from-left-4 duration-700">
                                <Sparkles className="h-3.5 w-3.5 text-[#FF3F6C]" />
                                <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase italic">{banner.tag}</span>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-white/80 font-bold text-lg md:text-xl tracking-[0.1em] uppercase animate-in fade-in slide-in-from-left-6 duration-700 delay-100">{banner.title}</h4>
                                <h1 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                                    {banner.subtitle.split(' ').map((word, i) => (
                                        <span key={i} className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-[#FF3F6C] to-[#FFAD00]" : ""}>
                                            {word}{' '}
                                        </span>
                                    ))}
                                </h1>
                                <p className="text-base md:text-xl text-white/70 max-w-xl font-medium leading-relaxed animate-in fade-in slide-in-from-left-10 duration-700 delay-300">
                                    {banner.description}
                                </p>
                            </div>

                            <div className="flex pt-6 animate-in fade-in slide-in-from-left-12 duration-700 delay-400">
                                <Link
                                    href="/shop"
                                    className="group relative flex items-center gap-4 px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-[#FF3F6C] hover:text-white transition-all duration-500 overflow-hidden"
                                >
                                    <ShoppingBag className="h-4 w-4 relative z-10" />
                                    <span className="relative z-10">{banner.cta}</span>
                                    <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-2 transition-transform" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF3F6C] to-[#FF6D3F] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
                {BANNERS.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={cn(
                            "h-1.5 transition-all duration-300 rounded-full",
                            index === currentSlide ? "w-8 bg-white" : "w-1.5 bg-white/40"
                        )}
                    />
                ))}
            </div>
        </section>
    );
}

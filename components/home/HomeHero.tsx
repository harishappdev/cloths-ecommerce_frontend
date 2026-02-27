'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HomeHero() {
    return (
        <section className="w-full relative h-[500px] md:h-[650px] overflow-hidden">
            {/* Background Image / Illustration */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?auto=format&fit=crop&q=80&w=2000" // Placeholder matching the store vibe
                    alt="New Season"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Subtle dark overlay for readability */}
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-center text-white">
                <div className="max-w-xl">
                    <div className="inline-block px-3 py-1 rounded bg-[#2563EB] mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                            New Season
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4 tracking-tight">
                        Elevate Your Style <br /> Summer &apos;24
                    </h1>

                    <p className="text-lg text-gray-100 mb-10 max-w-md leading-relaxed opacity-90">
                        Discover the latest trends in sustainable high-fashion. Up to 40% off on premium collections.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            href="/shop"
                            className="bg-[#2563EB] text-white px-8 py-4 rounded font-bold transition-all hover:bg-blue-700 active:scale-95"
                        >
                            Shop Collection
                        </Link>
                        <Link
                            href="/lookbook"
                            className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded font-bold transition-all hover:bg-white hover:text-black active:scale-95"
                        >
                            View Lookbook
                        </Link>
                    </div>

                    {/* Simple pagination indicators (per screenshot) */}
                    <div className="mt-16 flex items-center space-x-2">
                        <div className="h-1 w-8 bg-[#2563EB] rounded" />
                        <div className="h-1 w-4 bg-white/30 rounded" />
                        <div className="h-1 w-4 bg-white/30 rounded" />
                    </div>
                </div>
            </div>
        </section>
    );
}

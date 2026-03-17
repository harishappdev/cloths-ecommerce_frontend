'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/utils/lib';

const categories = [
    {
        name: 'MEN',
        image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1964&auto=format&fit=crop',
        href: '/shop?category=Men',
        color: 'from-blue-500/80 to-purple-500/80'
    },
    {
        name: 'WOMEN',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop',
        href: '/shop?category=Women',
        color: 'from-pink-500/80 to-rose-500/80'
    },
    {
        name: 'KIDS',
        image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=2070&auto=format&fit=crop',
        href: '/shop?category=Kids',
        color: 'from-yellow-400/80 to-orange-500/80'
    },
    {
        name: 'FOOTWEAR',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
        href: '/shop?category=footwear',
        color: 'from-teal-400/80 to-blue-500/80'
    },
];

export default function CategoryGrid() {
    return (
        <section className="container mx-auto px-4 py-16">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase">Shop by Category</h2>
                <div className="h-1 w-20 bg-primary mt-2"></div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {categories.map((cat) => (
                    <Link
                        key={cat.name}
                        href={cat.href}
                        className="group relative h-[250px] md:h-[350px] overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-vibrant hover:shadow-xl hover:-translate-y-1"
                    >
                        <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className={cn("absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity", cat.color)} />

                        {/* Content */}
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tighter drop-shadow-lg group-hover:scale-110 transition-transform">
                                {cat.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

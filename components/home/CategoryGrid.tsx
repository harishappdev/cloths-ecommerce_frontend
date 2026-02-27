'use client';

import Image from 'next/image';
import Link from 'next/link';

const categories = [
    {
        name: 'Summer Wear',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
        href: '/shop?category=summer',
    },
    {
        name: 'Winter Collection',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800',
        href: '/shop?category=winter',
    },
    {
        name: 'Formal Wear',
        image: 'https://images.unsplash.com/photo-1594932224010-3343a41b2a95?auto=format&fit=crop&q=80&w=800',
        href: '/shop?category=formal',
    },
    {
        name: 'Footwear',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
        href: '/shop?category=footwear',
    },
];

export default function CategoryGrid() {
    return (
        <section className="container mx-auto px-4 py-20">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-black tracking-tight">Shop by Category</h2>
                <p className="text-sm text-gray-500">Curated collections for every occasion</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <Link
                        key={cat.name}
                        href={cat.href}
                        className="group relative h-[400px] overflow-hidden rounded-2xl bg-gray-100"
                    >
                        <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Content */}
                        <div className="absolute bottom-8 left-8">
                            <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

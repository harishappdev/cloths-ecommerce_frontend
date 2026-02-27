'use client';

import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/lib';

const categories = [
    { name: 'Menswear', description: 'Premium collection for the modern man.', count: '120+ Items', color: 'bg-blue-50', text: 'text-blue-600', icon: 'M' },
    { name: 'Womenswear', description: 'Elegant styles for every occasion.', count: '250+ Items', color: 'bg-purple-50', text: 'text-purple-600', icon: 'W' },
    { name: 'Accessories', description: 'The perfect finishing touches.', count: '80+ Items', color: 'bg-orange-50', text: 'text-orange-600', icon: 'A' },
    { name: 'Knitwear', description: 'Cozy and stylish essentials.', count: '45+ Items', color: 'bg-green-50', text: 'text-green-600', icon: 'K' },
    { name: 'Outerwear', description: 'Protection against the elements.', count: '60+ Items', color: 'bg-red-50', text: 'text-red-600', icon: 'O' }
];

export default function CategoriesPage() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="mb-16 text-center">
                <h1 className="text-5xl font-black tracking-tight mb-4">Explore Our <span className="text-primary italic">Categories</span></h1>
                <p className="text-gray-500 max-w-2xl mx-auto">Discover a world of premium fashion curated just for you. Browse through our diverse collections to find exactly what you're looking for.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => (
                    <Link
                        key={cat.name}
                        href={`/shop?category=${cat.name}`}
                        className="group relative overflow-hidden rounded-[2.5rem] border bg-white p-8 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
                    >
                        <div className={cn("mb-6 flex h-16 w-16 items-center justify-center rounded-3xl text-2xl font-black", cat.color, cat.text)}>
                            {cat.icon}
                        </div>
                        <h3 className="text-2xl font-black mb-2 flex items-center">
                            {cat.name}
                            <ArrowRight className="ml-2 h-5 w-5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                        </h3>
                        <p className="text-gray-500 mb-6 font-medium leading-relaxed">{cat.description}</p>
                        <div className="flex items-center text-xs font-bold uppercase tracking-widest text-primary">
                            <Layers className="mr-2 h-4 w-4" />
                            {cat.count}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

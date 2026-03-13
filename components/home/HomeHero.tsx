'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/lib';

const BANNERS = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
        objectPosition: "center"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop",
        objectPosition: "center 15%"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop",
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
        <section className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden bg-gray-50">
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
                        alt={`Banner ${banner.id}`}
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
                    {/* Subtle overlay to soften the image if needed */}
                    <div className="absolute inset-0 bg-black/5 z-10" />
                </div>
            ))}

            {/* Slide Indicators - Centered and Minimalist */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
                {BANNERS.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={cn(
                            "h-1 transition-all duration-500 rounded-full",
                            index === currentSlide ? "w-12 bg-white" : "w-2 bg-white/30"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

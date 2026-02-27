'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FlashSale() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 8,
        minutes: 45,
        seconds: 12,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                clearInterval(timer);
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const TimeUnit = ({ label, value }: { label: string; value: number }) => (
        <div className="flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border border-white/20">
                <span className="text-2xl md:text-3xl font-black text-white">
                    {value.toString().padStart(2, '0')}
                </span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                {label}
            </span>
        </div>
    );

    return (
        <section className="container mx-auto px-4 py-20">
            <div className="relative rounded-[48px] overflow-hidden bg-[#0F172A] py-20 px-4 md:px-20 text-center">
                {/* Background Pattern / Image */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center grayscale" />
                </div>

                <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Limited Time Only
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                        Flash Sale: Extra 50% <br /> Off Everything!
                    </h2>

                    <p className="text-gray-400 mb-12">
                        Grab your favorites before they&apos;re gone. Sale ends in:
                    </p>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-4 mb-12">
                        <TimeUnit label="Hrs" value={timeLeft.hours} />
                        <TimeUnit label="Min" value={timeLeft.minutes} />
                        <TimeUnit label="Sec" value={timeLeft.seconds} />
                    </div>

                    <Link
                        href="/shop?sale=true"
                        className="bg-white text-black px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-95"
                    >
                        Shop the Sale Now
                    </Link>
                </div>
            </div>
        </section>
    );
}

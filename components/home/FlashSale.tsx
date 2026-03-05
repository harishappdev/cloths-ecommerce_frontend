'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Timer, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/lib';

export default function FlashSale() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 12,
        minutes: 45,
        seconds: 12,
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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
            <div className="bg-white text-primary rounded-lg w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg border border-primary/10">
                <span className="text-xl md:text-2xl font-black">
                    {value.toString().padStart(2, '0')}
                </span>
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider mt-2">
                {label}
            </span>
        </div>
    );

    return (
        <section className="container mx-auto px-4 py-12">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-vibrant py-12 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Zap className="h-64 w-64 text-white rotate-12" />
                </div>

                <div className="relative z-10 max-w-xl text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-sm">
                        <Timer className="h-3 w-3" />
                        DEAL OF THE DAY
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tighter">
                        FLAT 80% OFF <br />
                        <span className="text-yellow-300 italic">ENDS SOON!</span>
                    </h2>

                    <p className="text-white/90 text-sm md:text-lg mb-8 font-medium max-w-md">
                        Style shouldn't break the bank. Grab the hottest trends at jaw-dropping prices before the clock runs out!
                    </p>

                    <Link
                        href="/shop?sale=true"
                        className="inline-flex items-center gap-2 bg-white text-primary px-10 py-4 rounded-lg font-black uppercase tracking-wider hover:bg-gray-100 hover:scale-105 transition-all shadow-xl active:scale-95"
                    >
                        <span>GO TO DEALS</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Countdown Timer Wrapper */}
                <div className="relative z-10 bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
                    <p className="text-white text-xs font-bold uppercase tracking-widest mb-4 text-center">Hurry Up! Time Left:</p>
                    <div className="flex items-center gap-3 md:gap-4" suppressHydrationWarning>
                        <TimeUnit label="Hrs" value={mounted ? timeLeft.hours : 0} />
                        <div className="text-white font-black text-2xl mb-6">:</div>
                        <TimeUnit label="Min" value={mounted ? timeLeft.minutes : 0} />
                        <div className="text-white font-black text-2xl mb-6">:</div>
                        <TimeUnit label="Sec" value={mounted ? timeLeft.seconds : 0} />
                    </div>
                </div>
            </div>
        </section>
    );
}

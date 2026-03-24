'use client';

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { Suspense } from "react";

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Suspense fallback={null}>
                <Navbar />
            </Suspense>
            <main className="flex-grow pb-20 lg:pb-0">
                {children}
            </main>
            <Footer />
            <MobileBottomNav />
        </>
    );
}

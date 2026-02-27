'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        // If we have a token, we expect to be authenticated soon, so show a subtle loader
        // If we don't have a token, we will redirect anyway, so no need for a heavy spinner
        const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
        if (!hasToken) return null; // Let the useEffect handle the redirect silently

        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return <>{children}</>;
}

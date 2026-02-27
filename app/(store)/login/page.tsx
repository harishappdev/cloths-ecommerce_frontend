'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        }
    }, [isAuthenticated, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, accessToken, data } = response.data;

            login(token || accessToken, data.user);
            toast.success('Welcome back!');

            if (data.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-2xl border bg-white p-10 shadow-sm">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Sign In</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your credentials to access your account
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <Link href="/forgot-password" title="Forgot password" className="text-xs font-medium text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full justify-center rounded-lg bg-black py-3 text-sm font-bold text-white transition-all hover:bg-primary disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                        {!loading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-bold text-primary hover:underline">
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

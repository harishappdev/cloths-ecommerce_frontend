'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/signup', { name, email, password });
            const { token, accessToken, data } = response.data;

            login(token || accessToken, data.user);
            toast.success('Account created! Welcome to Urban Closet.');
            router.push('/');
        } catch (err: any) {
            console.error('Signup Error:', err);
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 font-sans">
            <div className="w-full max-w-[440px] rounded-[24px] bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E5D5C5] shadow-sm">
                        <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Create Your Account</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Join us and start shopping
                    </p>
                </div>

                <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50 outline-none placeholder:text-gray-400"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50 outline-none placeholder:text-gray-400"
                                placeholder="example@mail.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50 outline-none placeholder:text-gray-400"
                                    placeholder="Min. 8 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#3B82F6] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-600 hover:shadow-blue-200 active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="font-bold text-[#2563EB] hover:text-blue-700 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            <p className="mt-12 text-[11px] text-gray-400">
                © 2024 YourBrand. All rights reserved.
            </p>
        </div>
    );
}

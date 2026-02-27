'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error('Passwords do not match!');
        }

        if (password.length < 8) {
            return toast.error('Password must be at least 8 characters long');
        }

        setIsLoading(true);

        try {
            const response = await api.patch(`/auth/resetPassword/${token}`, {
                password
            });

            if (response.data.status === 'success') {
                setIsSuccess(true);
                toast.success('Password reset successfully!');
                // Auto login happens in backend, but we want user to see success
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Token is invalid or has expired');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border shadow-sm text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black tracking-tight text-gray-900">Success!</h2>
                        <p className="text-sm text-gray-500">
                            Your password has been reset. Redirecting you to login...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border shadow-sm">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-gray-900">Set new password</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Must be at least 8 characters.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" senior-label="New Password" className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                New Password
                            </label>
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirm-password" senior-label="Confirm Password" className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                Confirm Password
                            </label>
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#2563EB] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

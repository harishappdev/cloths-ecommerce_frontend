'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2, Lock, KeyRound } from 'lucide-react';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Step = 'EMAIL' | 'OTP';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('EMAIL');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post('/auth/forgotPassword', { email });
            setStep('OTP');
            toast.success('6-digit OTP sent to your email!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error('Passwords do not match!');
        }

        if (password.length < 8) {
            return toast.error('Password must be at least 8 characters long');
        }

        if (otp.length !== 6) {
            return toast.error('Please enter a valid 6-digit OTP');
        }

        setIsLoading(true);

        try {
            const response = await api.post('/auth/resetPassword', {
                email,
                otp,
                password
            });

            if (response.data.status === 'success') {
                toast.success('Password reset successfully!');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border shadow-sm transition-all duration-300">
                {step === 'EMAIL' ? (
                    <>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-gray-900">Forgot password?</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                No worries, we'll send you a 6-digit OTP to reset your password.
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleRequestOTP}>
                            <div>
                                <label htmlFor="email-address" className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Email address
                                </label>
                                <div className="mt-2 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all sm:text-sm"
                                        placeholder="name@example.com"
                                    />
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
                                        'Get OTP'
                                    )}
                                </button>
                            </div>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div>
                            <button
                                onClick={() => setStep('EMAIL')}
                                className="mb-4 inline-flex items-center text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
                            >
                                <ArrowLeft className="mr-1 h-3 w-3" />
                                Back to Email
                            </button>
                            <h2 className="text-3xl font-black tracking-tight text-gray-900">Verify OTP</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                We've sent a 6-digit code to <span className="font-bold text-gray-900">{email}</span>.
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="otp" className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                        6-Digit OTP
                                    </label>
                                    <div className="mt-2 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <KeyRound className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="otp"
                                            name="otp"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            required
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 tracking-[0.5em] font-mono rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all sm:text-sm"
                                            placeholder="000000"
                                        />
                                    </div>
                                </div>

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
                    </>
                )}
            </div>
        </div>
    );
}

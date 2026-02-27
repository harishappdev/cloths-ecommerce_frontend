'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <div className="bg-black py-12 text-center text-white">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold">
                            {user.name[0].toUpperCase()}
                        </div>
                        <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
                        <p className="text-sm text-gray-400 uppercase tracking-widest">{user.role}</p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Email Address</p>
                                <p className="text-gray-900 font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <Shield className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Account Security</p>
                                <p className="text-gray-900 font-medium">Password Protected</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 border-t pt-6">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Account Status</p>
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

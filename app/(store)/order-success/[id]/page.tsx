'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { orderService, Order } from '@/services/orderService';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

function SuccessContent() {
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const { isAuthenticated, loading: authLoading } = useAuth();

    useEffect(() => {
        const fetchOrder = async () => {
            if (authLoading || !isAuthenticated || !orderId) return;

            try {
                const response = await orderService.getOrderById(orderId);
                setOrder(response.data.order);
            } catch (error) {
                console.error('Failed to fetch order', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, isAuthenticated, authLoading]);

    if (loading) return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500">
                <CheckCircle className="h-12 w-12" />
            </div>
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight">Order <span className="text-primary italic">Confirmed</span>!</h1>
            <p className="mt-4 text-gray-500">Thank you for your purchase. We've received your order and will begin processing it right away.</p>

            <div className="mt-10 mx-auto max-w-lg rounded-3xl border bg-gray-50 p-8">
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest text-left">Your Order ID</span>
                    <span className="font-mono text-sm font-bold text-gray-900">#{orderId.toUpperCase()}</span>
                </div>
                {order && (
                    <div className="text-left space-y-4">
                        <div className="flex items-center text-sm">
                            <Package className="mr-3 h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-600">Status: </span>
                            <span className="ml-2 font-bold text-primary uppercase text-xs">{order.orderStatus}</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <ShoppingBag className="mr-3 h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-600">Total Charged: </span>
                            <span className="ml-2 font-bold text-gray-900">${order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/orders" className="flex items-center space-x-2 rounded-full border-2 border-black px-8 py-3 font-bold transition-all hover:bg-black hover:text-white">
                    <span>View Orders</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/shop" className="rounded-full bg-black px-8 py-3 font-bold text-white transition-all hover:bg-primary">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </ProtectedRoute>
    );
}

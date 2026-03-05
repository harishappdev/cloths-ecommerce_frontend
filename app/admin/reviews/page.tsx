'use client';

import { useState, useEffect } from 'react';
import { 
    MessageSquare, 
    Trash2, 
    Search, 
    Filter, 
    Star, 
    CheckCircle2, 
    XCircle,
    User,
    Package,
    Calendar,
    ThumbsUp,
    MoreVertical,
    Check,
    X,
    Eye,
    ChevronLeft,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import { cn, getImageUrl } from '@/utils/lib';
import { toast } from 'react-hot-toast';
import { reviewService, Review } from '@/services/reviewService';
import { format } from 'date-fns';
import Image from 'next/image';

export default function ReviewManagementPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await reviewService.getAllReviews();
            setReviews(response.data.reviews);
        } catch (error) {
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleApproval = async (id: string) => {
        try {
            await reviewService.toggleApproval(id);
            toast.success('Review status updated');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review permanently?')) return;
        try {
            await reviewService.deleteReview(id);
            toast.success('Review deleted');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    const filteredReviews = reviews.filter(r => {
        const matchesSearch = 
            (typeof r.product === 'object' ? r.product.name : '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.review.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
            statusFilter === 'all' || 
            (statusFilter === 'approved' && r.isApproved) || 
            (statusFilter === 'pending' && !r.isApproved);

        return matchesSearch && matchesStatus;
    });

    const stats = [
        { label: 'Total Reviews', value: reviews.length, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Pending Moderation', value: reviews.filter(r => !r.isApproved).length, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Avg Rating', value: (reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)).toFixed(1), icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-2xl bg-[#FF2C79] flex items-center justify-center text-white shadow-xl shadow-pink-100">
                        <MessageSquare className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-black text-[#FF2C79] uppercase tracking-[0.2em]">Voice of Customer</p>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic">
                    Feedback <span className="text-[#FF2C79]">Central</span>
                </h1>
                <p className="text-xs font-black text-gray-400 mt-4 uppercase tracking-[0.1em]">Moderate and analyze customer experience assets.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                        <div className="flex items-center gap-4">
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12", stat.bg)}>
                                <stat.icon className={cn("h-7 w-7", stat.color)} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black text-gray-900 mt-0.5 tracking-tighter">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Table Container */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gray-50/30">
                    <div className="relative flex-grow max-w-xl group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#FF2C79] transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH BY PRODUCT, USER, OR CONTENT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-pink-500/5 focus:border-pink-200 transition-all outline-none"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {['all', 'approved', 'pending'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter as any)}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    statusFilter === filter 
                                        ? "bg-gray-900 text-white shadow-lg" 
                                        : "bg-white border border-gray-100 text-gray-400 hover:border-pink-200"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Contributor</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Target</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Rating/Review</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Media</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-right text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-8 py-10 h-24 bg-gray-50/20" />
                                    </tr>
                                ))
                            ) : filteredReviews.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-32 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                        No Experience Assets Identified
                                    </td>
                                </tr>
                            ) : (
                                filteredReviews.map((review) => (
                                    <tr key={review._id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                    {review.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{review.user.name}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                                    <Package className="h-4 w-4 text-gray-300" />
                                                </div>
                                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-wide truncate max-w-[150px]">
                                                    {typeof review.product === 'object' ? review.product.name : 'Unknown Product'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="max-w-xs space-y-2">
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={cn("h-3 w-3", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200")} 
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs font-medium text-gray-600 line-clamp-2 leading-relaxed italic">"{review.review}"</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex -space-x-2">
                                                {review.images && review.images.length > 0 ? (
                                                    review.images.slice(0, 3).map((img, i) => (
                                                        <div key={i} className="relative h-10 w-10 rounded-lg border-2 border-white shadow-sm overflow-hidden bg-gray-50">
                                                            <Image src={getImageUrl(img)} alt="Review" fill unoptimized className="object-cover" />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">No Media</span>
                                                )}
                                                {review.images && review.images.length > 3 && (
                                                    <div className="h-10 w-10 rounded-lg border-2 border-white shadow-sm bg-gray-900 flex items-center justify-center text-[10px] font-black text-white relative z-10">
                                                        +{review.images.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border",
                                                review.isApproved 
                                                    ? "bg-green-50 text-green-600 border-green-100" 
                                                    : "bg-orange-50 text-orange-600 border-orange-100"
                                            )}>
                                                {review.isApproved ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                <span className="text-[9px] font-black uppercase tracking-widest">
                                                    {review.isApproved ? 'Approved' : 'Pending'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleToggleApproval(review._id)}
                                                    className={cn(
                                                        "h-10 w-10 flex items-center justify-center rounded-xl transition-all border",
                                                        review.isApproved
                                                            ? "bg-orange-50 text-orange-500 border-orange-100 hover:bg-orange-100"
                                                            : "bg-green-50 text-green-600 border-green-100 hover:bg-green-100"
                                                    )}
                                                    title={review.isApproved ? "Revoke Approval" : "Approve Review"}
                                                >
                                                    {review.isApproved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(review._id)}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-all shadow-sm"
                                                    title="Delete Permanently"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

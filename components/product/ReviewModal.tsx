'use client';

import { useState } from 'react';
import { X, Star, Upload, Loader2, Camera } from 'lucide-react';
import { cn } from '@/utils/lib';
import Image from 'next/image';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { rating: number; review: string; images?: string[] }) => Promise<void>;
    productName: string;
}

export default function ReviewModal({ isOpen, onClose, onSubmit, productName }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            await onSubmit({ rating, review });
            setRating(0);
            setReview('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-vibrant-in">
            <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-tight text-gray-900">Write a Review</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[300px]">{productName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-900">How would you rate it?</p>
                        <div className="flex gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(star)}
                                    className="scale-110 transition-transform active:scale-90"
                                >
                                    <Star
                                        className={cn(
                                            "h-10 w-10 transition-all duration-200",
                                            (hover || rating) >= star
                                                ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                                                : "text-gray-200"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Text Area */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-900">Your Experience</label>
                        <textarea
                            required
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Tell us what you liked (or didn't like) about this product..."
                            rows={4}
                            className="w-full bg-gray-50 border-0 rounded-2xl p-5 text-sm font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                        />
                    </div>

                    {/* Image Upload Placeholder */}
                    <div className="p-6 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-3 bg-gray-50/30 group hover:border-primary/30 transition-colors cursor-pointer">
                        <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Camera className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add Photos (Coming Soon)</p>
                    </div>

                    <button
                        type="submit"
                        disabled={rating === 0 || isSubmitting}
                        className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'SUBMIT REVIEW'}
                    </button>
                </form>
            </div>
        </div>
    );
}

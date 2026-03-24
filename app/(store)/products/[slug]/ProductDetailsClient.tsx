'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    Star,
    Truck,
    RefreshCw,
    ShoppingCart,
    Heart,
    ChevronRight,
    Minus,
    Plus,
    CheckCircle2,
    Award,
    ChevronLeft,
    ShoppingBag
} from 'lucide-react';
import { cn, getImageUrl } from '@/utils/lib';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { productService } from '@/services/productService';
import { reviewService, Review } from '@/services/reviewService';
import ProductCard from '@/components/product/ProductCard';
import { useAuth } from '@/context/AuthContext';
import ReviewModal from '@/components/product/ReviewModal';

interface ProductDetailsClientProps {
    product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
    const router = useRouter();
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('Classic Navy');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isReviewLoading, setIsReviewLoading] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const { user } = useAuth();

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPosition({ x, y });
    };

    const handleReviewSubmit = async (reviewData: { rating: number; review: string; images?: string[] }) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to write a review');
            router.push('/login');
            return;
        }

        try {
            await reviewService.createReview({
                product: product._id,
                ...reviewData
            });
            toast.success('Review submitted for moderation!', { icon: '🚀' });
            setIsReviewModalOpen(false);
            // Re-fetch reviews to show the user (though they might need approval depending on backend settings)
            const response = await reviewService.getProductReviews(product._id);
            setReviews(response.data.reviews);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        }
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // Similar by Category
                const similarRes = await productService.getAllProducts(`category=${product.category}&_id[ne]=${product._id}&limit=4`);
                setSimilarProducts(similarRes.data.products);

                // Related by Occasion
                if (product.occasion) {
                    const relatedRes = await productService.getAllProducts(`occasion=${product.occasion}&_id[ne]=${product._id}&limit=4`);
                    setRelatedProducts(relatedRes.data.products);
                }
            } catch (error) {
                console.error('Failed to load recommendations');
            }
        };
        fetchRecommendations();
    }, [product.category, product.occasion, product._id]);

    useEffect(() => {
        const fetchReviews = async () => {
            if (activeTab === 'reviews') {
                setIsReviewLoading(true);
                try {
                    const response = await reviewService.getProductReviews(product._id);
                    setReviews(response.data.reviews);
                } catch (error) {
                    console.error('Failed to load reviews');
                } finally {
                    setIsReviewLoading(false);
                }
            }
        };
        fetchReviews();
    }, [activeTab, product._id]);

    const handleQuantityChange = (type: 'increment' | 'decrement') => {
        if (type === 'increment') {
            setQuantity(prev => (prev < 10 ? prev + 1 : prev));
        } else {
            setQuantity(prev => (prev > 1 ? prev - 1 : prev));
        }
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to add items to cart');
            router.push('/login');
            return;
        }

        try {
            const success = await addItem(product._id, quantity, selectedSize, selectedColor);
            if (success) {
                toast.success(`${product.name} added to bag`, {
                    style: {
                        borderRadius: '16px',
                        background: '#000',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    },
                });
            }
        } catch (error) {
            // Error handling is managed in CartContext
        }
    };

    const handleBuyNow = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to continue');
            router.push('/login');
            return;
        }
        handleAddToCart();
        router.push('/checkout');
    };

    const discountPerc = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : null;

    const colors = [
        { name: 'Classic Navy', hex: '#1E293B' },
        { name: 'Ivory White', hex: '#F9FAFB' },
        { name: 'Onyx Black', hex: '#000000' }
    ];

    const tabs = [
        { id: 'description', label: 'Details' },
        { id: 'specifications', label: 'Comp' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'shipping', label: 'Service' }
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left: Product Gallery */}
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex md:flex-col gap-3 overflow-x-auto no-scrollbar md:w-20">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={cn(
                                        "relative h-20 w-16 md:h-24 md:w-full shrink-0 rounded-lg overflow-hidden border-2 transition-vibrant",
                                        activeImage === index ? "border-primary" : "border-gray-100 hover:border-gray-300"
                                    )}
                                >
                                    <Image src={getImageUrl(img)} alt={`Thumbnail ${index}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image with Zoom */}
                        <div 
                            className="flex-grow relative aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden shadow-sm group cursor-zoom-in"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setIsZooming(true)}
                            onMouseLeave={() => setIsZooming(false)}
                        >
                            <div 
                                className={cn(
                                    "absolute inset-0 transition-transform duration-200 pointer-events-none",
                                    isZooming ? "scale-[2]" : "scale-100"
                                )}
                                style={isZooming ? {
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                } : undefined}
                            >
                                <Image
                                    src={getImageUrl(product.images[activeImage])}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            {discountPerc && (
                                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-sm shadow-xl uppercase">
                                    {discountPerc}% OFF
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{product.brand}</p>
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">{product.name}</h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded border border-green-100">
                                    <span className="text-sm font-bold">{product.ratings}</span>
                                    <Star className="h-4 w-4 fill-green-700" />
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.numReviews} Reviews</span>
                            </div>

                            <div className="flex items-baseline gap-4 py-4 border-y border-gray-100 mb-6">
                                <span className="text-3xl font-black text-gray-900">
                                    ${(product.discountPrice || product.price).toLocaleString()}
                                </span>
                                {product.discountPrice && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">
                                            ${product.price.toLocaleString()}
                                        </span>
                                        <span className="text-lg font-black text-orange-500">
                                            ({discountPerc}% OFF)
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Variants and CTA */}
                        <div className="space-y-8">
                            {/* Color Selection */}
                            <div className="space-y-4">
                                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Select Color — {selectedColor}</span>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map(color => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={cn(
                                                "h-10 w-10 rounded-full border-2 transition-vibrant",
                                                selectedColor === color.name ? "ring-2 ring-primary ring-offset-2" : "border-gray-100 hover:border-gray-300"
                                            )}
                                            style={{ backgroundColor: color.hex }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Select Size</span>
                                    <button className="text-[11px] font-bold text-primary uppercase underline">Size Chart</button>
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {['S', 'M', 'L', 'XL', '2XL', '3XL'].map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "h-12 flex items-center justify-center rounded border text-xs font-bold transition-vibrant",
                                                selectedSize === size
                                                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                                    : "border-gray-200 text-gray-600 hover:border-primary"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 space-y-4">
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-grow bg-primary text-white h-14 rounded-lg font-black uppercase tracking-wider hover:bg-vital shadow-xl transition-vibrant active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        ADD TO BAG
                                    </button>
                                    <button className="h-14 w-14 rounded-lg border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-vibrant">
                                        <Heart className="h-6 w-6" />
                                    </button>
                                </div>
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full h-14 bg-gray-900 text-white rounded-lg font-black uppercase tracking-wider hover:bg-black shadow-lg transition-vibrant active:scale-95"
                                >
                                    BUY IT NOW
                                </button>
                            </div>

                            {/* Benefits */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Truck className="h-5 w-5 text-gray-400" />
                                    <div className="text-[11px] font-bold text-gray-500 uppercase">Fast Free Delivery</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RefreshCw className="h-5 w-5 text-gray-400" />
                                    <div className="text-[11px] font-bold text-gray-500 uppercase">Easy 30 Days Returns</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Refined Tabs Section */}
                <div className="mt-32 md:mt-48">
                    <div className="flex gap-8 border-b border-gray-100 mb-12 overflow-x-auto no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "pb-4 text-xs font-bold uppercase tracking-wider transition-vibrant relative whitespace-nowrap",
                                    activeTab === tab.id ? "text-primary" : "text-gray-400 hover:text-primary"
                                )}
                            >
                                {tab.label}
                                {activeTab === tab.id && <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(255,44,121,0.5)]" />}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl py-6">
                        {activeTab === 'description' && (
                            <div className="space-y-8 animate-vibrant-in">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-black tracking-tight text-gray-900 uppercase">Product Description</h2>
                                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                        {product.description || "The ultimate statement piece for your wardrobe. Engineered for comfort and designed for style, this garment features premium craftsmanship and high-quality materials that stand the test of time."}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">Key Highlights</h4>
                                        <ul className="space-y-3">
                                            {[
                                                'Premium breathable fabric',
                                                'Reinforced stitching for durability',
                                                'Modern comfort-fit silhouette',
                                                'Easy-care material'
                                            ].map(item => (
                                                <li key={item} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-4">Specifications</h4>
                                        <div className="space-y-4">
                                            {[
                                                ['Material', product.fabric || 'Cotton Blend'],
                                                ['Occasion', product.occasion || 'Casual'],
                                                ['Origin', 'Imported'],
                                                ['Fit', 'Regular Fit'],
                                                ['Season', 'All Season']
                                            ].map(([label, value]) => (
                                                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                                                    <span className="text-[11px] font-bold uppercase text-gray-400">{label}</span>
                                                    <span className="text-[11px] font-bold text-gray-900">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-12 animate-vibrant-in">
                                <div className="flex flex-col md:flex-row gap-12 items-start">
                                    {/* Rating Summary */}
                                    <div className="w-full md:w-64 space-y-6">
                                        <div className="text-center md:text-left">
                                            <div className="text-6xl font-black text-gray-900 mb-2">{product.ratings}</div>
                                            <div className="flex justify-center md:justify-start gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} className={cn("h-5 w-5", s <= Math.floor(product.ratings) ? "fill-yellow-400 text-yellow-400" : "text-gray-200")} />
                                                ))}
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Based on {product.numReviews} Reviews</p>
                                        </div>

                                        {/* Review Bars */}
                                        <div className="space-y-3">
                                            {[5, 4, 3, 2, 1].map(star => {
                                                const count = product.ratingDistribution?.[star as keyof typeof product.ratingDistribution] || 0;
                                                const perc = product.numReviews > 0 ? (count / product.numReviews) * 100 : 0;
                                                return (
                                                    <div key={star} className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black w-3">{star}</span>
                                                        <div className="flex-grow h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary rounded-full" style={{ width: `${perc}%` }} />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400 w-8">{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => setIsReviewModalOpen(true)}
                                            className="w-full py-4 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg"
                                        >
                                            Write A Review
                                        </button>
                                    </div>

                                    {/* Review List */}
                                    <div className="flex-grow space-y-8">
                                        {isReviewLoading ? (
                                            <div className="flex flex-col items-center gap-4 py-20">
                                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Loading Feedback...</p>
                                            </div>
                                        ) : reviews.length === 0 ? (
                                            <div className="bg-gray-50 rounded-3xl p-12 text-center border border-dashed border-gray-200">
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">No Reviews Yet</p>
                                                <p className="text-xs text-gray-400">Be the first to share your thoughts about this product.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-8">
                                                {reviews.map(review => (
                                                    <div key={review._id} className="border-b border-gray-100 pb-8 last:border-0">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <div className="flex gap-1 mb-2">
                                                                    {[1, 2, 3, 4, 5].map(s => (
                                                                        <Star key={s} className={cn("h-3 w-3", s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200")} />
                                                                    ))}
                                                                </div>
                                                                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{review.user.name}</p>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 leading-relaxed italic">&quot;{review.review}&quot;</p>
                                                        {review.images && review.images.length > 0 && (
                                                            <div className="flex gap-3 mt-4">
                                                                {review.images.map((img, i) => (
                                                                    <div key={i} className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-100">
                                                                        <Image src={getImageUrl(img)} alt="Review" fill className="object-cover" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Similar Products Grid */}
                {similarProducts.length > 0 && (
                    <div className="mt-24 border-t border-gray-100 pt-16">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tight">Similar Pieces</h2>
                            <Link href="/shop" className="text-xs font-bold text-primary uppercase hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {similarProducts.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Products Grid */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 border-t border-gray-100 pt-16">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tight">You may also like</h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {relatedProducts.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={handleReviewSubmit}
                productName={product.name}
            />
        </div>
    );
}

function Tag({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
            <path d="M7 7h.01" />
        </svg>
    );
}


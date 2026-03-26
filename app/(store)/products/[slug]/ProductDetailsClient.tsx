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
    ShoppingBag,
    Barcode
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
            const response = await reviewService.getProductReviews(product._id);
            setReviews(response.data.reviews);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        }
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const similarRes = await productService.getAllProducts(`category=${product.category}&_id[ne]=${product._id}&limit=4`);
                setSimilarProducts(similarRes.data.products);

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
                        fontSize: '14px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    },
                });
            }
        } catch (error) {
            // Managed in CartContext
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
                <nav className="flex items-center text-xs font-semibold uppercase tracking-wider text-gray-500 mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left: Product Gallery */}
                    <div className="flex flex-col-reverse md:flex-row gap-4">
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
                                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-sm shadow-xl uppercase z-10">
                                    {discountPerc}% OFF
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-primary uppercase tracking-wider">{product.brand}</p>
                                {product.barcode && (
                                    <span className="text-xs font-semibold uppercase text-gray-400 tracking-widest bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                        REF: {product.barcode}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded border border-green-100">
                                    <span className="text-sm font-bold">{product.ratings}</span>
                                    <Star className="h-4 w-4 fill-green-700" />
                                </div>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{product.numReviews} Reviews</span>
                            </div>

                            <div className="flex items-baseline gap-4 py-6 border-y border-gray-100 mb-6">
                                <span className="text-3xl font-bold text-gray-900 tracking-tight">
                                    ₹{(product.discountPrice || product.price).toLocaleString()}
                                </span>
                                {product.discountPrice && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">
                                            ₹{product.price.toLocaleString()}
                                        </span>
                                        <span className="text-lg font-bold text-primary">
                                            ({discountPerc}% OFF)
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-8">
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

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Select Size</span>
                                    <button className="text-xs font-bold text-primary uppercase underline">Size Chart</button>
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

                            <div className="pt-6 space-y-4">
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-grow bg-primary text-white h-14 rounded-xl font-bold uppercase tracking-widest hover:bg-[#E62E63] shadow-xl transition-vibrant active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        ADD TO BAG
                                    </button>
                                    <button className="h-14 w-14 rounded-xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-vibrant">
                                        <Heart className="h-6 w-6" />
                                    </button>
                                </div>
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full h-14 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-black shadow-lg transition-vibrant active:scale-95"
                                >
                                    BUY IT NOW
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Truck className="h-5 w-5 text-gray-400" />
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fast Free Delivery</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RefreshCw className="h-5 w-5 text-gray-400" />
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Easy 30 Days Returns</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-24 md:mt-32">
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
                                {activeTab === tab.id && <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-full" />}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl">
                        {activeTab === 'description' && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Product Description</h2>
                                    <p className="text-base text-gray-600 leading-relaxed">
                                        {product.description || "Premium craftsmanship and high-quality materials."}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">Key Highlights</h4>
                                        <ul className="space-y-3">
                                            {['Premium breathable fabric', 'Reinforced stitching', 'Modern silhouette', 'Easy-care'].map(item => (
                                                <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">Specifications</h4>
                                        <div className="space-y-4">
                                            {[
                                                ['Material', product.fabric || 'Cotton Blend'],
                                                ['Occasion', product.occasion || 'Casual'],
                                                ['Barcode', product.barcode || 'N/A'],
                                                ['Origin', 'Imported']
                                            ].map(([label, value]) => (
                                                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
                                                    <span className="text-xs font-bold text-gray-900">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-12">
                                <div className="flex flex-col md:flex-row gap-12">
                                    <div className="w-full md:w-64 space-y-6">
                                        <div className="text-center md:text-left">
                                            <div className="text-5xl font-bold text-gray-900 mb-2">{product.ratings}</div>
                                            <div className="flex justify-center md:justify-start gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} className={cn("h-5 w-5", s <= Math.floor(product.ratings) ? "fill-yellow-400 text-yellow-400" : "text-gray-200")} />
                                                ))}
                                            </div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Based on {product.numReviews} Reviews</p>
                                        </div>

                                        <div className="space-y-3">
                                            {[5, 4, 3, 2, 1].map(star => {
                                                const count = product.ratingDistribution?.[star as keyof typeof product.ratingDistribution] || 0;
                                                const perc = product.numReviews > 0 ? (count / product.numReviews) * 100 : 0;
                                                return (
                                                    <div key={star} className="flex items-center gap-3">
                                                        <span className="text-xs font-bold w-3">{star}</span>
                                                        <div className="flex-grow h-1.5 bg-gray-100 rounded-full">
                                                            <div className="h-full bg-primary rounded-full" style={{ width: `${perc}%` }} />
                                                        </div>
                                                        <span className="text-xs font-semibold text-gray-400 w-8">{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => setIsReviewModalOpen(true)}
                                            className="w-full py-4 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all"
                                        >
                                            Write A Review
                                        </button>
                                    </div>

                                    <div className="flex-grow space-y-8">
                                        {isReviewLoading ? (
                                            <div className="flex flex-col items-center gap-4 py-20">
                                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Feedback...</p>
                                            </div>
                                        ) : reviews.length === 0 ? (
                                            <div className="bg-gray-50 rounded-3xl p-12 text-center border border-dashed border-gray-200">
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">No Reviews Yet</p>
                                                <p className="text-xs text-gray-400">Be the first to share your thoughts.</p>
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
                                                                <p className="text-sm font-bold text-gray-900">{review.user.name}</p>
                                                            </div>
                                                            <span className="text-xs text-gray-400 uppercase">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-base text-gray-600 leading-relaxed italic">&quot;{review.review}&quot;</p>
                                                        {review.images && review.images.length > 0 && (
                                                            <div className="flex gap-3 mt-4">
                                                                {review.images.map((img, i) => (
                                                                    <div key={i} className="relative h-16 w-16 rounded-xl overflow-hidden border border-gray-100">
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

                <div className="mt-24 border-t border-gray-100 pt-16">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Similar Pieces</h2>
                        <Link href="/shop" className="text-xs font-bold text-primary uppercase hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {similarProducts.map(p => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>
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

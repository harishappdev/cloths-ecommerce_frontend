'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
    ChevronLeft
} from 'lucide-react';
import { cn, getImageUrl } from '@/utils/lib';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { productService } from '@/services/productService';
import ProductCard from '@/components/product/ProductCard';

interface ProductDetailsClientProps {
    product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
    const router = useRouter();
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('Midnight Black');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchSimilar = async () => {
            try {
                const response = await productService.getAllProducts(`category=${product.category}&limit=5`);
                setSimilarProducts(response.data.products.filter(p => p._id !== product._id).slice(0, 4));
            } catch (error) {
                console.error('Failed to load similar products');
            }
        };
        fetchSimilar();
    }, [product.category, product._id]);

    const handleAddToCart = () => {
        addItem(product._id, quantity, selectedSize, selectedColor);
    };

    const handleBuyNow = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to add items to cart');
            router.push('/login');
            return;
        }
        await addItem(product._id, quantity, selectedSize, selectedColor);
        router.push('/checkout');
    };

    const discountPerc = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : null;


    const colors = [
        { name: 'Midnight Black', hex: '#111827' },
        { name: 'Steel Gray', hex: '#4B5563' },
        { name: 'Deep Sea Blue', hex: '#1E3A8A' }
    ];

    const tabs = [
        { id: 'description', label: 'DESCRIPTION' },
        { id: 'specifications', label: 'SPECIFICATIONS' },
        { id: 'reviews', label: 'REVIEWS (124)' },
        { id: 'shipping', label: 'SHIPPING & RETURNS' }
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-6">
                {/* Breadcrumbs */}
                <nav className="mb-8 flex items-center space-x-2 text-[10px] font-bold text-gray-400">
                    <a href="/" className="hover:text-black">Home</a>
                    <ChevronRight className="h-2.5 w-2.5" />
                    <a href="/shop" className="hover:text-black">Men&apos;s Clothing</a>
                    <ChevronRight className="h-2.5 w-2.5" />
                    <span className="text-gray-900 font-black uppercase tracking-tight">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT: Gallery */}
                    <div className="lg:col-span-7 flex gap-4 h-fit">
                        <div className="flex flex-col gap-3 w-20 shrink-0">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={cn(
                                        "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                                        activeImage === i ? "border-black shadow-sm" : "border-gray-100 hover:border-gray-300"
                                    )}
                                >
                                    <Image src={getImageUrl(img)} alt="" fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#F3F4F6] border border-gray-100">
                            <Image
                                src={getImageUrl(product.images[activeImage])}
                                alt={product.name}
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* RIGHT: Info */}
                    <div className="lg:col-span-5 space-y-8 py-2">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563EB] mb-3 block">PREMIUM ESSENTIALS</span>
                            <h1 className="text-4xl font-extrabold text-gray-900 leading-[1.1] mb-2">{product.name}</h1>
                            <p className="text-xs font-bold text-gray-400">Brand: <span className="text-gray-900 uppercase">AETHER & CORE</span></p>

                            <div className="mt-6 flex items-center gap-6">
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 rounded-full border border-yellow-100">
                                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-black text-yellow-700">4.9</span>
                                </div>
                                <span className="text-[10px] font-black text-gray-300 uppercase underline decoration-gray-200 cursor-pointer">124 Reviews</span>
                                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-green-600" />
                                    In Stock
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-gray-900">${(product.discountPrice || product.price).toFixed(2)}</span>
                            {product.discountPrice && (
                                <>
                                    <span className="text-xl text-gray-300 line-through font-bold">${product.price.toFixed(2)}</span>
                                    <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded">
                                        {discountPerc}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="p-5 rounded-2xl bg-yellow-50/50 border border-yellow-200/50 space-y-3">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-[#B45309]">AVAILABLE OFFERS</h5>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2 text-[10px] font-bold text-gray-600">
                                    <Tag className="h-3.5 w-3.5 text-yellow-600 mt-0.5" />
                                    <span>Bank Offer: 10% instant discount on Credit Cards.</span>
                                </div>
                                <div className="flex items-start gap-2 text-[10px] font-bold text-gray-600">
                                    <Tag className="h-3.5 w-3.5 text-yellow-600 mt-0.5" />
                                    <span>No Cost EMI available on orders above $500.</span>
                                </div>
                            </div>
                        </div>

                        {/* Color Selector */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-gray-400">Select Color: <span className="text-gray-900">{selectedColor}</span></span>
                            </div>
                            <div className="flex gap-3">
                                {colors.map(color => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={cn(
                                            "w-9 h-9 rounded-full border-2 transition-all p-0.5",
                                            selectedColor === color.name ? "border-[#2563EB]" : "border-transparent"
                                        )}
                                    >
                                        <div className="w-full h-full rounded-full border border-gray-200" style={{ backgroundColor: color.hex }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selector */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Size</span>
                                <button className="text-[10px] font-black uppercase tracking-widest text-[#2563EB] hover:underline">SIZE GUIDE</button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {['S', 'M', 'L', 'XL'].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={cn(
                                            "h-12 flex-1 min-w-[3rem] rounded-xl border-2 font-black text-sm transition-all",
                                            selectedSize === size ? "bg-white border-[#2563EB] text-[#2563EB] shadow-sm" : "border-gray-50 text-gray-400 hover:border-gray-200"
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <div className="flex items-center bg-gray-50 rounded-xl px-2 h-14 border border-gray-100">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-gray-400 hover:text-black"><Minus className="h-3.5 w-3.5" /></button>
                                <span className="w-8 text-center font-black text-sm">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-gray-400 hover:text-black"><Plus className="h-3.5 w-3.5" /></button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#2563EB] text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                ADD TO CART
                            </button>
                        </div>
                        <button
                            onClick={handleBuyNow}
                            className="w-full h-14 bg-[#0F172A] text-white rounded-xl font-black text-sm hover:bg-black transition-all active:scale-95"
                        >
                            BUY IT NOW
                        </button>

                        {/* Feature Icons */}
                        <div className="grid grid-cols-3 gap-2 pt-4">
                            <div className="flex flex-col items-center gap-2 py-4">
                                <Truck className="h-5 w-5 text-gray-400" />
                                <span className="text-[8px] font-black uppercase tracking-tighter text-gray-500">FREE SHIPPING</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 py-4 border-x border-gray-100">
                                <RefreshCw className="h-5 w-5 text-gray-400" />
                                <span className="text-[8px] font-black uppercase tracking-tighter text-gray-500">30 DAYS RETURN</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 py-4">
                                <Award className="h-5 w-5 text-gray-400" />
                                <span className="text-[8px] font-black uppercase tracking-tighter text-gray-500">2 YEAR WARRANTY</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS SECTION */}
                <div className="mt-20 border-t border-gray-100">
                    <div className="flex justify-center border-b border-gray-100 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative border-b-2",
                                    activeTab === tab.id ? "text-[#2563EB] border-[#2563EB]" : "text-gray-400 border-transparent hover:text-gray-700"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div className="space-y-8">
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">Unmatched Performance</h2>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                Engineered for the modern urban explorer, the Techwear Shell Jacket combines high-performance waterproof materials with a sleek, minimalist silhouette. Designed to withstand extreme weather conditions while maintaining breathability.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    '3-layer GORE-TEX construction',
                                    'Laser-cut ventilation zones',
                                    'Internal utility carrying straps'
                                ].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-xs font-bold text-gray-700">
                                        <div className="h-5 w-5 rounded-full bg-[#2563EB] flex items-center justify-center">
                                            <CheckCircle2 className="h-3 w-3 text-white" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gray-50/50 rounded-xl p-10 border border-gray-100">
                            <div className="space-y-6">
                                {[
                                    ['Material', '85% Nylon, 15% Elastane'],
                                    ['Waterproof Rating', '20,000mm'],
                                    ['Weight', '450g (Size M)'],
                                    ['Origin', 'Made in Portugal']
                                ].map(([label, value]) => (
                                    <div key={label} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
                                        <span className="text-[10px] font-bold text-gray-800">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIMILAR PRODUCTS */}
                {similarProducts.length > 0 && (
                    <div className="mt-20 border-t border-gray-100 pt-16 pb-20">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl font-black uppercase tracking-tight">SIMILAR PRODUCTS</h2>
                            <div className="flex gap-2">
                                <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50"><ChevronLeft className="h-4 w-4" /></button>
                                <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50"><ChevronRight className="h-4 w-4" /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {similarProducts.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
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


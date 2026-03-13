'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { adminService } from '@/services/adminService';
import { productService } from '@/services/productService';
import { Product, Category } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    Filter,
    ChevronDown,
    MoreHorizontal,
    Box,
    Package,
    ChevronRight,
    ChevronLeft,
    X,
    UploadCloud,
    AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { cn, getImageUrl } from '@/utils/lib';

export default function AdminProducts() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        price: '',
        category: '',
        stock: '',
        fabric: '',
        occasion: '',
    });
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [colors, setColors] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [editingProduct, setEditingProduct] = useState<string | null>(null);

    const { data: productsData, isLoading: productsLoading } = useSWR('/products');
    const { data: categoriesData } = useSWR('/categories');

    const products = productsData?.data?.products || [];
    const categories = categoriesData?.data?.categories || [];

    // No longer need manual fetches in useEffect

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEditing = !!editingProduct;
        const loadingToast = toast.loading(isEditing ? 'Updating product...' : 'Creating product...');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('brand', formData.brand);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('stock', formData.stock);
            data.append('fabric', formData.fabric);
            data.append('occasion', formData.occasion);

            selectedSizes.forEach(size => data.append('sizes', size));
            colors.forEach(color => data.append('colors', color));

            if (selectedFiles) {
                for (let i = 0; i < selectedFiles.length; i++) {
                    data.append('images', selectedFiles[i]);
                }
            }

            if (isEditing && editingProduct) {
                await adminService.updateProduct(editingProduct, data);
                toast.success('Product updated successfully!', { id: loadingToast });
            } else {
                await adminService.createProduct(data);
                toast.success('Product added successfully!', { id: loadingToast });
            }

            setIsAddModalOpen(false);
            resetForm();
            mutate('/products');
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} product`, { id: loadingToast });
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', brand: '', price: '', category: '', stock: '', fabric: '', occasion: '' });
        setSelectedSizes([]);
        setColors([]);
        setSelectedFiles(null);
        setEditingProduct(null);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product._id);
        setFormData({
            name: product.name,
            description: product.description || '',
            brand: product.brand || '',
            price: product.price.toString(),
            category: product.category,
            stock: (product.stock ?? 0).toString(),
            fabric: product.fabric || '',
            occasion: product.occasion || '',
        });
        setSelectedSizes(product.sizes || []);
        setColors(product.colors || []);
        setIsAddModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await adminService.deleteProduct(id);
            toast.success('Product deleted');
            mutate('/products');
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const filteredProducts = products.filter((p: Product) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCategories = categories.filter((cat: Category) =>
        cat.name.toLowerCase().includes('')
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="h-2 w-10 bg-gradient-to-r from-[#FF2C79] to-purple-600 rounded-full" />
                        <p className="text-[10px] font-black text-[#FF2C79] uppercase tracking-[0.2em]">Inventory Hub</p>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-[0.8]">PRODUCT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2C79] to-purple-600">CATALOG</span></h1>
                    <p className="text-xs font-bold text-gray-400 mt-4 uppercase tracking-[0.1em]">Manage your premium fashion collection and stock levels.</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsAddModalOpen(true);
                    }}
                    className="group w-full sm:w-auto flex items-center justify-center gap-3 rounded-[1.5rem] bg-gray-900 px-10 py-5 font-black text-[11px] text-white shadow-2xl shadow-gray-200 hover:bg-[#FF2C79] transition-all active:scale-95 uppercase tracking-widest"
                >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                    <span>Create New Product</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="rounded-[2.5rem] border border-gray-100 bg-white p-5 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-5 transition-all hover:shadow-md">
                <div className="relative flex-grow">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="SEARCH PRODUCTS..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-14 pr-6 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-pink-500/10 transition-all placeholder:text-gray-300"
                        suppressHydrationWarning
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-4">
                    <div className="relative flex-grow lg:min-w-[220px]">
                        <select
                            className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-6 pr-12 text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer focus:ring-2 focus:ring-pink-500/10"
                            onChange={(e) => setSearchTerm(e.target.value === 'All Categories' ? '' : e.target.value)}
                            suppressHydrationWarning
                        >
                            <option>All Categories</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative flex-grow lg:min-w-[180px]">
                        <select className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-6 pr-12 text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer focus:ring-2 focus:ring-pink-500/10">
                            <option>Status: All</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <button className="h-14 w-full lg:w-14 flex items-center justify-center bg-[#F8FAFC] rounded-2xl text-gray-400 hover:text-[#FF2C79] hover:bg-pink-50 transition-all sm:col-span-2 lg:col-span-1">
                        <Filter className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="rounded-[3rem] border border-gray-100 bg-white shadow-sm overflow-hidden p-2">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1100px]">
                        <thead>
                            <tr className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-50">
                                <th className="py-8 px-10">IDENTIFIER</th>
                                <th className="py-8 px-8">BRANDSCAPE</th>
                                <th className="py-8 px-8">TAXONOMY</th>
                                <th className="py-8 px-8">VALUATION</th>
                                <th className="py-8 px-8">RESERVE</th>
                                <th className="py-8 px-8">VECTOR</th>
                                <th className="py-8 px-10 text-right">PROTOCOL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {productsLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={7} className="py-8 px-10">
                                            <Skeleton className="h-16 w-full rounded-[1.5rem]" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-32 text-center">
                                        <div className="bg-gray-50 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                            <Box className="h-8 w-8 text-gray-200" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Zero Matching Entities</p>
                                    </td>
                                </tr>
                            ) : filteredProducts.map((product: Product) => (
                                <tr key={product._id} className="group hover:bg-pink-50/10 transition-all duration-300">
                                    <td className="py-8 px-10">
                                        <div className="flex items-center gap-6">
                                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.25rem] border border-gray-100 bg-gray-50 shadow-sm transition-transform group-hover:rotate-3">
                                                <Image
                                                    src={getImageUrl(product.images[0])}
                                                    alt={product.name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover transition-transform group-hover:scale-110 duration-700"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900 uppercase tracking-tight line-clamp-1">{product.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">UID: {product._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-8">
                                        <span className="text-[11px] font-black uppercase text-gray-900 tracking-[0.1em] bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">{product.brand || 'VIBRANT'}</span>
                                    </td>
                                    <td className="py-8 px-8">
                                        <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">{product.category}</span>
                                    </td>
                                    <td className="py-8 px-8 font-black text-gray-900 text-sm tracking-tight">
                                        ₹{product.price.toLocaleString()}
                                    </td>
                                    <td className="py-8 px-8">
                                        <div className="w-36 space-y-3">
                                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                                <span className={cn(
                                                    (product.stock ?? 0) < 10 ? "text-[#FF2C79]" : "text-gray-900"
                                                )}>{product.stock ?? 0} UNITS</span>
                                                <span className="text-gray-300">| 100%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.1)]",
                                                        (product.stock ?? 0) < 10 ? "bg-[#FF2C79]" :
                                                            (product.stock ?? 0) < 50 ? "bg-purple-500" : "bg-gray-900"
                                                    )}
                                                    style={{ width: `${Math.min(((product.stock ?? 0) / 200) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "relative h-5 w-10 rounded-full p-1 transition-all duration-500 shadow-inner",
                                                (product.stock ?? 0) > 0 ? "bg-[#FF2C79]" : "bg-gray-100"
                                            )}>
                                                <div className={cn(
                                                    "h-3 w-3 rounded-full bg-white shadow-xl transition-all duration-500",
                                                    (product.stock ?? 0) > 0 ? "translate-x-5" : "translate-x-0"
                                                )} />
                                            </div>
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest",
                                                (product.stock ?? 0) > 0 ? "text-[#FF2C79]" : "text-gray-300"
                                            )}>
                                                {(product.stock ?? 0) > 0 ? "Live" : "Hold"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-8 px-10 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="h-11 w-11 flex items-center justify-center rounded-[1rem] bg-gray-50 text-gray-400 hover:text-[#FF2C79] hover:bg-pink-50 hover:shadow-lg hover:shadow-pink-100/50 transition-all active:scale-90"
                                            >
                                                <Edit2 className="h-4.5 w-4.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="h-11 w-11 flex items-center justify-center rounded-[1rem] bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:shadow-lg hover:shadow-red-100/50 transition-all active:scale-90"
                                            >
                                                <Trash2 className="h-4.5 w-4.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-10 py-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        CATALOGUE RANGE <span className="text-gray-900">01 — 12</span>
                    </p>
                    <div className="flex items-center gap-3">
                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gray-900 text-white text-[11px] font-black shadow-xl shadow-gray-200">01</button>
                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-900 text-[11px] font-black">02</button>
                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 lg:p-10 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="w-full h-full lg:h-auto lg:max-w-5xl lg:rounded-[3.5rem] bg-white shadow-2xl animate-in zoom-in-95 duration-500 relative flex flex-col max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="sticky top-0 z-20 flex items-center justify-between p-10 lg:p-16 bg-white shrink-0">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="h-1.5 w-8 bg-[#FF2C79] rounded-full" />
                                    <p className="text-[10px] font-black text-[#FF2C79] uppercase tracking-[0.2em]">{editingProduct ? 'Update Registry' : 'System Entry'}</p>
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-900 uppercase leading-[0.85]">{editingProduct ? 'UPDATE' : 'NEW'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2C79] to-purple-600">{editingProduct ? 'PRODUCT' : 'COLLECTION'}</span></h2>
                                <p className="text-xs font-bold text-gray-400 mt-6 uppercase tracking-[0.1em]">{editingProduct ? 'Modifying existing asset parameters.' : 'Registering unique asset into global inventory.'}</p>
                            </div>
                            <button onClick={() => { setIsAddModalOpen(false); resetForm(); }} className="h-16 w-16 rounded-[2rem] border border-gray-100 text-gray-300 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all hover:rotate-90">
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}                                <div className="flex-grow overflow-y-auto px-10 lg:px-16 pb-16 custom-scrollbar">
                            <form id="add-product-form" onSubmit={handleSubmit} className="space-y-16">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                    <div className="space-y-10">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between ml-1">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF2C79]">Primary Attributes</label>
                                                <span className="h-px flex-1 bg-gray-50 ml-6" />
                                            </div>
                                            <div className="space-y-5">
                                                <div className="group relative">
                                                    <input
                                                        required
                                                        className="w-full rounded-2xl bg-[#F8FAFC] border-none px-8 py-5 text-sm font-black focus:ring-2 focus:ring-pink-500/10 outline-none placeholder:text-gray-300 transition-all group-hover:bg-white group-hover:shadow-sm"
                                                        placeholder="PRODUCT DESIGNATION"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="group relative">
                                                    <input
                                                        required
                                                        className="w-full rounded-2xl bg-[#F8FAFC] border-none px-8 py-5 text-sm font-black focus:ring-2 focus:ring-pink-500/10 outline-none placeholder:text-gray-300 transition-all group-hover:bg-white group-hover:shadow-sm"
                                                        placeholder="MANUFACTURER / BRAND"
                                                        value={formData.brand}
                                                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <select
                                                        required
                                                        className="w-full rounded-2xl bg-[#F8FAFC] border-none px-8 py-5 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-pink-500/10 outline-none appearance-none group-hover:bg-white group-hover:shadow-sm transition-all"
                                                        value={formData.category}
                                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                    >
                                                        <option value="">SELECT TAXONOMY</option>
                                                        {categories.map((cat: Category) => (
                                                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 pointer-events-none" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-5">
                                                    <div className="group relative">
                                                        <input
                                                            className="w-full rounded-2xl bg-[#F8FAFC] border-none px-8 py-5 text-sm font-black focus:ring-2 focus:ring-pink-500/10 outline-none placeholder:text-gray-300 transition-all group-hover:bg-white group-hover:shadow-sm"
                                                            placeholder="FABRIC (E.G. COTTON)"
                                                            value={formData.fabric}
                                                            onChange={e => setFormData({ ...formData, fabric: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="relative group">
                                                        <select
                                                            className="w-full rounded-2xl bg-[#F8FAFC] border-none px-8 py-5 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-pink-500/10 outline-none appearance-none group-hover:bg-white group-hover:shadow-sm transition-all"
                                                            value={formData.occasion}
                                                            onChange={e => setFormData({ ...formData, occasion: e.target.value })}
                                                        >
                                                            <option value="">SELECT OCCASION</option>
                                                            {['Casual', 'Formal', 'Party', 'Ethnic', 'Sport', 'Work'].map(occ => (
                                                                <option key={occ} value={occ}>{occ}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 pointer-events-none" />
                                                    </div>
                                                </div>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    className="w-full rounded-3xl bg-[#F8FAFC] border-none px-8 py-6 text-sm font-bold focus:ring-2 focus:ring-pink-500/10 outline-none resize-none placeholder:text-gray-300 group-hover:bg-white group-hover:shadow-sm transition-all leading-relaxed"
                                                    placeholder="NARRATIVE SPECIFICATIONS..."
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between ml-1">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF2C79]">Commercial Logic</label>
                                                <span className="h-px flex-1 bg-gray-50 ml-6" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-5">
                                                <div className="relative group">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-black">₹</div>
                                                    <input
                                                        required
                                                        type="number"
                                                        step="1"
                                                        className="w-full rounded-2xl bg-[#F8FAFC] border-none px-12 py-5 text-sm font-black focus:ring-2 focus:ring-pink-500/10 outline-none group-hover:bg-white group-hover:shadow-sm transition-all"
                                                        placeholder="MSRP"
                                                        value={formData.price}
                                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300">
                                                        <Package className="h-4 w-4" />
                                                    </div>
                                                    <input
                                                        required
                                                        type="number"
                                                        className="w-full rounded-2xl bg-[#F8FAFC] border-none px-12 py-5 text-sm font-black focus:ring-2 focus:ring-pink-500/10 outline-none group-hover:bg-white group-hover:shadow-sm transition-all"
                                                        placeholder="STOCK"
                                                        value={formData.stock}
                                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Available Dimensions</label>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44', 'ALL'].map(size => (
                                                        <button
                                                            key={size}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedSizes(prev =>
                                                                    prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                                                                );
                                                            }}
                                                            className={cn(
                                                                "h-12 w-14 rounded-xl text-[10px] font-black transition-all border",
                                                                selectedSizes.includes(size)
                                                                    ? "bg-gray-900 border-gray-900 text-white shadow-lg"
                                                                    : "bg-gray-50 border-gray-100 text-gray-400 hover:border-pink-200"
                                                            )}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-4">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Product Palette (Colors)</label>
                                                <div className="flex gap-3">
                                                    <div className="relative flex-1 group">
                                                        <input
                                                            type="text"
                                                            className="w-full rounded-2xl bg-[#F8FAFC] border-none px-8 py-4 text-sm font-black focus:ring-2 focus:ring-pink-500/10 outline-none placeholder:text-gray-300 transition-all group-hover:bg-white group-hover:shadow-sm"
                                                            placeholder="NAME (E.G. MIDNIGHT BLACK)"
                                                            value={selectedColor}
                                                            onChange={e => setSelectedColor(e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    if (selectedColor.trim()) {
                                                                        setColors(prev => [...prev, selectedColor.trim()]);
                                                                        setSelectedColor('');
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (selectedColor.trim()) {
                                                                setColors(prev => [...prev, selectedColor.trim()]);
                                                                setSelectedColor('');
                                                            }
                                                        }}
                                                        className="h-14 px-8 rounded-2xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#FF2C79] transition-all"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {colors.map((color, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-xl bg-pink-50 border border-pink-100 text-[#FF2C79] text-[10px] font-black uppercase tracking-wider animate-in fade-in zoom-in-95"
                                                        >
                                                            {color}
                                                            <button
                                                                type="button"
                                                                onClick={() => setColors(prev => prev.filter((_, i) => i !== index))}
                                                                className="h-6 w-6 rounded-lg hover:bg-white flex items-center justify-center transition-colors"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {colors.length === 0 && (
                                                        <p className="text-[9px] font-bold text-gray-300 italic">No colors defined for this entry.</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-4">
                                                <div className="flex items-center justify-between ml-1">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF2C79]">Digital Media</label>
                                                    <span className="h-px flex-1 bg-gray-50 ml-6" />
                                                </div>
                                                <label className="group block relative w-full h-56 border-2 border-[#F1F5F9] border-dashed rounded-[2.5rem] bg-[#F8FAFC] hover:bg-pink-50/30 hover:border-pink-200 transition-all cursor-pointer overflow-hidden text-center">
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                                                        <div className="h-16 w-16 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform group-hover:shadow-pink-100/50">
                                                            <UploadCloud className="h-7 w-7 text-[#FF2C79]" />
                                                        </div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Upload Visual Assets</p>
                                                        <p className="text-[9px] font-bold text-gray-300 mt-2">{editingProduct ? 'Leave blank to keep existing' : 'Upto 4 High Resolution Images'}</p>
                                                    </div>
                                                    <input required={!editingProduct} type="file" multiple className="hidden" onChange={e => setSelectedFiles(e.target.files)} />
                                                </label>
                                                {selectedFiles && selectedFiles.length > 0 && (
                                                    <div className="flex items-center gap-4 bg-gray-900 p-5 rounded-2xl shadow-xl animate-in slide-in-from-bottom-2">
                                                        <div className="h-10 w-10 bg-[#FF2C79] rounded-xl flex items-center justify-center text-white font-black text-xs">
                                                            {selectedFiles.length}
                                                        </div>
                                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Media objects attached and ready</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 z-20 p-10 lg:p-16 bg-white border-t border-gray-50 flex items-center justify-between shrink-0">
                            <button
                                type="button"
                                onClick={() => { setIsAddModalOpen(false); resetForm(); }}
                                className="h-20 px-12 rounded-[2rem] border-2 border-gray-100 font-black text-[11px] text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Discard
                            </button>
                            <button
                                type="submit"
                                form="add-product-form"
                                className="h-20 px-20 lg:px-24 rounded-[2rem] bg-gray-900 font-black text-[11px] text-white uppercase tracking-widest hover:bg-[#FF2C79] shadow-2xl shadow-gray-200 transition-all active:scale-95"
                            >
                                {editingProduct ? 'Save Changes' : 'Publish to Store'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

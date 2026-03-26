'use client';

import { useState, useMemo, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { adminService } from '@/services/adminService';
import { Product, Category } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    Filter,
    ChevronDown,
    Box,
    Package,
    ChevronRight,
    ChevronLeft,
    X,
    UploadCloud,
    Barcode,
    Copy,
    Check,
    ArrowUpDown,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { cn, getImageUrl } from '@/utils/lib';
import { useDebounce } from '@/hooks/useDebounce';

type SortConfig = {
    key: string;
    direction: 'asc' | 'desc' | null;
};

export default function AdminProducts() {
    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' });
    const [categoryFilter, setCategoryFilter] = useState('');
    
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
        barcode: '',
    });
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [colors, setColors] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [editingProduct, setEditingProduct] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // --- Data Fetching (Server-side) ---
    const queryParams = useMemo(() => {
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', limit.toString());
        
        if (debouncedSearch) params.append('search', debouncedSearch);
        if (categoryFilter && categoryFilter !== 'All Categories') params.append('category', categoryFilter);
        
        if (sortConfig.key && sortConfig.direction) {
            const prefix = sortConfig.direction === 'desc' ? '-' : '';
            params.append('sort', `${prefix}${sortConfig.key}`);
        }
        
        return params.toString();
    }, [currentPage, limit, debouncedSearch, categoryFilter, sortConfig]);

    const { data: productsData, isLoading: productsLoading } = useSWR(`/products?${queryParams}`);
    const { data: categoriesData } = useSWR('/categories');

    const products = productsData?.data?.products || [];
    const totalResults = productsData?.totalResults || 0;
    const totalPages = Math.ceil(totalResults / limit);
    const categories = categoriesData?.data?.categories || [];

    // --- Actions ---
    const handleSort = (key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        setCurrentPage(1); // Reset to page 1 on sort
    };

    const copyToClipboard = async (text: string, id: string) => {
        if (!text) return;
        
        try {
            // Check if document is focused before attempting to write to clipboard
            if (document.hasFocus()) {
                await navigator.clipboard.writeText(text);
                setCopiedId(id);
                toast.success('Copied to clipboard!', { icon: '📋' });
            } else {
                // Fallback for when document is not focused or clipboard API fails
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                setCopiedId(id);
                toast.success('Copied (Fallback)!', { icon: '📋' });
            }
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Could not copy automatically. Please select text manually.');
        }

        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEditing = !!editingProduct;
        const loadingToast = toast.loading(isEditing ? 'Updating product...' : 'Creating product...');

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, (formData as any)[key]);
            });

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
            mutate(`/products?${queryParams}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} product`, { id: loadingToast });
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', brand: '', price: '', category: '', stock: '', fabric: '', occasion: '', barcode: '' });
        setSelectedSizes([]);
        setColors([]);
        setSelectedFiles(null);
        setEditingProduct(null);
    };

    const handlePrintBarcode = (barcode: string, name: string) => {
        if (!barcode) return;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Barcode - ${name}</title>
                    <style>
                        body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
                        .container { text-align: center; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
                        img { max-width: 100%; height: auto; }
                        .name { font-weight: bold; margin-top: 10px; font-size: 14px; text-transform: uppercase; }
                        .code { font-family: monospace; margin-top: 5px; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text=${barcode}&scale=3&rotate=N&includetext" alt="${barcode}" />
                        <div class="name">${name}</div>
                        <div class="code">${barcode}</div>
                    </div>
                    <script>
                        window.onload = () => {
                            window.print();
                            // window.close(); // Optional: close after print
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
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
            barcode: (product as any).barcode || '',
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
            mutate(`/products?${queryParams}`);
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    // Reset pagination on search
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, categoryFilter]);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Product Portfolio</h1>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF2C79]" />
                        Registry Management System
                    </p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsAddModalOpen(true);
                    }}
                    className="group w-full sm:w-auto flex items-center justify-center gap-3 rounded-[1.5rem] bg-gray-900 px-10 py-5 font-bold text-sm text-white shadow-2xl shadow-gray-200 hover:bg-[#FF2C79] transition-all active:scale-95 uppercase tracking-wide"
                >
                    <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                    <span>Create New Product</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="rounded-[2.5rem] border border-gray-100 bg-white p-5 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-5 transition-all hover:shadow-md">
                <div className="relative flex-grow">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="SEARCH BY NAME OR BARCODE..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-14 pr-6 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-pink-500/10 transition-all placeholder:text-gray-300"
                    />
                    {productsLoading && searchTerm && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                            <div className="h-4 w-4 border-2 border-[#FF2C79] border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-4">
                    <div className="relative flex-grow lg:min-w-[220px]">
                        <select
                            value={categoryFilter}
                            className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 pl-6 pr-12 text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer focus:ring-2 focus:ring-pink-500/10"
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat: Category) => (
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
                    <table className="w-full text-left min-w-[1200px]">
                        <thead>
                            <tr className="text-[10px] font-black uppercase text-gray-400 tracking-wider border-b border-gray-50 bg-[#F8FAFC]/50">
                                <th className="py-8 px-10">IDENTIFIER</th>
                                <th className="py-8 px-8">BRAND & TAXONOMY</th>
                                <th className="py-8 px-8">
                                    <button onClick={() => handleSort('price')} className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                                        VALUATION
                                        {sortConfig.key === 'price' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                        ) : <ArrowUpDown className="h-3 w-3 opacity-30" />}
                                    </button>
                                </th>
                                <th className="py-8 px-8">
                                    <button onClick={() => handleSort('stock')} className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                                        RESERVE
                                        {sortConfig.key === 'stock' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                        ) : <ArrowUpDown className="h-3 w-3 opacity-30" />}
                                    </button>
                                </th>
                                <th className="py-8 px-8">BARCODE</th>
                                <th className="py-8 px-10 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {productsLoading ? (
                                Array(limit).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="py-6 px-10">
                                            <Skeleton className="h-14 w-full rounded-2xl" />
                                        </td>
                                    </tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-32 text-center">
                                        <div className="bg-gray-50 h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                            <Box className="h-10 w-10 text-gray-200" />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-500 tracking-normal">No products found</p>
                                        <button 
                                            onClick={() => { setSearchTerm(''); setCategoryFilter(''); }}
                                            className="mt-6 text-[10px] font-black text-[#FF2C79] uppercase tracking-widest hover:underline"
                                        >
                                            Reset All Filters
                                        </button>
                                    </td>
                                </tr>
                            ) : products.map((product: Product) => (
                                <tr key={product._id} className="group hover:bg-pink-50/10 transition-all duration-300">
                                    <td className="py-8 px-10">
                                        <div className="flex items-center gap-6">
                                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.25rem] border border-gray-100 bg-gray-50 shadow-sm transition-transform group-hover:rotate-2">
                                                <Image
                                                    src={getImageUrl(product.images[0])}
                                                    alt={product.name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover transition-transform group-hover:scale-110 duration-700"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 tracking-tight line-clamp-1">{product.name}</p>
                                                <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider font-mono">ID: {product._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                     <td className="py-8 px-8">
                                        <div className="space-y-1.5">
                                            <span className="inline-block text-[10px] font-semibold uppercase text-white bg-gray-900 px-2 py-0.5 rounded-md tracking-wider">{product.brand || 'STYLENEST'}</span>
                                            <p className="text-xs font-semibold uppercase text-gray-400 tracking-widest">{product.category}</p>
                                        </div>
                                    </td>
                                    <td className="py-8 px-8 font-semibold text-gray-900 text-sm tracking-tight">
                                        ₹{product.price.toLocaleString()}
                                    </td>
                                    <td className="py-8 px-8">
                                        <div className="w-32 space-y-3">
                                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                                <span className={cn(
                                                    (product.stock ?? 0) < 10 ? "text-[#FF2C79]" : "text-gray-900"
                                                )}>{product.stock ?? 0} UNITS</span>
                                                <span className="text-gray-300">{(product.stock ?? 0) > 100 ? '99%+' : 'OK'}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        (product.stock ?? 0) < 10 ? "bg-[#FF2C79]" :
                                                            (product.stock ?? 0) < 50 ? "bg-purple-500" : "bg-gray-900"
                                                    )}
                                                    style={{ width: `${Math.min(((product.stock ?? 0) / 200) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-8">
                                        {(product as any).barcode ? (
                                            <div className="flex items-center gap-4 group/barcode">
                                                <div className="p-1.5 bg-white rounded-xl border border-gray-100 shadow-sm group-hover/barcode:border-pink-200 group-hover/barcode:shadow-md transition-all">
                                                    <img 
                                                        src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${(product as any).barcode}&scale=1.5&rotate=N&includetext`} 
                                                        alt={(product as any).barcode}
                                                        className="h-10 w-auto min-w-[100px] object-contain"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard((product as any).barcode, product._id)}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#FF2C79] hover:border-pink-200 transition-all active:scale-90"
                                                    title="Copy Barcode"
                                                >
                                                    {copiedId === product._id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-[9px] font-black uppercase text-gray-300 italic tracking-widest">No Label</span>
                                        )}
                                    </td>
                                    <td className="py-8 px-10 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="h-11 w-11 flex items-center justify-center rounded-[1rem] bg-gray-50 text-gray-400 hover:text-purple-600 hover:bg-purple-50 hover:shadow-lg hover:shadow-purple-100/50 transition-all active:scale-90"
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
                    <div className="flex flex-col items-center sm:items-start gap-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            SHOWING <span className="text-gray-900">{Math.min(limit, products.length)}</span> OF <span className="text-gray-900">{totalResults}</span> ENTITIES
                        </p>
                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Page {currentPage} of {totalPages || 1}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            disabled={currentPage === 1 || productsLoading}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="h-12 px-6 flex items-center gap-2 rounded-2xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Prev
                        </button>
                        
                        <div className="flex items-center gap-1.5 mx-2">
                             {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                 const pageNum = i + 1; // Simplistic page logic for now
                                 return (
                                     <button
                                         key={pageNum}
                                         onClick={() => setCurrentPage(pageNum)}
                                         className={cn(
                                             "h-12 w-12 rounded-2xl text-[11px] font-black transition-all",
                                             currentPage === pageNum 
                                                ? "bg-gray-900 text-white shadow-xl shadow-gray-200" 
                                                : "border border-gray-100 text-gray-400 hover:bg-gray-50"
                                         )}
                                     >
                                         {String(pageNum).padStart(2, '0')}
                                     </button>
                                 );
                             })}
                             {totalPages > 5 && <span className="text-gray-300 px-2 font-black">...</span>}
                        </div>

                        <button 
                            disabled={currentPage >= totalPages || productsLoading}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="h-12 px-6 flex items-center gap-2 rounded-2xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Components Reused (Keeping for full parity) */}
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

                        {/* Modal Body */}
                        <div className="flex-grow overflow-y-auto px-10 lg:px-16 pb-16 custom-scrollbar">
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
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF2C79]">Inventory Logic</label>
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
                                                <div className="group relative">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300">
                                                        <Barcode className="h-4 w-4" />
                                                    </div>
                                                    <input
                                                        className="w-full rounded-2xl bg-[#F8FAFC] border-none px-12 py-5 text-sm font-black focus:ring-2 focus:ring-pink-500/10 outline-none group-hover:bg-white group-hover:shadow-sm transition-all"
                                                        placeholder="PRODUCT BARCODE"
                                                        value={formData.barcode}
                                                        onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                                                    />
                                                </div>

                                                {formData.barcode && (
                                                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-gray-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-500">
                                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center min-w-[200px]">
                                                            <img 
                                                                src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${formData.barcode}&scale=1.5&rotate=N&includetext`} 
                                                                alt="Barcode Preview"
                                                                className="max-h-24 object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex-grow space-y-3 text-center sm:text-left">
                                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Label System</p>
                                                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => copyToClipboard(formData.barcode, 'modal')}
                                                                    className="px-4 py-2 flex items-center gap-2 rounded-lg bg-white border border-gray-200 text-[10px] font-bold text-gray-600 hover:text-pink-600 hover:border-pink-200 transition-all"
                                                                >
                                                                    <Copy className="h-3.5 w-3.5" />
                                                                    Copy Data
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handlePrintBarcode(formData.barcode, formData.name)}
                                                                    className="px-4 py-2 flex items-center gap-2 rounded-lg bg-gray-900 text-[10px] font-bold text-white hover:bg-pink-600 transition-all"
                                                                >
                                                                    <UploadCloud className="h-3.5 w-3.5 rotate-180" />
                                                                    Print Label
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
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
                                                        <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">Upload Visual Assets</p>
                                                        <p className="text-[9px] font-bold text-gray-300 mt-2">{editingProduct ? 'Leave blank to keep existing' : 'Upto 4 High Resolution Images'}</p>
                                                    </div>
                                                    <input required={!editingProduct} type="file" multiple className="hidden" onChange={e => setSelectedFiles(e.target.files)} />
                                                </label>
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

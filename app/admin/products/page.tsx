'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { productService } from '@/services/productService';
import { Product } from '@/types';
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
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
    });
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);


    const fetchProducts = async () => {
        try {
            const response = await productService.getAllProducts();
            setProducts(response.data.products);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await adminService.getCategories();
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Failed to load categories');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const loadingToast = toast.loading('Creating product...');
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('stock', formData.stock);

            if (selectedFiles) {
                for (let i = 0; i < selectedFiles.length; i++) {
                    data.append('images', selectedFiles[i]);
                }
            }

            await adminService.createProduct(data);
            toast.success('Product added successfully!', { id: loadingToast });
            setIsAddModalOpen(false);
            setFormData({ name: '', description: '', price: '', category: '', stock: '' });
            setSelectedFiles(null);
            fetchProducts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add product', { id: loadingToast });
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await adminService.deleteProduct(id);
            toast.success('Product deleted');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Product Management</h1>
                    <p className="text-sm font-bold text-gray-400 mt-1">Manage your clothing inventory and listings.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 font-black text-sm text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm flex items-center gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#F8FAFC] border-none rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-400 transition-all"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative min-w-[200px]">
                        <select
                            className="w-full bg-[#F8FAFC] border-none rounded-xl py-3 pl-4 pr-10 text-sm font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/10"
                            onChange={(e) => setSearchTerm(e.target.value === 'All Categories' ? '' : e.target.value)}
                        >
                            <option>All Categories</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative min-w-[150px]">
                        <select className="w-full bg-[#F8FAFC] border-none rounded-xl py-3 pl-4 pr-10 text-sm font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/10">
                            <option>Status: All</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <button className="h-11 w-11 flex items-center justify-center bg-[#F8FAFC] rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                        <Filter className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="rounded-[1.5rem] border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50 bg-[#F8FAFC]/50">
                                <th className="py-5 px-8">Product Info</th>
                                <th className="py-5 px-6">Category</th>
                                <th className="py-5 px-6">Price</th>
                                <th className="py-5 px-6">Stock</th>
                                <th className="py-5 px-6">Status</th>
                                <th className="py-5 px-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="py-8 px-8 h-24 bg-gray-50/20"></td>
                                    </tr>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <Box className="mx-auto h-12 w-12 text-gray-200 mb-4" />
                                        <p className="text-sm font-bold text-gray-400">No products found matching your search.</p>
                                    </td>
                                </tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product._id} className="group hover:bg-[#F8FAFC] transition-all">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[1rem] border border-gray-100 bg-gray-50 shadow-sm">
                                                <Image
                                                    src={getImageUrl(product.images[0])}
                                                    alt={product.name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover transition-transform group-hover:scale-110"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-black text-gray-900 group-hover:text-[#2563EB] transition-colors">{product.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">SKU: {product._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6">
                                        <span className="text-[13px] font-bold text-gray-500">{product.category}</span>
                                    </td>
                                    <td className="py-6 px-6 font-black text-gray-900 text-sm">
                                        ${product.price.toFixed(2)}
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="w-32 space-y-2">
                                            <div className="flex justify-between items-center text-[11px] font-black">
                                                <span className={cn(
                                                    product.stock < 10 ? "text-red-500" :
                                                        product.stock < 50 ? "text-orange-500" : "text-gray-900"
                                                )}>{product.stock} units</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        product.stock < 10 ? "bg-red-500" :
                                                            product.stock < 50 ? "bg-orange-500" : "bg-emerald-500"
                                                    )}
                                                    style={{ width: `${Math.min((product.stock / 200) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "relative h-6 w-11 rounded-full p-1 cursor-pointer transition-colors duration-300",
                                                product.stock > 0 ? "bg-[#2563EB]" : "bg-gray-200"
                                            )}>
                                                <div className={cn(
                                                    "h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300",
                                                    product.stock > 0 ? "translate-x-5" : "translate-x-0"
                                                )} />
                                            </div>
                                            <span className={cn(
                                                "text-[11px] font-black uppercase tracking-widest",
                                                product.stock > 0 ? "text-emerald-500" : "text-gray-400"
                                            )}>
                                                {product.stock > 0 ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#2563EB] hover:bg-blue-50 transition-all">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-8 py-5 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-[12px] font-bold text-gray-400">
                        Showing <span className="text-gray-900 font-black">1-4</span> of <span className="text-gray-900 font-black">{products.length}</span> products
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#2563EB] text-white text-xs font-black shadow-lg shadow-blue-500/20">1</button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-600 text-xs font-black hover:bg-gray-50">2</button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-600 text-xs font-black hover:bg-gray-50">3</button>
                        <div className="px-2 text-gray-400 text-xs font-black">...</div>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-600 text-xs font-black hover:bg-gray-50">12</button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-3xl rounded-[3rem] bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

                        <div className="relative z-10 flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-black tracking-tight text-gray-900">Create New <span className="text-primary italic">Product</span></h2>
                                <p className="text-sm font-bold text-gray-400 mt-1">Fill in the details to list a new item in your store.</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="h-12 w-12 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddProduct} className="relative z-10 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">General Infomation</label>
                                    <div className="space-y-4">
                                        <input
                                            required
                                            className="w-full rounded-2xl bg-[#F8FAFC] border-none px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-gray-300"
                                            placeholder="Product Name"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                        <select
                                            required
                                            className="w-full rounded-2xl bg-[#F8FAFC] border-none px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full rounded-2xl bg-[#F8FAFC] border-none px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none resize-none placeholder:text-gray-300"
                                            placeholder="Describe the product features..."
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Pricing & Inventory</label>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black">$</div>
                                            <input
                                                required
                                                type="number"
                                                step="0.01"
                                                className="w-full rounded-2xl bg-[#F8FAFC] border-none px-12 py-4 text-sm font-black focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="Price"
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black"><Package className="h-4 w-4" /></div>
                                            <input
                                                required
                                                type="number"
                                                className="w-full rounded-2xl bg-[#F8FAFC] border-none px-12 py-4 text-sm font-black focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="Initial Stock"
                                                value={formData.stock}
                                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">Media Assets</label>
                                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-[#F1F5F9] border-dashed rounded-[2rem] bg-[#F8FAFC] hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <UploadCloud className="h-10 w-10 text-gray-300 mb-3" />
                                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Click to upload</p>
                                                </div>
                                                <input required type="file" multiple className="hidden" onChange={e => setSelectedFiles(e.target.files)} />
                                            </label>
                                            {selectedFiles && (
                                                <div className="flex items-center space-x-2 text-primary bg-primary/5 p-3 rounded-xl border border-primary/10">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span className="text-xs font-black">{selectedFiles.length} images selected</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 rounded-[1.5rem] border-2 border-gray-100 py-5 font-black text-sm text-gray-400 hover:bg-gray-50 transition-all active:scale-95">Discard</button>
                                <button type="submit" className="flex-1 rounded-[1.5rem] bg-black py-5 font-black text-sm text-white hover:bg-primary shadow-xl shadow-black/10 transition-all active:scale-95">Submit Entry</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

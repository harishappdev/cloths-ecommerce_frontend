'use client';

import React, { useState } from 'react';
import { inventoryService } from '@/services/inventoryService';
import { Package, ScanBarcode, Plus, Minus, Search, Loader2, Barcode } from 'lucide-react';
import toast from 'react-hot-toast';
import BarcodeScanner from '@/components/admin/BarcodeScanner';
import { cn, getImageUrl } from '@/utils/lib';

export default function InventoryPage() {
    const [barcode, setBarcode] = useState('');
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [stockAction, setStockAction] = useState<'add' | 'remove'>('add');
    const [quantity, setQuantity] = useState<number | ''>('');
    const [actionLoading, setActionLoading] = useState(false);

    const handleScan = async (scannedCode: string) => {
        setBarcode(scannedCode);
        await searchProduct(scannedCode);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!barcode.trim()) return;
        await searchProduct(barcode);
    };

    const searchProduct = async (code: string) => {
        setLoading(true);
        setError('');
        setProduct(null);
        try {
            const data = await inventoryService.getProductByBarcode(code);
            if (data.status === 'success') {
                setProduct(data.data.product);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Product not found.');
            toast.error('Failed to locate product.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || !quantity || quantity <= 0) return;

        setActionLoading(true);
        try {
            const data = await inventoryService.updateStock(product.barcode, stockAction, Number(quantity));
            if (data.status === 'success') {
                setProduct(data.data.product);
                setQuantity('');
                toast.success(`Stock ${stockAction === 'add' ? 'added' : 'removed'} successfully`);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update stock');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6 lg:space-y-10">
            <div>
                <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <ScanBarcode className="w-8 h-8 text-[#FF2C79]" />
                    Inventory Management
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Scan product barcode to view and manage inventory stock levels.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Search / Scan Section */}
                <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Search className="w-5 h-5 text-gray-400" />
                        Find Product
                    </h2>

                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-grow group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                                    <Barcode className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={barcode}
                                    onChange={(e) => setBarcode(e.target.value)}
                                    placeholder="Enter Barcode / SKU"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-pink-500/5 focus:bg-white focus:border-pink-200 transition-all font-bold text-sm tracking-tight"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !barcode.trim()}
                                className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all disabled:opacity-30 flex items-center justify-center min-w-[120px] shadow-lg active:scale-95"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch Product'}
                            </button>
                        </div>
                    </form>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-6 bg-white text-gray-300 font-black tracking-[0.3em] text-[9px] uppercase">Optical Capture</span>
                        </div>
                    </div>

                    <BarcodeScanner onScanSuccess={handleScan} />

                    {error && (
                        <div className="mt-8 bg-red-50 border border-red-100 p-5 rounded-[2rem] animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-3 text-red-600">
                                <Package className="w-5 h-5 opacity-50" />
                                <p className="text-sm font-black uppercase tracking-tight">{error}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Detail & Stock Update Section */}
                <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-gray-100 shadow-2xl shadow-gray-200/50">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-gray-200" />
                            Live Product Data
                        </h2>
                        {product && (
                            <span className="px-3 py-1 rounded-full bg-green-50 text-[10px] font-black uppercase tracking-wider text-green-600 border border-green-100">
                                Active In DB
                            </span>
                        )}
                    </div>

                    {!product ? (
                        <div className="h-[300px] flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/30 group">
                            <Package className="w-16 h-16 mb-4 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                            <p className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Awaiting Search Input</p>
                        </div>
                    ) : (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-pink-50 rounded-[2rem] scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500" />
                                    {product.images && product.images[0] ? (
                                        <div className="relative w-32 h-32 rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-md">
                                            <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        </div>
                                    ) : (
                                        <div className="relative w-32 h-32 rounded-[2rem] bg-gray-50 flex items-center justify-center border border-gray-100 shadow-md">
                                            <Package className="w-10 h-10 text-gray-200" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-center sm:text-left space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight uppercase mb-2">{product.name}</h3>
                                        <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-4 pt-2">
                                            <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm inline-block">
                                                <img 
                                                    src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${product.barcode}&scale=1.5&rotate=N&includetext`} 
                                                    alt={product.barcode}
                                                    className="h-10 w-auto min-w-[120px] object-contain"
                                                />
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 opacity-60">
                                                    ID: {product._id.slice(-8)}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(product.barcode);
                                                        toast.success('Barcode copied!');
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-pink-600 transition-colors"
                                                    title="Copy Barcode"
                                                >
                                                    <Barcode className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center sm:justify-start gap-8 pt-4">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Price</p>
                                            <p className="font-bold text-gray-900 text-2xl tracking-tighter">₹{product.price.toLocaleString()}</p>
                                        </div>
                                        <div className="w-px h-10 bg-gray-100 self-center"></div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Available Units</p>
                                            <p className={cn(
                                                "font-bold text-2xl tracking-tighter",
                                                product.stock > 10 ? "text-green-500" : product.stock > 0 ? "text-orange-500" : "text-red-500"
                                            )}>
                                                {product.stock}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateStock} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 space-y-5 shadow-sm">
                                <h4 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">Manage Stock</h4>
                                <div className="flex gap-2 p-1.5 bg-gray-100/50 border border-gray-200 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setStockAction('add')}
                                        className={cn(
                                            "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                                            stockAction === 'add' ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", stockAction === 'add' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400')}>
                                            <Plus className="w-3.5 h-3.5" />
                                        </div>
                                        Add Stock
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStockAction('remove')}
                                        className={cn(
                                            "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                                            stockAction === 'remove' ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", stockAction === 'remove' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400')}>
                                            <Minus className="w-3.5 h-3.5" />
                                        </div>
                                         Remove Stock
                                    </button>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                                        placeholder="Quantity to update..."
                                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2C79]/50 transition-all font-bold text-gray-900"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={actionLoading || !quantity}
                                        className={cn(
                                            "px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center min-w-[140px] shadow-lg",
                                            stockAction === 'add'
                                                ? "bg-green-500 hover:bg-green-600 shadow-green-200 text-white"
                                                : "bg-red-500 hover:bg-red-600 shadow-red-200 text-white",
                                            (actionLoading || !quantity) && "opacity-50 cursor-not-allowed shadow-none"
                                        )}
                                    >
                                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Update'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

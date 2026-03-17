'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { adminService } from '@/services/adminService';
import { Category } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import {
    Plus,
    Edit2,
    Trash2,
    Layers,
    Search,
    ChevronRight,
    Tag,
    Grid2X2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/lib';

export default function AdminCategories() {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const { data: categoriesData, isLoading: categoriesLoading } = useSWR('/categories');
    const categories = categoriesData?.data?.categories || [];

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName) return;
        try {
            await adminService.createCategory(newCategoryName);
            toast.success('Category created');
            setNewCategoryName('');
            mutate('/categories');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create category');
        }
    };

    const handleEdit = async (cat: Category) => {
        setEditingId(cat._id);
        setEditName(cat.name);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId || !editName) return;
        try {
            await adminService.updateCategory(editingId, editName);
            toast.success('Category updated');
            setEditingId(null);
            mutate('/categories');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update category');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await adminService.deleteCategory(id);
            toast.success('Category deleted');
            mutate('/categories');
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    return (
        <div className="space-y-10 max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <span className="h-2 w-10 bg-gradient-to-r from-[#FF2C79] to-purple-600 rounded-full" />
                    <p className="text-[10px] font-black text-[#FF2C79] uppercase tracking-[0.2em]">Product Categories</p>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[0.8]">
                    STORE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2C79] to-purple-600">SECTIONS</span>
                </h1>
                <p className="text-xs font-bold text-gray-400 mt-4 uppercase tracking-[0.1em]">
                    Organize your products into easy-to-find sections.
                </p>
            </div>

            {/* Quick Add Section */}
            <div className="rounded-[3rem] border border-gray-100 bg-white p-8 md:p-12 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Grid2X2 className="h-48 w-48 text-gray-900" />
                </div>

                <div className="flex items-center gap-5 mb-10 relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#FF2C79] to-purple-600 text-white flex items-center justify-center shadow-xl shadow-pink-100 rotate-3 group-hover:rotate-0 transition-transform">
                        <Plus className="h-6 w-6 stroke-[3px]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#111827] uppercase tracking-tighter">
                            New Category
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Add to list</p>
                    </div>
                </div>

                <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-5 items-stretch sm:items-center relative z-10">
                    <div className="relative flex-grow group/input">
                        <Tag className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within/input:text-[#FF2C79] transition-colors" />
                        <input
                            type="text"
                            placeholder="CATEGORY NAME..."
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-black placeholder:text-gray-300 focus:ring-4 focus:ring-pink-500/5 focus:bg-white transition-all text-gray-900 uppercase tracking-widest"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center rounded-2xl bg-gray-900 px-10 py-5 font-black text-[11px] text-white hover:bg-[#FF2C79] shadow-2xl shadow-gray-200 transition-all active:scale-95 uppercase tracking-[0.2em]"
                    >
                        Add Category
                    </button>
                </form>
            </div>

            {/* Categories List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {categoriesLoading ? (
                    Array(8).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-64 rounded-[2.5rem]" />
                    ))
                ) : categories.length === 0 ? (
                    <div className="col-span-full py-40 text-center rounded-[3rem] border-2 border-dashed border-gray-100 bg-[#F8FAFC]/30">
                        <div className="bg-white h-24 w-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <Layers className="h-10 w-10 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-black text-xs uppercase tracking-[0.3em]">Directory is currently vacant</p>
                    </div>
                ) : categories.map((cat: Category) => (
                    <div key={cat._id} className="group relative flex flex-col justify-between rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-pink-100/50 hover:-translate-y-2 overflow-hidden min-h-[220px]">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0">
                            <div className="h-1 w-12 bg-gradient-to-r from-[#FF2C79] to-purple-600 rounded-full" />
                        </div>

                        <div className="relative z-10 flex flex-col gap-8">
                            <div className="flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAFAFB] text-gray-400 border border-gray-50 group-hover:bg-[#FF2C79]/5 group-hover:text-[#FF2C79] group-hover:scale-110 transition-all duration-500">
                                    <Layers className="h-6 w-6 stroke-[2px]" />
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="p-3 text-gray-300 hover:text-[#FF2C79] hover:bg-pink-50 rounded-xl transition-all"
                                    >
                                        <Edit2 className="h-4 w-4 stroke-[2.5px]" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 className="h-4 w-4 stroke-[2.5px]" />
                                    </button>
                                </div>
                            </div>

                            {editingId === cat._id ? (
                                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                                    <input
                                        autoFocus
                                        className="w-full rounded-2xl border-2 border-pink-500/10 bg-pink-50/5 px-5 py-3 text-sm font-black text-gray-900 outline-none focus:ring-4 focus:ring-pink-500/5 uppercase tracking-widest"
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        onBlur={() => !editName && setEditingId(null)}
                                    />
                                    <div className="flex justify-end gap-5">
                                        <button type="button" onClick={() => setEditingId(null)} className="text-[9px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-[0.2em]">ABORT</button>
                                        <button type="submit" className="text-[9px] font-black text-[#FF2C79] hover:text-pink-700 uppercase tracking-[0.2em]">COMMIT</button>
                                    </div>
                                </form>
                            ) : (
                                <h3 className="text-2xl font-black text-[#111827] leading-tight uppercase tracking-tighter group-hover:text-[#FF2C79] transition-colors">
                                    {cat.name}
                                </h3>
                            )}
                        </div>

                        <div className="mt-10 flex items-center justify-between relative z-10 border-t border-gray-50 pt-8">
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] group-hover:text-gray-400 transition-colors">
                                STATUS: VERIFIED
                            </p>
                            <div className="flex gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                                <div className="h-1.5 w-4 rounded-full bg-[#10B981]/20" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}

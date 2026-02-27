'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { Category } from '@/types';
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
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const fetchCategories = async () => {
        try {
            const response = await adminService.getCategories();
            setCategories(response.data.categories);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName) return;
        try {
            await adminService.createCategory(newCategoryName);
            toast.success('Category created');
            setNewCategoryName('');
            fetchCategories();
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
            fetchCategories();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update category');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await adminService.deleteCategory(id);
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    return (
        <div className="space-y-12 max-w-7xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-none">
                    Category <span className="text-[#2563EB]">Management</span>
                </h1>
                <p className="text-base font-bold text-gray-400">
                    Create and organize product categories for your store.
                </p>
            </div>

            {/* Quick Add Section */}
            <div className="rounded-[1.5rem] border border-gray-100 bg-white p-10 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-[#EBF5FF] text-[#2563EB] flex items-center justify-center">
                        <Plus className="h-6 w-6 stroke-[3px]" />
                    </div>
                    <h2 className="text-xl font-black text-[#111827]">
                        Add New Category
                    </h2>
                </div>

                <form onSubmit={handleCreate} className="flex gap-4 items-center">
                    <div className="relative flex-grow">
                        <Tag className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="e.g., Casual Wear, Accessories, Winter Collection..."
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4.5 pl-14 pr-6 text-base font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/10 transition-all text-gray-900"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center rounded-2xl bg-[#2563EB] px-10 py-4.5 font-black text-base text-white hover:bg-blue-600 shadow-xl shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap min-w-[220px]"
                    >
                        Create Category
                    </button>
                </form>
            </div>

            {/* Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-48 animate-pulse rounded-[1.5rem] bg-gray-50 border border-gray-100" />
                    ))
                ) : categories.length === 0 ? (
                    <div className="col-span-full py-20 text-center rounded-[1.5rem] border border-dashed border-gray-200">
                        <Grid2X2 className="mx-auto h-16 w-16 text-gray-200 mb-6" />
                        <p className="text-gray-400 font-black text-lg">No categories created yet.</p>
                    </div>
                ) : categories.map((cat) => (
                    <div key={cat._id} className="group relative flex flex-col justify-between rounded-[1.5rem] border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden min-h-[180px]">
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#475569] border border-gray-100">
                                    <Layers className="h-6 w-6 stroke-[2.5px]" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="p-2.5 text-gray-400 hover:text-[#2563EB] hover:bg-[#EBF5FF] rounded-lg transition-all border border-transparent hover:border-blue-100"
                                    >
                                        <Edit2 className="h-4 w-4 stroke-[2.5px]" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                                    >
                                        <Trash2 className="h-4 w-4 stroke-[2.5px]" />
                                    </button>
                                </div>
                            </div>

                            {editingId === cat._id ? (
                                <form onSubmit={handleUpdate} className="flex flex-col gap-3">
                                    <input
                                        autoFocus
                                        className="w-full rounded-xl border-2 border-blue-500/20 bg-blue-50/10 px-4 py-2.5 text-base font-bold text-gray-900 outline-none focus:ring-4 focus:ring-blue-500/5"
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        onBlur={() => !editName && setEditingId(null)}
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button type="button" onClick={() => setEditingId(null)} className="text-[11px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest">Cancel</button>
                                        <button type="submit" className="text-[11px] font-black text-[#2563EB] hover:text-blue-700 uppercase tracking-widest">Save Changes</button>
                                    </div>
                                </form>
                            ) : (
                                <h3 className="text-2xl font-black text-[#111827] leading-tight">
                                    {cat.name}
                                </h3>
                            )}
                        </div>

                        <div className="mt-8 flex items-center justify-between relative z-10">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">
                                Active Category
                            </p>
                            <div className="h-2.5 w-2.5 rounded-full bg-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

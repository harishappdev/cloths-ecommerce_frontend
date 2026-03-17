'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { adminService } from '@/services/adminService';
import { Skeleton } from '@/components/ui/Skeleton';
import {
    Users,
    Search,
    Filter,
    ChevronDown,
    MoreHorizontal,
    Mail,
    Phone,
    Calendar,
    ArrowUpRight,
    UserCheck,
    UserMinus,
    Shield,
    ShieldCheck,
    Download,
    Plus,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/lib';

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: usersData, isLoading: usersLoading } = useSWR('/users');
    const customers = usersData?.data?.users || [];

    const filteredCustomers = (customers || []).filter((c: any) =>
        c?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c?._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="h-2 w-10 bg-gradient-to-r from-[#FF2C79] to-purple-600 rounded-full" />
                        <p className="text-[10px] font-black text-[#FF2C79] uppercase tracking-[0.2em]">Customer Insights</p>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[0.8] uppercase">Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2C79] to-purple-600">Directory</span></h1>
                    <p className="text-sm font-bold text-gray-500 mt-4 uppercase tracking-[0.1em]">Manage your customer base and their profiles.</p>
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] bg-gray-900 text-[11px] font-black text-white shadow-2xl shadow-gray-200 hover:bg-[#FF2C79] transition-all active:scale-95 uppercase tracking-[0.2em]">
                    <Download className="h-4 w-4" />
                    <span>Export Data</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="rounded-[2.5rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-6 transition-all hover:shadow-md">
                <div className="flex-grow max-w-2xl relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-[#FF2C79] transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH BY NAME / EMAIL..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#FAFAFB] border-none rounded-2xl py-5 pl-16 pr-6 text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-pink-500/5 focus:bg-white placeholder:text-gray-300 transition-all text-gray-900"
                        suppressHydrationWarning
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="flex items-center bg-[#FAFAFB] p-1 rounded-2xl border border-gray-50">
                        <button className="flex-1 px-8 py-3 rounded-xl text-[10px] font-black bg-[#FF2C79] text-white shadow-lg shadow-pink-100 transition-all uppercase tracking-[0.2em]">Live</button>
                        <button className="flex-1 px-8 py-3 rounded-xl text-[10px] font-black text-gray-400 hover:text-gray-900 transition-all uppercase tracking-[0.2em]">Idle</button>
                    </div>

                    <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-gray-100 text-[10px] font-black text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-[0.2em]">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <span>Filter</span>
                    </button>

                    <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gray-900 text-white text-[10px] font-black transition-all hover:bg-[#FF2C79] shadow-xl shadow-gray-200 uppercase tracking-[0.2em]">
                        <Plus className="h-4 w-4" />
                        <span>Add Customer</span>
                    </button>
                </div>
            </div>

            {/* Customers Table */}
            <div className="rounded-[3rem] border border-gray-100 bg-white shadow-sm overflow-hidden p-2">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1100px]">
                        <thead>
                            <tr className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-50 bg-[#FAFAFB]/50">
                                <th className="py-8 px-10">CUSTOMER INFO</th>
                                <th className="py-8 px-8">CONTACT DETAILS</th>
                                <th className="py-8 px-8">ORDER COUNT</th>
                                <th className="py-8 px-8">TOTAL SPENT</th>
                                <th className="py-8 px-8">STATUS</th>
                                <th className="py-8 px-10 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {usersLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="py-8 px-10">
                                            <Skeleton className="h-16 w-full rounded-[1.5rem]" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-32 text-center text-gray-400">
                                        <div className="bg-gray-50 h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                            <Users className="h-10 w-10 text-gray-200" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">No customers found</p>
                                    </td>
                                </tr>
                            ) : filteredCustomers.map((customer: any) => (
                                <tr key={customer._id} className="group hover:bg-pink-50/10 transition-all duration-500">
                                    <td className="py-8 px-10">
                                        <div className="flex items-center gap-6">
                                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[1.25rem] border-2 border-white bg-gray-50 shadow-sm ring-1 ring-gray-100 transition-transform group-hover:rotate-6 group-hover:scale-110">
                                                <Image
                                                    src={`https://ui-avatars.com/api/?name=${customer.name}&background=FF2C79&color=fff&bold=true`}
                                                    alt={customer.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 group-hover:text-[#FF2C79] transition-colors uppercase tracking-tight">{customer.name}</p>
                                                <p className="text-[9px] font-black text-gray-400 mt-1 uppercase tracking-widest">ID: #{customer._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-8">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-[11px] font-black text-gray-600 uppercase tracking-tight">
                                                <Mail className="h-3.5 w-3.5 text-[#FF2C79]" />
                                                {customer.email}
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                                <Phone className="h-3.5 w-3.5" />
                                                No Phone
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-8 text-center sm:text-left">
                                        <span className="text-xs font-black text-gray-900 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 uppercase tracking-widest">8 ORDERS</span>
                                    </td>
                                    <td className="py-8 px-8 font-black text-gray-900 text-sm tracking-tight">
                                        ₹{Number(1240).toLocaleString()}
                                    </td>
                                    <td className="py-8 px-8">
                                        <span className={cn(
                                            "inline-flex items-center rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm",
                                            customer.role === 'admin' ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                        )}>
                                            {customer.role === 'admin' ? "Admin" : "Customer"}
                                        </span>
                                    </td>
                                    <td className="py-8 px-10 text-right">
                                        <button className="px-8 py-4 rounded-2xl bg-gray-900 text-[10px] font-black text-white hover:bg-[#FF2C79] transition-all active:scale-95 shadow-lg shadow-gray-100 uppercase tracking-[0.2em]">
                                            Open Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-10 py-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        PAGE <span className="text-gray-900 font-black">01 OF 01</span>
                    </p>
                    <div className="flex items-center gap-3">
                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gray-900 text-white text-[11px] font-black shadow-2xl shadow-gray-200">01</button>
                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all shadow-sm">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

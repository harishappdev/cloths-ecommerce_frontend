'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import {
    Users,
    UserCheck,
    UserPlus,
    Wallet,
    Search,
    Filter,
    ChevronRight,
    ChevronLeft,
    Mail,
    Phone,
    MoreHorizontal,
    Download,
    Bell,
    HelpCircle,
    Plus,
    UserPlus2
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/lib';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await adminService.getUsers();
                if (response.status === 'success' && response.data?.users) {
                    setCustomers(response.data.users);
                }
            } catch (error) {
                toast.error('Failed to load customers');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const filteredCustomers = (customers || []).filter(c =>
        c?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c?._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900">Customer Management</h1>
                    <p className="text-sm font-bold text-gray-400 mt-2">Review, manage, and engage with your customer community.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="rounded-[1.5rem] border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-between gap-4">
                <div className="flex-grow max-w-xl relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#F8FAFC] border-none rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-400 transition-all"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-[#F8FAFC] p-1 rounded-xl border border-gray-100">
                        <button className="px-5 py-2.5 rounded-lg text-xs font-black bg-[#2563EB] text-white shadow-sm transition-all">Active</button>
                        <button className="px-5 py-2.5 rounded-lg text-xs font-black text-gray-400 hover:text-gray-900 transition-all">Inactive</button>
                        <button className="px-5 py-2.5 rounded-lg text-xs font-black text-gray-400 hover:text-gray-900 transition-all">All</button>
                    </div>

                    <button className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-gray-100 text-sm font-black text-gray-900 hover:bg-gray-50 transition-all">
                        <Filter className="h-4 w-4" />
                        <span>More Filters</span>
                    </button>

                    <button className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] text-sm font-black text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95">
                        <Plus className="h-4 w-4" />
                        <UserPlus2 className="h-4 w-4" />
                        <span>Add Customer</span>
                    </button>
                </div>
            </div>

            {/* Customers Table */}
            <div className="rounded-[1.5rem] border border-gray-100 bg-white shadow-sm overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50 bg-[#F8FAFC]/50">
                                <th className="py-5 px-8">Customer Name</th>
                                <th className="py-5 px-6">Email</th>
                                <th className="py-5 px-6">Phone</th>
                                <th className="py-5 px-6">Total Orders</th>
                                <th className="py-5 px-6">Total Spend</th>
                                <th className="py-5 px-6">Status</th>
                                <th className="py-5 px-8 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="py-8 px-8 h-24 bg-gray-50/20"></td>
                                    </tr>
                                ))
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <Users className="mx-auto h-12 w-12 text-gray-200 mb-4" />
                                        <p className="text-sm font-bold text-gray-400">No customers found matching your search.</p>
                                    </td>
                                </tr>
                            ) : filteredCustomers.map((customer) => (
                                <tr key={customer._id} className="group hover:bg-[#F8FAFC] transition-all">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
                                                <Image
                                                    src={`https://i.pravatar.cc/150?u=${customer._id}`}
                                                    alt={customer.name}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-110"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-black text-gray-900 group-hover:text-[#2563EB] transition-colors">{customer.name}</p>
                                                <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">ID: #C-{customer._id.slice(-4).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6">
                                        <span className="text-[13px] font-bold text-gray-500">{customer.email}</span>
                                    </td>
                                    <td className="py-6 px-6">
                                        <span className="text-[13px] font-bold text-gray-500">+1 (555) 012-3456</span>
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-black text-gray-900">12 Orders</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 font-black text-gray-900 text-sm">
                                        $1,240.50
                                    </td>
                                    <td className="py-6 px-6">
                                        <span className={cn(
                                            "inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider",
                                            customer.role === 'admin' ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"
                                        )}>
                                            {customer.role === 'admin' ? "Admin" : "Active"}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <button className="text-[11px] font-black text-[#2563EB] uppercase tracking-widest hover:underline transition-all">
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-8 py-5 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-[12px] font-bold text-gray-400">
                        Showing <span className="text-gray-900 font-black">1-5</span> of <span className="text-gray-900 font-black">{customers.length}</span> customers
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#2563EB] text-white text-xs font-black shadow-lg shadow-blue-500/20">1</button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-600 text-xs font-black hover:bg-gray-50">2</button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-600 text-xs font-black hover:bg-gray-50">3</button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

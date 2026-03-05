'use client';

import { useState, useEffect } from 'react';
import { Plus, MapPin, Trash2, Edit3, Check, Loader2, X, Home, Briefcase, ChevronLeft } from 'lucide-react';
import { userService } from '@/services/userService';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/lib';

interface Address {
    _id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    type?: 'home' | 'work' | 'other';
}

interface AddressManagerProps {
    onBack: () => void;
}

export default function AddressManager({ onBack }: AddressManagerProps) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        isDefault: false,
        type: 'home' as const
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const response = await userService.getAddresses();
            setAddresses(response.data.addresses);
        } catch (error) {
            toast.error('Failed to load addresses');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (editingId) {
                await userService.updateAddress(editingId, formData);
                toast.success('Address updated successfully');
            } else {
                await userService.addAddress(formData);
                toast.success('Address added successfully');
            }
            setIsAdding(false);
            setEditingId(null);
            setFormData({ name: '', street: '', city: '', state: '', zipCode: '', country: 'India', isDefault: false, type: 'home' });
            fetchAddresses();
        } catch (error) {
            toast.error('Operation failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            await userService.removeAddress(id);
            toast.success('Address removed');
            fetchAddresses();
        } catch (error) {
            toast.error('Failed to remove address');
        }
    };

    const handleEdit = (address: Address) => {
        setFormData({
            name: address.name,
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
            isDefault: address.isDefault,
            type: address.type || 'home'
        });
        setEditingId(address._id);
        setIsAdding(true);
    };

    if (isLoading && addresses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-vibrant-in">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">Synchronizing Locations...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-vibrant-in">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft className="h-6 w-6 text-gray-900" />
                    </button>
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase italic tracking-tight">Saved Addresses</h2>
                </div>
                {!isAdding && (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="p-3 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-black transition-all flex items-center gap-2 group"
                    >
                        <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Add New</span>
                    </button>
                )}
            </div>

            {isAdding ? (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100 animate-slide-up">
                    <div className="flex justify-between items-center mb-8">
                        <p className="text-xs font-black uppercase tracking-widest text-primary">{editingId ? 'Modify Address' : 'New Destination'}</p>
                        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-900">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address Label (e.g. My Home)</label>
                                <input 
                                    required 
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address Type</label>
                                <div className="flex gap-3">
                                    {(['home', 'work', 'other'] as const).map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setFormData({...formData, type: t})}
                                            className={cn(
                                                "flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                                formData.type === t ? "bg-primary border-primary text-white shadow-lg" : "border-gray-100 text-gray-400 hover:border-gray-200"
                                            )}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Building / Street / Area</label>
                                <input 
                                    required 
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={formData.street}
                                    onChange={e => setFormData({...formData, street: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                                <input 
                                    required 
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={formData.city}
                                    onChange={e => setFormData({...formData, city: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">State / Province</label>
                                <input 
                                    required 
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={formData.state}
                                    onChange={e => setFormData({...formData, state: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Zip / Postal Code</label>
                                <input 
                                    required 
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={formData.zipCode}
                                    onChange={e => setFormData({...formData, zipCode: e.target.value})}
                                />
                            </div>
                            <div className="flex items-center gap-3 pt-6">
                                <input 
                                    type="checkbox" 
                                    id="isDefault" 
                                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={formData.isDefault}
                                    onChange={e => setFormData({...formData, isDefault: e.target.checked})}
                                />
                                <label htmlFor="isDefault" className="text-[11px] font-black uppercase tracking-widest text-gray-900 cursor-pointer">Set as Default Address</label>
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 h-14 bg-gradient-vibrant text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'SAVE DESTINATION'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : addresses.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200 shadow-sm">
                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MapPin className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-2">No Saved Locations</p>
                    <p className="text-xs text-gray-400 mb-8 italic">Your global shipping network starts here.</p>
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl"
                    >
                        Add Global Origin
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    {addresses.map((address) => (
                        <div 
                            key={address._id} 
                            className={cn(
                                "group bg-white rounded-3xl p-6 border-2 transition-all hover:shadow-2xl hover:shadow-gray-100",
                                address.isDefault ? "border-primary/20 shadow-lg shadow-pink-50" : "border-gray-50 hover:border-gray-200"
                            )}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm",
                                        address.isDefault ? "bg-primary/10 text-primary" : "bg-gray-50 text-gray-400"
                                    )}>
                                        {address.type === 'work' ? <Briefcase className="h-5 w-5" /> : <Home className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{address.name}</h4>
                                        {address.isDefault && (
                                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-2 py-0.5 rounded">Default</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(address)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary transition-colors">
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(address._id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-500 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1 text-xs font-bold text-gray-500 italic leading-relaxed">
                                <p>{address.street}</p>
                                <p>{address.city}, {address.state} - {address.zipCode}</p>
                                <p className="text-gray-900 not-italic uppercase tracking-widest font-black pt-2">{address.country}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

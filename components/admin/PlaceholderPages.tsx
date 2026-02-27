import {
    Users,
    Ticket,
    BarChart3,
    Settings,
    Construction
} from 'lucide-react';

const PlaceholderPage = ({ title, icon: Icon, description }: any) => (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="relative">
            <div className="h-32 w-32 rounded-[2.5rem] bg-primary/5 flex items-center justify-center text-primary shadow-xl shadow-primary/5">
                <Icon className="h-16 w-16" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white border-4 border-[#F8FAFC] flex items-center justify-center text-orange-500 shadow-lg">
                <Construction className="h-5 w-5" />
            </div>
        </div>
        <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-gray-900">{title} <span className="text-primary italic">Coming Soon</span></h1>
            <p className="text-lg font-bold text-gray-400">{description}</p>
        </div>
        <div className="flex items-center space-x-4 pt-4">
            <div className="h-1.5 w-12 rounded-full bg-primary/20" />
            <div className="h-1.5 w-12 rounded-full bg-primary" />
            <div className="h-1.5 w-12 rounded-full bg-primary/20" />
        </div>
    </div>
);

// Exports for each page
export const CustomersPlaceholder = () => (
    <PlaceholderPage
        title="Customer Hub"
        icon={Users}
        description="We're building a powerful CRM to help you manage and understand your customer base with deep analytics."
    />
);

export const CouponsPlaceholder = () => (
    <PlaceholderPage
        title="Marketing Engine"
        icon={Ticket}
        description="Revolutionary discount and coupon management system is being crafted to boost your conversion rates."
    />
);

export const ReportsPlaceholder = () => (
    <PlaceholderPage
        title="Advanced Analytics"
        icon={BarChart3}
        description="Complex data sets and meaningful insights will soon be available here to guide your business decisions."
    />
);

export const SettingsPlaceholder = () => (
    <PlaceholderPage
        title="System Settings"
        icon={Settings}
        description="Configure your store's global preferences, payment gateways, and integration keys in this upcoming hub."
    />
);

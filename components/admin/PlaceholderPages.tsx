import {
    Users,
    Ticket,
    BarChart3,
    Settings,
    Construction
} from 'lucide-react';

const PlaceholderPage = ({ title, icon: Icon, description }: any) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-xl mx-auto space-y-8 px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="relative">
            <div className="h-28 w-28 md:h-32 md:w-32 rounded-[2rem] md:rounded-[2.5rem] bg-gray-50 flex items-center justify-center text-gray-900 shadow-xl shadow-gray-100 ring-1 ring-gray-100">
                <Icon className="h-12 w-12 md:h-16 md:w-16 stroke-[1.5px]" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl bg-white border-4 border-[#F8FAFC] flex items-center justify-center text-orange-500 shadow-lg">
                <Construction className="h-4 w-4 md:h-5 md:w-5" />
            </div>
        </div>
        <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 uppercase">
                {title} <br className="sm:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2C79] to-purple-600 ml-2 mt-2 inline-block">Next Gen Admin</span>
            </h1>
            <p className="text-xs md:text-sm font-bold text-gray-400 leading-relaxed uppercase tracking-widest">{description}</p>
        </div>
        <div className="flex items-center space-x-3 pt-6">
            <div className="h-1 w-8 rounded-full bg-gray-50" />
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#FF2C79] to-purple-600 shadow-lg shadow-pink-100" />
            <div className="h-1 w-8 rounded-full bg-gray-50" />
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

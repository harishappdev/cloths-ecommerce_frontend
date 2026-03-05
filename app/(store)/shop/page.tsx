import { Metadata } from 'next';
import { Suspense } from 'react';
import { ShopClient } from './ShopClient';

export async function generateMetadata({ 
    searchParams 
}: { 
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}): Promise<Metadata> {
    const params = await searchParams;
    const category = params.category as string;
    const search = params.search as string;
    const sale = params.sale === 'true';

    let title = 'Shop All Collections | Urban Closet';
    let description = 'Explore our premium collections of clothing, footwear, and accessories.';

    if (category) {
        title = `${category}'s Collection | Urban Closet Premium`;
        description = `Discover the latest trends in ${category.toLowerCase()}'s fashion at Urban Closet.`;
    } else if (sale) {
        title = 'Limited Sale | Exclusive Offers at Urban Closet';
        description = 'Shop our exclusive sale items and get the best deals on premium fashion.';
    } else if (search) {
        title = `Search results for "${search}" | Urban Closet`;
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        }
    };
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white container mx-auto px-4 py-20">
                <div className="h-4 w-24 bg-[#F8FAFC] animate-pulse mb-4" />
                <div className="h-12 w-64 bg-[#F8FAFC] animate-pulse mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-[256px,1fr] gap-12">
                    <div className="space-y-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-40 bg-[#F8FAFC] animate-pulse rounded-2xl" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-80 bg-[#F8FAFC] animate-pulse rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        }>
            <ShopClient />
        </Suspense>
    );
}

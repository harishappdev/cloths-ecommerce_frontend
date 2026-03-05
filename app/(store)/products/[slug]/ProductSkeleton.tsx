'use client';

export default function ProductSkeleton() {
    return (
        <div className="bg-white min-h-screen animate-pulse">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Breadcrumbs Skeleton */}
                <div className="h-4 w-48 bg-gray-50 rounded-full mb-8" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left: Product Gallery Skeleton */}
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        <div className="flex md:flex-col gap-3 md:w-20">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-20 w-16 md:h-24 md:w-full bg-gray-50 rounded-lg" />
                            ))}
                        </div>
                        <div className="flex-grow aspect-[4/5] bg-gray-50 rounded-2xl" />
                    </div>

                    {/* Right: Product Info Skeleton */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="h-4 w-24 bg-gray-50 rounded-full" />
                            <div className="h-12 w-3/4 bg-gray-50 rounded-xl" />
                            <div className="h-6 w-32 bg-gray-50 rounded-full" />
                        </div>
                        
                        <div className="py-6 border-y border-gray-50">
                            <div className="h-10 w-40 bg-gray-50 rounded-xl" />
                        </div>
                        
                        <div className="space-y-4">
                            <div className="h-4 w-32 bg-gray-50 rounded-full" />
                            <div className="flex gap-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-10 w-10 rounded-full bg-gray-50" />)}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="h-4 w-32 bg-gray-50 rounded-full" />
                            <div className="grid grid-cols-6 gap-2">
                                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-12 bg-gray-50 rounded-lg" />)}
                            </div>
                        </div>

                        <div className="pt-8 space-y-4">
                            <div className="h-16 w-full bg-gray-50 rounded-xl" />
                            <div className="h-16 w-full bg-gray-900/5 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

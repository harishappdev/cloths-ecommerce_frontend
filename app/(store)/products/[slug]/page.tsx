import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProductDetailsClient from './ProductDetailsClient';
import ProductSkeleton from './ProductSkeleton';

async function getProduct(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/products/slug/${slug}`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data.data.product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Product Not Found | Urban Closet',
        };
    }

    return {
        title: `${product.name} | Urban Closet Premium`,
        description: product.description?.substring(0, 160),
        openGraph: {
            title: product.name,
            description: product.description,
            images: [product.images[0]],
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    // We can fetch data here, but for better UX with Suspense, we could also move it to a sub-component
    // However, since it's a server component Page, we'll keep it simple for now.
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    return (
        <Suspense fallback={<ProductSkeleton />}>
            <ProductDetailsClient product={product} />
        </Suspense>
    );
}

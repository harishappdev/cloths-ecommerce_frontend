import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getImageUrl(imagePath?: string) {
    if (!imagePath) return 'https://via.placeholder.com/600x800?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;

    // Get backend base URL from environment or fallback to localhost:5000
    // We strip /api/v1 if it's included in the env variable to get the root static folder access
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace('/api/v1', '');
    const normalizedPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;

    return `${apiBase}/${normalizedPath}`;
}

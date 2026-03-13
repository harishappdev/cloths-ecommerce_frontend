import { SWRConfiguration, preload } from 'swr';
import api from '@/services/api';

export const fetcher = (url: string) => api.get(url).then(res => res.data);

export const prefetch = (url: string) => preload(url, fetcher);

export const swrConfig: SWRConfiguration = {
    fetcher,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    dedupingInterval: 5000, // 5 seconds
};

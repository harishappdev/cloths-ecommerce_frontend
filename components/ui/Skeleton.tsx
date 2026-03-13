import { cn } from '@/utils/lib';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-gray-100",
                className
            )}
        />
    );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number, cols?: number }) {
    return (
        <div className="w-full space-y-4">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                    {Array.from({ length: cols }).map((_, j) => (
                        <Skeleton key={j} className="h-12 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
}

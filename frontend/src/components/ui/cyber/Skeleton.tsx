import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}


export function Skeleton({ className }: SkeletonProps) {
    return (
        <span
            className={cn(
                'inline-block bg-white/10 animate-pulse rounded',
                className
            )}
        />
    );
}

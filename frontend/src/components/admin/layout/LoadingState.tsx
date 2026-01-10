'use client';

interface LoadingStateProps {
    message?: string;
}

// Standardized loading state for admin pages
export function LoadingState({ message = 'LOADING...' }: LoadingStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="font-mono text-xs text-muted-foreground/50 animate-pulse">
                {message}
            </div>
        </div>
    );
}

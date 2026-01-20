'use client';

import { cn } from '@/lib/utils';

interface StatusMessageProps {
    type: 'success' | 'error' | 'info';
    message: string;
    className?: string;
}

export function StatusMessage({ type, message, className }: StatusMessageProps) {
    const styles = {
        success: 'bg-cyan-neon/10 border-cyan-neon/30 text-cyan-neon',
        error: 'bg-red-500/10 border-red-500/30 text-red-400',
        info: 'bg-primary/10 border-primary/30 text-primary',
    };

    const prefixes = {
        success: '✓',
        error: '✗',
        info: 'ℹ',
    };

    return (
        <div
            className={cn(
                'border rounded px-4 py-3 font-mono text-sm',
                styles[type],
                className
            )}
        >
            <span className="mr-2">{prefixes[type]}</span>
            {message.toUpperCase().replace(/ /g, '_')}
        </div>
    );
}

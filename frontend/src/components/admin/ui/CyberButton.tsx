'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
}

const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, isLoading = false, children, disabled, ...props }, ref) => {
        const baseStyles = cn(
            'relative overflow-hidden rounded font-mono uppercase tracking-widest',
            'transition-all duration-300 cursor-pointer',
            'disabled:opacity-40 disabled:cursor-not-allowed'
        );

        const variants = {
            primary: cn(
                'bg-transparent border border-cyan-neon/40 text-cyan-neon',
                'hover:border-cyan-neon hover:bg-cyan-neon/10',
                'hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]'
            ),
            secondary: cn(
                'bg-transparent border border-white/20 text-muted-foreground',
                'hover:border-white/40 hover:text-foreground'
            ),
            danger: cn(
                'bg-transparent border border-red-500/40 text-red-400',
                'hover:border-red-500 hover:bg-red-500/10',
                'hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
            ),
            ghost: cn(
                'bg-transparent border border-transparent text-muted-foreground',
                'hover:border-white/20 hover:text-foreground'
            ),
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-[10px]',
            md: 'px-5 py-2 text-xs',
            lg: 'px-6 py-3 text-sm',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    fullWidth && 'w-full',
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : null}
                    {children}
                </span>
            </button>
        );
    }
);

CyberButton.displayName = 'CyberButton';

export { CyberButton };

'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    isLoading?: boolean;
    size?: 'sm' | 'md' | 'lg';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, isLoading = false, children, disabled, ...props }, ref) => {
        const baseStyles = cn(
            'relative overflow-hidden rounded font-mono uppercase tracking-widest',
            'transition-all duration-300 cursor-pointer',
            'disabled:opacity-40 disabled:cursor-default'
        );

        const variants = {
            primary: cn(
                'bg-transparent border border-violet-500/40 text-violet-400',
                'hover:border-violet-500 hover:bg-violet-500/10',
                'hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]'
            ),
            secondary: cn(
                'bg-transparent border border-white/20 text-muted-foreground',
                'hover:border-white/40 hover:text-foreground'
            ),
            danger: cn(
                'bg-transparent border border-rose-500/40 text-rose-400',
                'hover:border-rose-500 hover:bg-rose-500/10',
                'hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]'
            ),
            ghost: cn(
                'bg-transparent border border-transparent text-muted-foreground',
                'hover:border-white/20 hover:text-foreground'
            ),
            outline: cn(
                'bg-transparent border border-white/10 text-slate-400',
                'hover:border-violet-500/50 hover:text-violet-300 hover:bg-violet-500/5'
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

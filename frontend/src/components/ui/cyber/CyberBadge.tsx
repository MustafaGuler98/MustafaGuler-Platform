import { cn } from '@/lib/utils';

interface CyberBadgeProps {
    label: string;
    variant?: 'primary' | 'success' | 'warning' | 'info' | 'muted' | 'danger';
    className?: string;
}

const variantStyles = {
    primary: 'border-violet-500/30 text-violet-300 shadow-[0_0_10px_-5px_rgba(139,92,246,0.3)]',
    success: 'border-emerald-500/30 text-emerald-300 shadow-[0_0_10px_-5px_rgba(52,211,153,0.3)]',
    warning: 'border-amber-500/30 text-amber-300 shadow-[0_0_10px_-5px_rgba(251,191,36,0.3)]',
    info: 'border-indigo-500/30 text-indigo-300 shadow-[0_0_10px_-5px_rgba(99,102,241,0.3)]',
    danger: 'border-rose-500/30 text-rose-300 shadow-[0_0_10px_-5px_rgba(244,63,94,0.3)]',
    muted: 'border-slate-500/30 text-slate-400',
};

export function CyberBadge({
    label,
    variant = 'primary',
    className,
}: CyberBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center w-28 h-7', // Fixed width & height for consistency
                'text-[10px] font-mono tracking-wider uppercase',
                'rounded-sm border bg-slate-900/40 backdrop-blur-[2px]',
                variantStyles[variant],
                className
            )}
        >
            {label}
        </span>
    );
}



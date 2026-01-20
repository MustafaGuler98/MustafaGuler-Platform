import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface CyberCardProps {
    title?: string;
    icon?: LucideIcon;
    children: ReactNode;
    className?: string;
    action?: ReactNode;
    noPadding?: boolean;
}

export function CyberCard({
    title,
    icon: Icon,
    children,
    className,
    action,
    noPadding = false,
}: CyberCardProps) {
    return (
        <div className={cn(
            "group relative bg-slate-900/40 border border-white/5 rounded-lg overflow-hidden transition-all duration-300",
            "hover:border-violet-500/20 hover:bg-slate-900/60 hover:shadow-[0_0_20px_-10px_rgba(139,92,246,0.1)]",
            className
        )}>
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {(title || Icon) && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-2.5">
                        {Icon && (
                            <Icon
                                size={16}
                                className="text-violet-400/80 group-hover:text-violet-400 transition-colors"
                            />
                        )}
                        {title && (
                            <h3 className="font-mono text-xs font-bold tracking-widest text-slate-400 uppercase group-hover:text-violet-300 transition-colors">
                                {title}
                            </h3>
                        )}
                    </div>
                    {action && (
                        <div>{action}</div>
                    )}
                </div>
            )}

            <div className={cn(noPadding ? "" : "p-5")}>
                {children}
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 group-hover:border-violet-500/30 transition-colors rounded-tl-sm" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10 group-hover:border-violet-500/30 transition-colors rounded-br-sm" />
        </div>
    );
}

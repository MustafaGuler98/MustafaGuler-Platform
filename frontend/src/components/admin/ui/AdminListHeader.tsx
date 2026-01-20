import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminListHeaderProps {
    title: string;
    subtitle?: string;
    icon: ReactNode;
    actionButton?: ReactNode;
    className?: string;
}

export function AdminListHeader({
    title,
    subtitle,
    icon,
    actionButton,
    className,
}: AdminListHeaderProps) {
    return (
        <div className={cn('flex items-center justify-between', className)}>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded border border-primary/30 flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <h1 className="font-mono text-lg text-foreground tracking-wide">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            {actionButton && <div>{actionButton}</div>}
        </div>
    );
}

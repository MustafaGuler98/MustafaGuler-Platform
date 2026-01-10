'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CyberButton } from '@/components/admin/ui/CyberButton';
import { ReactNode } from 'react';

interface AdminPageHeaderProps {
    backHref?: string;
    icon: ReactNode;
    title: string;
    subtitle: string;
    action?: ReactNode;
}

export function AdminPageHeader({
    backHref,
    icon,
    title,
    subtitle,
    action,
}: AdminPageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                {backHref && (
                    <Link href={backHref}>
                        <CyberButton variant="ghost" size="sm">
                            <ArrowLeft size={12} />
                        </CyberButton>
                    </Link>
                )}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded border border-primary/30 flex items-center justify-center">
                        {icon}
                    </div>
                    <div>
                        <h1 className="font-mono text-base text-foreground tracking-wide">
                            {title}
                        </h1>
                        <p className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

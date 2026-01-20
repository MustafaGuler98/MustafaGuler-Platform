'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CyberActionLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export function CyberActionLink({
    href,
    children,
    className,
    onClick,
}: CyberActionLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                'font-mono uppercase tracking-widest text-[10px]',
                'text-cyan-neon hover:text-white',
                'transition-colors duration-200',
                'cursor-pointer',
                className
            )}
        >
            {children}
        </Link>
    );
}

'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { CyberButton } from './CyberButton';
import { ReactNode } from 'react';

interface CyberNewButtonProps {
    href: string;
    label?: string;
    icon?: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export function CyberNewButton({
    href,
    label = 'NEW',
    icon,
    size = 'sm',
}: CyberNewButtonProps) {
    const IconComponent = icon || <Plus size={12} />;

    return (
        <Link href={href}>
            <CyberButton variant="primary" size={size}>
                {IconComponent}
                {label}
            </CyberButton>
        </Link>
    );
}

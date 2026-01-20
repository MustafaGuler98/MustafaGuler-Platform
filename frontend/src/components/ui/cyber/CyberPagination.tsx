'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CyberPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function CyberPagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: CyberPaginationProps) {
    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    return (
        <div className={cn('flex items-center justify-center gap-6 py-4', className)}>
            <button
                disabled={!canGoPrev}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2 font-mono text-xs text-muted-foreground hover:text-cyan-neon disabled:opacity-30 disabled:cursor-default transition-colors hover:bg-white/5 rounded"
            >
                <ChevronLeft size={16} />
            </button>

            <span className="font-mono text-xs tracking-widest">
                <span className="text-cyan-neon">{currentPage}</span>
                <span className="text-muted-foreground"> / {totalPages}</span>
            </span>

            <button
                disabled={!canGoNext}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2 font-mono text-xs text-muted-foreground hover:text-cyan-neon disabled:opacity-30 disabled:cursor-default transition-colors hover:bg-white/5 rounded"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}

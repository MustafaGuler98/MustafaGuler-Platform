"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArticlePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
    showOnly?: "left" | "right";
    isLoading?: boolean;
}

export function ArticlePagination({
    currentPage,
    totalPages,
    onPageChange,
    showOnly,
    isLoading = false
}: ArticlePaginationProps) {

    const handlePageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages || isLoading) return;
        onPageChange(newPage);
    };

    const leftButton = (
        <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={`p-2 rounded-full transition-colors duration-300 ${currentPage > 0 && !isLoading
                ? 'text-white hover:text-cyan-neon hover:shadow-[0_0_12px_var(--cyan-neon)] cursor-pointer'
                : 'text-white/20 pointer-events-none'
                }`}
            disabled={currentPage === 0 || isLoading}
            aria-label="Previous page"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>
    );

    const rightButton = (
        <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={`p-2 rounded-full transition-colors duration-300 ${currentPage < totalPages - 1 && !isLoading
                ? 'text-white hover:text-cyan-neon hover:shadow-[0_0_12px_var(--cyan-neon)] cursor-pointer'
                : 'text-white/20 pointer-events-none'
                }`}
            disabled={currentPage >= totalPages - 1 || isLoading}
            aria-label="Next page"
        >
            <ChevronRight className="w-6 h-6" />
        </button>
    );

    if (showOnly === "left") return leftButton;
    if (showOnly === "right") return rightButton;

    return (
        <div className="flex items-center gap-4">
            {leftButton}
            <span className="font-mono text-xs text-muted-foreground">
                {currentPage + 1} / {totalPages}
            </span>
            {rightButton}
        </div>
    );
}

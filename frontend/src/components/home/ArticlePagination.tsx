"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { articleService } from "@/services/articleServices";
import { ArticleListWithoutImage } from "@/types/article";

interface ArticlePaginationProps {
    initialPage: number;
    totalPages: number;
    articlesPerPage: number;
    onArticlesChange: (articles: ArticleListWithoutImage[], page: number) => void;
}

export function ArticlePagination({
    initialPage,
    totalPages,
    articlesPerPage,
    onArticlesChange
}: ArticlePaginationProps) {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [isLoading, setIsLoading] = useState(false);

    const handlePageChange = async (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages || isLoading) return;

        setIsLoading(true);
        try {
            const result = await articleService.getPagedWithoutImageArticles(newPage + 1, articlesPerPage, 'en');
            if (result.isSuccess && result.data) {
                onArticlesChange(result.data.items, newPage);
                setCurrentPage(newPage);
            }
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            {/* Left Arrow */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                className={`p-2 rounded-full transition-colors duration-300 ${currentPage > 0 && !isLoading
                    ? 'text-white hover:text-cyan-neon hover:shadow-[0_0_12px_var(--cyan-neon)] cursor-pointer'
                    : 'text-white/20 pointer-events-none'
                    }`}
                disabled={currentPage === 0 || isLoading}
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Page indicator */}
            <span className="font-mono text-xs text-muted-foreground">
                {currentPage + 1} / {totalPages}
            </span>

            {/* Right Arrow */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                className={`p-2 rounded-full transition-colors duration-300 ${currentPage < totalPages - 1 && !isLoading
                    ? 'text-white hover:text-cyan-neon hover:shadow-[0_0_12px_var(--cyan-neon)] cursor-pointer'
                    : 'text-white/20 pointer-events-none'
                    }`}
                disabled={currentPage >= totalPages - 1 || isLoading}
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}

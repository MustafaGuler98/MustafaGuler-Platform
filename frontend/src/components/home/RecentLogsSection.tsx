"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ArticleListWithoutImage } from "@/types/article";
import { formatDate } from "@/lib/utils";
import { ArticlePagination } from "./ArticlePagination";

interface RecentLogsSectionProps {
    articles: ArticleListWithoutImage[];
    totalCount: number;
}

const ARTICLES_PER_PAGE = 3;

export function RecentLogsSection({ articles, totalCount }: RecentLogsSectionProps) {
    const [currentArticles, setCurrentArticles] = useState<ArticleListWithoutImage[]>(articles);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoadingArticles, setIsLoadingArticles] = useState(false);
    const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

    // Pre-load the service module after initial render
    useEffect(() => {
        const prefetchServices = async () => {
            try {
                await import("@/services/articleServices");
            } catch (e) {
                console.debug("Prefetch failed", e);
            }
        };

        // Wait 3 seconds to ensure it doesn't interfere with initial page load
        const timer = setTimeout(prefetchServices, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handlePageChange = async (newPage: number) => {
        setIsLoadingArticles(true);
        try {
            const { articleService } = await import("@/services/articleServices");
            const result = await articleService.getPagedWithoutImageArticles(newPage + 1, ARTICLES_PER_PAGE, 'en');

            if (result.isSuccess && result.data) {
                setCurrentArticles(result.data.items);
                setCurrentPage(newPage);
            }
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setIsLoadingArticles(false);
        }
    };

    return (
        <section className="py-16 px-4">
            <div className="container max-w-5xl mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        <h2 className="font-heading text-xl font-bold text-foreground tracking-wider">
                            Recent Logs
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="group flex items-center gap-2 text-sm text-primary hover:text-cyan-neon transition-colors"
                    >
                        View All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {currentArticles.length === 0 && !isLoadingArticles ? (
                    <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card/20">
                        <p className="text-muted-foreground font-mono text-sm">
                            [INFO] No logs found in the archive...
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        {/* Left Arrow */}
                        {totalPages > 1 && (
                            <ArticlePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                showOnly="left"
                                isLoading={isLoadingArticles}
                            />
                        )}

                        {/* Cards Grid */}
                        <div className={`flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity duration-300 ${isLoadingArticles ? 'opacity-50' : 'opacity-100'}`}>
                            {currentArticles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/blog/${article.slug}`}
                                    className="group block"
                                >
                                    <div className="relative overflow-hidden rounded-lg border transition-all duration-300 bg-[#0f0518]/90 border-primary/40 backdrop-blur-sm hover:bg-[#1a0b2e] hover:border-cyan-neon/50 hover:translate-x-1 hover:shadow-[0_4px_20px_-10px_rgba(34,211,238,0.25)]">
                                        <div className="p-4 flex flex-col gap-2">
                                            <h3 className="font-heading text-sm font-bold text-white/90 group-hover:text-cyan-neon transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-mono text-[10px] text-amber-400 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                    {article.categoryName || "LOG"}
                                                </span>
                                                <span className="font-mono text-[10px] text-muted-foreground/60">
                                                    {formatDate(article.createdDate)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Right Arrow */}
                        {totalPages > 1 && (
                            <ArticlePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                showOnly="right"
                                isLoading={isLoadingArticles}
                            />
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

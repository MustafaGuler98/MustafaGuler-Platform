"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types/article";
import { formatDate, getImageUrl } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Zap, Database, Folder, Filter, Calendar } from "lucide-react";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { BlogQuoteWidget, BlogBookWidget, BlogFilmWidget, BlogMusicWidget } from "@/components/blog/widgets/SidebarWidgets";
import { BlogHeaderStats } from "@/components/blog/widgets/BlogHeaderStats";

import type { ArchivesStats } from '@/types/archives';

interface BlogClientProps {
    articles: Article[];
    popularArticles: Article[];
    categories: string[];
    stats: ArchivesStats | null;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
    };
}

export default function BlogClient({ articles, popularArticles, categories, stats, pagination }: BlogClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);

    const currentCategory = searchParams.get('category');
    const [popularPage, setPopularPage] = useState(0);

    const [gridParent] = useAutoAnimate();

    const POPULAR_ITEMS_PER_PAGE = 3;

    useEffect(() => {
        setMounted(true);
    }, []);

    const visiblePopularArticles = popularArticles.slice(
        popularPage * POPULAR_ITEMS_PER_PAGE,
        (popularPage + 1) * POPULAR_ITEMS_PER_PAGE
    );

    const maxPopularPages = Math.min(3, Math.ceil(popularArticles.length / POPULAR_ITEMS_PER_PAGE));

    const visibleGridArticles = articles;


    const currentPage = pagination?.currentPage || 1;
    const totalPages = pagination?.totalPages || 1;


    const toggleCategory = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (currentCategory === category) {
            params.delete('category'); // Deselect
        } else {
            params.set('category', category); // Select
        }

        params.set('page', '1'); // Reset to page 1 on filter change
        router.push(`/blog?${params.toString()}`, { scroll: false });
    };

    const handlePopularNav = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            setPopularPage(prev => Math.min(maxPopularPages - 1, prev + 1));
        } else {
            setPopularPage(prev => Math.max(0, prev - 1));
        }
    };

    const handleGridNav = (direction: 'next' | 'prev') => {
        let nextPage = currentPage;
        if (direction === 'next') {
            if (currentPage < totalPages) nextPage = currentPage + 1;
        } else {
            if (currentPage > 1) nextPage = currentPage - 1;
        }

        if (nextPage !== currentPage) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', nextPage.toString());
            router.push(`/blog?${params.toString()}`);
        }
    };

    if (!mounted) return <div className="min-h-screen bg-[#020103]" />;

    return (
        <div className="min-h-screen text-foreground relative overflow-hidden flex flex-col">

            <main className="relative z-10 flex-1 container max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-16">

                {/* Header */}
                <div className="flex items-center justify-between gap-4 border-b border-primary/20 pb-8">
                    <div className="flex flex-col items-start gap-4">
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-neon tracking-widest uppercase animate-pulse">
                            <Database className="w-4 h-4" />
                            <span>ARCHIVE</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-[0.02em] text-gray-200">
                            BLOG
                        </h1>
                    </div>

                    {/* Right side stats - API based */}
                    <BlogHeaderStats articleCount={pagination?.totalCount || articles.length} stats={stats} />
                </div>

                {/* Popular Carousel Section */}
                <section className="relative">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold tracking-[0.05em] text-white flex items-center gap-3">
                            <Zap className="w-5 h-5 text-purple-400" />
                            POPULAR
                        </h2>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePopularNav('prev')}
                                disabled={popularPage === 0}
                                className="p-2 rounded-full border border-white/10 text-white hover:text-cyan-neon hover:shadow-[0_0_12px_var(--cyan-neon)] transition-all duration-300 disabled:opacity-30 disabled:text-gray-600 disabled:hover:text-gray-600 disabled:hover:shadow-none"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handlePopularNav('next')}
                                disabled={popularPage >= maxPopularPages - 1}
                                className="p-2 rounded-full border border-white/10 text-white hover:text-cyan-neon hover:shadow-[0_0_12px_var(--cyan-neon)] transition-all duration-300 disabled:opacity-30 disabled:text-gray-600 disabled:hover:text-gray-600 disabled:hover:shadow-none"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {visiblePopularArticles.map((article) => (
                            <Link href={`/blog/${article.slug}`} key={article.id} className="group relative block h-full">
                                {/* Top Border Accent */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60 rounded-t-lg z-10" />

                                <div className="relative h-full overflow-hidden rounded-lg border transition-all duration-300
                                            bg-[#0d0416]/95 border-purple-500/30 backdrop-blur-sm
                                            hover:bg-[#180a2e] hover:border-purple-400/60 hover:translate-x-1 
                                            hover:shadow-[0_4px_25px_-8px_rgba(168,85,247,0.3)]">

                                    {/* Image Area */}
                                    <div className="relative h-48 w-full overflow-hidden border-b border-purple-500/20">
                                        <Image
                                            src={getImageUrl(article.mainImage)}
                                            alt={article.title}
                                            width={777}
                                            height={494}
                                            priority
                                            title={article.title}
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 h-full w-full"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-[#0f0518]/60 to-transparent" />
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-5 flex flex-col gap-3">
                                        <h3 className="text-base font-semibold tracking-tight text-gray-100 leading-snug
                                                    group-hover:text-cyan-400 transition-colors 
                                                    line-clamp-2">
                                            {article.title}
                                        </h3>

                                        <div className="flex items-center justify-between gap-2 mt-auto">
                                            {/* Category - Amber like Timeline */}
                                            <span className="font-mono text-[10px] text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                                <Zap className="w-3 h-3" />
                                                {article.categoryName || "LOG"}
                                            </span>
                                            {/* Date */}
                                            <span className="font-mono text-[10px] text-muted-foreground/60 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(article.createdDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Main Content Split */}
                <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 relative">

                    {/* Left: Article Grid (75%) */}
                    <div className="flex-1 w-full lg:w-3/4">
                        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                            <h2 className="text-xl font-bold tracking-[0.05em] text-white flex items-center gap-2">
                                <Folder className="w-5 h-5 text-cyan-400" />
                                ALL LOGS
                            </h2>
                            <span className="font-mono text-xs text-muted-foreground/60">
                                {visibleGridArticles.length} items
                            </span>
                        </div>

                        <div ref={gridParent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {visibleGridArticles.map((article) => (
                                <Link href={`/blog/${article.slug}`} key={article.id} className="group flex flex-col h-full">
                                    {/* Top Border Accent - Cyan Theme */}

                                    <div className="relative overflow-hidden rounded-lg border transition-all duration-300 h-full flex flex-col
                                                bg-[#0a0e14]/95 border-cyan-500/20 backdrop-blur-sm
                                                hover:bg-[#0f1419] hover:border-cyan-400/50 hover:translate-x-1 
                                                hover:shadow-[0_4px_25px_-8px_rgba(34,211,238,0.25)]">

                                        {/* Image Header */}
                                        <div className="relative h-44 w-full overflow-hidden border-b border-cyan-500/15">
                                            <Image
                                                src={getImageUrl(article.mainImage)}
                                                alt={article.title}
                                                width={777}
                                                height={494}
                                                priority
                                                title={article.title}
                                                className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-60 h-full w-full"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-transparent to-transparent" />
                                        </div>

                                        <div className="p-4 flex flex-col gap-2 flex-1">
                                            {/* Category Tag - Amber */}
                                            <div className="flex">
                                                <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400 uppercase border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 rounded">
                                                    {article.categoryName}
                                                </span>
                                            </div>

                                            <h3 className="font-semibold text-sm text-gray-200 leading-snug tracking-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>

                                            <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-muted-foreground/60">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(article.createdDate)}
                                                </span>
                                                <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-neon" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Grid Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <button
                                    onClick={() => handleGridNav('prev')}
                                    disabled={currentPage <= 1}
                                    className="px-5 py-2 rounded border border-white/10 text-xs font-mono uppercase tracking-widest 
                                            hover:bg-white/5 hover:border-primary/50 hover:text-cyan-neon
                                            disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 disabled:hover:text-gray-500
                                            transition-all"
                                >
                                    Previous
                                </button>
                                <span className="font-mono text-xs text-muted-foreground">
                                    <span className="text-primary">{currentPage}</span> / {totalPages}
                                </span>
                                <button
                                    onClick={() => handleGridNav('next')}
                                    disabled={currentPage >= totalPages}
                                    className="px-5 py-2 rounded border border-white/10 text-xs font-mono uppercase tracking-widest 
                                            hover:bg-white/5 hover:border-primary/50 hover:text-cyan-neon
                                            disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 disabled:hover:text-gray-500
                                            transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Sidebar (25%) */}
                    <div className="w-full lg:w-1/4">
                        <div className="lg:sticky lg:top-32 flex flex-col-reverse lg:flex-col gap-8">

                            {/* Categories Widget */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                                    <Filter className="w-4 h-4 text-amber-400" />
                                    <h3 className="font-bold tracking-[0.1em] text-xs text-gray-300 uppercase">
                                        Filters
                                    </h3>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {/* ALL Button */}
                                    <button
                                        onClick={() => router.push('/blog', { scroll: false })}
                                        className={`
                                            text-[11px] font-mono font-bold uppercase px-3 py-1.5 rounded transition-all duration-300 border
                                            ${!currentCategory
                                                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                                                : 'bg-transparent border-white/10 text-muted-foreground hover:border-white/30 hover:text-gray-300'
                                            }
                                        `}
                                    >
                                        ALL
                                    </button>

                                    {categories.map(cat => {
                                        const isActive = currentCategory === cat;
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => toggleCategory(cat)}
                                                className={`
                                                    text-[11px] font-mono font-bold uppercase px-3 py-1.5 rounded transition-all duration-300 border
                                                    ${isActive
                                                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                                                        : 'bg-transparent border-white/10 text-muted-foreground hover:border-white/30 hover:text-gray-300'
                                                    }
                                                `}
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => router.push('/blog', { scroll: false })}
                                    className="w-full text-[10px] text-muted-foreground hover:text-cyan-neon transition-colors text-center uppercase tracking-widest font-mono pt-3 border-t border-white/5"
                                >
                                    Reset Filters
                                </button>
                            </div>

                            {/* API-based Widgets */}
                            <BlogQuoteWidget />
                            <BlogBookWidget />
                            <BlogFilmWidget />
                            <BlogMusicWidget />

                        </div>
                    </div>
                </div>


            </main>
        </div>
    );
}

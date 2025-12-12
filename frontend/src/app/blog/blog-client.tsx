"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types/article";
import { formatDate, getImageUrl } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Sparkles, Calendar, ArrowRight, Zap, Database, Folder, Filter, Quote, Book, Film, Music } from "lucide-react";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { sidebarData, getRandomItem } from "@/data/sidebar-data";

interface BlogClientProps {
    articles: Article[];
    popularArticles: Article[];
}

export default function BlogClient({ articles, popularArticles }: BlogClientProps) {
    const [mounted, setMounted] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
    const [popularPage, setPopularPage] = useState(0);
    const [gridPage, setGridPage] = useState(0);

    const [gridParent] = useAutoAnimate();

    const POPULAR_ITEMS_PER_PAGE = 3;
    const GRID_ITEMS_PER_PAGE = 6;

    useEffect(() => {
        setMounted(true);
        const allCats = new Set(articles.map(a => a.categoryName || "Uncategorized"));
        setSelectedCategories(allCats);
    }, [articles]);

    const uniqueCategories = useMemo(() => {
        const cats = new Set(articles.map(a => a.categoryName || "Uncategorized"));
        return Array.from(cats).sort();
    }, [articles]);

    // (sorted by backend)
    const visiblePopularArticles = popularArticles.slice(
        popularPage * POPULAR_ITEMS_PER_PAGE,
        (popularPage + 1) * POPULAR_ITEMS_PER_PAGE
    );

    const maxPopularPages = Math.min(3, Math.ceil(popularArticles.length / POPULAR_ITEMS_PER_PAGE));

    // Filtered Grid Logic
    const filteredArticles = useMemo(() => {
        return articles.filter(a => selectedCategories.has(a.categoryName || "Uncategorized"));
    }, [articles, selectedCategories]);

    const totalGridPages = Math.ceil(filteredArticles.length / GRID_ITEMS_PER_PAGE);

    const visibleGridArticles = filteredArticles.slice(
        gridPage * GRID_ITEMS_PER_PAGE,
        (gridPage + 1) * GRID_ITEMS_PER_PAGE
    );

    // Handlers
    const toggleCategory = (category: string) => {
        const next = new Set(selectedCategories);
        if (next.has(category)) {
            next.delete(category);
        } else {
            next.add(category);
        }
        setSelectedCategories(next);
        setGridPage(0);
    };

    const handlePopularNav = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            setPopularPage(prev => Math.min(maxPopularPages - 1, prev + 1));
        } else {
            setPopularPage(prev => Math.max(0, prev - 1));
        }
    };

    const handleGridNav = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            setGridPage(p => Math.min(totalGridPages - 1, p + 1));
        } else {
            setGridPage(p => Math.max(0, p - 1));
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

                    {/* Right side stats - Horizontal 5 items */}
                    <div className="hidden xl:flex items-end gap-6 mt-auto pt-6">
                        <div className="flex flex-col items-center">
                            <div className="font-mono text-[10px] text-gray-500 tracking-wider uppercase">
                                Articles
                            </div>
                            <div className="text-2xl font-bold font-heading text-cyan-400/70">
                                {articles.length}
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="font-mono text-[10px] text-gray-500 tracking-wider uppercase">
                                Movies
                            </div>
                            <div className="text-2xl font-bold font-heading text-purple-400/70">
                                0
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="font-mono text-[10px] text-gray-500 tracking-wider uppercase">
                                Books
                            </div>
                            <div className="text-2xl font-bold font-heading text-amber-400/70">
                                0
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="font-mono text-[10px] text-gray-500 tracking-wider uppercase">
                                Songs
                            </div>
                            <div className="text-2xl font-bold font-heading text-pink-400/70">
                                0
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="font-mono text-[10px] text-gray-500 tracking-wider uppercase">
                                Quotes
                            </div>
                            <div className="text-2xl font-bold font-heading text-slate-400/70">
                                0
                            </div>
                        </div>
                    </div>
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
                                    {article.mainImage && (
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
                                    )}

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
                <div className="flex flex-col lg:flex-row gap-12 relative">

                    {/* Left: Article Grid (75%) */}
                    <div className="flex-1 w-full lg:w-3/4">
                        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                            <h2 className="text-xl font-bold tracking-[0.05em] text-white flex items-center gap-2">
                                <Folder className="w-5 h-5 text-cyan-400" />
                                ALL LOGS
                            </h2>
                            <span className="font-mono text-xs text-muted-foreground/60">
                                {visibleGridArticles.length} / {filteredArticles.length}
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
                                        {article.mainImage && (
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
                                        )}

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
                        {totalGridPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <button
                                    onClick={() => handleGridNav('prev')}
                                    disabled={gridPage === 0}
                                    className="px-5 py-2 rounded border border-white/10 text-xs font-mono uppercase tracking-widest 
                                            hover:bg-white/5 hover:border-primary/50 hover:text-cyan-neon
                                            disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 disabled:hover:text-gray-500
                                            transition-all"
                                >
                                    Previous
                                </button>
                                <span className="font-mono text-xs text-muted-foreground">
                                    <span className="text-primary">{gridPage + 1}</span> / {totalGridPages}
                                </span>
                                <button
                                    onClick={() => handleGridNav('next')}
                                    disabled={gridPage >= totalGridPages - 1}
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
                        <div className="lg:sticky lg:top-32 space-y-8">

                            {/* Categories Widget */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                                    <Filter className="w-4 h-4 text-amber-400" />
                                    <h3 className="font-bold tracking-[0.1em] text-xs text-gray-300 uppercase">
                                        Filters
                                    </h3>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {uniqueCategories.map(cat => {
                                        const isActive = selectedCategories.has(cat);
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
                                    onClick={() => {
                                        const allCats = new Set(articles.map(a => a.categoryName || "Uncategorized"));
                                        setSelectedCategories(allCats);
                                    }}
                                    className="w-full text-[10px] text-muted-foreground hover:text-cyan-neon transition-colors text-center uppercase tracking-widest font-mono pt-3 border-t border-white/5"
                                >
                                    Reset Filters
                                </button>
                            </div>

                            {/* Quote */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 tracking-widest uppercase">
                                    <Quote className="w-3 h-3" />
                                    <span>Quote</span>
                                </div>
                                {(() => {
                                    const quote = getRandomItem(sidebarData.quotes);
                                    return (
                                        <div className="p-4 rounded-lg border border-cyan-500/30 bg-slate-900/40 backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.08)]">
                                            <p className="font-mono text-[11px] text-gray-300 leading-relaxed italic">
                                                "{quote.text}"
                                            </p>
                                            <p className="font-mono text-[9px] text-slate-400/60 mt-2 text-right">
                                                — {quote.author}
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Book of the Month */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 tracking-widest uppercase">
                                    <Book className="w-3 h-3" />
                                    <span>Book of the Month</span>
                                </div>
                                {(() => {
                                    const book = getRandomItem(sidebarData.books);
                                    return (
                                        <div className="p-3 rounded-lg border border-amber-500/15 bg-amber-950/10">
                                            <p className="font-mono text-[11px] text-gray-200 font-medium">{book.title}</p>
                                            <p className="font-mono text-[9px] text-amber-400/60">{book.author}</p>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Film of the Week */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 tracking-widest uppercase">
                                    <Film className="w-3 h-3" />
                                    <span>Film of the Week</span>
                                </div>
                                {(() => {
                                    const film = getRandomItem(sidebarData.films);
                                    return (
                                        <div className="p-3 rounded-lg border border-purple-500/15 bg-purple-950/10">
                                            <p className="font-mono text-[11px] text-gray-200 font-medium">{film.title}</p>
                                            <p className="font-mono text-[9px] text-purple-400/60">{film.year}</p>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Song of the Day */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-mono text-pink-400 tracking-widest uppercase">
                                    <Music className="w-3 h-3" />
                                    <span>Song of the Day</span>
                                </div>
                                {(() => {
                                    const song = getRandomItem(sidebarData.songs);
                                    return (
                                        <div className="p-3 rounded-lg border border-pink-500/15 bg-pink-950/10">
                                            <p className="font-mono text-[11px] text-gray-200 font-medium">{song.title}</p>
                                            <p className="font-mono text-[9px] text-pink-400/60">{song.artist}</p>
                                        </div>
                                    );
                                })()}
                            </div>

                        </div>
                    </div>
                </div>


            </main>
        </div>
    );
}

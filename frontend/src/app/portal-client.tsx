"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo, useCallback } from "react";
import { ArrowRight, Sparkles, Github, Linkedin, ChevronLeft, ChevronRight } from "lucide-react";
import { Article, ArticleListWithoutImage } from "@/types/article";
import { formatDate } from "@/lib/utils";
import NeuralNetwork from "@/components/neural-network";
import { mindTags } from "@/data/mind-tags";
import { ActivitySection } from "@/components/shared/ActivitySection";
import { articleService } from "@/services/articleServices";
import { MobileNav } from "@/components/mobile-nav";

interface PortalClientProps {
    articles: ArticleListWithoutImage[];
    totalCount: number;
}

interface CarouselSlot {
    word: string;
    angle: number;
    opacity: number;
    glow: number;        // Glow intensity (0-1)
    isSwapping: boolean;
}

const NUM_SLOTS = 6;
const SLOT_ANGLES = [0, 60, 120, 180, 240, 300];
const ORBIT_RADIUS = 38;
const ROTATION_SPEED = 0.15; // degrees per frame

export default function PortalClient({ articles, totalCount }: PortalClientProps) {
    const [mounted, setMounted] = useState(false);
    const [slots, setSlots] = useState<CarouselSlot[]>([]);
    const [rotationOffset, setRotationOffset] = useState(0);
    const [wordIndex, setWordIndex] = useState(NUM_SLOTS);

    // Pagination state
    const [articlePage, setArticlePage] = useState(0);
    const [currentArticles, setCurrentArticles] = useState<ArticleListWithoutImage[]>(articles);
    const [isLoadingArticles, setIsLoadingArticles] = useState(false);

    const ARTICLES_PER_PAGE = 3;
    const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

    // Shuffled word queue
    const wordQueue = useMemo(() => {
        return [...mindTags].sort(() => Math.random() - 0.5);
    }, []);

    // Get position from angle
    const getPosition = useCallback((slotAngle: number) => {
        const totalAngle = slotAngle + rotationOffset;
        const radians = (totalAngle * Math.PI) / 180;
        return {
            x: 50 + Math.cos(radians) * ORBIT_RADIUS,
            y: 50 + Math.sin(radians) * ORBIT_RADIUS,
        };
    }, [rotationOffset]);

    // Initialize slots
    useEffect(() => {
        setMounted(true);
        setSlots(SLOT_ANGLES.map((angle, i) => ({
            word: wordQueue[i % wordQueue.length],
            angle,
            opacity: 1,
            glow: 1,
            isSwapping: false,
        })));
    }, [wordQueue]);

    // Animation
    useEffect(() => {
        if (!mounted || slots.length === 0) return;

        let animationFrame: number;
        let lastSwapTime = Date.now();
        let nextSlot = 0;
        let currentWordIndex = wordIndex;

        const animate = () => {
            const now = Date.now();

            // Rotate
            setRotationOffset(prev => (prev + ROTATION_SPEED) % 360);

            // Swap every 2 seconds (doubled speed)
            if (now - lastSwapTime > 2000) {
                lastSwapTime = now;
                // Random slot selection instead of sequential
                const slotToSwap = Math.floor(Math.random() * NUM_SLOTS);
                nextSlot = (nextSlot + 1) % NUM_SLOTS;

                // Start swap - mark slot for fading out
                setSlots(prev => {
                    const updated = [...prev];
                    updated[slotToSwap] = { ...updated[slotToSwap], isSwapping: true };
                    return updated;
                });

                // After fade, change word - capture slotToSwap in closure
                const capturedSlot = slotToSwap;
                const capturedWord = wordQueue[currentWordIndex % wordQueue.length];
                currentWordIndex++;

                setTimeout(() => {
                    setSlots(prev => {
                        const updated = [...prev];
                        updated[capturedSlot] = {
                            ...updated[capturedSlot],
                            word: capturedWord,
                            isSwapping: false,
                            glow: 1 // Reset glow for fade in
                        };
                        return updated;
                    });
                }, 800);
            }

            // Fade glow first, then opacity
            setSlots(prev => prev.map(slot => {
                let op = slot.opacity;
                let gl = slot.glow;

                if (slot.isSwapping) {
                    // Fading out: glow fades fast first, then opacity slowly
                    if (gl > 0) {
                        gl = Math.max(0, gl - 0.08);
                    } else if (op > 0) {
                        op = Math.max(0, op - 0.025); // Slower fade
                    }
                } else {
                    // Fading in: appear with glow
                    if (op < 1) op = Math.min(1, op + 0.05);
                    if (gl < 1 && op > 0.5) gl = Math.min(1, gl + 0.06);
                }

                return { ...slot, opacity: op, glow: gl };
            }));

            animationFrame = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [mounted, slots.length, wordQueue, wordIndex]);

    // Handle Page Change
    const handlePageChange = async (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages) return;

        setIsLoadingArticles(true);
        try {
            // API expects 1-based page index, we use 0-based index locally
            const result = await articleService.getPagedWithoutImageArticles(newPage + 1, ARTICLES_PER_PAGE, 'en');
            if (result.isSuccess && result.data) {
                setCurrentArticles(result.data.items);
                setArticlePage(newPage);
            }
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setIsLoadingArticles(false);
        }
    };

    if (!mounted) {
        return <div className="min-h-screen" />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent text-foreground">

            {/* HERO SECTION */}
            <section className="relative flex flex-col items-center px-4 pt-6 pb-2 overflow-hidden">

                {/* Header */}
                <div className="w-full px-6 relative flex items-start justify-between mb-4 h-24 md:h-36">

                    {/* Left: Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 pt-8">
                        <Link href="/" className="relative group px-1 py-2 text-sm font-medium font-heading tracking-wide text-cyan-neon">
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-3 h-3 animate-pulse" />
                                PORTAL
                            </span>
                            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-neon shadow-[0_0_10px_var(--cyan-neon)]" />
                        </Link>
                        <Link href="/blog" className="relative group px-1 py-2 text-sm font-medium font-heading tracking-wide text-muted-foreground hover:text-cyan-neon transition-colors">
                            BLOG
                            <span className="absolute bottom-0 left-0 h-[2px] bg-cyan-neon w-0 group-hover:w-full transition-all duration-300 group-hover:shadow-[0_0_8px_var(--cyan-neon)]" />
                            <span className="absolute top-0 right-0 h-[2px] bg-primary w-0 group-hover:w-1/2 transition-all duration-300 group-hover:shadow-[0_0_8px_var(--primary)]" />
                        </Link>
                        <Link href="/blog/timeline" className="relative group px-1 py-2 text-sm font-medium font-heading tracking-wide text-muted-foreground hover:text-cyan-neon transition-colors">
                            TIMELINE
                            <span className="absolute bottom-0 left-0 h-[2px] bg-cyan-neon w-0 group-hover:w-full transition-all duration-300 group-hover:shadow-[0_0_8px_var(--cyan-neon)]" />
                            <span className="absolute top-0 right-0 h-[2px] bg-primary w-0 group-hover:w-1/2 transition-all duration-300 group-hover:shadow-[0_0_8px_var(--primary)]" />
                        </Link>
                        <Link href="/about" className="relative group px-1 py-2 text-sm font-medium font-heading tracking-wide text-muted-foreground hover:text-cyan-neon transition-colors">
                            ABOUT.ME
                            <span className="absolute bottom-0 left-0 h-[2px] bg-cyan-neon w-0 group-hover:w-full transition-all duration-300 group-hover:shadow-[0_0_8px_var(--cyan-neon)]" />
                            <span className="absolute top-0 right-0 h-[2px] bg-primary w-0 group-hover:w-1/2 transition-all duration-300 group-hover:shadow-[0_0_8px_var(--primary)]" />
                        </Link>
                    </nav>

                    {/* Center: Logo + Title - Absolute centered */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 group mt-4 md:mt-0">
                        {/* Avatar Container with orbital effect */}
                        <div className="logo-orbital relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-visible transition-all duration-300">
                            <div className="logo-glow-border w-full h-full rounded-full overflow-hidden transition-all duration-300">
                                <Image
                                    src="/logo1.png"
                                    alt="Mustafa Guler"
                                    width={1024}
                                    height={1024}
                                    priority
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>

                        {/* Typography Logo - Below */}
                        <div className="flex flex-col items-center text-center">
                            <span className="font-heading font-bold text-lg leading-none tracking-wider text-foreground group-hover:text-primary transition-colors">
                                MUSTAFA GULER
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] group-hover:text-cyan-neon transition-colors">
                                DIGITAL_MIND
                            </span>
                        </div>
                    </Link>

                    {/* Right: Social + Contact */}
                    <div className="hidden md:flex flex-col items-end gap-5 pt-8">
                        {/* Social Icons */}
                        <div className="flex items-center gap-9">
                            <a href="https://www.linkedin.com/in/mustafaguler98" target="_blank" rel="noopener noreferrer"
                                className="glitch-icon text-primary drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] hover:text-cyan-neon transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                                <Linkedin className="w-6 h-6" />
                            </a>
                            <a href="https://github.com/MustafaGuler98" target="_blank" rel="noopener noreferrer"
                                className="glitch-icon-delayed text-primary drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] hover:text-cyan-neon transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]">
                                <Github className="w-6 h-6" />
                            </a>
                        </div>
                        {/* Contact Button */}
                        <Link href="/contact" className="holo-terminal-btn rounded-none text-white hover:text-cyan-neon transition-all duration-300 font-mono text-xs tracking-widest uppercase px-4 py-2 border border-primary/50">
                            <span className="blink-cursor">CONTACT</span>
                        </Link>
                    </div>

                    {/* Mobile Navigation Trigger */}
                    <div className="md:hidden pt-8">
                        <MobileNav />
                    </div>
                </div>

                {/* Role Text */}
                <div className="text-center mb-3 z-20 relative mt-16 md:mt-0">
                    <p className="role-text font-heading text-sm md:text-base font-medium tracking-widest text-muted-foreground">
                        Software Developer / Storyteller / Digital Nomad
                    </p>
                </div>

                {/* Neural Network Container - extra height for bottom visibility */}
                <div className="relative w-full mx-auto pb-8" style={{ height: '45vh', maxHeight: '450px', maxWidth: '450px' }}>
                    {/* Canvas */}
                    <div className="absolute inset-0 z-10">
                        <NeuralNetwork className="w-full h-full" />
                    </div>

                    {/* Carousel Slots */}
                    {slots.map((slot, idx) => {
                        const pos = getPosition(slot.angle);
                        const scale = 0.85 + slot.opacity * 0.25;
                        const glowSize = 8 + slot.glow * 12; // 8-20px glow
                        const glowOpacity = slot.glow * 0.7;
                        return (
                            <span
                                key={`${slot.angle}-${idx}`}
                                className="absolute z-20 font-mono text-xs select-none pointer-events-none whitespace-nowrap"
                                style={{
                                    left: `${pos.x}%`,
                                    top: `${pos.y}%`,
                                    transform: `translate(-50%, -50%) scale(${scale})`,
                                    opacity: slot.opacity * 0.9,
                                    color: idx % 2 === 0
                                        ? 'rgba(147, 51, 234, 0.95)'
                                        : 'rgba(34, 211, 238, 0.95)',
                                    textShadow: idx % 2 === 0
                                        ? `0 0 ${glowSize}px rgba(147, 51, 234, ${glowOpacity})`
                                        : `0 0 ${glowSize}px rgba(34, 211, 238, ${glowOpacity})`,
                                }}
                            >
                                {slot.word}
                            </span>
                        );
                    })}
                </div>

            </section>

            {/* RECENT LOGS SECTION */}
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
                            <button
                                onClick={() => handlePageChange(articlePage - 1)}
                                className={`p-2 rounded-full transition-colors duration-300 ${articlePage > 0 && !isLoadingArticles
                                    ? 'text-white hover:text-cyan-neon hover:shadow-[0_0_12px_var(--cyan-neon)] cursor-pointer'
                                    : 'text-white/20 pointer-events-none'
                                    }`}
                                disabled={articlePage === 0 || isLoadingArticles}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            {/* Cards Grid */}
                            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 transition-opacity duration-300 ${isLoadingArticles ? 'opacity-50' : 'opacity-100'}`}>
                                {currentArticles.map((article) => (
                                    <Link
                                        key={article.id}
                                        href={`/blog/${article.slug}`}
                                        className="group block"
                                    >
                                        {/* Timeline-style card */}
                                        <div className="relative overflow-hidden rounded-lg border transition-all duration-300
                                                      bg-[#0f0518]/90 border-primary/40 backdrop-blur-sm
                                                      hover:bg-[#1a0b2e] hover:border-cyan-neon/50 hover:translate-x-1 
                                                      hover:shadow-[0_4px_20px_-10px_rgba(34,211,238,0.25)]">
                                            <div className="p-4 flex flex-col gap-2">
                                                <h3 className="font-heading text-sm font-bold text-white/90 
                                                               group-hover:text-cyan-neon transition-colors 
                                                               line-clamp-2">
                                                    {article.title}
                                                </h3>
                                                <div className="flex items-center justify-between gap-2">
                                                    {/* Category - Yellow like timeline */}
                                                    <span className="font-mono text-[10px] text-amber-400 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                        {article.categoryName || "LOG"}
                                                    </span>
                                                    {/* Date */}
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
                            <button
                                onClick={() => handlePageChange(articlePage + 1)}
                                className={`p-2 rounded-full transition-colors duration-300 ${articlePage < totalPages - 1 && !isLoadingArticles
                                    ? 'text-white hover:text-cyan-neon hover:shadow-[0_0_12px_var(--cyan-neon)] cursor-pointer'
                                    : 'text-white/20 pointer-events-none'
                                    }`}
                                disabled={articlePage >= totalPages - 1 || isLoadingArticles}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ACTIVITY SECTION */}
            <section className="pb-24 px-4">
                <div className="container max-w-5xl mx-auto">
                    {/* DIVIDER */}
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-16" />

                    <ActivitySection />
                </div>
            </section>

        </div>
    );
}

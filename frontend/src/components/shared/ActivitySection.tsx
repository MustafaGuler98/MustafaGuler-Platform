"use client";

import { useState, useRef, useCallback } from "react";
import { NeonStreamNav } from "@/components/ui/neon-stream-nav";
import { FeaturedActivityCards } from "@/components/about/FeaturedActivityCards";
import type { PublicActivities } from "@/types/archives";

interface ActivitySectionProps {
    activities: PublicActivities | null;
}

const CARD_WIDTH = 280;
const CARD_GAP = 24;
const CARD_ITEM_WIDTH = CARD_WIDTH + CARD_GAP;
const DEFAULT_TOTAL_ITEMS = 7;
const SCROLL_INTERVAL_MS = 150;

export function ActivitySection({ activities }: ActivitySectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalItems, setTotalItems] = useState(DEFAULT_TOTAL_ITEMS);
    const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const updateActiveIndex = useCallback(() => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
            const index = Math.round(scrollLeft / CARD_ITEM_WIDTH);

            let finalIndex = Math.max(0, Math.min(totalItems - 1, index));

            // If the user has scrolled to the very (or near) end, force the last index
            if (Math.abs(scrollWidth - clientWidth - scrollLeft) < 10) {
                finalIndex = totalItems - 1;
            }

            setActiveIndex(finalIndex);
        }
    }, [totalItems]);

    const handleScroll = () => {
        // Only update when not using buttons
        if (!scrollIntervalRef.current) {
            updateActiveIndex();
        }
    };

    const scrollPrev = useCallback(() => {
        if (containerRef.current) {
            const currentScroll = containerRef.current.scrollLeft;
            const currentIndex = Math.round(currentScroll / CARD_ITEM_WIDTH);
            const targetIndex = currentIndex - 1;

            if (targetIndex <= 0) {
                containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                containerRef.current.scrollTo({ left: targetIndex * CARD_ITEM_WIDTH, behavior: 'smooth' });
            }
        }
    }, []);

    const scrollNext = useCallback(() => {
        if (containerRef.current) {
            const currentScroll = containerRef.current.scrollLeft;
            const currentIndex = Math.round(currentScroll / CARD_ITEM_WIDTH);
            const targetIndex = currentIndex + 1;

            const maxIndex = totalItems - 1;
            const finalIndex = Math.min(maxIndex, targetIndex);

            containerRef.current.scrollTo({ left: finalIndex * CARD_ITEM_WIDTH, behavior: 'smooth' });
        }
    }, [totalItems]);

    const startScrolling = useCallback((direction: 'left' | 'right') => {
        // Immediately scroll once
        if (direction === 'left') scrollPrev();
        else scrollNext();

        // Then start continuous scrolling
        scrollIntervalRef.current = setInterval(() => {
            if (direction === 'left') scrollPrev();
            else scrollNext();
        }, SCROLL_INTERVAL_MS);
    }, [scrollPrev, scrollNext]);

    const stopScrolling = useCallback(() => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
        // Update index after scrolling stops
        setTimeout(updateActiveIndex, 100);
    }, [updateActiveIndex]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            {/* HEADER: Cyber Stroke */}
            <div className="flex flex-col items-center mb-8 group cursor-default">
                <div className="relative">
                    {/* Main Stroke Text */}
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent stroke-cyan-300 stroke-[1px] relative z-10"
                        style={{ WebkitTextStroke: '1px #67e8f9' }}>
                        ACTIVITY
                    </h2>
                    {/* Shadow Stroke for Depth */}
                    <h2 className="absolute top-0 left-0 text-4xl md:text-5xl font-black tracking-tighter text-cyan-900/50 select-none z-0 translate-x-[1px] translate-y-[1px]"
                        style={{ WebkitTextStroke: '1px rgba(22, 78, 99, 0.5)' }}>
                        ACTIVITY
                    </h2>
                </div>

                <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-2xl px-4">
                    {/* Selected Subtitle: Circuit Node */}
                    <div className="flex items-center gap-2 text-cyan-500/70 text-xs font-mono">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                        <div className="w-8 h-[1px] bg-cyan-800"></div>
                        <span className="tracking-widest uppercase text-cyan-100/80 text-[10px]">// Latest_Updates</span>
                        <div className="w-8 h-[1px] bg-cyan-800"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                    </div>
                </div>
            </div>

            {/* Scrollable Container with Side Navigation */}
            <div className="relative flex items-center gap-2 md:gap-12">

                {/* LEFT: Neon Stream Button */}
                <NeonStreamNav
                    direction="left"
                    onMouseDown={() => startScrolling('left')}
                    onMouseUp={stopScrolling}
                    onMouseLeave={stopScrolling}
                    disabled={activeIndex === 0}
                    className="hidden md:flex"
                />

                {/* CENTER: Carousel */}
                <div className="relative flex-1 overflow-hidden">
                    {/* Left Fade Gradient */}
                    <div className={`absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity duration-300 ${activeIndex === 0 ? 'opacity-0' : 'opacity-100'}`} />

                    <div
                        id="system-logs-container"
                        ref={el => { containerRef.current = el; }}
                        onScroll={handleScroll}
                        className="flex gap-6 overflow-x-auto py-8 px-4 md:px-8 snap-x snap-mandatory scrollbar-none"
                    >
                        {/* Dynamic Featured Items from API */}
                        <FeaturedActivityCards data={activities} />
                    </div>

                    {/* Right Fade Gradient */}
                    <div className={`absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity duration-300 ${activeIndex === totalItems - 1 ? 'opacity-0' : 'opacity-100'}`} />
                </div>

                {/* RIGHT: Neon Stream Button */}
                <NeonStreamNav
                    direction="right"
                    onMouseDown={() => startScrolling('right')}
                    onMouseUp={stopScrolling}
                    onMouseLeave={stopScrolling}
                    disabled={activeIndex === totalItems - 1}
                    className="hidden md:flex"
                />

            </div>
        </div>
    );
}

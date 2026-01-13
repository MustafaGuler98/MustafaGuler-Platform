"use client";

import { useState, useRef, useCallback } from "react";
import { ActivityCard } from "@/components/content/activity-card";
import { TechStack } from "@/components/content/tech-stack";
import { NeonStreamNav } from "@/components/ui/neon-stream-nav";
import { Film, Gamepad2, Headphones, Sparkles, BookOpen, MonitorPlay, Dices, Tv } from "lucide-react";

const CARD_WIDTH = 280;
const CARD_GAP = 24;
const CARD_ITEM_WIDTH = CARD_WIDTH + CARD_GAP;
const TOTAL_ITEMS = 7;
const SCROLL_INTERVAL_MS = 150; // Speed when holding button

export default function AboutPage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTerminalTab, setActiveTerminalTab] = useState<'bio' | 'site'>('bio');
    const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const updateActiveIndex = useCallback(() => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
            const index = Math.round(scrollLeft / CARD_ITEM_WIDTH);

            let finalIndex = Math.max(0, Math.min(TOTAL_ITEMS - 1, index));

            // If the user has scrolled to the very (or near) end, force the last index
            if (Math.abs(scrollWidth - clientWidth - scrollLeft) < 10) {
                finalIndex = TOTAL_ITEMS - 1;
            }

            setActiveIndex(finalIndex);
        }
    }, []);

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

            const maxIndex = TOTAL_ITEMS - 1;
            const finalIndex = Math.min(maxIndex, targetIndex);

            containerRef.current.scrollTo({ left: finalIndex * CARD_ITEM_WIDTH, behavior: 'smooth' });
        }
    }, []);

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
        <div className="min-h-screen w-full flex flex-col items-center pt-12 pb-24 px-6 md:px-12 relative overflow-hidden">

            {/* Ambient Background */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-50">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-neon/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-5xl">

                {/* HEADLINE SECTION (Refactored) */}
                <div className="mb-20 md:mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header Title */}
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-2">
                            MUSTAFA GULER
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <div className="h-[1px] w-8 md:w-24 bg-gradient-to-r from-gray-500 to-transparent"></div>
                            <div className="font-mono tracking-widest text-xs md:text-sm uppercase font-bold flex gap-2 md:gap-3">
                                <span className="text-cyan-400 text-shadow-glow-cyan">FULL STACK DEVELOPER</span>
                                <span className="text-gray-700">•</span>
                                <span className="text-amber-400 text-shadow-glow-amber">STORYTELLER</span>
                                <span className="text-gray-700">•</span>
                                <span className="text-fuchsia-400 text-shadow-glow-fuchsia">DIGITAL NOMAD</span>
                            </div>
                            <div className="h-[1px] w-8 md:w-24 bg-gradient-to-l from-gray-500 to-transparent"></div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* LEFT: Bio Terminal (Dominant) */}
                        <div className="lg:col-span-9 w-full">
                            <div className="group relative rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden min-h-[400px]">
                                {/* Terminal Header */}
                                <div className="flex items-center justify-center px-4 py-3 bg-white/5 border-b border-white/5 relative">
                                    <div className="flex gap-3">
                                        {/* Bio Tab (Green) */}
                                        <button
                                            onClick={() => setActiveTerminalTab('bio')}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTerminalTab === 'bio' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] border border-emerald-400 scale-110' : 'bg-emerald-900/30 border border-emerald-500/30 hover:bg-emerald-500/50'}`}
                                            aria-label="Bio Tab"
                                        />
                                        {/* Site Tab */}
                                        <button
                                            onClick={() => setActiveTerminalTab('site')}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTerminalTab === 'site' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] border border-emerald-400 scale-110' : 'bg-emerald-900/30 border border-emerald-500/30 hover:bg-emerald-500/50'}`}
                                            aria-label="Site Info Tab"
                                        />
                                    </div>
                                </div>

                                {/* Terminal Body */}
                                <div className="p-6 md:p-10 font-mono text-sm md:text-base leading-relaxed text-gray-300 space-y-6 min-h-[400px]">

                                    {/* BIO TAB */}
                                    {activeTerminalTab === 'bio' && (
                                        <div className="animate-in fade-in duration-300 space-y-6">
                                            <div>
                                                <p className="mb-2">
                                                    <span className="text-emerald-400">➜</span> <span className="text-emerald-300 font-bold tracking-wide">Who Am I?</span>
                                                </p>
                                                <div className="pl-4 border-l-2 border-white/5 space-y-6">
                                                    <p className="leading-7">
                                                        I am a <span className="text-cyan-400 font-bold">Full Stack Developer</span> specializing in web technologies.
                                                        While my core expertise lies in <span className="font-bold text-gray-100">C#</span>, <span className="font-bold text-gray-100">.NET</span>, and <span className="font-bold text-gray-100">Next.js</span>,
                                                        my true strength is <span className="font-bold italic text-white">adaptability</span>; I am versatile in utilizing whatever tool the solution demands.
                                                    </p>

                                                    <p className="leading-7">
                                                        I am also a <span className="text-amber-400 font-bold">Storyteller</span>. The same urge that drives me to architect software inspires my writing.
                                                        I craft narratives through <span className="italic text-gray-400">poetry</span>, <span className="italic text-gray-400">blog posts</span>, <span className="italic text-gray-400">travel essays</span>,
                                                        and <span className="italic text-gray-400">Tabletop RPG campaigns</span>... For me, <span className="font-bold italic text-white">creating</span> is an expression of who I am.
                                                    </p>

                                                    <p className="leading-7">
                                                        And, I am a <span className="text-fuchsia-400 font-bold">Digital Nomad</span>. I find joy in getting lost in new cities,
                                                        wandering through <span className="italic text-gray-400">museums</span>, cooking and tasting <span className="italic text-gray-400">local cuisines</span>, and absorbing the
                                                        <span className="italic text-gray-400"> history</span> and <span className="italic text-gray-400">literature</span> of diverse cultures.
                                                    </p>

                                                    <div className="leading-7 mt-8">
                                                        <p className="mb-8">
                                                            I am <span className="font-black text-white tracking-wide">Mustafa Guler</span>. I live to create.
                                                            My world is fueled by <span className="italic text-gray-300">technology, books, poetry, philosophy, history, games, movies, and songs...</span>
                                                        </p>

                                                        {/* PASSION STATEMENT */}
                                                        <p className="text-gray-300 italic font-medium leading-relaxed mt-6">
                                                            But above all, perhaps the most important thing about me is that no matter what I do, I do it with <span className="font-black text-red-400 tracking-widest">PASSION</span>.


                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                                                <button onClick={() => setActiveTerminalTab('site')} className="w-max opacity-60 hover:opacity-100 transition-all">
                                                    <span className="text-emerald-400">➜</span> <span className="text-gray-400 ml-2 hover:text-emerald-300 transition-colors">What is this website?</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* SITE TAB */}
                                    {activeTerminalTab === 'site' && (
                                        <div className="animate-in fade-in duration-300 space-y-6">
                                            <div>
                                                <p className="mb-2">
                                                    <span className="text-emerald-400">➜</span> <span className="text-emerald-300 font-bold tracking-wide">What is this website?</span>
                                                </p>
                                                <div className="pl-4 border-l-2 border-white/5 space-y-6">
                                                    <p className="leading-7">
                                                        This is an <span className="text-cyan-400 font-bold">advanced personal platform</span> designed to serve as the central hub of my digital footprint.
                                                        It is more than a standard portfolio or a blog; it is a system I customized down to the finest detail to suit my own needs,
                                                        intended to <span className="text-white italic">evolve and grow</span> alongside me for a lifetime.
                                                    </p>

                                                    <p className="leading-7">
                                                        We keep our films on <span className="text-emerald-400 font-bold">Letterboxd</span>, music on <span className="text-green-500 font-bold">Spotify</span>,
                                                        anime on <span className="text-blue-500 font-bold">MyAnimeList</span>, games on <span className="text-gray-100 font-bold">Steam</span>,
                                                        books on <span className="text-amber-100 font-bold">Goodreads</span>... I used to do the same. But eventually,
                                                        I decided to build this <span className="text-cyan-200 font-bold">unified home</span> to bring all those aspects together.
                                                        As a result, you will find traces of me and my many interests scattered throughout these pages.
                                                    </p>

                                                    <p className="leading-7">
                                                        For those interested in the code, the technical infrastructure is available <a href="https://github.com/MustafaGuler98/MustafaGuler-Platform" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30 underline-offset-4 transition-all">here</a>.
                                                        However, a note of honesty: Although it is <span className="text-white font-bold">fully open-source</span>, I did not design this system for general use.
                                                        It was built strictly for my own logic and requirements. Therefore, you might face some challenges if you try to adapt it for yourself.
                                                        In such cases, feel free to reach out. Who knows, perhaps one day I will find the time to make this structure accessible to everyone!
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                                                <button onClick={() => setActiveTerminalTab('bio')} className="w-max opacity-60 hover:opacity-100 transition-all">
                                                    <span className="text-emerald-400">➜</span> <span className="text-gray-400 ml-2 hover:text-emerald-300 transition-colors">Who Am I?</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Decorative scanline */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[1px] w-full animate-scan pointer-events-none opacity-20"></div>
                            </div>
                        </div>

                        {/* RIGHT: Tech Stack Sidebar (Narrow) */}
                        <div className="lg:col-span-3 w-full">
                            <TechStack />
                        </div>
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-16" />

                {/* THE BOX (ACTIVITIES) */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    {/* HEADER: Cyber Stroke */}
                    <div className="flex flex-col items-center mb-8 group cursor-default">
                        <div className="relative">
                            {/* Main Stroke Text */}
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent stroke-cyan-300 stroke-[1px] relative z-10"
                                style={{ WebkitTextStroke: '1px #67e8f9' }}>
                                RECORDS
                            </h2>
                            {/* Shadow Stroke for Depth */}
                            <h2 className="absolute top-0 left-0 text-4xl md:text-5xl font-black tracking-tighter text-cyan-900/50 select-none z-0 translate-x-[1px] translate-y-[1px]"
                                style={{ WebkitTextStroke: '1px rgba(22, 78, 99, 0.5)' }}>
                                RECORDS
                            </h2>
                        </div>

                        <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-2xl px-4">
                            {/* Selected Subtitle: Circuit Node */}
                            <div className="flex items-center gap-2 text-cyan-500/70 text-xs font-mono">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                                <div className="w-8 h-[1px] bg-cyan-800"></div>
                                <span className="tracking-widest uppercase text-cyan-100/80 text-[10px]">// Last_Known_Activity</span>
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
                                {/* 1. BOOK (Amber) */}
                                <div className="min-w-[260px] md:min-w-[280px] snap-start">
                                    <ActivityCard
                                        title="BOOK"
                                        name="Neuromancer"
                                        description="William Gibson. The sky above the port was the color of television, tuned to a dead channel."
                                        Icon={BookOpen}
                                        colorClass="text-amber-400"
                                        imageUrl="https://upload.wikimedia.org/wikipedia/en/4/4b/Neuromancer_%28Book%29.jpg"
                                        fontClass="font-[family-name:var(--font-rajdhani)] font-bold uppercase tracking-wide text-base md:text-lg"
                                    />
                                </div>

                                {/* 2. MOVIE (Purple) */}
                                <div className="min-w-[260px] md:min-w-[280px] snap-start">
                                    <ActivityCard
                                        title="MOVIE"
                                        name="Dune: Part Two"
                                        description="A visual masterpiece. The sound design is incredible."
                                        Icon={Film}
                                        colorClass="text-purple-400"
                                        imageUrl="https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"
                                        fontClass="font-[family-name:var(--font-rajdhani)] font-bold uppercase tracking-wide text-base md:text-lg"
                                    />
                                </div>

                                {/* 3. TV SERIES (Indigo) */}
                                <div className="min-w-[260px] md:min-w-[280px] snap-start">
                                    <ActivityCard
                                        title="TV SERIES"
                                        name="Severance"
                                        description="Microdata refinement via Lumon Industries. Please try to enjoy each code equally."
                                        Icon={Tv}
                                        colorClass="text-blue-500"
                                        imageUrl="https://m.media-amazon.com/images/M/MV5BMjA5OTQyODY2MV5BMl5BanBnXkFtZTgwMzkxOTAwNjM@._V1_.jpg"
                                        fontClass="font-[family-name:var(--font-rajdhani)] font-bold uppercase tracking-wide text-base md:text-lg"
                                    />
                                </div>

                                {/* 4. SONG (Pink) */}
                                <div className="min-w-[260px] md:min-w-[280px] snap-start">
                                    <ActivityCard
                                        title="SONG"
                                        name="Random Access Memories"
                                        description="Daft Punk. A classic that never gets old."
                                        Icon={Headphones}
                                        colorClass="text-pink-400"
                                        imageUrl="https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg"
                                        fontClass="font-[family-name:var(--font-rajdhani)] font-bold uppercase tracking-wide text-base md:text-lg"
                                    />
                                </div>

                                {/* 5. ANIME (Rose) */}
                                <div className="min-w-[260px] md:min-w-[280px] snap-start">
                                    <ActivityCard
                                        title="ANIME"
                                        name="Cyberpunk: Edgerunners"
                                        description="Night City treats everyone the same. A tragic masterpiece."
                                        Icon={MonitorPlay}
                                        colorClass="text-rose-500"
                                        imageUrl="https://m.media-amazon.com/images/M/MV5BMTM3MDU1OWEtZDUxNC00MGUxLWIwOTItMmY3ZWMzNzRkZjQzXkEyXkFqcGc@._V1_.jpg"
                                        fontClass="font-[family-name:var(--font-rajdhani)] font-bold uppercase tracking-wide text-base md:text-lg"
                                    />
                                </div>

                                {/* 6. GAME (Cyan) */}
                                <div className="min-w-[260px] md:min-w-[280px] snap-start">
                                    <ActivityCard
                                        title="GAME"
                                        name="Baldur's Gate 3"
                                        description="Exploring the vast world of Faerûn. Currently stuck in Act 3."
                                        Icon={Gamepad2}
                                        colorClass="text-cyan-400"
                                        imageUrl="https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.webp"
                                        fontClass="font-[family-name:var(--font-rajdhani)] font-bold uppercase tracking-wide text-base md:text-lg"
                                    />
                                </div>

                                {/* 7. TTRPG (Emerald) */}
                                <div className="min-w-[260px] md:min-w-[280px] snap-start">
                                    <ActivityCard
                                        title="TTRPG"
                                        name="Dungeons & Dragons"
                                        description="The Curse of Strahd. Rolling nat 1s at the worst possible moments."
                                        Icon={Dices}
                                        colorClass="text-emerald-400"
                                        imageUrl="https://upload.wikimedia.org/wikipedia/en/a/a0/Dungeons_%26_Dragons_5th_Edition_Player%27s_Handbook.jpg"
                                        fontClass="font-[family-name:var(--font-rajdhani)] font-bold uppercase tracking-wide text-base md:text-lg"
                                    />
                                </div>
                            </div>

                            {/* Right Fade Gradient */}
                            <div className={`absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity duration-300 ${activeIndex === TOTAL_ITEMS - 1 ? 'opacity-0' : 'opacity-100'}`} />
                        </div>

                        {/* RIGHT: Neon Stream Button */}
                        <NeonStreamNav
                            direction="right"
                            onMouseDown={() => startScrolling('right')}
                            onMouseUp={stopScrolling}
                            onMouseLeave={stopScrolling}
                            disabled={activeIndex === TOTAL_ITEMS - 1}
                            className="hidden md:flex"
                        />

                    </div>
                </div>

            </div>
        </div>
    );
}


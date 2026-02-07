"use client";

import { useEffect, useState, useRef } from "react";
import { AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./lastfm-widget.module.css";
import { LASTFM_STATUS_CACHE_KEY } from "./lastfm-cache";
import type { MusicStatus } from "./lastfm-types";

export interface LastFmWidgetProps {
    onReady?: () => void;
    initialStatus?: MusicStatus | null;
}

const FALLBACK_STATUS: MusicStatus = {
    isPlaying: false,
    title: "No recent track",
    artist: "Last.fm unavailable",
    lastPlayedAt: new Date().toISOString(),
};

function readCachedStatus(): MusicStatus | null {
    if (typeof window === "undefined") return null;

    try {
        const raw = sessionStorage.getItem(LASTFM_STATUS_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as MusicStatus;
        if (!parsed?.title || !parsed?.artist) return null;
        return parsed;
    } catch {
        return null;
    }
}

function writeCachedStatus(status: MusicStatus) {
    if (typeof window === "undefined") return;
    try {
        sessionStorage.setItem(LASTFM_STATUS_CACHE_KEY, JSON.stringify(status));
    } catch {
        // Ignore storage quota/privacy mode errors.
    }
}

function useMusicStatus(initialStatus?: MusicStatus | null) {
    const initialStatusRef = useRef<MusicStatus | null>(initialStatus ?? readCachedStatus());
    const [status, setStatus] = useState<MusicStatus | null>(initialStatusRef.current);
    const [timeAgo, setTimeAgo] = useState<string>("");
    const [isReady, setIsReady] = useState<boolean>(initialStatusRef.current !== null);

    const fetchStatus = async () => {
        try {
            const res = await fetch(`/music-status.json`);
            if (res.ok) {
                const data = await res.json();
                setStatus(data);
                writeCachedStatus(data);
            } else {
                setStatus((prev) => prev ?? FALLBACK_STATUS);
            }
        } catch (error) {
            console.error(error);
            setStatus((prev) => prev ?? FALLBACK_STATUS);
        } finally {
            setIsReady(true);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!status) return;
        const updateTime = () => {
            if (status.isPlaying) {
                setTimeAgo("Listening");
                return;
            }
            if (!status.lastPlayedAt) {
                setTimeAgo("");
                return;
            }
            const now = new Date();
            const lastPlayed = new Date(status.lastPlayedAt);
            const diffMs = now.getTime() - lastPlayed.getTime();
            const diffMins = Math.round(diffMs / 60000);

            if (diffMins < 1) setTimeAgo("Just now");
            else if (diffMins < 60) setTimeAgo(`${diffMins}m ago`);
            else {
                const diffHrs = Math.floor(diffMins / 60);
                setTimeAgo(`${diffHrs}h ago`);
            }
        };
        updateTime();
        const timer = setInterval(updateTime, 60000);
        return () => clearInterval(timer);
    }, [status]);

    return { status, timeAgo, isReady };
}

// SCROLL ON HOVER 
const ConditionalMarquee = ({ text, className, parentGroup = true }: { text: string; className?: string, parentGroup?: boolean }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (containerRef.current && textRef.current) {
            // Check if content is wider than container
            setIsOverflowing(textRef.current.offsetWidth > containerRef.current.offsetWidth);
        }
    }, [text]);

    return (
        <div ref={containerRef} className={cn("relative overflow-hidden w-full h-full flex items-center", className)}>
            {/* Measurement Span (Hidden) - Absolute to not affect layout, used to measure natural width */}
            <span ref={textRef} className="absolute opacity-0 pointer-events-none whitespace-nowrap">{text}</span>

            {isOverflowing ? (
                <>
                    {/* 1. Static State: Truncated (Visible by default, Hidden on Hover) */}
                    <div className={cn(
                        "absolute inset-0 flex items-center transition-opacity duration-300",
                        parentGroup ? "group-hover:opacity-0" : "hover:opacity-0"
                    )}>
                        <span className="truncate w-full">{text}</span>
                    </div>

                    {/* 2. Hover State: Marquee (Hidden by default, Visible on Hover) */}
                    <div className={cn(
                        "absolute inset-0 flex items-center opacity-0 transition-opacity duration-300",
                        styles.animateMarqueeSeamless,
                        styles.maskBorderFade,
                        parentGroup ? "group-hover:opacity-100" : "hover:opacity-100"
                    )}>
                        <span className="mr-8">{text}</span>
                        <span className="mr-8">{text}</span>
                        <span className="mr-8">{text}</span>
                    </div>
                </>
            ) : (
                <span className="truncate w-full">{text}</span>
            )}
        </div>
    );
};

export function LastFmWidget({ onReady, initialStatus = null }: LastFmWidgetProps = {}) {
    const { status, timeAgo, isReady } = useMusicStatus(initialStatus);
    const readyNotifiedRef = useRef(false);
    const displayStatus = status ?? {
        isPlaying: false,
        title: "Loading track...",
        artist: "Fetching Last.fm",
        lastPlayedAt: "",
    };
    const isLoading = !status;

    useEffect(() => {
        if (!onReady || !isReady || readyNotifiedRef.current) return;
        readyNotifiedRef.current = true;
        onReady();
    }, [isReady, onReady]);

    // Approximate perimeter for 202x46 with 8px radius
    // (202-16)*2 + (46-16)*2 + 2*PI*8 = 372 + 60 + ~50 = 482
    const perimeter = 482;
    const beamLength = 120; // Length of the colored line
    const gap = perimeter - beamLength; // Remaining gap

    return (
        <div className="flex items-center justify-center">
            {/* Outer Container */}
            <div className={cn(
                "relative group w-[202px] h-[46px] rounded-lg transition-all duration-300",
                "bg-[#050510]",
                "hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            )}>

                {/* 1. ANIMATED SVG BORDER (Playing State Only) */}
                {displayStatus.isPlaying && !isLoading && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 rounded-lg overflow-visible">
                        <defs>
                            <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                                <stop offset="50%" stopColor="#22d3ee" />
                                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#9333ea" stopOpacity="0" />
                                <stop offset="50%" stopColor="#9333ea" />
                                <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Rect for Cyan Beam */}
                        <rect
                            x="1" y="1" width="200" height="44" rx="7"
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="1.5"
                            strokeDasharray={`${beamLength} ${gap}`}
                            strokeLinecap="round"
                            className={styles.animateBeamCyan}
                        />
                        {/* Rect for Purple Beam (Offset by half) */}
                        <rect
                            x="1" y="1" width="200" height="44" rx="7"
                            fill="none"
                            stroke="#9333ea"
                            strokeWidth="1.5"
                            strokeDasharray={`${beamLength} ${gap}`}
                            strokeLinecap="round"
                            className={styles.animateBeamPurple}
                        />
                    </svg>
                )}

                {/* 2. STATIC BORDER (Paused State) + Base Border */}
                <div className={cn(
                    "absolute inset-0 rounded-lg border border-transparent transition-all duration-300 pointer-events-none z-10",
                )} style={{
                    background: displayStatus.isPlaying && !isLoading
                        ? 'transparent'
                        : 'linear-gradient(#050510, #050510) padding-box, linear-gradient(to bottom, rgba(34,211,238,0.8), rgba(147,51,234,0.8)) border-box',
                    border: '1px solid transparent'
                }} />

                {/* Inner Content Container */}
                <div className="relative w-full h-full rounded-lg overflow-hidden z-30 flex">

                    {/* Subtle Background Tint */}
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-purple-600/10 pointer-events-none" />

                    {/* Left Icon Area - Stronger Gradient */}
                    <div className="w-[44px] h-full shrink-0 bg-gradient-to-b from-cyan-500/30 to-purple-600/30 relative flex items-center justify-center border-r border-white/5">
                        <AudioLines className={cn("w-4 h-4 relative z-10 text-white drop-shadow-md", displayStatus.isPlaying && !isLoading && "animate-[pulse_1.5s_ease-in-out_infinite]")} />
                        {/* Enhanced Overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 to-purple-500/20 backdrop-blur-[1px]" />
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 px-3 flex flex-col justify-center overflow-hidden relative z-10">
                        {/* Song Title - Hover turns Cyan */}
                        <div className="w-full text-[12px] font-bold text-gray-100 group-hover:text-cyan-400 transition-colors h-[18px] relative">
                            <ConditionalMarquee text={displayStatus.title.toUpperCase()} />
                        </div>

                        {/* Artist & Status */}
                        <div className="flex w-full items-center justify-between text-[10px] font-bold text-purple-500 mt-[-2px]">
                            {/* Artist Name with Marquee */}
                            <div className="flex-1 min-w-0 pr-2 h-[15px] relative">
                                <ConditionalMarquee text={displayStatus.artist} />
                            </div>

                            {/* Status Text - High Contrast White */}
                            <span className={cn(
                                "text-[9px] font-bold transition-colors text-gray-400 shrink-0",
                                displayStatus.isPlaying && !isLoading && "animate-pulse"
                            )}>
                                {isLoading ? "SYNC" : (displayStatus.isPlaying ? "LIVE" : timeAgo || "Idle")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

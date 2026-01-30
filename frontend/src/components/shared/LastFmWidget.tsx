"use client";

import { useEffect, useState } from "react";
import { Music, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MusicStatus {
    isPlaying: boolean;
    title: string;
    artist: string;
    lastPlayedAt: string;
}

export function LastFmWidget() {
    const [status, setStatus] = useState<MusicStatus | null>(null);
    const [timeAgo, setTimeAgo] = useState<string>("");

    const fetchStatus = async () => {
        try {
            // Fetch from Nginx/File directly
            const res = await fetch(`/music-status.json`);
            if (res.ok) {
                const data = await res.json();
                setStatus(data);
            }
        } catch (error) {
            console.error("Failed to fetch music status:", error);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    // Update "Time Ago" every minute if not playing
    useEffect(() => {
        if (!status || status.isPlaying) return;

        const updateTimeAgo = () => {
            if (!status.lastPlayedAt) {
                setTimeAgo("");
                return;
            }

            const now = new Date();
            const lastPlayed = new Date(status.lastPlayedAt);

            if (isNaN(lastPlayed.getTime())) {
                setTimeAgo("");
                return;
            }

            const diffMs = now.getTime() - lastPlayed.getTime();
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins < 1) setTimeAgo("Just now");
            else if (diffMins < 60) setTimeAgo(`${diffMins}m ago`);
            else {
                const diffHrs = Math.floor(diffMins / 60);
                setTimeAgo(`${diffHrs}h ago`);
            }
        };

        updateTimeAgo();
        const timer = setInterval(updateTimeAgo, 60000);
        return () => clearInterval(timer);
    }, [status]);

    if (!status) return null;

    return (
        <div
            className={cn(
                "hidden lg:flex items-center gap-2 text-[10px] font-mono tracking-wider transition-all duration-300",
                "bg-background/50 border border-primary/20 rounded-full px-3 py-1",
                "hover:bg-primary/10 hover:border-primary/50 hover:text-cyan-neon group cursor-default"
            )}
        >
            {status.isPlaying ? (
                <Music className="w-3 h-3 text-cyan-neon animate-pulse" />
            ) : (
                <Clock className="w-3 h-3 text-muted-foreground group-hover:text-cyan-neon" />
            )}

            <div className="flex flex-col leading-none">
                <span className={cn("font-bold", status.isPlaying ? "text-cyan-neon" : "text-foreground")}>
                    {status.isPlaying ? "NOW PLAYING" : "LAST PLAYED"}
                </span>
                <span className="text-muted-foreground truncate max-w-[150px] group-hover:text-primary transition-colors">
                    {status.isPlaying
                        ? `${status.artist} - ${status.title}`
                        : `${timeAgo ? timeAgo + ": " : ""}${status.artist} - ${status.title}`
                    }
                </span>
            </div>
        </div>
    );
}

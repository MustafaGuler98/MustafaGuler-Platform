"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { LastFmWidgetProps } from "./LastFmWidget";
import { LASTFM_TAB_WARMED_KEY } from "./lastfm-cache";

interface LastFmDeferredWidgetProps {
    className?: string;
    reserveSpace?: boolean;
    delayMs?: number;
}

type IdleCallbackHandle = number;
type IdleCallbackFn = (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void;

declare global {
    interface Window {
        requestIdleCallback?: (callback: IdleCallbackFn, options?: { timeout: number }) => IdleCallbackHandle;
        cancelIdleCallback?: (handle: IdleCallbackHandle) => void;
    }
}

const LazyLastFmWidget = dynamic<LastFmWidgetProps>(
    () => import("./LastFmWidget").then((mod) => mod.LastFmWidget),
    { ssr: false }
);

let widgetPreloadPromise: Promise<void> | null = null;
let statusWarmupPromise: Promise<void> | null = null;

function preloadWidgetChunk(): Promise<void> {
    if (!widgetPreloadPromise) {
        widgetPreloadPromise = import("./LastFmWidget").then(() => undefined);
    }
    return widgetPreloadPromise;
}

function warmupStatusJson(): Promise<void> {
    if (!statusWarmupPromise) {
        statusWarmupPromise = fetch("/music-status.json", { method: "GET", credentials: "same-origin" })
            .then(() => undefined)
            .catch(() => undefined);
    }
    return statusWarmupPromise;
}

export function LastFmDeferredWidget({
    className,
    reserveSpace = true,
    delayMs = 800,
}: LastFmDeferredWidgetProps) {
    const [shouldRenderWidget, setShouldRenderWidget] = useState(false);
    const [isWidgetReady, setIsWidgetReady] = useState(false);

    useEffect(() => {
        let cancelled = false;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let idleId: IdleCallbackHandle | null = null;
        let effectiveDelayMs = delayMs;

        try {
            if (sessionStorage.getItem(LASTFM_TAB_WARMED_KEY) === "1") {
                effectiveDelayMs = 0;
            }
        } catch {
            // Ignore access restrictions in private modes.
        }

        const startWarmup = () => {
            void warmupStatusJson();
            void preloadWidgetChunk().then(() => {
                if (!cancelled) {
                    setShouldRenderWidget(true);
                }
            });
        };

        timeoutId = setTimeout(() => {
            if (typeof window.requestIdleCallback === "function") {
                idleId = window.requestIdleCallback(
                    () => startWarmup(),
                    { timeout: 1500 }
                );
                return;
            }

            startWarmup();
        }, effectiveDelayMs);

        return () => {
            cancelled = true;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (idleId !== null && typeof window.cancelIdleCallback === "function") {
                window.cancelIdleCallback(idleId);
            }
        };
    }, [delayMs]);

    if (!shouldRenderWidget) {
        if (!reserveSpace) return null;

        return (
            <div
                aria-hidden="true"
                className={cn(
                    "w-[202px] h-[46px] rounded-lg border border-white/10 bg-[#050510]/60",
                    className
                )}
            />
        );
    }

    return (
        <div className={cn("relative w-[202px] h-[46px]", className)}>
            {!isWidgetReady && reserveSpace && (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-lg border border-white/10 bg-[#050510]/60"
                />
            )}
            <div className="absolute inset-0">
                <LazyLastFmWidget
                    onReady={() => {
                        setIsWidgetReady(true);
                        try {
                            sessionStorage.setItem(LASTFM_TAB_WARMED_KEY, "1");
                        } catch {
                            // Ignore access restrictions in private modes.
                        }
                    }}
                />
            </div>
        </div>
    );
}

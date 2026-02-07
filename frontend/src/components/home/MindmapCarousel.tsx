"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import NeuralNetwork from "@/components/neural-network";
import styles from "./mindmap-carousel.module.css";
import { cn } from "@/lib/utils";

interface MindmapCarouselProps {
    items: string[];
}

interface CarouselSlot {
    word: string;
    angle: number;
    isSwapping: boolean;
}

const NUM_SLOTS = 6;
const SLOT_ANGLES = [0, 60, 120, 180, 240, 300];
const ORBIT_RADIUS = 38;
const SWAP_INTERVAL_MS = 2000;
const SWAP_FADE_MS = 260;

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function MindmapCarousel({ items }: MindmapCarouselProps) {
    const [slots, setSlots] = useState<CarouselSlot[]>([]);
    const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const swapIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const wordQueue = useMemo(() => {
        if (items.length === 0) return [];
        return shuffleArray(items);
    }, [items]);

    const getPosition = useCallback((slotAngle: number) => {
        const radians = (slotAngle * Math.PI) / 180;
        return {
            x: 50 + Math.cos(radians) * ORBIT_RADIUS,
            y: 50 + Math.sin(radians) * ORBIT_RADIUS,
        };
    }, []);

    // Initialize slots when wordQueue changes
    useEffect(() => {
        if (wordQueue.length === 0) {
            setSlots([]);
            return;
        }

        setSlots(SLOT_ANGLES.map((angle, i) => ({
            word: wordQueue[i % wordQueue.length],
            angle,
            isSwapping: false,
        })));
    }, [wordQueue]);

    // Swap words periodically without running frame-based React updates.
    useEffect(() => {
        if (wordQueue.length === 0) return;
        let currentWordIndex = NUM_SLOTS;

        const runSwap = () => {
            const slotToSwap = Math.floor(Math.random() * NUM_SLOTS);
            const nextWord = wordQueue[currentWordIndex % wordQueue.length];
            currentWordIndex++;

            setSlots(prev => {
                if (prev.length === 0) return prev;
                const updated = [...prev];
                updated[slotToSwap] = { ...updated[slotToSwap], isSwapping: true };
                return updated;
            });

            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }

            animationTimeoutRef.current = setTimeout(() => {
                setSlots(prev => {
                    if (prev.length === 0) return prev;
                    const updated = [...prev];
                    updated[slotToSwap] = {
                        ...updated[slotToSwap],
                        word: nextWord,
                        isSwapping: false,
                    };
                    return updated;
                });
                animationTimeoutRef.current = null;
            }, SWAP_FADE_MS);
        };

        swapIntervalRef.current = setInterval(runSwap, SWAP_INTERVAL_MS);

        return () => {
            if (swapIntervalRef.current) {
                clearInterval(swapIntervalRef.current);
                swapIntervalRef.current = null;
            }
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
                animationTimeoutRef.current = null;
            }
        };
    }, [wordQueue]);

    return (
        <div className="relative w-full mx-auto pb-8" style={{ height: '45vh', maxHeight: '450px', maxWidth: '450px' }}>
            {/* Canvas */}
            <div className="absolute inset-0 z-10">
                <NeuralNetwork className="w-full h-full" />
            </div>

            {/* Carousel Slots */}
            <div className={cn("absolute inset-0 z-20", styles.orbitTrack)}>
                {slots.length > 0 && slots.map((slot, idx) => {
                    const pos = getPosition(slot.angle);
                    const textColor = idx % 2 === 0
                        ? "rgba(147, 51, 234, 0.95)"
                        : "rgba(34, 211, 238, 0.95)";
                    const textGlow = idx % 2 === 0
                        ? "0 0 16px rgba(147, 51, 234, 0.65)"
                        : "0 0 16px rgba(34, 211, 238, 0.65)";

                    return (
                        <span
                            key={`${slot.angle}-${idx}`}
                            className={cn(
                                "absolute select-none pointer-events-none whitespace-nowrap",
                                styles.slot
                            )}
                            style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                            }}
                        >
                            <span className={styles.counterSpin}>
                                <span
                                    className={cn(
                                        "font-mono text-xs",
                                        styles.word,
                                        slot.isSwapping && styles.wordSwapping
                                    )}
                                    style={{
                                        color: textColor,
                                        textShadow: textGlow,
                                    }}
                                >
                                    {slot.word}
                                </span>
                            </span>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

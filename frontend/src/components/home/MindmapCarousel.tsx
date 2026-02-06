"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import NeuralNetwork from "@/components/neural-network";

interface MindmapCarouselProps {
    items: string[];
}

interface CarouselSlot {
    word: string;
    angle: number;
    opacity: number;
    glow: number;
    isSwapping: boolean;
}

const NUM_SLOTS = 6;
const SLOT_ANGLES = [0, 60, 120, 180, 240, 300];
const ORBIT_RADIUS = 38;
const ROTATION_SPEED = 0.15;

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
    const [rotationOffset, setRotationOffset] = useState(0);
    const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const wordQueue = useMemo(() => {
        if (items.length === 0) return [];
        return shuffleArray(items);
    }, [items]);

    const getPosition = useCallback((slotAngle: number) => {
        const totalAngle = slotAngle + rotationOffset;
        const radians = (totalAngle * Math.PI) / 180;
        return {
            x: 50 + Math.cos(radians) * ORBIT_RADIUS,
            y: 50 + Math.sin(radians) * ORBIT_RADIUS,
        };
    }, [rotationOffset]);

    // Initialize slots when wordQueue changes
    useEffect(() => {
        if (wordQueue.length === 0) {
            setSlots([]);
            return;
        }

        setSlots(SLOT_ANGLES.map((angle, i) => ({
            word: wordQueue[i % wordQueue.length],
            angle,
            opacity: 1,
            glow: 1,
            isSwapping: false,
        })));
    }, [wordQueue]);

    // Animation loop
    useEffect(() => {
        if (slots.length === 0 || wordQueue.length === 0) return;

        let animationFrame: number;
        let lastSwapTime = Date.now();
        let currentWordIndex = NUM_SLOTS;

        const animate = () => {
            const now = Date.now();

            setRotationOffset(prev => (prev + ROTATION_SPEED) % 360);

            if (now - lastSwapTime > 2000) {
                lastSwapTime = now;
                const slotToSwap = Math.floor(Math.random() * NUM_SLOTS);

                setSlots(prev => {
                    const updated = [...prev];
                    updated[slotToSwap] = { ...updated[slotToSwap], isSwapping: true };
                    return updated;
                });

                const capturedSlot = slotToSwap;
                const capturedWord = wordQueue[currentWordIndex % wordQueue.length];
                currentWordIndex++;

                if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

                animationTimeoutRef.current = setTimeout(() => {
                    setSlots(prev => {
                        const updated = [...prev];
                        updated[capturedSlot] = {
                            ...updated[capturedSlot],
                            word: capturedWord,
                            isSwapping: false,
                            glow: 1
                        };
                        return updated;
                    });
                    animationTimeoutRef.current = null;
                }, 800);
            }

            setSlots(prev => prev.map(slot => {
                let op = slot.opacity;
                let gl = slot.glow;

                if (slot.isSwapping) {
                    if (gl > 0) {
                        gl = Math.max(0, gl - 0.08);
                    } else if (op > 0) {
                        op = Math.max(0, op - 0.025);
                    }
                } else {
                    if (op < 1) op = Math.min(1, op + 0.05);
                    if (gl < 1 && op > 0.5) gl = Math.min(1, gl + 0.06);
                }

                return { ...slot, opacity: op, glow: gl };
            }));

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, [slots.length, wordQueue]);

    return (
        <div className="relative w-full mx-auto pb-8" style={{ height: '45vh', maxHeight: '450px', maxWidth: '450px' }}>
            {/* Canvas */}
            <div className="absolute inset-0 z-10">
                <NeuralNetwork className="w-full h-full" />
            </div>

            {/* Carousel Slots */}
            {slots.length > 0 && slots.map((slot, idx) => {
                const pos = getPosition(slot.angle);
                const scale = 0.85 + slot.opacity * 0.25;
                const glowSize = 8 + slot.glow * 12;
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
    );
}

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NeonStreamNavProps {
    direction: "left" | "right";
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

/**
 * A reusable "Neon" style navigation button.
 * Features animated chevrons that flow towards the direction of navigation.
 * - Supports both click (onClick) and hold (onMouseDown/Up/Leave) behaviors.
 * - Arrows are white by default, turning cyan on hover.
 * - Border is always a subtle cyan, glowing brighter on hover.
 */
export function NeonStreamNav({
    direction,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onClick,
    disabled = false,
    className,
}: NeonStreamNavProps) {
    const isLeft = direction === "left";
    const Icon = isLeft ? ChevronLeft : ChevronRight;

    const animationBase = isLeft
        ? "animate-in slide-in-from-right-2 fade-in repeat-infinite duration-1000"
        : "animate-in slide-in-from-left-2 fade-in repeat-infinite duration-1000";

    const marginClass = isLeft ? "-ml-3" : "-mr-3";

    return (
        <button
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onMouseDown}
            onTouchEnd={onMouseUp}
            disabled={disabled}
            aria-label={isLeft ? "Previous" : "Next"}
            className={cn(
                "flex group shrink-0 items-center text-white hover:text-cyan-neon transition-colors duration-500",
                "py-3 px-5 border border-cyan-neon/30 hover:border-cyan-neon",
                "hover:shadow-[0_0_10px_rgba(34,211,238,0.4)] rounded-full hover:bg-cyan-neon/5",
                "active:scale-95 disabled:opacity-20 disabled:pointer-events-none select-none",
                className
            )}
        >
            {/* Order of chevrons matters for visual flow */}
            {isLeft ? (
                <>
                    <Icon className={cn("w-5 h-5", animationBase)} />
                    <Icon className={cn("w-5 h-5", animationBase, "delay-150", marginClass)} />
                    <Icon className={cn("w-5 h-5", animationBase, "delay-300", marginClass)} />
                </>
            ) : (
                <>
                    <Icon className={cn("w-5 h-5", animationBase, "delay-300", marginClass)} />
                    <Icon className={cn("w-5 h-5", animationBase, "delay-150", marginClass)} />
                    <Icon className={cn("w-5 h-5", animationBase)} />
                </>
            )}
        </button>
    );
}

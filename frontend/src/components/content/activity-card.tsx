import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import Image from "next/image";

interface ActivityCardProps {
    title: string;
    name: string;
    description?: string;
    imageUrl?: string;
    Icon: LucideIcon;
    colorClass?: string; // e.g. "text-cyan-neon"
    variant?: "poster" | "row";
    fontClass?: string; // New prop for custom fonts
}

export function ActivityCard({
    title,
    name,
    description,
    imageUrl,
    Icon,
    colorClass = "text-primary",
    variant = "poster",
    fontClass
}: ActivityCardProps) {

    if (variant === "row") {
        return (
            <div className="group relative w-full h-28 flex overflow-hidden rounded-sm border border-white/10 bg-black/40 hover:bg-white/5 transition-colors duration-300">
                {/* Left: Image */}
                <div className="w-28 h-full shrink-0 relative overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            width={112}
                            height={112}
                            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                    )}
                    {/* Inner Shadow on Image */}
                    <div className="absolute inset-0 shadow-[inset_-10px_0_20px_-5px_rgba(0,0,0,0.8)]" />
                </div>

                {/* Right: Content */}
                <div className="flex-1 p-3 flex flex-col justify-center relative">
                    {/* Top Item */}
                    <div className="flex items-center gap-2 mb-1">
                        <Icon className={cn("w-3 h-3", colorClass)} />
                        <span className="text-[9px] uppercase tracking-widest font-mono text-muted-foreground/70">
                            {title}
                        </span>
                    </div>

                    {/* Main Name */}
                    <h4 className="text-sm font-bold font-heading text-foreground group-hover:text-cyan-neon transition-colors line-clamp-1">
                        {name}
                    </h4>

                    {/* Description */}
                    {description && (
                        <p className="text-[10px] text-muted-foreground font-mono line-clamp-1 mt-0.5 opacity-60">
                            {description}
                        </p>
                    )}

                    {/* Hover Indicator */}
                    <div className={cn(
                        "absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-8 rounded-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300",
                        colorClass === "text-cyan-neon" ? "bg-cyan-neon" :
                            colorClass === "text-amber-500" ? "bg-amber-500" :
                                colorClass === "text-pink-500" ? "bg-pink-500" :
                                    colorClass === "text-emerald-400" ? "bg-emerald-400" :
                                        colorClass === "text-orange-600" ? "bg-orange-600" : "bg-primary"
                    )} />
                </div>
            </div>
        );
    }

    return (
        <div className="group relative w-full aspect-[3/4] overflow-hidden rounded-sm border border-white/10 bg-black/40">
            {/* Background Image OR Fallback Gradient */}
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={name}
                    width={280}
                    height={374}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-80" />
            )}

            {/* Gradient Overlay - Only at bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

            {/* Content Container */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end">

                {/* Top Label with Icon */}
                <div className="absolute top-4 left-4 flex items-center gap-2 opacity-100 transition-opacity duration-300">
                    <div className={cn("p-1.5 rounded-sm bg-black/40 backdrop-blur-md border border-white/10", colorClass)}>
                        <Icon className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.15em] font-mono text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
                        {title}
                    </span>
                </div>

                {/* Main Text */}
                <div className="relative z-10 mt-auto translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className={cn("text-2xl md:text-3xl font-bold text-white mb-2 leading-tight has-[+]:mb-0", fontClass)}>
                        {name}
                    </h3>
                    {description && (
                        <p className="text-xs text-white/60 font-mono line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {description}
                        </p>
                    )}
                </div>

                {/* Hover line */}
                <div className={cn(
                    "absolute bottom-0 left-0 h-[2px] w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left",
                    colorClass.includes("cyan") ? "bg-cyan-400" :
                        colorClass.includes("amber") ? "bg-amber-400" :
                            colorClass.includes("purple") ? "bg-purple-400" :
                                colorClass.includes("pink") ? "bg-pink-400" :
                                    colorClass.includes("rose") ? "bg-rose-500" :
                                        colorClass.includes("emerald") ? "bg-emerald-400" :
                                            colorClass.includes("indigo") ? "bg-indigo-400" :
                                                colorClass.includes("blue") ? "bg-blue-500" :
                                                    colorClass.includes("orange") ? "bg-orange-600" :
                                                        "bg-primary"
                )} />
            </div>
        </div>
    );
}

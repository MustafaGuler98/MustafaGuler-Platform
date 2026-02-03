import { ReactNode } from "react";

interface SidebarSectionProps {
    title: string;
    children: ReactNode;
    className?: string; // Additional classes if needed
}

export function SidebarSection({ title, children, className = "" }: SidebarSectionProps) {
    return (
        <div className={`w-full ${className}`}>
            {/* Header: Neon Glitch with Moving Blue Scanline */}
            <div className="relative inline-block pb-1 mb-6">
                <h3 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    {title}
                </h3>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            </div>

            {/* Content */}
            {children}
        </div>
    );
}

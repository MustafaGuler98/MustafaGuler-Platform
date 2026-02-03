import Link from "next/link";
import { ReactNode } from "react";

interface SidebarItemProps {
    label: string;
    icon?: ReactNode;
    imageUrl?: string;
    href?: string;
    onClick?: () => void;
    children?: ReactNode;
    className?: string;
    truncateLabel?: boolean;
}

export function SidebarItem({ label, icon, imageUrl, href, onClick, children, className = "", truncateLabel = true }: SidebarItemProps) {
    const isLink = !!href;
    const Component = isLink ? Link : "div";

    const containerClasses = `
        group relative flex flex-col items-center justify-center gap-1.5 p-1.5 
        bg-black/40 border border-white/5 hover:border-cyan-500/50 rounded-sm 
        transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] 
        overflow-hidden aspect-square
        ${isLink ? "cursor-pointer" : "cursor-default"}
        ${className}
    `;

    const content = (
        <>
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />

            {/* Icon Container */}
            <div className="relative z-10 p-1 rounded-full bg-white/5 group-hover:bg-cyan-950/50 transition-colors">
                {imageUrl ? (
                    <img src={imageUrl} alt={label} className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110" />
                ) : icon ? (
                    <div className="text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 transform group-hover:scale-110">
                        {icon}
                    </div>
                ) : null}
            </div>

            {/* Label */}
            <span className={`relative z-10 text-[9px] md:text-[10px] font-bold text-gray-400 group-hover:text-white tracking-wider font-rajdhani uppercase transition-colors text-center w-full px-1 ${truncateLabel ? "truncate" : ""}`}>
                {label}
            </span>

            {/* Extra Children */}
            {children && (
                <div className="relative z-10 mt-0.5">
                    {children}
                </div>
            )}

            {/* Tech Decoration Corners */}
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/10 group-hover:border-cyan-500/50 transition-colors" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/10 group-hover:border-cyan-500/50 transition-colors" />
        </>
    );

    if (isLink) {
        return (
            <Link href={href!} onClick={onClick} target={href?.startsWith("http") ? "_blank" : undefined} className={containerClasses} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}>
                {content}
            </Link>
        );
    }

    return (
        <div onClick={onClick} className={containerClasses}>
            {content}
        </div>
    );
}

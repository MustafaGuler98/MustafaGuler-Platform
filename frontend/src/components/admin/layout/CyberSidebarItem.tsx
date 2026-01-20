'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

export interface NavItemType {
    href: string;
    icon: React.ReactNode;
    label: string;
    children?: NavItemType[];
}

interface CyberSidebarItemProps {
    item: NavItemType;
    isActive: (href: string) => boolean;
    isCollapsed: boolean;
}

export function CyberSidebarItem({ item, isActive, isCollapsed }: CyberSidebarItemProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false); // For expanded mode accordion

    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isChildActive = hasChildren && item.children!.some(child => isActive(child.href));

    // Auto-expand if child is active (only in expanded mode)
    useEffect(() => {
        if (!isCollapsed && (active || isChildActive)) {
            setIsOpen(true);
        }
    }, [active, isChildActive, isCollapsed]);

    // Close accordion when collapsing sidebar
    useEffect(() => {
        if (isCollapsed) {
            setIsOpen(false);
        }
    }, [isCollapsed]);

    // COLLAPSED STATE
    if (isCollapsed) {
        // CASE A: Item with Children (Dropdown Menu)
        if (hasChildren) {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className={cn(
                                'w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200 mx-auto group relative',
                                (active || isChildActive)
                                    ? 'text-cyan-neon bg-cyan-neon/10'
                                    : 'text-muted-foreground hover:text-cyan-neon hover:bg-card/50'
                            )}
                            title={item.label}
                        >
                            {/* Active Indicator Dot */}
                            {(active || isChildActive) && (
                                <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-cyan-neon shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            )}
                            {item.icon}
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent side="right" sideOffset={10} className="w-48 bg-[#0a0118]/95 border-primary/40 backdrop-blur-xl">
                        <DropdownMenuLabel className="font-heading text-cyan-neon tracking-wider text-xs border-b border-white/10 pb-2 mb-1">
                            {item.label}
                        </DropdownMenuLabel>

                        {item.children!.map((child) => {
                            const childActive = isActive(child.href);
                            return (
                                <DropdownMenuItem key={child.href} asChild>
                                    <Link
                                        href={child.href}
                                        className={cn(
                                            "font-mono text-xs cursor-pointer flex items-center gap-2",
                                            childActive ? "text-cyan-neon" : "text-muted-foreground"
                                        )}
                                    >
                                        {child.icon}
                                        {child.label}
                                    </Link>
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        // CASE B: Single Item
        return (
            <Link
                href={item.href}
                className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-md transition-all duration-200 mx-auto group relative',
                    active
                        ? 'text-cyan-neon bg-cyan-neon/10'
                        : 'text-muted-foreground hover:text-cyan-neon hover:bg-card/50'
                )}
                title={item.label}
            >
                {active && (
                    <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-cyan-neon shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
                {item.icon}
            </Link>
        );
    }

    // EXPANDED STATE
    // CASE A: Item with Children (Accordion logic)
    if (hasChildren) {
        return (
            <div>
                <div className="flex items-center group">
                    <Link
                        href={item.href}
                        className={cn(
                            'flex-1 flex items-center gap-3 px-3 py-2.5 rounded-l-md transition-all duration-200',
                            'font-mono text-xs tracking-widest uppercase',
                            (active || isChildActive)
                                ? 'text-cyan-neon bg-gradient-to-r from-cyan-neon/10 to-transparent'
                                : 'text-muted-foreground group-hover:text-foreground group-hover:bg-card/30'
                        )}
                    >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                    </Link>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(!isOpen);
                        }}
                        className={cn(
                            'p-2.5 rounded-r-md transition-all duration-200',
                            (active || isChildActive)
                                ? 'text-cyan-neon bg-gradient-to-r from-transparent to-transparent'
                                : 'text-muted-foreground hover:text-cyan-neon hover:bg-card/30'
                        )}
                    >
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                </div>

                {/* Submenu Children */}
                <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0")}>
                    <div className="flex flex-col gap-1 pl-4 border-l border-white/5 ml-5">
                        {item.children!.map((child) => {
                            const childActive = isActive(child.href);
                            return (
                                <Link
                                    key={child.href}
                                    href={child.href}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200',
                                        'font-mono text-[10px] tracking-widest uppercase',
                                        childActive
                                            ? 'text-cyan-neon bg-cyan-neon/5'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
                                    )}
                                >
                                    {child.icon}
                                    <span className="truncate">{child.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // CASE B: Single Item
    return (
        <Link
            href={item.href}
            className={cn(
                'flex items-center gap-3 px-3 py-4 mx-2 mb-1 transition-all duration-300 group relative',
                'font-heading text-xs tracking-[0.2em] uppercase',
                active
                    ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.6)] font-bold clip-path-slant-right'
                    : 'text-slate-500 hover:text-cyan-400 hover:bg-white/5'
            )}
            style={{
                clipPath: active ? 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)' : undefined
            }}
        >
            <div className="relative z-10 flex items-center gap-3">
                <span className={cn("transition-colors duration-200", active ? "text-black" : "text-slate-500 group-hover:text-cyan-400")}>
                    {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
            </div>

            {/* Tech Decoration Lines */}
            {active && (
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-black/20" />
            )}
        </Link>
    );
}

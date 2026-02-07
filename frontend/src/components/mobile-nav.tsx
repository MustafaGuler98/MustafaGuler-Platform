"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Github, Linkedin, Sparkles } from "lucide-react";
import Link from "next/link";
import { LastFmDeferredWidget } from "@/components/shared/LastFmDeferredWidget";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const NavLink = ({ href, label }: { href: string; label: string }) => {
        const isActive = pathname === href;
        return (
            <Link
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 font-heading tracking-wider border-l-2",
                    isActive
                        ? "text-cyan-neon border-cyan-neon bg-cyan-neon/5"
                        : "text-muted-foreground border-transparent hover:text-cyan-neon hover:border-primary/50 hover:bg-white/5"
                )}
            >
                {isActive && <Sparkles className="w-3 h-3 animate-pulse" />}
                {label}
            </Link>
        );
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:text-cyan-neon transition-colors">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-primary/20 bg-[#0a0118]/95 backdrop-blur-xl p-0 flex flex-col">

                {/* Accessible Title */}
                <div className="sr-only">
                    <SheetTitle>Mobile Navigation Menu</SheetTitle>
                </div>

                {/* Header */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex flex-col gap-1">
                        <span className="font-heading font-bold text-lg tracking-wider text-foreground">
                            MUSTAFA GULER
                        </span>
                        <span className="font-mono text-[10px] text-cyan-neon tracking-[0.2em] animate-pulse">
                            SYSTEM_ONLINE
                        </span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1">
                    <NavLink href="/" label="PORTAL" />
                    <NavLink href="/blog" label="BLOG" />
                    <NavLink href="/blog/timeline" label="TIMELINE" />
                    <NavLink href="/about" label="ABOUT.ME" />
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/5 flex flex-col gap-6">
                    {/* Music Widget */}
                    <div className="flex justify-center scale-90">
                        <LastFmDeferredWidget />
                    </div>

                    {/* Socials */}
                    <div className="flex items-center justify-center gap-8">
                        <Link
                            href="https://www.linkedin.com/in/mustafaguler98"
                            target="_blank"
                            className="text-muted-foreground hover:text-cyan-neon transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </Link>
                        <Link
                            href="https://github.com/MustafaGuler98"
                            target="_blank"
                            className="text-muted-foreground hover:text-cyan-neon transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Contact Button */}
                    <Link
                        href="/contact"
                        onClick={() => setOpen(false)}
                        className="w-full flex items-center justify-center py-3 border border-primary/30 rounded bg-primary/5 text-xs font-mono tracking-widest uppercase hover:bg-primary/10 hover:border-cyan-neon hover:text-cyan-neon transition-all"
                    >
                        CONTACT
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    );
}

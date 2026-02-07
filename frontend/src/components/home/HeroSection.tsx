import Link from "next/link";
import Image from "next/image";
import { Sparkles, Github, Linkedin } from "lucide-react";
import { LastFmWidgetServer } from "@/components/shared/LastFmWidgetServer";
import { MobileNav } from "@/components/mobile-nav";
import { MindmapCarousel } from "./MindmapCarousel";
import effectsStyles from "@/styles/effects.module.css";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
    mindmapItems: string[];
}

export function HeroSection({ mindmapItems }: HeroSectionProps) {
    return (
        <section className="relative flex flex-col items-center px-4 pt-6 pb-2 overflow-hidden">
            {/* Header */}
            <div className="w-full px-6 relative flex items-start justify-between mb-4 h-24 md:h-36">
                {/* Left: Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 pt-8">
                    <Link href="/" className="relative group px-1 py-2 text-sm font-medium font-heading tracking-wide text-cyan-neon">
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-3 h-3 animate-pulse" />
                            PORTAL
                        </span>
                        <span className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-neon shadow-[0_0_10px_var(--cyan-neon)]" />
                    </Link>
                    <Link href="/blog" className="relative group px-1 py-2 text-sm font-medium font-heading tracking-wide text-muted-foreground hover:text-cyan-neon transition-colors">
                        BLOG
                        <span className="absolute bottom-0 left-0 h-[2px] bg-cyan-neon w-0 group-hover:w-full transition-all duration-300 group-hover:shadow-[0_0_8px_var(--cyan-neon)]" />
                        <span className="absolute top-0 right-0 h-[2px] bg-primary w-0 group-hover:w-1/2 transition-all duration-300 group-hover:shadow-[0_0_8px_var(--primary)]" />
                    </Link>
                    <Link href="/blog/timeline" className="relative group px-1 py-2 text-sm font-medium font-heading tracking-wide text-muted-foreground hover:text-cyan-neon transition-colors">
                        TIMELINE
                        <span className="absolute bottom-0 left-0 h-[2px] bg-cyan-neon w-0 group-hover:w-full transition-all duration-300 group-hover:shadow-[0_0_8px_var(--cyan-neon)]" />
                        <span className="absolute top-0 right-0 h-[2px] bg-primary w-0 group-hover:w-1/2 transition-all duration-300 group-hover:shadow-[0_0_8px_var(--primary)]" />
                    </Link>
                    <Link href="/about" className="relative group px-1 py-2 text-sm font-medium font-heading tracking-wide text-muted-foreground hover:text-cyan-neon transition-colors">
                        ABOUT.ME
                        <span className="absolute bottom-0 left-0 h-[2px] bg-cyan-neon w-0 group-hover:w-full transition-all duration-300 group-hover:shadow-[0_0_8px_var(--cyan-neon)]" />
                        <span className="absolute top-0 right-0 h-[2px] bg-primary w-0 group-hover:w-1/2 transition-all duration-300 group-hover:shadow-[0_0_8px_var(--primary)]" />
                    </Link>
                </nav>

                {/* Center: Logo + Title */}
                <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 group mt-4 md:mt-0">
                    <div className={cn(effectsStyles.logoOrbital, "relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-visible transition-all duration-300")}>
                        <div className={cn(effectsStyles.logoGlowBorder, "w-full h-full rounded-full overflow-hidden transition-all duration-300")}>
                            <Image
                                src="/logo1.webp"
                                alt="Mustafa Guler"
                                width={96}
                                height={96}
                                priority
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <span className="font-heading font-bold text-lg leading-none tracking-wider text-foreground group-hover:text-primary transition-colors">
                            MUSTAFA GULER
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] group-hover:text-cyan-neon transition-colors">
                            DIGITAL_MIND
                        </span>
                    </div>
                </Link>

                {/* Right: Social + Contact */}
                <div className="hidden md:flex flex-col items-end gap-5 pt-8">
                    <div className="flex items-center gap-12 pr-0">
                        <LastFmWidgetServer />
                        <div className="flex items-center gap-9">
                            <a href="https://www.linkedin.com/in/mustafaguler98" target="_blank" rel="noopener noreferrer"
                                className={cn(effectsStyles.glitchIcon, "text-primary drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] hover:text-cyan-neon transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]")}>
                                <Linkedin className="w-6 h-6" />
                            </a>
                            <a href="https://github.com/MustafaGuler98" target="_blank" rel="noopener noreferrer"
                                className={cn(effectsStyles.glitchIconDelayed, "text-primary drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] hover:text-cyan-neon transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]")}>
                                <Github className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                    <Link href="/contact" className={cn(effectsStyles.holoTerminalBtn, "rounded-none text-white hover:text-cyan-neon transition-all duration-300 font-mono text-xs tracking-widest uppercase px-4 py-2 border border-primary/50")}>
                        <span className={effectsStyles.blinkCursor}>CONTACT</span>
                    </Link>
                </div>

                {/* Mobile Navigation Trigger */}
                <div className="md:hidden pt-8">
                    <MobileNav />
                </div>
            </div>

            {/* Role Text */}
            <div className="text-center mb-3 z-20 relative mt-16 md:mt-0">
                <p className={cn(effectsStyles.roleText, "font-heading text-sm md:text-base font-medium tracking-widest text-muted-foreground")}>
                    Software Developer / Storyteller / Digital Nomad
                </p>
            </div>

            {/* Mindmap Carousel (Client Component) */}
            <MindmapCarousel items={mindmapItems} />
        </section>
    );
}

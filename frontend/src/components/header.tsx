"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe, Menu, Sparkles, Github, Linkedin } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const scrollDirection = useScrollDirection();
  const [scrolled, setScrolled] = useState(false);

  // Check if page is scrolled to add background blur/opacity styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  // Custom NavLink Component for RPG Style
  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={cn(
          "relative group px-1 py-2 text-sm font-medium transition-all duration-300 font-heading tracking-wide",
          active ? "text-cyan-neon" : "text-muted-foreground hover:text-cyan-neon"
        )}
      >
        <span className="relative z-10 flex items-center gap-2">
          {active && <Sparkles className="w-3 h-3 animate-pulse" />}
          {label}
        </span>

        {/* Hover Effect: Expanding Underline */}
        <span className={cn(
          "absolute bottom-0 left-0 h-[2px] bg-cyan-neon transition-all duration-300 ease-out",
          active ? "w-full shadow-[0_0_10px_var(--cyan-neon)]" : "w-0 group-hover:w-full group-hover:shadow-[0_0_8px_var(--cyan-neon)]"
        )} />

        {/* Hover Effect: Top Line */}
        <span className="absolute top-0 right-0 h-[2px] bg-primary transition-all duration-300 ease-out w-0 group-hover:w-1/2 group-hover:shadow-[0_0_8px_var(--primary)]" />
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 border-b",
        // Smart Scroll Logic: Hide on down (translate-y-full), Show on up (translate-y-0)
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0",
        // Visual Logic: Transparent at top, Glassmorphism + Border when scrolled
        scrolled
          ? "bg-background/80 backdrop-blur-md border-primary/20 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="w-full px-6 h-36 flex items-center justify-between">

        {/* --- LEFT: LOGO --- */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Avatar Container */}
          <div className="logo-orbital relative w-30 h-30 rounded-full overflow-visible transition-all duration-300">
            <div className="logo-glow-border w-full h-full rounded-full overflow-hidden transition-all duration-300">
              <Image
                src="/logo1.png"
                alt="Mustafa Guler"
                fill
                className="object-cover"
              />              
            </div>
          </div>

          {/* Typography Logo */}
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg leading-none tracking-wider text-foreground group-hover:text-primary transition-colors">
              MUSTAFA GULER
            </span>
            <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] group-hover:text-cyan-neon transition-colors">
              DIGITAL_MIND
            </span>
          </div>
        </Link>

        {/* --- CENTER: NAVIGATION (RPG STYLE) --- */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <NavLink href="/" label="PORTAL" />
          <NavLink href="/blog" label="BLOG" />
          <NavLink href="/blog/timeline" label="TIMELINE" />
          <NavLink href="/about" label="ABOUT.ME" />
        </nav>

        {/* --- RIGHT: ACTIONS --- */}
        <div className="flex items-center gap-3">

          {/* Desktop: Socials & Connect Button Stack */}
          <div className="hidden md:flex flex-col items-end gap-5">

            {/* Row 1: Social Icons */}
            <div className="flex items-center gap-9 pr-0">
              <Link
                href="https://www.linkedin.com/in/mustafaguler98"
                target="_blank"
                className="glitch-icon text-primary drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] hover:text-cyan-neon transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              >
                <Linkedin className="w-6 h-6" />
              </Link>
              <Link
                href="https://github.com/MustafaGuler98"
                target="_blank"
                className="glitch-icon-delayed text-primary drop-shadow-[0_0_8px_rgba(147,51,234,0.8)] hover:text-cyan-neon transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]"
              >
                <Github className="w-6 h-6" />
              </Link>
            </div>


            {/* <ModeToggle /> */}
            {/* 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full hover:bg-primary/10 hover:text-cyan-neon transition-colors">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0a0118] border-primary/20 text-foreground">
              <DropdownMenuItem className="justify-center cursor-pointer hover:text-cyan-neon focus:text-cyan-neon focus:bg-primary/10">TR</DropdownMenuItem>
              <DropdownMenuItem className="justify-center cursor-pointer hover:text-cyan-neon focus:text-cyan-neon focus:bg-primary/10">EN</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> 
            */}

            <Button
              variant="outline"
              size="sm"
              className="holo-terminal-btn hidden md:flex rounded-none text-white hover:text-cyan-neon transition-all duration-300 font-mono text-xs tracking-widest uppercase"
            >
              <span className="blink-cursor">CONTACT</span>
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

      </div>
    </header>
  );
}
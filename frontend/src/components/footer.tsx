"use client"

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Github, Linkedin, ArrowUp, Mail, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer() {
    const [copied, setCopied] = useState(false);
    const [currentYear] = useState(new Date().getFullYear());

    // Copy email to clipboard
    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText("contact.mustafaguler@gmail.com");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy email:", err);
        }
    };

    // Scroll to top handler
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Footer navigation links
    const footerLinks = [
        { href: "/", label: "Portal" },
        { href: "/blog", label: "Blog" },
        { href: "/blog/timeline", label: "Timeline" },
        { href: "/about", label: "About" },
    ];

    // Footer link component with chevron hover effect
    const FooterLink = ({ href, label }: { href: string; label: string }) => (
        <Link
            href={href}
            className="group flex items-center gap-1 text-gray-300 hover:text-cyan-neon transition-all duration-300 text-sm hover:translate-x-1"
        >
            <ChevronRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-cyan-neon" />
            <span>{label}</span>
        </Link>
    );

    return (
        <footer className="relative w-full mt-auto z-20">
            {/* Dark overlay - fades from transparent at top to dark at bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90 -z-10" />

            {/* Top border: Energy Beam with Core */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            {/* Energy Core - positioned inside footer to avoid overflow clipping */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 -mt-1.5 rounded-full bg-cyan-neon shadow-[0_0_12px_4px_rgba(34,211,238,0.6),0_0_24px_8px_rgba(34,211,238,0.3)] z-50" />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Main Grid: 3 columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

                    {/* LEFT COLUMN: Identity Node (4 units) */}
                    <div className="md:col-span-4 flex flex-col gap-4">
                        {/* Logo */}
                        <h3 className="font-heading text-xl font-bold tracking-wider bg-gradient-to-r from-primary via-cyan-neon to-cyan-300 bg-clip-text text-transparent">
                            DIGITAL_MIND
                        </h3>

                        {/* Slogan */}
                        <p className="text-sm italic bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(255,255,255,0.1)]">
                            Driven by passion...
                        </p>

                        {/* Matrix Status Box */}
                        <div className="mt-4 px-4 py-2.5 bg-green-950/40 border border-green-500/50 rounded shadow-[0_0_15px_rgba(34,197,94,0.15),inset_0_0_20px_rgba(34,197,94,0.05)] inline-flex items-center gap-3 w-fit">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                            </span>
                            <span className="font-mono text-xs text-green-400 tracking-widest drop-shadow-[0_0_4px_rgba(34,197,94,0.6)]">
                                [SYSTEM_STATUS: <span className="text-green-300 font-bold">ONLINE</span>]
                            </span>
                        </div>
                    </div>

                    {/* CENTER COLUMN: Navigation Array (4 units) */}
                    <div className="md:col-span-4 flex flex-col gap-2">
                        {/* Section Title */}
                        <div className="mb-1">
                            <span className="font-mono text-xs text-white uppercase tracking-[0.2em]">
                                NAVIGATION
                            </span>
                            <div className="mt-1 h-[1px] w-20 bg-gradient-to-r from-primary/50 to-transparent" />
                        </div>

                        {/* Links */}
                        <nav className="flex flex-col gap-3">
                            {footerLinks.map((link) => (
                                <FooterLink key={link.href} href={link.href} label={link.label} />
                            ))}
                        </nav>
                    </div>

                    {/* RIGHT COLUMN: Communication Hub (4 units) */}
                    <div className="md:col-span-4 flex flex-col gap-2 md:items-end">
                        {/* Section Title */}
                        <div className="mb-1">
                            <span className="font-mono text-xs text-white uppercase tracking-[0.2em]">
                                CONNECT
                            </span>
                            <div className="mt-1 h-[1px] w-16 bg-gradient-to-r from-primary/50 to-transparent" />
                        </div>

                        {/* Email Cyber-Card */}
                        <button
                            onClick={handleCopyEmail}
                            className={cn(
                                "group px-3 py-2 rounded-md border transition-all duration-300 cursor-pointer flex items-center justify-center gap-2",
                                copied
                                    ? "bg-green-900/30 border-green-500/50"
                                    : "bg-[#0a0118]/50 border-primary/30 hover:border-primary/60"
                            )}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3 h-3 text-green-400" />
                                    <span className="font-mono text-xs text-green-400">COPIED!</span>
                                </>
                            ) : (
                                <>
                                    <Mail className="w-3 h-3 text-primary group-hover:text-cyan-neon transition-colors" />
                                    <span className="font-mono text-xs text-gray-300 group-hover:text-cyan-neon transition-colors">
                                        contact.mustafaguler@gmail.com
                                    </span>
                                </>
                            )}
                        </button>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 mt-2">
                            <Link
                                href="https://github.com/MustafaGuler98"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-md border border-gray-700/50 text-gray-400 hover:text-cyan-neon hover:border-cyan-neon hover:shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-300"
                            >
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link
                                href="https://www.linkedin.com/in/mustafaguler98"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-md border border-gray-700/50 text-gray-400 hover:text-cyan-neon hover:border-cyan-neon hover:shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-300"
                            >
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                </div>

                {/* FOOTER BOTTOM BAR */}
                <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-6 border-t border-white/5 gap-4">
                    {/* Left: Copyright */}
                    <p className="text-gray-500 text-xs">
                        © {currentYear} Mustafa Guler.
                    </p>

                    {/* Center: Tech Stack Badges */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-xs">Powered by:</span>
                        <span className="font-mono text-[10px] px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20 hover:shadow-[0_0_12px_rgba(147,51,234,0.5)] transition-all duration-300 cursor-default">
                            .NET Core
                        </span>
                        <span className="font-mono text-[10px] px-2 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700 hover:shadow-[0_0_12px_rgba(255,255,255,0.3)] transition-all duration-300 cursor-default">
                            Next.js
                        </span>
                    </div>

                    {/* Right: Back to Top */}
                    <button
                        onClick={scrollToTop}
                        className="group p-2 rounded-md border border-primary/50 text-primary hover:text-cyan-neon hover:border-cyan-neon hover:shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-300 cursor-pointer"
                        aria-label="Back to top"
                    >
                        <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                    </button>
                </div>

            </div>
        </footer>
    );
}

"use client";

import { AlertTriangle, Terminal } from "lucide-react";

export default function AboutMePage() {

    return (
        <div className="min-h-screen w-full flex flex-col items-center pt-32 pb-12 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/15 rounded-full blur-[150px] -z-10 pointer-events-none" />
            <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-cyan-neon/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
            <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            {/* Floating Code Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-primary/20 font-mono text-xs animate-pulse"
                        style={{
                            top: `${20 + i * 15}%`,
                            left: `${5 + i * 10}%`,
                            animationDelay: `${i * 0.3}s`,
                        }}
                    >
                        {["</>", "{}", "[]", "=>", "//", "/**/"][i]}
                    </div>
                ))}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={`right-${i}`}
                        className="absolute text-cyan-neon/15 font-mono text-xs animate-pulse"
                        style={{
                            top: `${25 + i * 12}%`,
                            right: `${5 + i * 8}%`,
                            animationDelay: `${i * 0.4}s`,
                        }}
                    >
                        {["01", "10", "11", "00", "&&", "||"][i]}
                    </div>
                ))}
            </div>

            <div className="w-full max-w-2xl flex flex-col items-center text-center gap-8 relative">

                {/* Title */}
                <div>
                    <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon via-primary to-cyan-neon">
                            ABOUT.ME
                        </span>
                    </h1>
                    <div className="text-muted-foreground text-sm font-mono">
                        STATUS: UNDER_CONSTRUCTION
                    </div>
                </div>

                {/* Main Message Box */}
                <div className="bg-background/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_60px_-15px_rgba(124,58,237,0.2)] relative overflow-hidden w-full">
                    {/* Neon Border Effects */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-neon to-transparent opacity-50" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                    <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-neon/30 to-transparent opacity-50" />
                    <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent opacity-50" />

                    <div className="flex flex-col gap-6">
                        {/* Warning Header */}
                        <div className="flex items-center gap-3 text-yellow-500/80">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="text-xs font-mono uppercase tracking-widest">
                                System Notice
                            </span>
                        </div>

                        {/* Main Text */}
                        <div className="space-y-4">
                            <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed">
                                Look, the{" "}
                                <span className="text-cyan-neon font-bold">About.me</span>{" "}
                                page isn't ready yet.
                            </p>
                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-mono">
                                But let's be honest,
                                <span className="text-primary font-semibold italic"> this entire website is about me</span>.
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* Terminal-style message */}
                        <div className="bg-[#030014]/60 rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 mb-3">
                                <Terminal className="w-4 h-4 text-cyan-neon" />
                                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                    developer.log
                                </span>
                            </div>
                            <div className="font-mono text-xs space-y-1 text-left">
                                <p className="text-muted-foreground">
                                    <span className="text-cyan-neon">{">"}</span> So for now, go explore the rest.
                                </p>
                                <p className="text-muted-foreground">
                                    <span className="text-cyan-neon">{">"}</span> Read the{" "}
                                    <a href="/blog" className="text-primary hover:text-cyan-neon transition-colors underline decoration-primary/30 underline-offset-4 hover:decoration-cyan-neon">
                                        blog
                                    </a>
                                    , check out the{" "}
                                    <a href="/" className="text-primary hover:text-cyan-neon transition-colors underline decoration-primary/30 underline-offset-4 hover:decoration-cyan-neon">
                                        portal
                                    </a>
                                    .
                                </p>
                                <p className="text-muted-foreground">
                                    <span className="text-cyan-neon">{">"}</span> Everything you need to know about me is{" "}
                                    <span className="text-foreground italic">already there</span>.
                                </p>
                                <p className="text-muted-foreground opacity-60 mt-2">
                                    <span className="text-primary">{">"}</span> ...or just stalk my socials. They're in the corners.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

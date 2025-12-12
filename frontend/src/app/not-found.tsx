'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-start justify-center px-4 mt-4 relative overflow-hidden">
            {/* Background grid effect */}
            <div className="absolute inset-0 footer-grid-pattern opacity-30" />

            <div className="relative z-10 text-center space-y-8 max-w-lg">
                {/* 404 */}
                <h1 className="font-heading text-[120px] md:text-[180px] font-bold text-primary/20 leading-none select-none">
                    404
                </h1>

                {/* Title */}
                <div className="space-y-2">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground tracking-wider uppercase">
                        Signal Lost
                    </h2>
                    <div className="h-[2px] w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
                </div>

                {/* Sarcastic message */}
                <div className="space-y-4">
                    <p className="text-muted-foreground">
                        The neural pathway you&apos;re trying to access doesn&apos;t exist in this dimension.
                    </p>
                    <p className="text-muted-foreground/70 text-sm italic">
                        &quot;Maybe it was deleted. Maybe it never existed. Maybe you typed something wrong. Who knows? Not me.&quot;
                    </p>
                </div>

                {/* Terminal hint */}
                <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4 font-mono text-sm text-left">
                    <p className="text-muted-foreground">
                        <span className="text-cyan-neon">$</span> searching for <span className="text-primary">requested_page</span>...
                    </p>
                    <p className="text-red-500 mt-1">
                        <span className="text-cyan-neon">$</span> error: path not found in the matrix
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 border border-primary/50 rounded-lg text-primary hover:bg-primary/20 hover:border-primary transition-all duration-300 font-mono text-sm uppercase tracking-wider"
                    >
                        <Home className="w-4 h-4" />
                        <span>Return to Portal</span>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-neon/10 border border-cyan-neon/50 rounded-lg text-cyan-neon hover:bg-cyan-neon/20 hover:border-cyan-neon transition-all duration-300 font-mono text-sm uppercase tracking-wider"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Go Back</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

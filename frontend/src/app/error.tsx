'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Terminal, AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [glitchText, setGlitchText] = useState('SYSTEM_FAILURE');

    useEffect(() => {
        console.error('[System Malfunction]', error);

        const glitchVariants = [
            'SY5T3M_F41LUR3',
            'SYST€M_FÅILUR€',
            'S¥ST3M_FA!LURE',
            'SYSTEM_FAILURE',
        ];

        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * glitchVariants.length);
            setGlitchText(glitchVariants[randomIndex]);
        }, 150);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            setGlitchText('SYSTEM_FAILURE');
        }, 2000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background grid effect */}
            <div className="absolute inset-0 footer-grid-pattern opacity-30" />

            {/* Scan line effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" />
            </div>

            <div className="relative z-10 text-center space-y-8 max-w-lg">
                {/* Glitchy error icon */}
                <div className="relative inline-block">
                    <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-red-500/50 bg-red-500/10">
                        <AlertTriangle className="w-12 h-12 text-red-500 glitch-icon" />
                    </div>
                    {/* Orbital ring */}
                    <div className="absolute inset-[-8px] rounded-full border border-dashed border-red-500/30 animate-spin" style={{ animationDuration: '8s' }} />
                </div>

                {/* Glitchy title */}
                <div className="space-y-2">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-red-500 tracking-wider">
                        {glitchText}
                    </h1>
                    <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                </div>

                {/* Terminal-style error message */}
                <div className="bg-card/80 backdrop-blur-sm border border-primary/30 rounded-lg p-6 text-left font-mono text-sm">
                    <div className="flex items-center gap-2 text-primary mb-3">
                        <Terminal className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">error.log</span>
                    </div>

                    <div className="space-y-2 text-muted-foreground">
                        <p><span className="text-red-500">&gt;</span> Reality matrix destabilized</p>
                        <p><span className="text-red-500">&gt;</span> Neural pathways corrupted</p>
                        <p><span className="text-cyan-neon">&gt;</span> Attempting consciousness recovery...</p>
                        <p className="text-foreground/80 mt-4 border-l-2 border-primary/50 pl-3">
                            {error.message || 'An unexpected glitch in the matrix occurred.'}
                        </p>
                    </div>
                </div>

                {/* Message */}
                <p className="text-muted-foreground text-sm italic">
                    &quot;Well, this is awkward. Something broke and honestly, we have no idea what happened either.&quot;
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 border border-primary/50 rounded-lg text-primary hover:bg-primary/20 hover:border-primary transition-all duration-300 font-mono text-sm uppercase tracking-wider"
                    >
                        <RefreshCw className="w-4 h-4 group-hover:animate-spin" />
                        <span>Reboot System</span>
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-neon/10 border border-cyan-neon/50 rounded-lg text-cyan-neon hover:bg-cyan-neon/20 hover:border-cyan-neon transition-all duration-300 font-mono text-sm uppercase tracking-wider"
                    >
                        <Home className="w-4 h-4" />
                        <span>Return to Portal</span>
                    </Link>
                </div>

            </div>
        </div>
    );
}

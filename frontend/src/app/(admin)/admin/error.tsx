'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RefreshCw, LayoutDashboard } from 'lucide-react';
import { CyberButton } from '@/components/ui/cyber/CyberButton';

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to console (future: send to Serilog endpoint)
        console.error('[Admin Module Error]', {
            message: error.message,
            digest: error.digest,
            timestamp: new Date().toISOString(),
        });
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-8">
            <div className="max-w-md w-full space-y-6 text-center">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-red-500/50 bg-red-500/10 flex items-center justify-center">
                        <AlertOctagon className="w-8 h-8 text-red-500" />
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <h2 className="font-mono text-xl text-red-400 tracking-wider">
                        MODULE_OFFLINE
                    </h2>
                    <div className="h-[1px] w-24 mx-auto bg-red-500/30" />
                </div>

                {/* Error Message */}
                <div className="bg-black/40 border border-white/10 rounded-lg p-4 text-left font-mono text-xs">
                    <p className="text-muted-foreground mb-2">
                        <span className="text-red-400">&gt;</span> Error: {error.message || 'An unexpected error occurred'}
                    </p>
                    {error.digest && (
                        <p className="text-muted-foreground/60">
                            <span className="text-cyan-neon/60">&gt;</span> Digest: {error.digest}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <CyberButton
                        variant="danger"
                        size="sm"
                        onClick={() => reset()}
                    >
                        <RefreshCw size={14} />
                        RETRY
                    </CyberButton>

                    <Link href="/admin">
                        <CyberButton variant="ghost" size="sm">
                            <LayoutDashboard size={14} />
                            DASHBOARD
                        </CyberButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}

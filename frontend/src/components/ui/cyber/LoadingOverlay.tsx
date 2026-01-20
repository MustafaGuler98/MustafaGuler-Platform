'use client';

import { RefreshCw } from 'lucide-react';

interface LoadingOverlayProps {
    isVisible: boolean;
    message?: string;
}

export function LoadingOverlay({
    isVisible,
    message = 'Loading...',
}: LoadingOverlayProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-black border border-cyan-500/50 p-4 rounded flex items-center gap-3">
                <RefreshCw className="animate-spin text-cyan-neon" size={20} />
                <span className="font-mono text-sm text-cyan-neon">{message}</span>
            </div>
        </div>
    );
}

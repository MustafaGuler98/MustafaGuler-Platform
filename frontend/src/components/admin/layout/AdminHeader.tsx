'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function AdminHeader() {
    const pathname = usePathname();
    const { user } = useAuth();

    // Get username from email
    const username = user?.email?.split('@')[0] || 'User';

    return (
        <header className="h-16 bg-[#0a0118]/80 border-b border-primary/40 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center justify-between px-6 h-full">
                {/* Welcome Message */}
                <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <span>Welcome,</span>
                    <span className="text-cyan-neon font-bold tracking-wide">
                        {user?.email || '...'}
                    </span>
                    <span className="text-primary/80">!</span>
                    <span className="text-xs text-muted-foreground/60 ml-1">
                        ({user?.role || 'Guest'})
                    </span>
                </div>

                {/* Portal Link + Status */}
                <div className="flex items-center gap-6">
                    {/* Portal Link */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-1.5 rounded border border-primary/30 text-muted-foreground hover:border-cyan-neon/50 hover:text-cyan-neon transition-all duration-300 font-mono text-[10px] tracking-widest uppercase"
                    >
                        <ExternalLink size={12} />
                        PORTAL
                    </Link>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-neon animate-pulse" />
                        <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
                            ONLINE
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}

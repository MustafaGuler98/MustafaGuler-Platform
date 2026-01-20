'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ExternalLink, ArrowUpRight, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AdminHeader() {
    const { user } = useAuth();
    const [dateTime, setDateTime] = useState<{ date: string; time: string }>({ date: '', time: '' });

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setDateTime({
                date: now.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }),
                time: now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })
            });
        };
        updateDateTime();
        const interval = setInterval(updateDateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="h-14 bg-slate-900/60 border-b border-white/10 sticky top-0 z-30 backdrop-blur-sm">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Left: Date & Time */}
                <div className="flex items-center gap-3 text-sm" suppressHydrationWarning>
                    <span className="text-slate-300" suppressHydrationWarning>{dateTime.date || '...'}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400" suppressHydrationWarning>{dateTime.time || '--:--'}</span>
                </div>

                {/* Right: User + Portal Link */}
                <div className="flex items-center gap-6">
                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-4 border-l border-white/10" suppressHydrationWarning>
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-white font-medium leading-none mb-1" suppressHydrationWarning>
                                {user?.email?.split('@')[0] || '...'}
                            </p>
                            <p className="text-[10px] text-violet-400 font-mono tracking-wider leading-none uppercase">
                                ADMINISTRATOR
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center shadow-lg shadow-black/20">
                            <span className="text-sm text-violet-300 font-bold uppercase" suppressHydrationWarning>
                                {user?.email?.[0] || 'A'}
                            </span>
                        </div>
                    </div>

                    <div className="w-px h-6 bg-white/10" />

                    {/* Portal Link: Cyan Text Accent */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-700 text-cyan-500/80 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-950/50 rounded text-xs font-mono transition-all group"
                        title="Portal Link"
                    >
                        <Globe size={12} className="text-cyan-500/80 group-hover:text-cyan-400 transition-colors" />
                        <span>mustafaguler.com</span>
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </Link>
                </div>
            </div>
        </header>
    );
}

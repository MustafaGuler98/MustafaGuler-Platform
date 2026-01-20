
import Link from 'next/link';
import { Archive, Film, BookOpen, Quote as QuoteIcon, Gamepad2, Music as MusicIcon, Dice6, ArrowRight, Star, Tv, MonitorPlay } from 'lucide-react';
import { archivesStatsService } from '@/services/admin/archivesAdminService';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberCard } from '@/components/ui/cyber/CyberCard';
import { Skeleton } from '@/components/ui/cyber/Skeleton';
import type { ArchivesStats } from '@/types/archives';
import { RefreshStatsButton } from '@/components/admin/RefreshStatsButton';

export default async function ArchivesPage() {
    const stats = await archivesStatsService.getStats();
    const s = stats?.data;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                        ARCHIVES_CONTROL
                    </h1>
                    <p className="text-slate-500 text-xs font-mono mt-1">
                        PERSONAL_MEDIA_DATABASE
                    </p>
                </div>
                <div className="flex gap-2">
                    <RefreshStatsButton />
                </div>
            </div>

            {/* Error handling */}
            {!s && (
                <div className="p-4 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
                    ERROR: FAILED_TO_RETRIEVE_STATS_DATA
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ArchiveStatCard icon={Film} label="MOVIES" count={s?.movieCount} href="/admin/archives/movies" />
                <ArchiveStatCard icon={BookOpen} label="BOOKS" count={s?.bookCount} href="/admin/archives/books" />
                <ArchiveStatCard icon={QuoteIcon} label="QUOTES" count={s?.quoteCount} href="/admin/archives/quotes" />
                <ArchiveStatCard icon={Tv} label="TV_SERIES" count={s?.tvSeriesCount} href="/admin/archives/tvseries" />
                <ArchiveStatCard icon={MonitorPlay} label="ANIME" count={s?.animeCount} href="/admin/archives/anime" />
                <ArchiveStatCard icon={Gamepad2} label="GAMES" count={s?.gameCount} href="/admin/archives/games" />
                <ArchiveStatCard icon={MusicIcon} label="MUSIC" count={s?.musicCount} href="/admin/archives/music" />
                <ArchiveStatCard icon={Dice6} label="TTRPG" count={s?.ttrpgCount} href="/admin/archives/ttrpg" />
            </div>

            {/* Quick Actions */}
            <CyberCard
                title="QUICK_CREATE"
                className="hover:bg-slate-900/40"
            >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <QuickAction href="/admin/archives/movies/new" icon={Film} label="MOVIE" />
                    <QuickAction href="/admin/archives/books/new" icon={BookOpen} label="BOOK" />
                    <QuickAction href="/admin/archives/quotes/new" icon={QuoteIcon} label="QUOTE" />
                    <QuickAction href="/admin/archives/tvseries/new" icon={Tv} label="TV SERIES" />
                    <QuickAction href="/admin/archives/anime/new" icon={MonitorPlay} label="ANIME" />
                    <QuickAction href="/admin/archives/games/new" icon={Gamepad2} label="GAME" />
                    <QuickAction href="/admin/archives/music/new" icon={MusicIcon} label="MUSIC" />
                    <QuickAction href="/admin/archives/ttrpg/new" icon={Dice6} label="TTRPG" />
                </div>
            </CyberCard>
        </div>
    );
}

function ArchiveStatCard({ icon: Icon, label, count, href }: { icon: any, label: string, count?: number, href: string }) {
    return (
        <Link href={href}>
            <CyberCard className="p-3 bg-slate-900/40 border-white/5 hover:border-violet-500/30 transition-all group h-full" noPadding>
                <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded bg-white/5 border border-white/10 group-hover:border-violet-500/30 transition-colors`}>
                            <Icon size={14} className="text-violet-400" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-slate-200">
                                {count ?? <Skeleton className="w-6 h-6" />}
                            </div>
                            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest group-hover:text-violet-400/80 transition-colors">
                                {label}
                            </div>
                        </div>
                    </div>
                </div>
            </CyberCard>
        </Link>
    );
}

function QuickAction({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
    return (
        <Link href={href}>
            <CyberButton variant="outline" className="w-full h-auto py-3 flex gap-2 items-center justify-center border-dashed hover:border-solid hover:border-violet-500/50 hover:bg-violet-500/5">
                <Icon size={14} className="text-violet-400/70" />
                <span className="text-[10px] font-mono tracking-wider">{label}</span>
            </CyberButton>
        </Link>
    );
}

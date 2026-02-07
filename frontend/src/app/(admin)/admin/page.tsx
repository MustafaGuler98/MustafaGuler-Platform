'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import Link from 'next/link';
import { FileText, FolderTree, Image, Plus, Clock, Edit, Upload, Activity, ShieldCheck, Zap, Film, BookOpen, Quote as QuoteIcon, Tv, MonitorPlay, Gamepad2, Music as MusicIcon, Dice6 } from 'lucide-react';
import { formatTerminalDateTime } from '@/lib/date-utils';
import { CyberButton } from "@/components/ui/cyber/CyberButton";
import { CyberCard } from "@/components/ui/cyber/CyberCard";
import { Skeleton } from "@/components/ui/cyber/Skeleton";
import { RefreshHomepageButton } from '@/components/admin/RefreshHomepageButton';
import { articleAdminService, categoryAdminService, imageAdminService, archivesStatsService } from '@/services/admin';
import type { AdminArticle, Category, ImageInfo } from '@/types/admin';
import type { ArchivesStats } from '@/types/archives';

interface Stats {
    articles: number;
    categories: number;
    images: number;
}

async function fetchStats(): Promise<Stats> {
    const [articlesRes, categoriesRes, imagesRes] = await Promise.all([
        articleAdminService.getPaged(1, 1),
        categoryAdminService.getAll(),
        imageAdminService.getPaged(1, 1),
    ]);

    return {
        articles: articlesRes.data?.totalCount || 0,
        categories: (categoriesRes.data as Category[])?.length || 0,
        images: imagesRes.data?.totalCount || 0,
    };
}

async function fetchArchiveStats(): Promise<ArchivesStats | null> {
    const response = await archivesStatsService.getStats();
    return response.data || null;
}

async function fetchRecentArticles(): Promise<AdminArticle[]> {
    const response = await articleAdminService.getPaged(1, 5);
    if (!response.isSuccess) return [];
    return response.data?.items || [];
}

async function fetchRecentImages(): Promise<ImageInfo[]> {
    const response = await imageAdminService.getPaged(1, 5);
    if (!response.isSuccess) return [];
    return response.data?.items || [];
}

export default function AdminDashboard() {
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: fetchStats,
    });

    const { data: archiveStats, isLoading: archiveStatsLoading } = useQuery({
        queryKey: ['admin-archive-stats'],
        queryFn: fetchArchiveStats,
    });

    const { data: recentArticles } = useQuery({
        queryKey: ['recent-articles'],
        queryFn: fetchRecentArticles,
    });

    const { data: recentImages } = useQuery({
        queryKey: ['recent-images'],
        queryFn: fetchRecentImages,
    });

    // Merge and sort recent activity
    const recentActivity = useMemo(
        () =>
            [
                ...(recentArticles || []).map((a) => ({
                    type: 'article' as const,
                    id: a.id,
                    title: a.title,
                    date: a.createdDate,
                    action: 'EDIT DATA',
                    icon: Edit
                })),
                ...(recentImages || []).map((i) => ({
                    type: 'image' as const,
                    id: i.id,
                    title: i.fileName,
                    date: i.createdDate,
                    action: 'UPLOADED',
                    icon: Upload
                })),
            ]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10),
        [recentArticles, recentImages]
    );

    return (
        <div className="space-y-8">
            {/* Header / System Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                        COMMAND CENTER
                    </h1>
                    <p className="text-slate-500 text-xs font-mono mt-1">
                        SYSTEM_STATUS: <span className="text-emerald-400">ONLINE</span>
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    <RefreshHomepageButton />
                    <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded text-[10px] font-mono text-violet-300 flex items-center gap-2">
                        <ShieldCheck size={12} /> ADMIN_ACCESS
                    </span>
                    <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-[10px] font-mono text-indigo-300 flex items-center gap-2">
                        <Zap size={12} /> VERSION 1.0
                    </span>
                </div>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CyberCard className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FileText size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-violet-500/10 rounded border border-violet-500/20">
                                <FileText size={18} className="text-violet-400" />
                            </div>
                            <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
                                TOTAL_ARTICLES
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-200 mt-2">
                            {statsLoading ? <Skeleton className="w-16 h-8" /> : stats?.articles || 0}
                        </div>
                    </div>
                </CyberCard>

                <CyberCard className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FolderTree size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                                <FolderTree size={18} className="text-purple-400" />
                            </div>
                            <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
                                CATEGORIES
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-200 mt-2">
                            {statsLoading ? <Skeleton className="w-16 h-8" /> : stats?.categories || 0}
                        </div>
                    </div>
                </CyberCard>

                <CyberCard className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Image size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-500/10 rounded border border-indigo-500/20">
                                <Image size={18} className="text-indigo-400" />
                            </div>
                            <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
                                MEDIA_ASSETS
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-200 mt-2">
                            {statsLoading ? <Skeleton className="w-16 h-8" /> : stats?.images || 0}
                        </div>
                    </div>
                </CyberCard>
            </div>

            {/* Archive Breakdown Stats */}
            <div>
                <h2 className="font-mono text-xs text-violet-400 tracking-widest mb-4 flex items-center gap-2">
                    DATA
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ArchiveStatCard icon={Film} label="MOVIES" count={archiveStats?.movieCount} loading={archiveStatsLoading} color="text-violet-400" />
                    <ArchiveStatCard icon={BookOpen} label="BOOKS" count={archiveStats?.bookCount} loading={archiveStatsLoading} color="text-violet-400" />
                    <ArchiveStatCard icon={QuoteIcon} label="QUOTES" count={archiveStats?.quoteCount} loading={archiveStatsLoading} color="text-violet-400" />
                    <ArchiveStatCard icon={Tv} label="TV_SERIES" count={archiveStats?.tvSeriesCount} loading={archiveStatsLoading} color="text-violet-400" />
                    <ArchiveStatCard icon={MonitorPlay} label="ANIME" count={archiveStats?.animeCount} loading={archiveStatsLoading} color="text-violet-400" />
                    <ArchiveStatCard icon={Gamepad2} label="GAMES" count={archiveStats?.gameCount} loading={archiveStatsLoading} color="text-violet-400" />
                    <ArchiveStatCard icon={MusicIcon} label="MUSIC" count={archiveStats?.musicCount} loading={archiveStatsLoading} color="text-violet-400" />
                    <ArchiveStatCard icon={Dice6} label="TTRPG" count={archiveStats?.ttrpgCount} loading={archiveStatsLoading} color="text-violet-400" />
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Recent Activity Feed  */}
                <div className="lg:col-span-2">
                    {/*
                        CyberCard default has hover:bg-slate-900/60.
                    */}
                    <CyberCard
                        title="SYSTEM_LOGS"
                        icon={Clock}
                        className="h-full hover:bg-slate-900/40 hover:shadow-none hover:border-white/5"
                    >
                        {recentActivity.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                <Clock size={32} className="mb-4 opacity-50" />
                                <p className="font-mono text-xs">NO_ACTIVITY_DETECTED</p>
                            </div>
                        ) : (
                            <div className="space-y-2"> { }
                                {recentActivity.map((item, i) => (
                                    <Link
                                        key={`${item.type}-${item.id}`}
                                        href={item.type === 'article' ? `/admin/articles/${item.id}` : '/admin/images'}
                                        className="block group"
                                    >
                                        <div className="flex items-center justify-between p-2 rounded hover:bg-violet-500/5 hover:border-violet-500/20 border border-transparent transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center border border-white/10 group-hover:border-violet-500/40 transition-colors">
                                                    <item.icon size={12} className="text-slate-400 group-hover:text-violet-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-300 font-medium group-hover:text-violet-200 transition-colors line-clamp-1">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-[9px] text-slate-500 font-mono">
                                                        {item.action} | ID: {item.id.substring(0, 8)}...
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[9px] font-mono text-slate-500 group-hover:text-violet-400/70 transition-colors">
                                                    {formatTerminalDateTime(item.date)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CyberCard>
                </div>

                {/* Right: Actions & Tools  */}
                <div className="space-y-6">
                    <CyberCard title="QUICK_EXECUTE" icon={Zap}>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/admin/articles/new">
                                <CyberButton variant="outline" className="w-full h-24 flex flex-col gap-2 items-center justify-center border-dashed hover:border-solid hover:border-violet-500/50 hover:bg-violet-500/5">
                                    <Plus size={20} className="text-violet-400" />
                                    <span className="text-[10px] font-mono tracking-wider">NEW_ARTICLE</span>
                                </CyberButton>
                            </Link>

                            <Link href="/admin/images/upload">
                                <CyberButton variant="outline" className="w-full h-24 flex flex-col gap-2 items-center justify-center border-dashed hover:border-solid hover:border-indigo-500/50 hover:bg-indigo-500/5">
                                    <Upload size={20} className="text-indigo-400" />
                                    <span className="text-[10px] font-mono tracking-wider">UPLOAD_MEDIA</span>
                                </CyberButton>
                            </Link>

                            <Link href="/admin/categories/new">
                                <CyberButton variant="outline" className="w-full h-24 flex flex-col gap-2 items-center justify-center border-dashed hover:border-solid hover:border-purple-500/50 hover:bg-purple-500/5">
                                    <FolderTree size={20} className="text-purple-400" />
                                    <span className="text-[10px] font-mono tracking-wider">ADD_CATEGORY</span>
                                </CyberButton>
                            </Link>
                        </div>
                    </CyberCard>
                </div>
            </div>
        </div>
    );
}

function ArchiveStatCard({ icon: Icon, label, count, loading, color = "text-violet-400" }: any) {
    return (
        <CyberCard className="p-3 bg-slate-900/40 border-white/5 hover:border-violet-500/30 transition-all group" noPadding>
            <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded bg-white/5 border border-white/10 group-hover:border-violet-500/30 transition-colors`}>
                        <Icon size={14} className={color} />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-200">
                            {loading ? <Skeleton className="w-8 h-6" /> : count || 0}
                        </div>
                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest group-hover:text-violet-400/80 transition-colors">
                            {label}
                        </div>
                    </div>
                </div>
            </div>
        </CyberCard>
    );
}

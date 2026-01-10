'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import Link from 'next/link';
import { FileText, FolderTree, Image, Plus, Clock, Edit, Upload } from 'lucide-react';
import { formatTerminalDateTime } from '@/lib/date-utils';
import { Skeleton } from '@/components/admin/ui/Skeleton';
import { articleAdminService, categoryAdminService, imageAdminService } from '@/services/admin';
import type { AdminArticle, Category, ImageInfo, PagedResult } from '@/types/admin';

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
        articles: articlesRes.totalCount || 0,
        categories: (categoriesRes.data as Category[])?.length || 0,
        images: imagesRes.totalCount || 0,
    };
}

async function fetchRecentArticles(): Promise<AdminArticle[]> {
    const response = await articleAdminService.getPaged(1, 5);
    if (!response.isSuccess) return [];
    return response.data || [];
}

async function fetchRecentImages(): Promise<ImageInfo[]> {
    const response = await imageAdminService.getPaged(1, 5);
    if (!response.isSuccess) return [];
    return response.data || [];
}

export default function AdminDashboard() {
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: fetchStats,
    });

    const { data: recentArticles } = useQuery({
        queryKey: ['recent-articles'],
        queryFn: fetchRecentArticles,
    });

    const { data: recentImages } = useQuery({
        queryKey: ['recent-images'],
        queryFn: fetchRecentImages,
    });

    // Merge and sort recent activity (memoized for performance)
    const recentActivity = useMemo(
        () =>
            [
                ...(recentArticles || []).map((a) => ({
                    type: 'article' as const,
                    id: a.id,
                    title: a.title,
                    date: a.createdDate,
                })),
                ...(recentImages || []).map((i) => ({
                    type: 'image' as const,
                    id: i.id,
                    title: i.fileName,
                    date: i.createdDate,
                })),
            ]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 8),
        [recentArticles, recentImages]
    );

    return (
        <div className="space-y-6">
            {/* HUD Stats Strip */}
            <div className="flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-black/20 border border-white/5 rounded-lg">
                <div className="flex items-center gap-8">
                    {/* Articles */}
                    <div className="flex items-center gap-3">
                        <FileText size={16} className="text-cyan-neon" />
                        <div>
                            <span className="font-mono text-lg font-bold text-cyan-neon">
                                {statsLoading ? <Skeleton className="w-8 h-5" /> : stats?.articles || 0}
                            </span>
                            <span className="ml-2 font-mono text-[10px] text-muted-foreground tracking-widest">
                                ARTICLES
                            </span>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-white/10" />

                    {/* Categories */}
                    <div className="flex items-center gap-3">
                        <FolderTree size={16} className="text-primary" />
                        <div>
                            <span className="font-mono text-lg font-bold text-primary">
                                {statsLoading ? <Skeleton className="w-8 h-5" /> : stats?.categories || 0}
                            </span>
                            <span className="ml-2 font-mono text-[10px] text-muted-foreground tracking-widest">
                                CATEGORIES
                            </span>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-white/10" />

                    {/* Images */}
                    <div className="flex items-center gap-3">
                        <Image size={16} className="text-secondary" />
                        <div>
                            <span className="font-mono text-lg font-bold text-secondary">
                                {statsLoading ? <Skeleton className="w-8 h-5" /> : stats?.images || 0}
                            </span>
                            <span className="ml-2 font-mono text-[10px] text-muted-foreground tracking-widest">
                                MEDIA_FILES
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: 2/3 + 1/3 Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Recent Activity (2/3) */}
                <div className="lg:col-span-2 backdrop-blur-sm bg-black/10 border border-white/5 rounded-lg p-5">
                    <h2 className="font-mono text-xs text-primary tracking-widest mb-4 flex items-center gap-2">
                        <Clock size={12} />
                        RECENT_ACTIVITY
                    </h2>

                    {recentActivity.length === 0 ? (
                        <p className="font-mono text-xs text-muted-foreground/50 py-8 text-center">
                            No recent activity found...
                        </p>
                    ) : (
                        <div className="space-y-1">
                            {recentActivity.map((item) => (
                                <Link
                                    key={`${item.type}-${item.id}`}
                                    href={
                                        item.type === 'article'
                                            ? `/admin/articles/${item.id}`
                                            : '/admin/images'
                                    }
                                    className="flex items-center gap-3 px-3 py-2 rounded border border-transparent hover:border-cyan-neon/20 hover:bg-cyan-neon/5 transition-all group"
                                >
                                    <span className="font-mono text-[10px] text-muted-foreground/60">
                                        {formatTerminalDateTime(item.date)}
                                    </span>
                                    {item.type === 'article' ? (
                                        <Edit size={12} className="text-cyan-neon/60" />
                                    ) : (
                                        <Upload size={12} className="text-secondary/60" />
                                    )}
                                    <span className="font-mono text-sm text-foreground/80 group-hover:text-cyan-neon transition-colors truncate">
                                        {item.title}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Quick Actions (1/3) */}
                <div className="backdrop-blur-sm bg-black/10 border border-white/5 rounded-lg p-5">
                    <h2 className="font-mono text-xs text-primary tracking-widest mb-4">
                        QUICK_ACTIONS
                    </h2>

                    <div className="space-y-2">
                        <Link
                            href="/admin/articles/new"
                            className="flex items-center gap-3 px-4 py-3 rounded border border-white/10 hover:border-cyan-neon/30 hover:bg-cyan-neon/5 transition-all group"
                        >
                            <Plus
                                size={14}
                                className="text-muted-foreground group-hover:text-cyan-neon transition-colors"
                            />
                            <span className="font-mono text-xs text-muted-foreground tracking-wider group-hover:text-cyan-neon transition-colors">
                                NEW_ARTICLE
                            </span>
                        </Link>

                        <Link
                            href="/admin/images/upload"
                            className="flex items-center gap-3 px-4 py-3 rounded border border-white/10 hover:border-cyan-neon/30 hover:bg-cyan-neon/5 transition-all group"
                        >
                            <Plus
                                size={14}
                                className="text-muted-foreground group-hover:text-cyan-neon transition-colors"
                            />
                            <span className="font-mono text-xs text-muted-foreground tracking-wider group-hover:text-cyan-neon transition-colors">
                                UPLOAD_MEDIA
                            </span>
                        </Link>

                        <Link
                            href="/admin/categories/new"
                            className="flex items-center gap-3 px-4 py-3 rounded border border-white/10 hover:border-cyan-neon/30 hover:bg-cyan-neon/5 transition-all group"
                        >
                            <Plus
                                size={14}
                                className="text-muted-foreground group-hover:text-cyan-neon transition-colors"
                            />
                            <span className="font-mono text-xs text-muted-foreground tracking-wider group-hover:text-cyan-neon transition-colors">
                                ADD_CATEGORY
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

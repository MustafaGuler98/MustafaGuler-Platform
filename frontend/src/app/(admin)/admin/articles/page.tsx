'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    FileText,
    ExternalLink,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import { articleAdminService } from '@/services/admin';
import { useDebounce } from '@/hooks/useDebounce';
import { ErrorMessage } from '@/components/admin/layout';
import { CyberButton } from '@/components/admin/ui/CyberButton';
import { CyberTable } from '@/components/admin/ui/CyberTable';
import { SearchInput } from '@/components/admin/ui/SearchInput';
import { formatTerminalDate } from '@/lib/date-utils';
import type { AdminArticle, PagedResult, SortConfig } from '@/types/admin';

export default function ArticlesPage() {
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'createdDate',
        direction: 'desc',
    });

    const debouncedSearch = useDebounce(searchTerm, 500);

    // Reset page when search changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['articles', page, pageSize, debouncedSearch, sortConfig],
        queryFn: async () => {
            const response = await articleAdminService.getPaged(
                page,
                pageSize,
                debouncedSearch,
                sortConfig.key,
                sortConfig.direction
            );
            if (!response.isSuccess) {
                throw new Error(response.message || 'Failed to fetch articles');
            }
            return {
                items: response.data,
                totalPages: response.totalPages ?? 1,
            };
        },
    });

    const articles = data?.items ?? [];
    const totalPages = data?.totalPages ?? 1;

    const handleSort = useCallback((key: string) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
        }));
        setPage(1);
    }, []);

    const SortIndicator = ({ columnKey }: { columnKey: string }) => {
        if (sortConfig.key !== columnKey) return null;
        return sortConfig.direction === 'asc' ? (
            <ArrowUp size={12} className="inline text-cyan-neon" />
        ) : (
            <ArrowDown size={12} className="inline text-cyan-neon" />
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded border border-primary/30 flex items-center justify-center">
                        <FileText size={18} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="font-mono text-lg text-foreground tracking-wide">
                            ARTICLES
                        </h1>
                        <p className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">
                            MANAGE_BLOG_CONTENT
                        </p>
                    </div>
                </div>
                <Link href="/admin/articles/new">
                    <CyberButton variant="primary" size="sm">
                        <Plus size={12} />
                        NEW
                    </CyberButton>
                </Link>
            </div>

            <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm('')}
                placeholder="SEARCH"
            />

            <ErrorMessage error={error} customMessage="FAILED_TO_LOAD_ARTICLES" />

            <div className="backdrop-blur-sm bg-black/20 border border-white/5 rounded-lg overflow-hidden">
                <CyberTable
                    columns={[
                        {
                            key: 'title',
                            label: (
                                <button
                                    onClick={() => handleSort('title')}
                                    className="flex items-center gap-1 hover:text-cyan-neon transition-colors"
                                >
                                    Title <SortIndicator columnKey="title" />
                                </button>
                            ),
                            render: (row) => (
                                <div className="flex items-center gap-2 group/title">
                                    <span className="text-foreground">{row.title}</span>
                                    <Link
                                        href={`/blog/${row.slug}`}
                                        target="_blank"
                                        onClick={(e) => e.stopPropagation()}
                                        className="opacity-0 group-hover:opacity-100 text-cyan-neon hover:text-white transition-all p-1.5 hover:bg-white/5 rounded-full"
                                        title="Open in Blog"
                                    >
                                        <ExternalLink size={16} />
                                    </Link>
                                </div>
                            ),
                        },
                        {
                            key: 'categoryName',
                            label: (
                                <button
                                    onClick={() => handleSort('category')}
                                    className="flex items-center gap-1 hover:text-cyan-neon transition-colors"
                                >
                                    Category <SortIndicator columnKey="category" />
                                </button>
                            ),
                            render: (row) => (
                                <span className="text-yellow-500 text-xs">{row.categoryName}</span>
                            ),
                        },
                        {
                            key: 'languageCode',
                            label: (
                                <button
                                    onClick={() => handleSort('language')}
                                    className="flex items-center gap-1 hover:text-cyan-neon transition-colors"
                                >
                                    Lang <SortIndicator columnKey="language" />
                                </button>
                            ),
                            render: (row) => (
                                <span className="text-muted-foreground/50 uppercase">{row.languageCode}</span>
                            ),
                        },
                        {
                            key: 'createdDate',
                            label: (
                                <button
                                    onClick={() => handleSort('createdDate')}
                                    className="flex items-center gap-1 hover:text-cyan-neon transition-colors"
                                >
                                    Date <SortIndicator columnKey="createdDate" />
                                </button>
                            ),
                            render: (row) => (
                                <span className="text-muted-foreground/70 text-xs">
                                    {formatTerminalDate(row.createdDate)}
                                </span>
                            ),
                        },
                    ]}
                    data={articles}
                    isLoading={isLoading}
                    emptyMessage={debouncedSearch ? 'NO_RESULTS_FOUND' : 'NO_ARTICLES_FOUND'}
                    onRowClick={(row) => (window.location.href = `/admin/articles/${row.id}`)}
                    actions={(row) => (
                        <Link href={`/admin/articles/${row.id}`}>
                            <CyberButton
                                variant="primary"
                                size="sm"
                                className="!border-none !bg-transparent text-cyan-neon hover:text-white shadow-none hover:shadow-none p-0"
                            >
                                START_EDIT
                            </CyberButton>
                        </Link>
                    )}
                />

                {/* Pagination  */}
                {!isLoading && articles.length > 0 && (
                    <div className="flex items-center justify-center gap-6 py-4 border-t border-white/5">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="p-2 font-mono text-xs text-muted-foreground hover:text-cyan-neon disabled:opacity-30 disabled:cursor-default transition-colors hover:bg-white/5 rounded"
                        >
                            <ChevronLeft size={16} className="inline" />
                        </button>

                        <span className="font-mono text-xs tracking-widest">
                            <span className="text-cyan-neon">{page}</span>
                            <span className="text-muted-foreground"> / {totalPages}</span>
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="p-2 font-mono text-xs text-muted-foreground hover:text-cyan-neon disabled:opacity-30 disabled:cursor-default transition-colors hover:bg-white/5 rounded"
                        >
                            <ChevronRight size={16} className="inline" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

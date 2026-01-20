'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FileText, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { articleAdminService } from '@/services/admin';
import { useDebounce } from '@/hooks/useDebounce';
import { ErrorMessage } from '@/components/admin/layout';
import { AdminListHeader } from '@/components/admin/ui/AdminListHeader';
import { CyberTable } from '@/components/ui/cyber/CyberTable';
import { CyberSearchInput } from '@/components/ui/cyber/CyberSearchInput';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberNewButton } from '@/components/ui/cyber/CyberNewButton';
import { CyberActionLink } from '@/components/ui/cyber/CyberActionLink';
import { CyberBadge } from '@/components/ui/cyber/CyberBadge';
import { CyberPagination } from '@/components/ui/cyber/CyberPagination';
import { formatTerminalDate } from '@/lib/date-utils';
import type { SortConfig } from '@/types/admin';
import { useRouter } from 'next/navigation';

export default function ArticlesPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'createdDate',
        direction: 'desc',
    });

    const debouncedSearch = useDebounce(searchTerm, 500);

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
            if (!response.isSuccess || !response.data) {
                throw new Error(response.message || 'Failed to fetch articles');
            }
            return response.data;
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
            <ArrowUp size={12} className="inline text-violet-400" />
        ) : (
            <ArrowDown size={12} className="inline text-violet-400" />
        );
    };

    return (
        <div className="space-y-6">
            <AdminListHeader
                title="ARTICLES"
                subtitle="MANAGE_BLOG_CONTENT"
                icon={<FileText size={18} className="text-violet-400" />}
                actionButton={<CyberNewButton href="/admin/articles/new" />}
            />

            <CyberSearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm('')}
                placeholder="SEARCH"
            />

            <ErrorMessage error={error} customMessage="FAILED_TO_LOAD_ARTICLES" />

            <div className="bg-slate-900/40 border border-white/5 rounded-lg overflow-hidden">
                <CyberTable
                    columns={[
                        {
                            key: 'title',
                            label: (
                                <button
                                    onClick={() => handleSort('title')}
                                    className="flex items-center gap-1 hover:text-violet-300 transition-colors"
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
                                        className="opacity-0 group-hover:opacity-100 text-violet-400 hover:text-white transition-all p-1.5 hover:bg-white/5 rounded-full"
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
                                    className="flex items-center gap-1 hover:text-violet-300 transition-colors"
                                >
                                    Category <SortIndicator columnKey="category" />
                                </button>
                            ),
                            render: (row) => (
                                <span className="text-violet-300 text-xs">{row.categoryName}</span>
                            ),
                        },
                        {
                            key: 'languageCode',
                            label: (
                                <button
                                    onClick={() => handleSort('language')}
                                    className="flex items-center gap-1 hover:text-violet-300 transition-colors"
                                >
                                    Lang <SortIndicator columnKey="language" />
                                </button>
                            ),
                            render: (row) => (
                                <span className="text-slate-500 uppercase">{row.languageCode}</span>
                            ),
                        },
                        {
                            key: 'createdDate',
                            label: (
                                <button
                                    onClick={() => handleSort('createdDate')}
                                    className="flex items-center gap-1 hover:text-violet-300 transition-colors"
                                >
                                    Date <SortIndicator columnKey="createdDate" />
                                </button>
                            ),
                            render: (row) => (
                                <span className="text-slate-500 text-xs">
                                    {formatTerminalDate(row.createdDate)}
                                </span>
                            ),
                        },
                    ]}
                    data={articles}
                    isLoading={isLoading}
                    emptyMessage={debouncedSearch ? 'NO_RESULTS_FOUND' : 'NO_ARTICLES_FOUND'}
                    onRowClick={(row) => router.push(`/admin/articles/${row.id}`)}
                    actions={(row) => (
                        <CyberActionLink href={`/admin/articles/${row.id}`}>
                            START_EDIT
                        </CyberActionLink>
                    )}
                />

                {!isLoading && articles.length > 0 && (
                    <div className="border-t border-white/5">
                        <CyberPagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

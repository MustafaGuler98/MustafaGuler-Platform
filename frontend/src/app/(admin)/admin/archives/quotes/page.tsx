'use client';

import { Quote as QuoteIcon } from 'lucide-react';
import { quoteAdminService } from '@/services/admin/archivesAdminService';
import { useResourcePagedList } from '@/hooks/admin/useResourcePagedList';
import { useDeleteResource } from '@/hooks/admin';
import { ArchiveListLayout, Column } from '@/components/admin/archives';
import type { Quote } from '@/types/archives';

const columns: Column<Quote>[] = [
    {
        key: 'content',
        label: 'Quote',
        render: (row) => (
            <span className="font-medium italic">
                &ldquo;{row.content.length > 80 ? row.content.substring(0, 80) + '...' : row.content}&rdquo;
            </span>
        )
    },
    {
        key: 'author',
        label: 'Author',
        render: (row) => <span className="text-cyan-neon">— {row.author}</span>
    },
    {
        key: 'source',
        label: 'Source',
        render: (row) => (
            <span className="text-muted-foreground/60 text-xs">
                {row.source || '-'}
            </span>
        )
    },
];

export default function QuotesPage() {
    const {
        items: data,
        page,
        setPage,
        totalPages,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        clearSearch
    } = useResourcePagedList<Quote>({
        serviceMethod: (page: number, pageSize: number, term?: string) => quoteAdminService.getPaged(page, pageSize, term),
        queryKey: 'archives-quotes'
    });

    const deleteMutation = useDeleteResource(
        'archives-quotes',
        (id) => quoteAdminService.delete(id)
    );

    return (
        <ArchiveListLayout
            title="QUOTES"
            icon={<QuoteIcon size={18} className="text-primary" />}
            newHref="/admin/archives/quotes/new"
            editHref={(id) => `/admin/archives/quotes/${id}`}
            data={data}
            columns={columns}
            isLoading={isLoading}
            error={error}
            deleteError={deleteMutation.error}
            emptyMessage="NO_QUOTES_FOUND"
            pagination={{
                currentPage: page,
                totalPages,
                onPageChange: setPage
            }}
            search={{
                searchTerm,
                onSearchChange: setSearchTerm,
                onClearSearch: clearSearch
            }}
        />
    );
}

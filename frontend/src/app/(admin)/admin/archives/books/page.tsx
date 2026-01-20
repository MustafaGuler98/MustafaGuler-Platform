'use client';

import { BookOpen } from 'lucide-react';
import { bookAdminService } from '@/services/admin/archivesAdminService';
import { useResourcePagedList } from '@/hooks/admin/useResourcePagedList';
import { useDeleteResource } from '@/hooks/admin';
import { ArchiveListLayout, Column } from '@/components/admin/archives';
import { CyberBadge } from '@/components/ui/cyber/CyberBadge';
import type { Book } from '@/types/archives';
import { readingStatusLabels } from '@/types/archives';

const columns: Column<Book>[] = [
    {
        key: 'title',
        label: 'Title',
        render: (row) => <span className="font-medium">{row.title}</span>
    },
    {
        key: 'author',
        label: 'Author',
        render: (row) => <span className="text-muted-foreground/80">{row.author}</span>
    },
    {
        key: 'readingStatus',
        label: 'Status',
        render: (row) => {
            const getVariant = (status: number) => {
                switch (status) {
                    case 1: return 'info'; // Reading
                    case 2: return 'success'; // Finished
                    case 3: return 'warning'; // OnHold
                    case 4: return 'danger'; // Dropped
                    default: return 'primary'; // PlanToRead
                }
            };
            return (
                <CyberBadge
                    label={readingStatusLabels[row.readingStatus]}
                    variant={getVariant(row.readingStatus)}
                />
            );
        }
    },
    {
        key: 'myRating',
        label: 'Rating',
        render: (row) => (
            <span className="text-cyan-neon font-mono">
                {row.myRating ? `${row.myRating}/100` : '-'}
            </span>
        )
    },
];

export default function BooksPage() {
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
    } = useResourcePagedList<Book>({
        serviceMethod: (page: number, pageSize: number, term?: string) => bookAdminService.getPaged(page, pageSize, term),
        queryKey: 'archives-books'
    });

    const deleteMutation = useDeleteResource(
        'archives-books',
        (id) => bookAdminService.delete(id)
    );

    return (
        <ArchiveListLayout
            title="BOOKS"
            icon={<BookOpen size={18} className="text-primary" />}
            newHref="/admin/archives/books/new"
            editHref={(id) => `/admin/archives/books/${id}`}
            data={data}
            columns={columns}
            isLoading={isLoading}
            error={error}
            deleteError={deleteMutation.error}
            emptyMessage="NO_BOOKS_FOUND"
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

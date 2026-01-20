'use client';

import { Film } from 'lucide-react';
import { movieAdminService } from '@/services/admin/archivesAdminService';
import { useResourcePagedList } from '@/hooks/admin/useResourcePagedList';
import { useDeleteResource } from '@/hooks/admin';
import { ArchiveListLayout, Column } from '@/components/admin/archives';
import type { Movie } from '@/types/archives';

const columns: Column<Movie>[] = [
    {
        key: 'title',
        label: 'Title',
        render: (row) => <span className="font-medium">{row.title}</span>
    },
    {
        key: 'director',
        label: 'Director',
        render: (row) => <span className="text-muted-foreground/80">{row.director}</span>
    },
    {
        key: 'releaseYear',
        label: 'Year',
        render: (row) => (
            <span className="text-muted-foreground/60 text-xs">
                {row.releaseYear || '-'}
            </span>
        )
    },
    {
        key: 'myRating',
        label: 'Rating',
        render: (row) => (
            <span className="text-violet-400 font-mono">
                {row.myRating ? `${row.myRating}/100` : '-'}
            </span>
        )
    },
];

export default function MoviesPage() {
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
    } = useResourcePagedList<Movie>({
        serviceMethod: (page: number, pageSize: number, term?: string) => movieAdminService.getPaged(page, pageSize, term),
        queryKey: 'archives-movies'
    });

    const deleteMutation = useDeleteResource(
        'archives-movies',
        (id) => movieAdminService.delete(id)
    );

    return (
        <ArchiveListLayout
            title="MOVIES"
            icon={<Film size={18} className="text-violet-400" />}
            newHref="/admin/archives/movies/new"
            editHref={(id) => `/admin/archives/movies/${id}`}
            data={data}
            columns={columns}
            isLoading={isLoading}
            error={error}
            deleteError={deleteMutation.error}
            emptyMessage="NO_MOVIES_FOUND"
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

'use client';

import { Music as MusicIcon } from 'lucide-react';
import { musicAdminService } from '@/services/admin/archivesAdminService';
import { useResourcePagedList } from '@/hooks/admin/useResourcePagedList';
import { useDeleteResource } from '@/hooks/admin';
import { ArchiveListLayout, Column } from '@/components/admin/archives';
import type { Music } from '@/types/archives';

const columns: Column<Music>[] = [
    { key: 'title', label: 'Title', render: (row) => <span className="font-medium">{row.title}</span> },
    { key: 'artist', label: 'Artist', render: (row) => <span className="text-cyan-neon">{row.artist}</span> },
    { key: 'album', label: 'Album', render: (row) => <span className="text-muted-foreground/80">{row.album || '-'}</span> },
    { key: 'genre', label: 'Genre', render: (row) => <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">{row.genre || '-'}</span> },
    { key: 'myRating', label: 'Rating', render: (row) => <span className="text-cyan-neon font-mono">{row.myRating ? `${row.myRating}/100` : '-'}</span> },
];

export default function MusicPage() {
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
    } = useResourcePagedList<Music>({
        serviceMethod: (page: number, pageSize: number, term?: string) => musicAdminService.getPaged(page, pageSize, term),
        queryKey: 'archives-music'
    });

    const deleteMutation = useDeleteResource('archives-music', (id) => musicAdminService.delete(id));

    return (
        <ArchiveListLayout
            title="MUSIC"
            icon={<MusicIcon size={18} className="text-primary" />}
            newHref="/admin/archives/music/new"
            editHref={(id) => `/admin/archives/music/${id}`}
            data={data}
            columns={columns}
            isLoading={isLoading}
            error={error}
            deleteError={deleteMutation.error}
            emptyMessage="NO_MUSIC_FOUND"
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

'use client';

import { Film } from 'lucide-react';
import { animeAdminService } from '@/services/admin/archivesAdminService';
import { useResourcePagedList } from '@/hooks/admin/useResourcePagedList';
import { useDeleteResource } from '@/hooks/admin';
import { ArchiveListLayout, Column } from '@/components/admin/archives';
import { CyberBadge } from '@/components/ui/cyber/CyberBadge';
import type { Anime } from '@/types/archives';
import { watchStatusLabels } from '@/types/archives';

const columns: Column<Anime>[] = [
    { key: 'title', label: 'Title', render: (row) => <span className="font-medium">{row.title}</span> },
    { key: 'studio', label: 'Studio', render: (row) => <span className="text-muted-foreground/80">{row.studio || '-'}</span> },
    { key: 'episodes', label: 'Episodes', render: (row) => <span className="text-muted-foreground/60 text-xs">{row.episodes || '-'}</span> },
    {
        key: 'status',
        label: 'Status',
        render: (row) => {
            const getVariant = (status: number) => {
                switch (status) {
                    case 1: return 'info'; // Watching
                    case 2: return 'success'; // Completed
                    case 3: return 'warning'; // OnHold
                    case 4: return 'danger'; // Dropped
                    default: return 'primary'; // PlanToWatch
                }
            };
            return (
                <CyberBadge
                    label={watchStatusLabels[row.status]}
                    variant={getVariant(row.status)}
                />
            );
        }
    },
    { key: 'myRating', label: 'Rating', render: (row) => <span className="text-cyan-neon font-mono">{row.myRating ? `${row.myRating}/100` : '-'}</span> },
];

export default function AnimePage() {
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
    } = useResourcePagedList<Anime>({
        serviceMethod: (page: number, pageSize: number, term?: string) => animeAdminService.getPaged(page, pageSize, term),
        queryKey: 'archives-anime'
    });

    const deleteMutation = useDeleteResource('archives-anime', (id) => animeAdminService.delete(id));

    return (
        <ArchiveListLayout
            title="ANIME"
            icon={<Film size={18} className="text-primary" />}
            newHref="/admin/archives/anime/new"
            editHref={(id) => `/admin/archives/anime/${id}`}
            data={data}
            columns={columns}
            isLoading={isLoading}
            error={error}
            deleteError={deleteMutation.error}
            emptyMessage="NO_ANIME_FOUND"
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

'use client';

import { Gamepad2 } from 'lucide-react';
import { gameAdminService } from '@/services/admin/archivesAdminService';
import { useResourcePagedList } from '@/hooks/admin/useResourcePagedList';
import { useDeleteResource } from '@/hooks/admin';
import { ArchiveListLayout, Column } from '@/components/admin/archives';
import { CyberBadge } from '@/components/ui/cyber/CyberBadge';
import type { Game } from '@/types/archives';
import { gameStatusLabels } from '@/types/archives';

const columns: Column<Game>[] = [
    { key: 'title', label: 'Title', render: (row) => <span className="font-medium">{row.title}</span> },
    { key: 'platform', label: 'Platform', render: (row) => <span className="text-muted-foreground/80">{row.platform || '-'}</span> },
    { key: 'playtimeHours', label: 'Playtime', render: (row) => <span className="text-muted-foreground/60 text-xs">{row.playtimeHours ? `${row.playtimeHours}h` : '-'}</span> },
    {
        key: 'status',
        label: 'Status',
        render: (row) => {
            const getVariant = (status: number) => {
                switch (status) {
                    case 1: return 'info'; // Playing
                    case 2: return 'success'; // Finished
                    case 3: return 'success'; // 100% Completed
                    case 4: return 'danger'; // Dropped
                    default: return 'primary'; // Backlog
                }
            };
            return (
                <CyberBadge
                    label={gameStatusLabels[row.status]}
                    variant={getVariant(row.status)}
                />
            );
        }
    },
    { key: 'myRating', label: 'Rating', render: (row) => <span className="text-cyan-neon font-mono">{row.myRating ? `${row.myRating}/100` : '-'}</span> },
];

export default function GamesPage() {
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
    } = useResourcePagedList<Game>({
        serviceMethod: (page: number, pageSize: number, term?: string) => gameAdminService.getPaged(page, pageSize, term),
        queryKey: 'archives-games'
    });

    const deleteMutation = useDeleteResource('archives-games', (id) => gameAdminService.delete(id));

    return (
        <ArchiveListLayout
            title="GAMES"
            icon={<Gamepad2 size={18} className="text-primary" />}
            newHref="/admin/archives/games/new"
            editHref={(id) => `/admin/archives/games/${id}`}
            data={data}
            columns={columns}
            isLoading={isLoading}
            error={error}
            deleteError={deleteMutation.error}
            emptyMessage="NO_GAMES_FOUND"
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

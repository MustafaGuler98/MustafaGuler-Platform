'use client';

import { Film } from 'lucide-react';
import { tvSeriesAdminService } from '@/services/admin/archivesAdminService';
import { useResourcePagedList } from '@/hooks/admin/useResourcePagedList';
import { useDeleteResource } from '@/hooks/admin';
import { ArchiveListLayout, Column } from '@/components/admin/archives';
import { CyberBadge } from '@/components/ui/cyber/CyberBadge';
import type { TvSeries } from '@/types/archives';
import { watchStatusLabels } from '@/types/archives';

const columns: Column<TvSeries>[] = [
    { key: 'title', label: 'Title', render: (row) => <span className="font-medium">{row.title}</span> },
    { key: 'startYear', label: 'Years', render: (row) => <span className="text-muted-foreground/60 text-xs">{row.startYear}{row.endYear ? ` - ${row.endYear}` : ''}</span> },
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

export default function TvSeriesPage() {
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
    } = useResourcePagedList<TvSeries>({
        serviceMethod: (page: number, pageSize: number, term?: string) => tvSeriesAdminService.getPaged(page, pageSize, term),
        queryKey: 'archives-tvseries'
    });

    const deleteMutation = useDeleteResource('archives-tvseries', (id) => tvSeriesAdminService.delete(id));

    return (
        <ArchiveListLayout
            title="TV SERIES"
            icon={<Film size={18} className="text-primary" />}
            newHref="/admin/archives/tvseries/new"
            editHref={(id) => `/admin/archives/tvseries/${id}`}
            data={data}
            columns={columns}
            isLoading={isLoading}
            error={error}
            deleteError={deleteMutation.error}
            emptyMessage="NO_TV_SERIES_FOUND"
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

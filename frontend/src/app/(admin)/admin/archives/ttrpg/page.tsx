'use client';

import { Dice6 } from 'lucide-react';
import { ttrpgAdminService } from '@/services/admin/archivesAdminService';
import { useResourcePagedList } from '@/hooks/admin/useResourcePagedList';
import { useDeleteResource } from '@/hooks/admin';
import { ArchiveListLayout, Column } from '@/components/admin/archives';
import type { TTRPG } from '@/types/archives';
import { ttrpgRoleLabels, campaignStatusLabels } from '@/types/archives';

const columns: Column<TTRPG>[] = [
    { key: 'title', label: 'Campaign', render: (row) => <span className="font-medium">{row.title}</span> },
    { key: 'system', label: 'System', render: (row) => <span className="text-cyan-neon">{row.system || '-'}</span> },
    { key: 'role', label: 'Role', render: (row) => <span className="text-xs px-2 py-1 rounded bg-cyan-neon/20 text-cyan-neon">{ttrpgRoleLabels[row.role]}</span> },
    { key: 'campaignStatus', label: 'Status', render: (row) => <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">{campaignStatusLabels[row.campaignStatus]}</span> },
    { key: 'sessionCount', label: 'Sessions', render: (row) => <span className="text-muted-foreground/60 font-mono">{row.sessionCount || '-'}</span> },
];

export default function TTRPGPage() {
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
    } = useResourcePagedList<TTRPG>({
        serviceMethod: (page: number, pageSize: number, term?: string) => ttrpgAdminService.getPaged(page, pageSize, term),
        queryKey: 'archives-ttrpg'
    });

    const deleteMutation = useDeleteResource('archives-ttrpg', (id) => ttrpgAdminService.delete(id));

    return (
        <ArchiveListLayout
            title="TTRPG"
            subtitle="TABLETOP_ROLE_PLAYING_GAMES"
            icon={<Dice6 size={18} className="text-primary" />}
            newHref="/admin/archives/ttrpg/new"
            editHref={(id) => `/admin/archives/ttrpg/${id}`}
            data={data}
            columns={columns}
            isLoading={isLoading}
            error={error}
            deleteError={deleteMutation.error}
            emptyMessage="NO_TTRPG_FOUND"
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

'use client';

import { Archive, Plus } from 'lucide-react';
import { adminMindmapService, MindmapItemDto } from '@/services/adminMindmapService';
import { useResourceList, useDeleteResource } from '@/hooks/admin';
import { ErrorMessage } from '@/components/admin/layout';
import { AdminListHeader } from '@/components/admin/ui/AdminListHeader';
import { CyberNewButton } from '@/components/ui/cyber/CyberNewButton';
import { CyberActionLink } from '@/components/ui/cyber/CyberActionLink';
import { CyberTable } from '@/components/ui/cyber/CyberTable';
import { CyberSearchInput } from '@/components/ui/cyber/CyberSearchInput';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useRouter } from 'next/navigation';

export default function MindmapPage() {
    const router = useRouter();
    const { data: items = [], isLoading, error } = useResourceList<MindmapItemDto>(
        'mindmap',
        () => adminMindmapService.getAll()
    );

    const deleteMutation = useDeleteResource(
        'mindmap',
        (id) => adminMindmapService.delete(id)
    );

    const { searchTerm, setSearchTerm, filteredData, clearSearch } = useSearchFilter(
        items,
        ['text']
    );

    return (
        <div className="space-y-6">
            <AdminListHeader
                title="MINDMAP"
                subtitle="HOMEPAGE_ROTATION"
                icon={<Archive size={18} className="text-violet-400" />}
                actionButton={<CyberNewButton href="/admin/mindmap/new" />}
            />

            <CyberSearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={clearSearch}
                placeholder="SEARCH_ITEMS"
            />

            <ErrorMessage
                error={error || deleteMutation.error}
                customMessage={error ? 'FAILED_TO_LOAD' : 'FAILED_TO_DELETE'}
            />

            <div className="bg-slate-900/40 border border-white/5 rounded-lg overflow-hidden">
                <CyberTable
                    columns={[
                        {
                            key: 'text',
                            label: 'Text',
                            render: (row) => <span className="font-medium text-slate-200">{row.text}</span>,
                        },
                        {
                            key: 'isActive',
                            label: 'Status',
                            render: (row) => (
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${row.isActive
                                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                    : 'border-slate-500/30 bg-slate-500/10 text-slate-400'
                                    }`}>
                                    {row.isActive ? 'ACTIVE' : 'PASSIVE'}
                                </span>
                            ),
                        },
                    ]}
                    data={filteredData}
                    isLoading={isLoading}
                    emptyMessage="NO_ITEMS_FOUND"
                    onRowClick={(row) => router.push(`/admin/mindmap/${row.id}`)}
                    actions={(row) => (
                        <CyberActionLink href={`/admin/mindmap/${row.id}`}>
                            EDIT
                        </CyberActionLink>
                    )}
                />
            </div>
        </div>
    );
}

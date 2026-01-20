'use client';

import { FolderTree } from 'lucide-react';
import { categoryAdminService } from '@/services/admin';
import { useResourceList, useDeleteResource } from '@/hooks/admin';
import { ErrorMessage } from '@/components/admin/layout';
import { ArchiveDashboardLayout } from '@/components/admin/archives';
import { AdminListHeader } from '@/components/admin/ui/AdminListHeader';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberNewButton } from '@/components/ui/cyber/CyberNewButton';
import { CyberActionLink } from '@/components/ui/cyber/CyberActionLink';
import { CyberTable } from '@/components/ui/cyber/CyberTable';
import { CyberSearchInput } from '@/components/ui/cyber/CyberSearchInput';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import type { Category } from '@/types/admin';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
    const router = useRouter();
    const { data: allCategories = [], isLoading, error } = useResourceList<Category>(
        'categories',
        () => categoryAdminService.getAll()
    );

    const deleteMutation = useDeleteResource(
        'categories',
        (id) => categoryAdminService.delete(id)
    );

    const { searchTerm, setSearchTerm, filteredData, clearSearch } = useSearchFilter(
        allCategories,
        ['name', 'slug', 'description']
    );

    return (
        <div className="space-y-6">
            <AdminListHeader
                title="CATEGORIES"
                subtitle="CONTENT_TAXONOMY"
                icon={<FolderTree size={18} className="text-violet-400" />}
                actionButton={<CyberNewButton href="/admin/categories/new" />}
            />

            <CyberSearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={clearSearch}
                placeholder="SEARCH"
            />

            <ErrorMessage
                error={error || deleteMutation.error}
                customMessage={error ? 'FAILED_TO_LOAD' : 'FAILED_TO_DELETE'}
            />

            <div className="bg-slate-900/40 border border-white/5 rounded-lg overflow-hidden">
                <CyberTable
                    columns={[
                        {
                            key: 'name',
                            label: 'Title',
                            render: (row) => <span className="font-medium">{row.name}</span>,
                        },
                        {
                            key: 'slug',
                            label: 'Slug',
                            render: (row) => (
                                <span className="text-muted-foreground/60 text-xs">/{row.slug}</span>
                            ),
                        },
                        {
                            key: 'description',
                            label: 'Description',
                            render: (row) => (
                                <span className="text-muted-foreground/60 text-xs">
                                    {row.description
                                        ? row.description.length > 60
                                            ? row.description.substring(0, 60) + '...'
                                            : row.description
                                        : '-'}
                                </span>
                            ),
                        },
                    ]}
                    data={filteredData}
                    isLoading={isLoading}
                    emptyMessage="NO_CATEGORIES_FOUND"
                    onRowClick={(row) => router.push(`/admin/categories/${row.slug}`)}
                    actions={(row) => (
                        <CyberActionLink href={`/admin/categories/${row.slug}`}>
                            START_EDIT
                        </CyberActionLink>
                    )}
                />
            </div>
        </div>
    );
}

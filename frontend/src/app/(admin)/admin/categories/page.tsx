'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, FolderTree } from 'lucide-react';
import { categoryAdminService } from '@/services/admin';
import { useResourceList, useDeleteResource } from '@/hooks/admin';
import { useDebounce } from '@/hooks/useDebounce';
import { ErrorMessage } from '@/components/admin/layout';
import { CyberButton } from '@/components/admin/ui/CyberButton';
import { CyberTable } from '@/components/admin/ui/CyberTable';
import { SearchInput } from '@/components/admin/ui/SearchInput';
import type { Category } from '@/types/admin';

export default function CategoriesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm);

    const { data: allCategories = [], isLoading, error } = useResourceList<Category>(
        'categories',
        () => categoryAdminService.getAll()
    );

    const deleteMutation = useDeleteResource(
        'categories',
        (id) => categoryAdminService.delete(id)
    );

    // Client-side filtering (categories are not paginated from backend yet)
    const categories = allCategories.filter((cat) => {
        if (!debouncedSearch) return true;
        const search = debouncedSearch.toLowerCase();
        return (
            cat.name.toLowerCase().includes(search) ||
            cat.slug.toLowerCase().includes(search) ||
            (cat.description?.toLowerCase().includes(search) ?? false)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded border border-primary/30 flex items-center justify-center">
                        <FolderTree size={18} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="font-mono text-lg text-foreground tracking-wide">
                            CATEGORIES
                        </h1>
                        <p className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">
                            CONTENT_TAXONOMY
                        </p>
                    </div>
                </div>
                <Link href="/admin/categories/new">
                    <CyberButton variant="primary" size="sm">
                        <Plus size={12} />
                        NEW
                    </CyberButton>
                </Link>
            </div>

            <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm('')}
                placeholder="SEARCH"
            />

            <ErrorMessage
                error={error || deleteMutation.error}
                customMessage={error ? 'FAILED_TO_LOAD' : 'FAILED_TO_DELETE'}
            />

            <div className="backdrop-blur-sm bg-black/20 border border-white/5 rounded-lg overflow-hidden">
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
                    data={categories}
                    isLoading={isLoading}
                    emptyMessage="NO_CATEGORIES_FOUND"
                    onRowClick={(row) => (window.location.href = `/admin/categories/${row.id}`)}
                    actions={(row) => (
                        <Link href={`/admin/categories/${row.id}`}>
                            <CyberButton
                                variant="primary"
                                size="sm"
                                className="!border-none !bg-transparent text-cyan-neon hover:text-white shadow-none hover:shadow-none p-0"
                            >
                                START_EDIT
                            </CyberButton>
                        </Link>
                    )}
                />
            </div>
        </div>
    );
}

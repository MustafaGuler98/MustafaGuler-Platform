'use client';

import { ReactNode } from 'react';
import { ErrorMessage } from '@/components/admin/layout';
import { CyberTable } from '@/components/ui/cyber/CyberTable';
import { CyberPagination } from '@/components/ui/cyber/CyberPagination';
import { CyberSearchInput } from '@/components/ui/cyber/CyberSearchInput';
import { AdminListHeader } from '@/components/admin/ui/AdminListHeader';
import { CyberNewButton } from '@/components/ui/cyber/CyberNewButton';
import { CyberActionLink } from '@/components/ui/cyber/CyberActionLink';
import { useRouter } from 'next/navigation';

export interface Column<T> {
    key: keyof T | string;
    label: string;
    render: (row: T) => ReactNode;
}

interface ArchiveListLayoutProps<T extends { id: string }> {
    title: string;
    subtitle?: string;
    icon: ReactNode;
    newHref: string;
    newButtonLabel?: string;
    newButtonIcon?: ReactNode;
    editHref: (id: string) => string;

    // Data & State
    data: T[];
    isLoading?: boolean;
    error?: Error | null;
    deleteError?: Error | null;
    emptyMessage?: string;

    // Server-Side Search & Pagination Props
    pagination: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
    search: {
        searchTerm: string;
        onSearchChange: (term: string) => void;
        onClearSearch: () => void;
    };

    columns: Column<T>[];
}

export function ArchiveListLayout<T extends { id: string }>({
    title,
    subtitle = 'ARCHIVES_COLLECTION',
    icon,
    newHref,
    newButtonLabel,
    newButtonIcon,
    editHref,
    data,
    columns,
    isLoading,
    error,
    deleteError,
    emptyMessage = 'NO_ITEMS_FOUND',
    pagination,
    search,
}: ArchiveListLayoutProps<T>) {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <AdminListHeader
                title={title}
                subtitle={subtitle}
                icon={icon}
                actionButton={
                    <CyberNewButton
                        href={newHref}
                        label={newButtonLabel}
                        icon={newButtonIcon}
                    />
                }
            />

            <CyberSearchInput
                value={search.searchTerm}
                onChange={search.onSearchChange}
                onClear={search.onClearSearch}
                placeholder="SEARCH"
            />
            <ErrorMessage
                error={error || deleteError}
                customMessage={error ? 'FAILED_TO_LOAD' : 'FAILED_TO_DELETE'}
            />

            <div className="bg-slate-900/40 border border-white/5 rounded-lg overflow-hidden">
                <CyberTable
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                    emptyMessage={emptyMessage}
                    onRowClick={(row) => router.push(editHref(row.id))}
                    actions={(row) => (
                        <CyberActionLink href={editHref(row.id)}>
                            EDIT
                        </CyberActionLink>
                    )}
                />
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <CyberPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.onPageChange}
                />
            )}
        </div>
    );
}


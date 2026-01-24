'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, ArrowLeft, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ErrorMessage } from '@/components/admin/layout';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberTable } from '@/components/ui/cyber/CyberTable';

interface Subscriber {
    id: string;
    email: string;
    source: string;
    createdDate: string;
    isActive: boolean;
}

interface PagedResult {
    items: Subscriber[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

function SubscribersContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageMs = Number(searchParams.get('page')) || 1;

    const { data: response, isLoading, error } = useQuery({
        queryKey: ['subscribers', pageMs],
        queryFn: async () => {
            const res = await apiClient.get<PagedResult>(`/contact/subscribers?pageNumber=${pageMs}&pageSize=20`);
            if (!res.isSuccess) {
                throw new Error(res.message || 'Failed to fetch subscribers');
            }
            return res.data;
        },
    });

    const subscribers = response?.items ?? [];
    const totalCount = response?.totalCount ?? 0;
    const totalPages = response?.totalPages ?? 1;

    const handleBulkEmail = () => {
        alert('This feature is not yet implemented.');
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            router.push(`/admin/contact/subscribers?page=${newPage}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white/5 rounded transition-colors"
                    >
                        <ArrowLeft size={18} className="text-muted-foreground" />
                    </button>
                    <div className="w-10 h-10 rounded border border-primary/30 flex items-center justify-center">
                        <Users size={18} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="font-mono text-lg text-foreground tracking-wide">
                            SUBSCRIBERS
                        </h1>
                        <p className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">
                            PROMO_ENABLED_CONTACTS
                        </p>
                    </div>
                </div>
                <CyberButton variant="primary" size="sm" onClick={handleBulkEmail}>
                    <Send size={12} />
                    SEND_BULK_EMAIL
                </CyberButton>
            </div>

            <ErrorMessage error={error} customMessage="FAILED_TO_LOAD_SUBSCRIBERS" />

            <div className="backdrop-blur-sm bg-black/20 border border-white/5 rounded-lg overflow-hidden">
                <CyberTable
                    columns={[
                        {
                            key: 'email',
                            label: 'Email',
                            render: (row: Subscriber) => (
                                <span className="text-cyan-neon font-mono">{row.email}</span>
                            ),
                        },
                        {
                            key: 'source',
                            label: 'Source',
                            render: (row: Subscriber) => (
                                <span className="text-xs text-muted-foreground border border-white/10 px-2 py-0.5 rounded uppercase">
                                    {row.source || 'UNKNOWN'}
                                </span>
                            ),
                        },
                        {
                            key: 'createdDate',
                            label: 'Joined',
                            render: (row: Subscriber) => (
                                <span className="text-xs text-muted-foreground">
                                    {new Date(row.createdDate).toLocaleDateString()}
                                </span>
                            ),
                        }
                    ]}
                    data={subscribers}
                    isLoading={isLoading}
                    emptyMessage="NO_SUBSCRIBERS_FOUND"
                />

                {/* Footer / Pagination */}
                {!isLoading && (
                    <div className="flex items-center justify-between p-4 border-t border-white/5 bg-black/20">
                        <span className="font-mono text-xs text-muted-foreground">
                            TOTAL: <span className="text-cyan-neon">{totalCount}</span> SUBSCRIBERS
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(pageMs - 1)}
                                disabled={pageMs <= 1}
                                className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} className="text-muted-foreground" />
                            </button>
                            <span className="font-mono text-xs text-muted-foreground">
                                PAGE {pageMs} / {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(pageMs + 1)}
                                disabled={pageMs >= totalPages}
                                className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} className="text-muted-foreground" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

import { Suspense } from 'react';

export default function SubscribersPage() {
    return (
        <Suspense fallback={<div className="text-cyan-neon font-mono text-sm p-8">INITIALIZING_SUBSCRIBER_MODULE...</div>}>
            <SubscribersContent />
        </Suspense>
    );
}

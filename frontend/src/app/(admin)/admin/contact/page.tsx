'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
    ChevronLeft,
    ChevronRight,
    Mail,
    Check,
    X,
    Users,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ErrorMessage } from '@/components/admin/layout';
import { CyberTable } from '@/components/ui/cyber/CyberTable';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberActionLink } from '@/components/ui/cyber/CyberActionLink';
import { CyberBadge } from '@/components/ui/cyber/CyberBadge';
import { formatTerminalDate } from '@/lib/date-utils';

import { PagedResult } from '@/types/admin';
import { useRouter } from 'next/navigation';

interface ContactMessage {
    id: string;
    senderName: string;
    senderEmail: string;
    subject: string;
    messagePreview: string;
    createdDate: string;
    isMailSent: boolean;
    isReplied: boolean;
}

export default function ContactPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading, error } = useQuery({
        queryKey: ['contact-messages', page, pageSize],
        queryFn: async () => {
            const response = await apiClient.get<PagedResult<ContactMessage>>(
                `/contact/paged?pageNumber=${page}&pageSize=${pageSize}`
            );
            if (!response.isSuccess) {
                throw new Error(response.message || 'Failed to fetch messages');
            }
            return response.data;
        },
    });

    const messages = data?.items ?? [];
    const totalPages = data?.totalPages ?? 1;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded border border-white/10 flex items-center justify-center">
                        <Mail size={18} className="text-violet-400" />
                    </div>
                    <div>
                        <h1 className="font-mono text-lg text-foreground tracking-wide">
                            CONTACT_MESSAGES
                        </h1>
                        <p className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">
                            INCOMING_TRANSMISSIONS
                        </p>
                    </div>
                </div>
                <Link href="/admin/contact/subscribers">
                    <CyberButton variant="secondary" size="sm">
                        <Users size={12} />
                        SUBSCRIBERS
                    </CyberButton>
                </Link>
            </div>

            <ErrorMessage error={error} customMessage="FAILED_TO_LOAD_MESSAGES" />

            <div className="bg-slate-900/40 border border-white/5 rounded-lg overflow-hidden">
                <CyberTable
                    columns={[
                        {
                            key: 'status',
                            label: 'Status',
                            render: (row: ContactMessage) => (
                                <div className="flex items-center gap-2">
                                    {row.isMailSent ? (
                                        <Check size={14} className="text-emerald-500" />
                                    ) : (
                                        <X size={14} className="text-rose-500" />
                                    )}
                                    {row.isReplied && (
                                        <CyberBadge
                                            label="REPLIED"
                                            variant="primary"
                                        />
                                    )}
                                </div>
                            ),
                        },
                        {
                            key: 'senderEmail',
                            label: 'Sender',
                            render: (row: ContactMessage) => (
                                <div>
                                    <div className="text-foreground">{row.senderName}</div>
                                    <div className="text-muted-foreground/60 text-xs">{row.senderEmail}</div>
                                </div>
                            ),
                        },
                        {
                            key: 'subject',
                            label: 'Subject',
                            render: (row: ContactMessage) => (
                                <span className="text-foreground">{row.subject}</span>
                            ),
                        },
                        {
                            key: 'messagePreview',
                            label: 'Message',
                            render: (row: ContactMessage) => (
                                <span className="text-muted-foreground/70 text-xs">
                                    {row.messagePreview}
                                </span>
                            ),
                        },
                        {
                            key: 'createdDate',
                            label: 'Date',
                            render: (row: ContactMessage) => (
                                <span className="text-muted-foreground/70 text-xs">
                                    {formatTerminalDate(row.createdDate)}
                                </span>
                            ),
                        },
                    ]}
                    data={messages}
                    isLoading={isLoading}
                    emptyMessage="NO_MESSAGES_FOUND"
                    onRowClick={(row: ContactMessage) => router.push(`/admin/contact/${row.id}`)}
                    actions={(row: ContactMessage) => (
                        <Link href={`/admin/contact/${row.id}`}>
                            <CyberButton
                                variant="primary"
                                size="sm"
                                className="!border-none !bg-transparent text-violet-400 hover:text-white shadow-none hover:shadow-none p-0"
                            >
                                VIEW
                            </CyberButton>
                        </Link>
                    )}
                />

                {/* Pagination */}
                {!isLoading && messages.length > 0 && (
                    <div className="flex items-center justify-center gap-6 py-4 border-t border-white/5">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="p-2 font-mono text-xs text-muted-foreground hover:text-violet-400 disabled:opacity-30 disabled:cursor-default transition-colors hover:bg-white/5 rounded"
                        >
                            <ChevronLeft size={16} className="inline" />
                        </button>

                        <span className="font-mono text-xs tracking-widest">
                            <span className="text-violet-400">{page}</span>
                            <span className="text-muted-foreground"> / {totalPages}</span>
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="p-2 font-mono text-xs text-muted-foreground hover:text-violet-400 disabled:opacity-30 disabled:cursor-default transition-colors hover:bg-white/5 rounded"
                        >
                            <ChevronRight size={16} className="inline" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

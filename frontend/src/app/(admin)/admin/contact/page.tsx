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
import { CyberButton } from '@/components/admin/ui/CyberButton';
import { CyberTable } from '@/components/admin/ui/CyberTable';
import { formatTerminalDate } from '@/lib/date-utils';

import { PagedResult } from '@/types/admin';

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
                    <div className="w-10 h-10 rounded border border-primary/30 flex items-center justify-center">
                        <Mail size={18} className="text-primary" />
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

            <div className="backdrop-blur-sm bg-black/20 border border-white/5 rounded-lg overflow-hidden">
                <CyberTable
                    columns={[
                        {
                            key: 'status',
                            label: 'Status',
                            render: (row: ContactMessage) => (
                                <div className="flex items-center gap-2">
                                    {row.isMailSent ? (
                                        <Check size={14} className="text-green-500" />
                                    ) : (
                                        <X size={14} className="text-red-500" />
                                    )}
                                    {row.isReplied && (
                                        <span className="text-[10px] text-cyan-neon border border-cyan-neon/30 px-1 rounded">
                                            REPLIED
                                        </span>
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
                    onRowClick={(row: ContactMessage) => (window.location.href = `/admin/contact/${row.id}`)}
                    actions={(row: ContactMessage) => (
                        <Link href={`/admin/contact/${row.id}`}>
                            <CyberButton
                                variant="primary"
                                size="sm"
                                className="!border-none !bg-transparent text-cyan-neon hover:text-white shadow-none hover:shadow-none p-0"
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
                            className="p-2 font-mono text-xs text-muted-foreground hover:text-cyan-neon disabled:opacity-30 disabled:cursor-default transition-colors hover:bg-white/5 rounded"
                        >
                            <ChevronLeft size={16} className="inline" />
                        </button>

                        <span className="font-mono text-xs tracking-widest">
                            <span className="text-cyan-neon">{page}</span>
                            <span className="text-muted-foreground"> / {totalPages}</span>
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="p-2 font-mono text-xs text-muted-foreground hover:text-cyan-neon disabled:opacity-30 disabled:cursor-default transition-colors hover:bg-white/5 rounded"
                        >
                            <ChevronRight size={16} className="inline" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

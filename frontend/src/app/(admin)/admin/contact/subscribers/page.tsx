'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Users, ArrowLeft, Send } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ErrorMessage } from '@/components/admin/layout';
import { CyberButton } from '@/components/admin/ui/CyberButton';
import { CyberTable } from '@/components/admin/ui/CyberTable';

interface Subscriber {
    senderName: string;
    senderEmail: string;
}

export default function SubscribersPage() {
    const router = useRouter();

    const { data: response, isLoading, error } = useQuery({
        queryKey: ['subscribers'],
        queryFn: async () => {
            const res = await apiClient.get<Subscriber[]>('/contact/subscribers');
            if (!res.isSuccess) {
                throw new Error(res.message || 'Failed to fetch subscribers');
            }
            return res.data;
        },
    });

    const subscribers = response ?? [];

    const handleBulkEmail = () => {
        alert('This feature is not yet implemented.');
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
                            key: 'senderName',
                            label: 'Name',
                            render: (row: Subscriber) => (
                                <span className="text-foreground">{row.senderName}</span>
                            ),
                        },
                        {
                            key: 'senderEmail',
                            label: 'Email',
                            render: (row: Subscriber) => (
                                <span className="text-cyan-neon">{row.senderEmail}</span>
                            ),
                        },
                    ]}
                    data={subscribers}
                    isLoading={isLoading}
                    emptyMessage="NO_SUBSCRIBERS_FOUND"
                />

                {/* Summary */}
                {!isLoading && subscribers.length > 0 && (
                    <div className="flex items-center justify-center py-4 border-t border-white/5">
                        <span className="font-mono text-xs text-muted-foreground">
                            TOTAL: <span className="text-cyan-neon">{subscribers.length}</span> SUBSCRIBERS
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Reply, Check, X, Clock, Globe } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ErrorMessage } from '@/components/admin/layout';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { formatTerminalDate } from '@/lib/date-utils';

interface ContactMessageDetail {
    id: string;
    senderName: string;
    senderEmail: string;
    subject: string;
    messageBody: string;
    allowPromo: boolean;
    clientIp: string | null;
    createdDate: string;
    isMailSent: boolean;
    isReplied: boolean;
}

export default function ContactDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: response, isLoading, error } = useQuery({
        queryKey: ['contact-message', id],
        queryFn: async () => {
            const res = await apiClient.get<ContactMessageDetail>(`/contact/${id}`);
            if (!res.isSuccess) {
                throw new Error(res.message || 'Failed to fetch message');
            }
            return res.data;
        },
    });

    const handleReply = () => {
        alert('This feature is not yet implemented.');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-mono text-muted-foreground animate-pulse">
                    LOADING_TRANSMISSION...
                </div>
            </div>
        );
    }

    if (error || !response) {
        return <ErrorMessage error={error} customMessage="FAILED_TO_LOAD_MESSAGE" />;
    }

    const data = response;

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
                        <Mail size={18} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="font-mono text-lg text-foreground tracking-wide">
                            MESSAGE_DETAIL
                        </h1>
                        <p className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">
                            ID: {id.substring(0, 8).toUpperCase()}
                        </p>
                    </div>
                </div>
                <CyberButton variant="primary" size="sm" onClick={handleReply}>
                    <Reply size={12} />
                    REPLY
                </CyberButton>
            </div>

            {/* Message Card */}
            <div className="backdrop-blur-sm bg-black/20 border border-white/5 rounded-lg p-6 space-y-6">
                {/* Status Row */}
                <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        {data.isMailSent ? (
                            <Check size={14} className="text-green-500" />
                        ) : (
                            <X size={14} className="text-red-500" />
                        )}
                        <span className="font-mono text-xs text-muted-foreground">
                            {data.isMailSent ? 'EMAIL_SENT' : 'EMAIL_FAILED'}
                        </span>
                    </div>
                    {data.isReplied && (
                        <span className="text-[10px] text-cyan-neon border border-cyan-neon/30 px-2 py-0.5 rounded">
                            REPLIED
                        </span>
                    )}
                    {data.allowPromo && (
                        <span className="text-[10px] text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded">
                            PROMO_OK
                        </span>
                    )}
                </div>

                {/* Sender Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">
                            SENDER_NAME
                        </label>
                        <p className="font-mono text-foreground">{data.senderName}</p>
                    </div>
                    <div>
                        <label className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">
                            SENDER_EMAIL
                        </label>
                        <p className="font-mono text-cyan-neon">{data.senderEmail}</p>
                    </div>
                </div>

                {/* Subject */}
                <div>
                    <label className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">
                        SUBJECT
                    </label>
                    <p className="font-mono text-foreground text-lg">{data.subject}</p>
                </div>

                {/* Message Body */}
                <div>
                    <label className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">
                        MESSAGE_BODY
                    </label>
                    <div className="mt-2 p-4 bg-black/30 border border-white/5 rounded font-mono text-foreground/90 whitespace-pre-wrap">
                        {data.messageBody}
                    </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-muted-foreground/60">
                    <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span className="font-mono text-xs">{formatTerminalDate(data.createdDate)}</span>
                    </div>
                    {data.clientIp && (
                        <div className="flex items-center gap-2">
                            <Globe size={12} />
                            <span className="font-mono text-xs">{data.clientIp}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

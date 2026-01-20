'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Quote as QuoteIcon } from 'lucide-react';
import { quoteAdminService } from '@/services/admin/archivesAdminService';
import { useResourceById, useUpdateResource, useDeleteResource } from '@/hooks/admin';
import { ArchiveDashboardLayout } from '@/components/admin/archives';
import { CyberInput } from '@/components/ui/cyber/CyberInput';
import { ValidationError } from '@/components/ui/cyber/ValidationError';
import type { Quote, UpdateQuote } from '@/types/archives';

export default function EditQuotePage() {
    const params = useParams();
    const id = params.id as string;

    const [form, setForm] = useState<UpdateQuote>({
        content: '',
        author: '',
        source: '',
    });
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const { data: quote, isLoading } = useResourceById<Quote>(
        'archives-quote',
        id,
        (id) => quoteAdminService.getById(id)
    );

    useEffect(() => {
        if (quote) {
            setForm({
                content: quote.content,
                author: quote.author,
                source: quote.source || '',
            });
        }
    }, [quote]);

    useEffect(() => {
        if (!quote) return;
        const isModified =
            form.content !== quote.content ||
            form.author !== quote.author ||
            (form.source || '') !== (quote.source || '');
        setIsFormDirty(isModified);
    }, [form, quote]);

    const updateMutation = useUpdateResource<Quote>(
        'archives-quotes',
        (id, data) => quoteAdminService.updateQuote(id, data as UpdateQuote),
        { onSuccessRedirect: '/admin/archives/quotes' }
    );

    const deleteMutation = useDeleteResource(
        'archives-quotes',
        (id) => quoteAdminService.delete(id),
        { onSuccessRedirect: '/admin/archives/quotes' }
    );

    const validateForm = (): boolean => {
        const errors: string[] = [];
        if (!form.content.trim()) errors.push('Quote content is required');
        if (!form.author.trim()) errors.push('Author is required');
        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        updateMutation.mutate({ id, data: form });
    };

    return (
        <ArchiveDashboardLayout
            title="EDIT_QUOTE"
            subtitle={quote?.author || 'Unknown Author'}
            backHref="/admin/archives/quotes"
            icon={<QuoteIcon size={18} className="text-purple-400" />}
            onSubmit={handleSubmit}
            onDelete={() => deleteMutation.mutate(id)}
            isPending={updateMutation.isPending}
            isDeletePending={deleteMutation.isPending}
            isDirty={isFormDirty}
            submitLabel="UPDATE_QUOTE"
            error={updateMutation.error || deleteMutation.error}
            sidebar={
                <div className="bg-slate-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                    <CyberInput
                        label="AUTHOR"
                        value={form.author}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                        required
                    />
                    <CyberInput
                        label="SOURCE"
                        value={form.source || ''}
                        onChange={(e) => setForm({ ...form, source: e.target.value })}
                    />
                </div>
            }
        >
            <ValidationError errors={validationErrors} />
            <CyberInput
                label="QUOTE_CONTENT"
                type="textarea"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={6}
                required
            />
        </ArchiveDashboardLayout>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { Quote as QuoteIcon } from 'lucide-react';
import { quoteAdminService } from '@/services/admin/archivesAdminService';
import { useCreateResource } from '@/hooks/admin';
import { ArchiveDashboardLayout } from '@/components/admin/archives';
import { CyberInput } from '@/components/ui/cyber/CyberInput';
import { ValidationError } from '@/components/ui/cyber/ValidationError';
import type { CreateQuote } from '@/types/archives';

export default function NewQuotePage() {
    const [form, setForm] = useState<CreateQuote>({
        content: '',
        author: '',
        source: '',
    });
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    useEffect(() => {
        const isModified = form.content !== '' || form.author !== '' || form.source !== '';
        setIsFormDirty(isModified);
    }, [form]);

    const mutation = useCreateResource(
        'archives-quotes',
        (data: CreateQuote) => quoteAdminService.createQuote(data),
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
        mutation.mutate(form);
    };

    return (
        <ArchiveDashboardLayout
            title="NEW_QUOTE"
            subtitle="Add to collection"
            backHref="/admin/archives/quotes"
            icon={<QuoteIcon size={18} className="text-purple-400" />}
            onSubmit={handleSubmit}
            isPending={mutation.isPending}
            isDirty={isFormDirty}
            submitLabel="CREATE_QUOTE"
            error={mutation.error}
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

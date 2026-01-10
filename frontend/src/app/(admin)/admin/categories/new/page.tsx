'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Save, FolderTree } from 'lucide-react';
import { categoryAdminService } from '@/services/admin';
import { useCreateResource } from '@/hooks/admin';
import { AdminPageHeader, ErrorMessage } from '@/components/admin/layout';
import { CyberButton } from '@/components/admin/ui/CyberButton';
import { TerminalInput } from '@/components/admin/ui/TerminalInput';
import type { CategoryFormData } from '@/types/admin';

export default function NewCategoryPage() {
    const [form, setForm] = useState<CategoryFormData>({
        name: '',
        description: '',
    });

    const mutation = useCreateResource(
        'categories',
        (data: CategoryFormData) => categoryAdminService.create(data),
        { onSuccessRedirect: '/admin/categories' }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(form);
    };

    return (
        <div className="space-y-8">
            <AdminPageHeader
                backHref="/admin/categories"
                icon={<FolderTree size={14} className="text-primary" />}
                title="NEW_CATEGORY"
                subtitle="CREATE_TAXONOMY"
            />

            <ErrorMessage error={mutation.error} />

            <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
                <div className="backdrop-blur-sm bg-black/20 border border-white/5 rounded-lg p-6 space-y-6">
                    <TerminalInput
                        label="NAME"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter category name..."
                        required
                    />

                    <TerminalInput
                        label="DESCRIPTION"
                        type="textarea"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Optional description..."
                        rows={3}
                    />
                </div>

                <div className="flex gap-3">
                    <CyberButton
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={mutation.isPending}
                    >
                        <Save size={12} />
                        {mutation.isPending ? 'SAVING...' : 'CREATE'}
                    </CyberButton>
                    <Link href="/admin/categories">
                        <CyberButton type="button" variant="ghost" size="md">
                            CANCEL
                        </CyberButton>
                    </Link>
                </div>
            </form>
        </div>
    );
}

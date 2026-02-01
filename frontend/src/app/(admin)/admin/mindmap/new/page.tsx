'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Save, Archive } from 'lucide-react';
import { adminMindmapService, MindmapItemAddDto } from '@/services/adminMindmapService';
import { useCreateResource } from '@/hooks/admin';
import { AdminPageHeader, ErrorMessage } from '@/components/admin/layout';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberInput } from '@/components/ui/cyber/CyberInput';

export default function NewMindmapPage() {
    const [form, setForm] = useState<MindmapItemAddDto>({
        text: '',
    });

    const mutation = useCreateResource(
        'mindmap',
        (data: MindmapItemAddDto) => adminMindmapService.create(data),
        { onSuccessRedirect: '/admin/mindmap' }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(form);
    };

    return (
        <div className="space-y-8">
            <AdminPageHeader
                backHref="/admin/mindmap"
                icon={<Archive size={14} className="text-primary" />}
                title="NEW_ITEM"
                subtitle="ADD_ROTATING_TEXT"
            />

            <ErrorMessage error={mutation.error} />

            <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
                <div className="backdrop-blur-sm bg-black/20 border border-white/5 rounded-lg p-5 space-y-6">
                    <CyberInput
                        label="TEXT"
                        value={form.text}
                        onChange={(e) => setForm({ ...form, text: e.target.value })}
                        placeholder="e.g. Software Architect"
                        required
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
                        {mutation.isPending ? 'CREATING...' : 'CREATE_ITEM'}
                    </CyberButton>
                    <Link href="/admin/mindmap">
                        <CyberButton type="button" variant="ghost" size="md">
                            CANCEL
                        </CyberButton>
                    </Link>
                </div>
            </form>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, Trash2, Archive, Loader2 } from 'lucide-react';
import { adminMindmapService, MindmapItemDto, MindmapItemUpdateDto } from '@/services/adminMindmapService';
import { useResourceById, useUpdateResource, useDeleteResource } from '@/hooks/admin';
import { AdminPageHeader, ErrorMessage } from '@/components/admin/layout';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberInput } from '@/components/ui/cyber/CyberInput';
import { useParams, useRouter } from 'next/navigation';

export default function EditMindmapPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: item, isLoading, error: loadError } = useResourceById<MindmapItemDto>(
        'mindmap',
        id,
        (id) => adminMindmapService.getById(id)
    );

    const [form, setForm] = useState<MindmapItemUpdateDto>({
        id: id,
        text: '',
        isActive: true
    });

    useEffect(() => {
        if (item) {
            setForm({
                id: item.id,
                text: item.text,
                isActive: item.isActive
            });
        }
    }, [item]);

    const updateMutation = useUpdateResource(
        'mindmap',
        (id, data) => adminMindmapService.update(id, data as MindmapItemUpdateDto),
        { onSuccessRedirect: '/admin/mindmap' }
    );

    const deleteMutation = useDeleteResource(
        'mindmap',
        (id) => adminMindmapService.delete(id),
        { onSuccessRedirect: '/admin/mindmap' }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({ id: form.id, data: form });
    };

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-violet-500" /></div>;
    if (loadError) return <ErrorMessage error={loadError} customMessage="FAILED_TO_LOAD_ITEM" />;

    return (
        <div className="space-y-8">
            <AdminPageHeader
                backHref="/admin/mindmap"
                icon={<Archive size={14} className="text-primary" />}
                title="EDIT_ITEM"
                subtitle="UPDATE_ROTATING_TEXT"
            />

            <ErrorMessage error={updateMutation.error || deleteMutation.error} />

            <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
                <div className="backdrop-blur-sm bg-black/20 border border-white/5 rounded-lg p-5 space-y-6">
                    <CyberInput
                        label="TEXT"
                        value={form.text}
                        onChange={(e) => setForm({ ...form, text: e.target.value })}
                        placeholder="e.g. Software Architect"
                        required
                    />

                    <div className="flex items-center gap-3">
                        <label className="text-xs font-mono text-slate-500 uppercase tracking-wider min-w-[100px]">STATUS</label>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, isActive: !form.isActive })}
                            className={`
                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900
                                ${form.isActive ? 'bg-violet-600' : 'bg-slate-700'}
                            `}
                        >
                            <span
                                className={`
                                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                    ${form.isActive ? 'translate-x-6' : 'translate-x-1'}
                                `}
                            />
                        </button>
                        <span className="text-xs font-mono text-slate-400">
                            {form.isActive ? 'ACTIVE' : 'PASSIVE'}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3 justify-between">
                    <div className="flex gap-3">
                        <CyberButton
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={updateMutation.isPending}
                        >
                            <Save size={12} />
                            {updateMutation.isPending ? 'SAVING...' : 'SAVE_CHANGES'}
                        </CyberButton>
                        <Link href="/admin/mindmap">
                            <CyberButton type="button" variant="ghost" size="md">
                                CANCEL
                            </CyberButton>
                        </Link>
                    </div>

                    <CyberButton
                        type="button"
                        variant="danger"
                        size="md"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this item?')) {
                                deleteMutation.mutate(id);
                            }
                        }}
                        disabled={deleteMutation.isPending}
                    >
                        <Trash2 size={12} />
                        DELETE
                    </CyberButton>
                </div>
            </form>
        </div>
    );
}

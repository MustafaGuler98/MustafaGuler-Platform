'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Save, Trash2, FileText } from 'lucide-react';
import { articleAdminService, categoryAdminService } from '@/services/admin';
import { useResourceById, useResourceList, useUpdateResource, useDeleteResource } from '@/hooks/admin';
import { AdminPageHeader, ErrorMessage, LoadingState } from '@/components/admin/layout';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberInput } from '@/components/ui/cyber/CyberInput';
import { CyberSelect } from '@/components/ui/cyber/CyberSelect';
import { MarkdownEditor } from '@/components/admin/ui/MarkdownEditor';
import { CyberConfirmationModal } from '@/components/ui/cyber/CyberConfirmationModal';
import type { AdminArticle, Category } from '@/types/admin';

export default function EditArticlePage() {
    const params = useParams();
    const id = params.id as string;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [form, setForm] = useState({
        id: '',
        title: '',
        content: '',
        categoryId: '',
        languageCode: 'en',
        mainImage: '',
    });

    const { data: article, isLoading: articleLoading } = useResourceById<AdminArticle>(
        'article',
        id,
        (id) => articleAdminService.getById(id)
    );

    const { data: categories = [] } = useResourceList<Category>(
        'categories',
        () => categoryAdminService.getAll()
    );

    useEffect(() => {
        if (article) {
            setForm({
                id: article.id,
                title: article.title,
                content: article.content,
                categoryId: article.categoryId,
                languageCode: article.languageCode,
                mainImage: article.mainImage || '',
            });
        }
    }, [article]);

    const updateMutation = useUpdateResource<AdminArticle>(
        'articles',
        (id, data) => articleAdminService.update(id, data),
        {
            onSuccessRedirect: '/admin/articles',
            invalidateQueries: ['articles', 'article'],
        }
    );

    const deleteMutation = useDeleteResource(
        'articles',
        (id) => articleAdminService.delete(id),
        { onSuccessRedirect: '/admin/articles' }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({ id: form.id, data: form });
    };

    // Open modal instead of native confirm
    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    // Actual delete trigger called by modal
    const handleConfirmDelete = () => {
        deleteMutation.mutate(id);
    };

    if (articleLoading) {
        return <LoadingState />;
    }

    return (
        <div className="space-y-8">
            <CyberConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="DELETE_ARTICLE"
                message="Are you sure you want to delete this article? This action cannot be undone."
                confirmText="DELETE_PERMANENTLY"
                isLoading={deleteMutation.isPending}
            />

            <AdminPageHeader
                backHref="/admin/articles"
                icon={<FileText size={14} className="text-violet-400" />}
                title="EDIT_ARTICLE"
                subtitle={`ID: ${id.substring(0, 8)}...`}
                action={
                    <CyberButton
                        variant="danger"
                        size="sm"
                        onClick={handleDeleteClick}
                        disabled={deleteMutation.isPending}
                    >
                        <Trash2 size={12} />
                        DELETE
                    </CyberButton>
                }
            />

            <ErrorMessage error={updateMutation.error || deleteMutation.error} />

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Editor (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        <CyberInput
                            label="TITLE"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Enter article title..."
                            required
                        />

                        <MarkdownEditor
                            value={form.content}
                            onChange={(value) => setForm({ ...form, content: value })}
                        />
                    </div>

                    {/* Right: Settings Panel (1/3) */}
                    <div className="space-y-6">
                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-5 space-y-6">
                            <h3 className="font-mono text-[10px] text-violet-400 tracking-widest">
                                SETTINGS
                            </h3>

                            {/* Category */}
                            <CyberSelect
                                label="CATEGORY"
                                value={form.categoryId}
                                onChange={(val) => setForm({ ...form, categoryId: String(val) })}
                                options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                                required
                            />

                            {/* Language */}
                            <CyberSelect
                                label="LANGUAGE"
                                value={form.languageCode}
                                onChange={(val) => setForm({ ...form, languageCode: String(val) })}
                                options={[
                                    { value: 'en', label: 'EN' },
                                    { value: 'tr', label: 'TR' }
                                ]}
                            />

                            <CyberInput
                                label="COVER_IMAGE"
                                value={form.mainImage}
                                onChange={(e) => setForm({ ...form, mainImage: e.target.value })}
                                placeholder="/uploads/img.jpg"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <CyberButton
                                type="submit"
                                variant="primary"
                                size="md"
                                fullWidth
                                disabled={updateMutation.isPending}
                            >
                                <Save size={12} />
                                {updateMutation.isPending ? 'SAVING...' : 'UPDATE'}
                            </CyberButton>
                            <Link href="/admin/articles" className="w-full">
                                <CyberButton type="button" variant="ghost" size="md" fullWidth>
                                    CANCEL
                                </CyberButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}


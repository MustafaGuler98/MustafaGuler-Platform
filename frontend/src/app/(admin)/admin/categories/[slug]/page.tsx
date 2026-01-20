'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Save, FolderTree, Trash2 } from 'lucide-react';
import { categoryAdminService } from '@/services/admin';
import { useResourceBySlug, useUpdateResource, useDeleteResource } from '@/hooks/admin';
import { AdminPageHeader, ErrorMessage, LoadingState } from '@/components/admin/layout';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberInput } from '@/components/ui/cyber/CyberInput';
import { CyberConfirmationModal } from '@/components/ui/cyber/CyberConfirmationModal';
import type { Category } from '@/types/admin';

export default function EditCategoryPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [form, setForm] = useState({
        id: '',
        name: '',
        slug: '',
        description: '',
    });

    const { data: category, isLoading } = useResourceBySlug<Category>(
        'category',
        slug,
        (slug) => categoryAdminService.getBySlug(slug)
    );

    useEffect(() => {
        if (category) {
            setForm({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description || '',
            });
        }
    }, [category]);

    const updateMutation = useUpdateResource<Category>(
        'categories',
        (id, data) => categoryAdminService.update(id, data),
        { onSuccessRedirect: '/admin/categories' }
    );

    const deleteMutation = useDeleteResource(
        'categories',
        (id) => categoryAdminService.delete(id),
        { onSuccessRedirect: '/admin/categories' }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({ id: form.id, data: form });
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        // We use ID for deletion to avoid issues with slug changes
        if (form.id) {
            deleteMutation.mutate(form.id);
        }
    };

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <div className="space-y-8">
            <CyberConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="DELETE_CATEGORY"
                message="Are you sure you want to delete this category? This action cannot be undone."
                confirmText="DELETE_PERMANENTLY"
                isLoading={deleteMutation.isPending}
            />

            <AdminPageHeader
                backHref="/admin/categories"
                icon={<FolderTree size={14} className="text-primary" />}
                title="EDIT_CATEGORY"
                subtitle={`/${slug}`}
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

            <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
                <div className="backdrop-blur-sm bg-black/20 border border-white/5 rounded-lg p-6 space-y-6">
                    <CyberInput
                        label="NAME"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter category name..."
                        required
                    />

                    <CyberInput
                        label="SLUG"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        placeholder="e.g. technology"
                        required
                    />

                    <CyberInput
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
                        disabled={updateMutation.isPending}
                    >
                        <Save size={12} />
                        {updateMutation.isPending ? 'SAVING...' : 'UPDATE'}
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

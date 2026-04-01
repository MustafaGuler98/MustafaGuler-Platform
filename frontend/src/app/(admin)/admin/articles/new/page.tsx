'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Save, FileText } from 'lucide-react';
import { articleAdminService, categoryAdminService } from '@/services/admin';
import { useResourceList, useCreateResource } from '@/hooks/admin';
import { AdminPageHeader, ErrorMessage } from '@/components/admin/layout';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberInput } from '@/components/ui/cyber/CyberInput';
import { CyberSelect } from '@/components/ui/cyber/CyberSelect';
import { TiptapEditor } from '@/components/admin/ui/TiptapEditor';
import type { Category, ArticleFormData } from '@/types/admin';

export default function NewArticlePage() {
    const [form, setForm] = useState<ArticleFormData>({
        title: '',
        content: '',
        contentHtml: '',
        categoryId: '',
        languageCode: 'en',
        mainImage: '',
    });

    const { data: categories = [] } = useResourceList<Category>(
        'categories',
        () => categoryAdminService.getAll()
    );

    const mutation = useCreateResource(
        'articles',
        (data: ArticleFormData) => articleAdminService.create(data),
        { onSuccessRedirect: '/admin/articles' }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(form);
    };

    return (
        <div className="space-y-8">
            <AdminPageHeader
                backHref="/admin/articles"
                icon={<FileText size={14} className="text-primary" />}
                title="NEW_ARTICLE"
                subtitle="CREATE_BLOG_POST"
            />

            <ErrorMessage error={mutation.error} />

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Primary Tiptap Editor Instance */}
                    <div className="lg:col-span-2 space-y-6">
                        <CyberInput
                            label="TITLE"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Enter article title..."
                            required
                        />

                        <TiptapEditor
                            content={form.content}
                            onChange={(json, html) => setForm({ ...form, content: json, contentHtml: html })}
                        />
                    </div>

                    {/* Right Column: Sticky Article Metadata Settings Form */}
                    <div className="space-y-6 sticky top-8">
                        <div className="backdrop-blur-sm bg-black/20 border border-white/5 rounded-lg p-5 space-y-6 flex flex-col">
                            <h3 className="font-mono text-[10px] text-primary tracking-widest">
                                SETTINGS
                            </h3>

                            {/* Article Category Selection Wrapper */}
                            <CyberSelect
                                label="CATEGORY"
                                value={form.categoryId}
                                onChange={(val) => setForm({ ...form, categoryId: String(val) })}
                                options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                            />

                            {/* Article Language Code Specification */}
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
                                disabled={mutation.isPending}
                            >
                                <Save size={12} />
                                {mutation.isPending ? 'SAVING...' : 'PUBLISH'}
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

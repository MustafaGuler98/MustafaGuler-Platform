'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Save, FileText } from 'lucide-react';
import { articleAdminService, categoryAdminService } from '@/services/admin';
import { useResourceList, useCreateResource } from '@/hooks/admin';
import { AdminPageHeader, ErrorMessage } from '@/components/admin/layout';
import { CyberButton } from '@/components/admin/ui/CyberButton';
import { TerminalInput } from '@/components/admin/ui/TerminalInput';
import { MarkdownEditor } from '@/components/admin/ui/MarkdownEditor';
import type { Category, ArticleFormData } from '@/types/admin';

export default function NewArticlePage() {
    const [form, setForm] = useState<ArticleFormData>({
        title: '',
        content: '',
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Editor (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        <TerminalInput
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
                        <div className="backdrop-blur-sm bg-black/20 border border-white/5 rounded-lg p-5 space-y-6">
                            <h3 className="font-mono text-[10px] text-primary tracking-widest">
                                SETTINGS
                            </h3>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="block text-[10px] text-primary font-mono uppercase tracking-widest">
                                    CATEGORY
                                </label>
                                <select
                                    value={form.categoryId}
                                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                    required
                                    className="w-full bg-transparent border-b border-white/20 focus:border-cyan-neon px-0 py-3 text-foreground focus:outline-none transition-colors duration-300 font-mono text-sm"
                                >
                                    <option value="" className="bg-[#0a0118]">
                                        SELECT...
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id} className="bg-[#0a0118]">
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Language */}
                            <div className="space-y-2">
                                <label className="block text-[10px] text-primary font-mono uppercase tracking-widest">
                                    LANGUAGE
                                </label>
                                <select
                                    value={form.languageCode}
                                    onChange={(e) => setForm({ ...form, languageCode: e.target.value })}
                                    className="w-full bg-transparent border-b border-white/20 focus:border-cyan-neon px-0 py-3 text-foreground focus:outline-none transition-colors duration-300 font-mono text-sm"
                                >
                                    <option value="en" className="bg-[#0a0118]">
                                        EN
                                    </option>
                                    <option value="tr" className="bg-[#0a0118]">
                                        TR
                                    </option>
                                </select>
                            </div>

                            <TerminalInput
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

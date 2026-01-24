'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, Star, Eye, Calendar, FileText } from 'lucide-react';
import { bookAdminService } from '@/services/admin/archivesAdminService';
import { useResourceById, useUpdateResource, useDeleteResource, useCreateResource } from '@/hooks/admin';
import { getImageUrl } from '@/lib/utils';
import { ArchiveDashboardLayout, DashboardStatCard } from '@/components/admin/archives';
import { TerminalImagePicker } from '@/components/admin/archives/TerminalImagePicker';
import { LoadingState } from '@/components/admin/layout';
import { CyberInput } from '@/components/ui/cyber/CyberInput';
import { CyberSelect } from '@/components/ui/cyber/CyberSelect';
import { CyberConfirmationModal } from '@/components/ui/cyber/CyberConfirmationModal';
import { ValidationError } from '@/components/ui/cyber/ValidationError';
import type { Book, UpdateBook, CreateBook } from '@/types/archives';
import { ReadingStatus, readingStatusLabels } from '@/types/archives';

export default function EditBookPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNewMode = id === 'new';
    const hasRedirected = useRef(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [form, setForm] = useState<UpdateBook>({
        title: '',
        author: '',
        pageCount: undefined,
        currentPage: undefined,
        publishYear: undefined,
        readingStatus: ReadingStatus.PlanToRead,
        coverImageUrl: '',
        description: '',
        myReview: '',
        myRating: undefined,
        consumedYear: undefined,
    });

    const { data: book, isLoading } = useResourceById<Book>(
        'archives-book',
        isNewMode ? '' : id,
        (id) => bookAdminService.getById(id),
        { enabled: !isNewMode }
    );

    useEffect(() => {
        if (book && !isNewMode) {
            setForm({
                title: book.title,
                author: book.author,
                pageCount: book.pageCount,
                currentPage: book.currentPage,
                publishYear: book.publishYear,
                readingStatus: book.readingStatus,
                coverImageUrl: book.coverImageUrl || '',
                description: book.description || '',
                myReview: book.myReview || '',
                myRating: book.myRating,
                consumedYear: book.consumedYear,
            });
        }
    }, [book, isNewMode]);

    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (isNewMode) {
            setIsDirty(form.title !== '' || form.author !== '');
            return;
        }
        if (!book) return;

        const initialForm: UpdateBook = {
            title: book.title,
            author: book.author,
            pageCount: book.pageCount,
            currentPage: book.currentPage,
            publishYear: book.publishYear,
            readingStatus: book.readingStatus,
            coverImageUrl: book.coverImageUrl || '',
            description: book.description || '',
            myReview: book.myReview || '',
            myRating: book.myRating,
            consumedYear: book.consumedYear,
        };

        setIsDirty(JSON.stringify(form) !== JSON.stringify(initialForm));
    }, [form, book, isNewMode]);

    const createMutation = useCreateResource<Book, CreateBook>(
        'archives-books',
        (data) => bookAdminService.createBook(data),
        { invalidateQueries: ['archives-books', 'archives-book'] }
    );

    const updateMutation = useUpdateResource<Book>(
        'archives-books',
        (id, data) => bookAdminService.updateBook(id, data as UpdateBook),
        { invalidateQueries: ['archives-books', 'archives-book'] }
    );

    const deleteMutation = useDeleteResource(
        'archives-books',
        (id) => bookAdminService.delete(id),
        { onSuccessRedirect: '/admin/archives/books' }
    );

    // Redirect to edit page after successful creation
    useEffect(() => {
        if (createMutation.isSuccess && createMutation.data?.id && !hasRedirected.current) {
            hasRedirected.current = true;
            setIsDirty(false);
            router.replace(`/admin/archives/books/${createMutation.data.id}`);
        }
    }, [createMutation.isSuccess, createMutation.data, router]);

    const validateForm = (): boolean => {
        const errors: string[] = [];
        if (!form.title?.trim()) errors.push('Title is required');
        if (!form.author?.trim()) errors.push('Author is required');
        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        if (isNewMode) {
            createMutation.mutate(form as CreateBook);
        } else {
            updateMutation.mutate({ id, data: form });
        }
    };

    const statusOptions = Object.entries(readingStatusLabels).map(([value, label]) => ({
        value: parseInt(value),
        label,
    }));

    if (!isNewMode && isLoading) return <LoadingState />;

    const mutationError = isNewMode ? createMutation.error : (updateMutation.error || deleteMutation.error);
    const isPending = isNewMode ? createMutation.isPending : updateMutation.isPending;

    return (
        <>
            {!isNewMode && (
                <CyberConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => deleteMutation.mutate(id)} title="DELETE_BOOK" message="Are you sure?" confirmText="DELETE_PERMANENTLY" isLoading={deleteMutation.isPending} />
            )}

            <ArchiveDashboardLayout
                backHref="/admin/archives/books"
                icon={<BookOpen size={18} className="text-emerald-400" />}
                title={isNewMode ? "NEW_BOOK" : "EDIT_BOOK"}
                subtitle={isNewMode ? "Add to collection" : (book?.title || '')}
                error={mutationError}
                isLoading={!isNewMode && isLoading}
                isPending={isPending}
                isDirty={isDirty}
                onSubmit={handleSubmit}
                onDelete={isNewMode ? undefined : () => setIsDeleteModalOpen(true)}
                isDeletePending={deleteMutation.isPending}
                submitLabel={isNewMode ? "CREATE_BOOK" : "UPDATE_BOOK"}

                stats={
                    <>
                        <DashboardStatCard label="STATUS" value={readingStatusLabels[form.readingStatus]} icon={<Eye size={18} />} colorClass="text-emerald-400 bg-emerald-400/10" />
                        <DashboardStatCard label="RATING" value={form.myRating} icon={<Star size={18} />} colorClass="text-yellow-400 bg-yellow-400/10" />
                        <DashboardStatCard label="YEAR" value={form.publishYear} icon={<Calendar size={18} />} colorClass="text-blue-400 bg-blue-400/10" />
                        <DashboardStatCard label="PAGES" value={form.pageCount} icon={<FileText size={18} />} colorClass="text-purple-400 bg-purple-400/10" />
                    </>
                }

                sidebar={
                    <div className="space-y-6">
                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-4 text-center space-y-4">
                            <div className="w-24 h-36 mx-auto rounded shadow-lg overflow-hidden border border-white/10 relative group bg-black">
                                {form.coverImageUrl ? (
                                    <img src={getImageUrl(form.coverImageUrl)} className="w-full h-full object-cover" alt="Book Cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700"><BookOpen /></div>
                                )}
                            </div>
                            <TerminalImagePicker label="COVER IMAGE" value={form.coverImageUrl || ''} onChange={(val) => setForm({ ...form, coverImageUrl: val })} />
                        </div>

                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                            <CyberInput label="AUTHOR" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
                            <CyberSelect label="STATUS" value={form.readingStatus} onChange={(value) => setForm({ ...form, readingStatus: value as ReadingStatus })} options={statusOptions} />
                        </div>

                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <CyberInput label="YEAR" type="number" value={form.publishYear?.toString() || ''} onChange={(e) => setForm({ ...form, publishYear: e.target.value ? parseInt(e.target.value) : undefined })} />
                                <CyberInput label="PAGES" type="number" value={form.pageCount?.toString() || ''} onChange={(e) => setForm({ ...form, pageCount: e.target.value ? parseInt(e.target.value) : undefined })} />
                                <CyberInput label="CURRENT_PAGE" type="number" value={form.currentPage?.toString() || ''} onChange={(e) => setForm({ ...form, currentPage: e.target.value ? parseInt(e.target.value) : undefined })} />
                            </div>
                            <CyberInput label="RATING" type="number" value={form.myRating?.toString() || ''} onChange={(e) => setForm({ ...form, myRating: e.target.value ? parseInt(e.target.value) : undefined })} />
                            <CyberInput label="READ_YEAR" type="number" value={form.consumedYear?.toString() || ''} onChange={(e) => setForm({ ...form, consumedYear: e.target.value ? parseInt(e.target.value) : undefined })} />
                        </div>
                    </div>
                }
            >
                <ValidationError errors={validationErrors} />
                <CyberInput label="TITLE" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                <CyberInput label="DESCRIPTION" type="textarea" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} />
                <CyberInput label="MY_REVIEW" type="textarea" value={form.myReview || ''} onChange={(e) => setForm({ ...form, myReview: e.target.value })} rows={10} />
            </ArchiveDashboardLayout>
        </>
    );
}

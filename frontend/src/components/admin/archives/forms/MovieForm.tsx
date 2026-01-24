'use client';

import { useState, useEffect } from 'react';
import { Film, Star, Eye, Calendar, Clock } from 'lucide-react';
import { ArchiveDashboardLayout, DashboardStatCard } from '@/components/admin/archives';
import { TerminalImagePicker } from '@/components/admin/archives/TerminalImagePicker';
import { getImageUrl } from '@/lib/utils';
import { CyberInput } from '@/components/ui/cyber/CyberInput';
import { CyberSelect } from '@/components/ui/cyber/CyberSelect';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberSaveButton } from '@/components/ui/cyber/CyberSaveButton';
import { ValidationError } from '@/components/ui/cyber/ValidationError';
import type { UpdateMovie } from '@/types/archives';
import { WatchStatus, watchStatusLabels } from '@/types/archives';

interface MovieFormProps {
    initialData?: UpdateMovie;
    onSubmit: (data: UpdateMovie) => void;
    isPending: boolean;
    onDelete?: () => void;
    isNewMode?: boolean;
}

export function MovieForm({
    initialData,
    onSubmit,
    isPending,
    onDelete,
    isNewMode = false
}: MovieFormProps) {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const defaultForm: UpdateMovie = {
        title: '',
        director: '',
        releaseYear: undefined,
        durationMinutes: undefined,
        coverImageUrl: '',
        description: '',
        myReview: '',
        myRating: undefined,
        consumedYear: undefined,
        status: WatchStatus.PlanToWatch,
    };

    const normalizeMovie = (data: any): UpdateMovie => {
        const n = (v: any) => (v === null ? undefined : v);
        const s = (v: any) => (v === null ? '' : v);

        return {
            title: s(data.title),
            director: s(data.director),
            releaseYear: n(data.releaseYear),
            durationMinutes: n(data.durationMinutes),
            coverImageUrl: s(data.coverImageUrl),
            description: s(data.description),
            myReview: s(data.myReview),
            myRating: n(data.myRating),
            consumedYear: n(data.consumedYear),
            status: data.status ?? WatchStatus.PlanToWatch,
        };
    };

    const [form, setForm] = useState<UpdateMovie>(defaultForm);
    const [isFormDirty, setIsFormDirty] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm(normalizeMovie(initialData));
        }
    }, [initialData]);

    useEffect(() => {
        if (isNewMode) {
            setIsFormDirty(form.title !== '' || form.director !== '');
            return;
        }

        if (!initialData) return;

        const cleanInitial = normalizeMovie(initialData);

        const isModified = (Object.keys(defaultForm) as (keyof UpdateMovie)[]).some(key => {
            const formVal = form[key];
            const initialVal = cleanInitial[key];

            const normalizedForm = (formVal === null || formVal === undefined || formVal === '') ? undefined : formVal;
            const normalizedInitial = (initialVal === null || initialVal === undefined || initialVal === '') ? undefined : initialVal;

            return normalizedForm !== normalizedInitial;
        });

        setIsFormDirty(isModified);
    }, [form, initialData, isNewMode]);

    const validateForm = (): boolean => {
        const errors: string[] = [];
        if (!form.title?.trim()) errors.push('Title is required');
        if (!form.director?.trim()) errors.push('Director is required');
        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        onSubmit(form);
    };

    const statusOptions = Object.entries(watchStatusLabels).map(([v, l]) => ({ value: parseInt(v), label: l }));

    return (
        <ArchiveDashboardLayout
            title={isNewMode ? "NEW_MOVIE" : "EDIT_MOVIE"}
            subtitle={isNewMode ? "Add to collection" : (form.title || 'Untitled Movie')}
            backHref="/admin/archives/movies"
            icon={<Film size={18} className="text-purple-400" />}
            onSubmit={handleSubmit}
            onDelete={onDelete}
            isPending={isPending}
            isDirty={isFormDirty}
            submitLabel={isNewMode ? "CREATE_MOVIE" : "UPDATE_MOVIE"}
            stats={
                <>
                    <DashboardStatCard label="RATING" value={form.myRating} icon={<Star size={18} />} colorClass="text-yellow-400 bg-yellow-400/10" />
                    <DashboardStatCard label="YEAR" value={form.releaseYear} icon={<Calendar size={18} />} colorClass="text-blue-400 bg-blue-400/10" />
                    <DashboardStatCard label="DURATION" value={form.durationMinutes} icon={<Clock size={18} />} colorClass="text-purple-400 bg-purple-400/10" />
                    <DashboardStatCard label="STATUS" value={watchStatusLabels[form.status || 0]} icon={<Eye size={18} />} colorClass="text-emerald-400 bg-emerald-400/10" />
                </>
            }
            sidebar={
                <div className="space-y-6">
                    <div className="bg-slate-900/40 border border-white/5 rounded-lg p-4 text-center space-y-4">
                        <div className="w-24 h-36 mx-auto rounded shadow-lg overflow-hidden border border-white/10 relative group bg-black">
                            <div className="w-24 h-36 mx-auto rounded shadow-lg overflow-hidden border border-white/10 relative group bg-black">
                                {form.coverImageUrl ? (
                                    <img src={getImageUrl(form.coverImageUrl)} className="w-full h-full object-cover" alt="Movie Cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700"><Film /></div>
                                )}
                            </div>
                        </div>
                        <TerminalImagePicker
                            label="COVER IMAGE"
                            value={form.coverImageUrl || ''}
                            onChange={(url) => setForm({ ...form, coverImageUrl: url })}
                        />
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                        <CyberInput
                            label="DIRECTOR"
                            value={form.director}
                            onChange={(e) => setForm({ ...form, director: e.target.value })}
                            required
                        />
                        <CyberSelect
                            label="STATUS"
                            value={form.status ?? 0}
                            onChange={(V) => setForm({ ...form, status: Number(V) })}
                            options={statusOptions}
                        />
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <CyberInput
                                label="YEAR"
                                type="number"
                                value={form.releaseYear?.toString() || ''}
                                onChange={(e) => setForm({ ...form, releaseYear: e.target.value ? parseInt(e.target.value) : undefined })}
                            />
                            <CyberInput
                                label="RATING"
                                type="number"
                                value={form.myRating?.toString() || ''}
                                onChange={(e) => setForm({ ...form, myRating: e.target.value ? parseInt(e.target.value) : undefined })}
                            />
                        </div>
                        <CyberInput
                            label="DURATION"
                            type="number"
                            value={form.durationMinutes?.toString() || ''}
                            onChange={(e) => setForm({ ...form, durationMinutes: e.target.value ? parseInt(e.target.value) : undefined })}
                        />
                        <CyberInput
                            label="WATCH_DATE"
                            type="number"
                            value={form.consumedYear?.toString() || ''}
                            onChange={(e) => setForm({ ...form, consumedYear: e.target.value ? parseInt(e.target.value) : undefined })}
                        />
                    </div>
                </div>
            }
        >
            <ValidationError errors={validationErrors} />
            <CyberInput
                label="TITLE"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
            />
            <CyberInput
                label="DESCRIPTION"
                type="textarea"
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={6}
            />
            <CyberInput
                label="MY_REVIEW"
                type="textarea"
                value={form.myReview || ''}
                onChange={(e) => setForm({ ...form, myReview: e.target.value })}
                rows={10}
            />
        </ArchiveDashboardLayout>
    );
}

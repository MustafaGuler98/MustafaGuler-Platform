'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tv, Star, Eye, Calendar, Layers } from 'lucide-react';
import { tvSeriesAdminService } from '@/services/admin/archivesAdminService';
import { useResourceById, useUpdateResource, useDeleteResource, useCreateResource } from '@/hooks/admin';
import { getImageUrl } from '@/lib/utils';
import { LoadingState } from '@/components/admin/layout';
import { ArchiveDashboardLayout, DashboardStatCard } from '@/components/admin/archives';
import { CyberInput } from '@/components/ui/cyber/CyberInput';
import { CyberSelect } from '@/components/ui/cyber/CyberSelect';
import { TerminalImagePicker } from '@/components/admin/archives/TerminalImagePicker';
import { CyberConfirmationModal } from '@/components/ui/cyber/CyberConfirmationModal';
import { ValidationError } from '@/components/ui/cyber/ValidationError';
import type { TvSeries, UpdateTvSeries, CreateTvSeries } from '@/types/archives';
import { WatchStatus, watchStatusLabels } from '@/types/archives';

const statusOptions = Object.entries(watchStatusLabels).map(([v, l]) => ({ value: parseInt(v), label: l }));

export default function EditTvSeriesPage() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const isNewMode = id === 'new';
    const hasRedirected = useRef(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [form, setForm] = useState<UpdateTvSeries>({ title: '', status: WatchStatus.PlanToWatch });

    const { data, isLoading } = useResourceById<TvSeries>(
        'archives-tvseries',
        isNewMode ? '' : id,
        (id) => tvSeriesAdminService.getById(id),
        { enabled: !isNewMode }
    );

    useEffect(() => {
        if (data && !isNewMode) setForm({
            title: data.title,
            startYear: data.startYear,
            endYear: data.endYear,
            totalSeasons: data.totalSeasons,
            totalEpisodes: data.totalEpisodes,
            currentEpisode: data.currentEpisode,
            status: data.status,
            coverImageUrl: data.coverImageUrl || '',
            description: data.description || '',
            myReview: data.myReview || '',
            myRating: data.myRating,
            consumedYear: data.consumedYear
        });
    }, [data, isNewMode]);

    const [isDirty, setIsDirty] = useState(false);
    useEffect(() => {
        if (isNewMode) { setIsDirty(form.title !== ''); return; }
        if (!data) return;
        const initial = { title: data.title, startYear: data.startYear, endYear: data.endYear, totalSeasons: data.totalSeasons, totalEpisodes: data.totalEpisodes, currentEpisode: data.currentEpisode, status: data.status, coverImageUrl: data.coverImageUrl || '', description: data.description || '', myReview: data.myReview || '', myRating: data.myRating, consumedYear: data.consumedYear };
        setIsDirty(JSON.stringify(form) !== JSON.stringify(initial));
    }, [form, data, isNewMode]);

    const createMutation = useCreateResource<TvSeries, CreateTvSeries>('archives-tvseries', (d) => tvSeriesAdminService.createTvSeries(d), { invalidateQueries: ['archives-tvseries'] });
    const updateMutation = useUpdateResource<TvSeries>('archives-tvseries', (id, d) => tvSeriesAdminService.updateTvSeries(id, d as UpdateTvSeries), { invalidateQueries: ['archives-tvseries'] });
    const deleteMutation = useDeleteResource('archives-tvseries', (id) => tvSeriesAdminService.delete(id), { onSuccessRedirect: '/admin/archives/tvseries' });

    // Redirect to edit page after successful creation
    useEffect(() => {
        if (createMutation.isSuccess && createMutation.data?.id && !hasRedirected.current) {
            hasRedirected.current = true;
            setIsDirty(false);
            router.replace(`/admin/archives/tvseries/${createMutation.data.id}`);
        }
    }, [createMutation.isSuccess, createMutation.data, router]);

    const validateForm = (): boolean => {
        const errors: string[] = [];
        if (!form.title?.trim()) errors.push('Title is required');
        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        if (isNewMode) createMutation.mutate(form as CreateTvSeries);
        else updateMutation.mutate({ id, data: form });
    };

    if (!isNewMode && isLoading) return <LoadingState />;

    const mutationError = isNewMode ? createMutation.error : (updateMutation.error || deleteMutation.error);
    const isPending = isNewMode ? createMutation.isPending : updateMutation.isPending;

    return (
        <>
            {!isNewMode && <CyberConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => deleteMutation.mutate(id)} title="DELETE_TV_SERIES" message="Are you sure?" confirmText="DELETE_PERMANENTLY" isLoading={deleteMutation.isPending} />}

            <ArchiveDashboardLayout
                backHref="/admin/archives/tvseries"
                icon={<Tv size={18} className="text-blue-400" />}
                title={isNewMode ? "NEW_TV_SERIES" : "EDIT_TV_SERIES"}
                subtitle={isNewMode ? "Add to collection" : (data?.title || '')}
                error={mutationError}
                isLoading={!isNewMode && isLoading}
                isPending={isPending}
                isDirty={isDirty}
                onSubmit={handleSubmit}
                onDelete={isNewMode ? undefined : () => setIsDeleteModalOpen(true)}
                isDeletePending={deleteMutation.isPending}
                submitLabel={isNewMode ? "CREATE_TV_SERIES" : "UPDATE_TV_SERIES"}

                stats={
                    <>
                        <DashboardStatCard label="STATUS" value={watchStatusLabels[form.status]} icon={<Eye size={18} />} colorClass="text-emerald-400 bg-emerald-400/10" />
                        <DashboardStatCard label="RATING" value={form.myRating} icon={<Star size={18} />} colorClass="text-yellow-400 bg-yellow-400/10" />
                        <DashboardStatCard label="YEARS" value={`${form.startYear || '?'} - ${form.endYear || '?'}`} icon={<Calendar size={18} />} colorClass="text-blue-400 bg-blue-400/10" />
                        <DashboardStatCard label="SEASONS" value={form.totalSeasons} icon={<Layers size={18} />} colorClass="text-purple-400 bg-purple-400/10" />
                    </>
                }

                sidebar={
                    <div className="space-y-6">
                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-4 text-center space-y-4">
                            <div className="w-24 h-36 mx-auto rounded shadow-lg overflow-hidden border border-white/10 relative group bg-black">
                                {form.coverImageUrl ? (<img src={getImageUrl(form.coverImageUrl)} className="w-full h-full object-cover" alt="TV Cover" />) : (<div className="w-full h-full flex items-center justify-center text-zinc-700"><Tv /></div>)}
                            </div>
                            <TerminalImagePicker label="COVER IMAGE" value={form.coverImageUrl || ''} onChange={(val) => setForm({ ...form, coverImageUrl: val })} />
                        </div>

                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <CyberInput label="SEASONS" type="number" value={form.totalSeasons?.toString() || ''} onChange={(e) => setForm({ ...form, totalSeasons: e.target.value ? parseInt(e.target.value) : undefined })} />
                                <CyberInput label="EPISODES" type="number" value={form.totalEpisodes?.toString() || ''} onChange={(e) => setForm({ ...form, totalEpisodes: e.target.value ? parseInt(e.target.value) : undefined })} />
                                <CyberInput label="CURRENT_EP" type="number" value={form.currentEpisode?.toString() || ''} onChange={(e) => setForm({ ...form, currentEpisode: e.target.value ? parseInt(e.target.value) : undefined })} />
                            </div>
                            <CyberSelect label="STATUS" value={form.status} onChange={(v) => setForm({ ...form, status: v as WatchStatus })} options={statusOptions} />
                        </div>

                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <CyberInput label="START_YEAR" type="number" value={form.startYear?.toString() || ''} onChange={(e) => setForm({ ...form, startYear: e.target.value ? parseInt(e.target.value) : undefined })} />
                                <CyberInput label="END_YEAR" type="number" value={form.endYear?.toString() || ''} onChange={(e) => setForm({ ...form, endYear: e.target.value ? parseInt(e.target.value) : undefined })} />
                            </div>
                            <CyberInput label="RATING" type="number" value={form.myRating?.toString() || ''} onChange={(e) => setForm({ ...form, myRating: e.target.value ? parseInt(e.target.value) : undefined })} />
                            <CyberInput label="WATCHED_YEAR" type="number" value={form.consumedYear?.toString() || ''} onChange={(e) => setForm({ ...form, consumedYear: e.target.value ? parseInt(e.target.value) : undefined })} />
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

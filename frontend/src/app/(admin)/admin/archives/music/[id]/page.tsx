'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Music as MusicIcon, Calendar, Star, Headphones, Tag } from 'lucide-react';
import { musicAdminService } from '@/services/admin/archivesAdminService';
import { LoadingState } from '@/components/admin/layout';
import { getImageUrl } from '@/lib/utils';
import { ArchiveDashboardLayout, DashboardStatCard } from '@/components/admin/archives';
import { TerminalImagePicker } from '@/components/admin/archives/TerminalImagePicker';
import { CyberInput } from '@/components/ui/cyber/CyberInput';
import { CyberConfirmationModal } from '@/components/ui/cyber/CyberConfirmationModal';
import { ValidationError } from '@/components/ui/cyber/ValidationError';
import { useResourceById } from '@/hooks/admin/useResourceQuery';
import { useCreateResource, useUpdateResource, useDeleteResource } from '@/hooks/admin/useResourceMutation';
import type { Music, UpdateMusic, CreateMusic } from '@/types/archives';

export default function EditMusicPage() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const isNewMode = id === 'new';
    const hasRedirected = useRef(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [form, setForm] = useState<UpdateMusic>({ title: '', artist: '' });

    const { data, isLoading } = useResourceById<Music>(
        'archives-music',
        isNewMode ? '' : id,
        (id) => musicAdminService.getById(id),
        { enabled: !isNewMode }
    );

    useEffect(() => {
        if (data && !isNewMode) setForm({
            title: data.title,
            artist: data.artist,
            album: data.album || '',
            releaseYear: data.releaseYear,
            genre: data.genre || '',
            spotifyId: data.spotifyId || '',
            coverImageUrl: data.coverImageUrl || '',
            description: data.description || '',
            myReview: data.myReview || '',
            myRating: data.myRating,
            consumedYear: data.consumedYear
        });
    }, [data, isNewMode]);

    const [isDirty, setIsDirty] = useState(false);
    useEffect(() => {
        if (isNewMode) { setIsDirty(form.title !== '' || form.artist !== ''); return; }
        if (!data) return;
        const initial = { title: data.title, artist: data.artist, album: data.album || '', releaseYear: data.releaseYear, genre: data.genre || '', spotifyId: data.spotifyId || '', coverImageUrl: data.coverImageUrl || '', description: data.description || '', myReview: data.myReview || '', myRating: data.myRating, consumedYear: data.consumedYear };
        setIsDirty(JSON.stringify(form) !== JSON.stringify(initial));
    }, [form, data, isNewMode]);

    const createMutation = useCreateResource<Music, CreateMusic>('archives-music', (d) => musicAdminService.createMusic(d), { invalidateQueries: ['archives-music'] });
    const updateMutation = useUpdateResource<Music>('archives-music', (id, d) => musicAdminService.updateMusic(id, d as UpdateMusic), { invalidateQueries: ['archives-music'] });
    const deleteMutation = useDeleteResource('archives-music', (id) => musicAdminService.delete(id), { onSuccessRedirect: '/admin/archives/music' });

    // Redirect to edit page after successful creation
    useEffect(() => {
        if (createMutation.isSuccess && createMutation.data?.id && !hasRedirected.current) {
            hasRedirected.current = true;
            setIsDirty(false);
            router.replace(`/admin/archives/music/${createMutation.data.id}`);
        }
    }, [createMutation.isSuccess, createMutation.data, router]);

    const validateForm = (): boolean => {
        const errors: string[] = [];
        if (!form.title?.trim()) errors.push('Title is required');
        if (!form.artist?.trim()) errors.push('Artist is required');
        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        if (isNewMode) createMutation.mutate(form as CreateMusic);
        else updateMutation.mutate({ id, data: form });
    };

    if (!isNewMode && isLoading) return <LoadingState />;

    const mutationError = isNewMode ? createMutation.error : (updateMutation.error || deleteMutation.error);
    const isPending = isNewMode ? createMutation.isPending : updateMutation.isPending;

    return (
        <>
            {!isNewMode && <CyberConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => deleteMutation.mutate(id)} title="DELETE_MUSIC" message="Are you sure?" confirmText="DELETE_PERMANENTLY" isLoading={deleteMutation.isPending} />}

            <ArchiveDashboardLayout
                backHref="/admin/archives/music"
                icon={<MusicIcon size={18} className="text-pink-400" />}
                title={isNewMode ? "NEW_MUSIC" : "EDIT_MUSIC"}
                subtitle={isNewMode ? "Add to collection" : `${data?.title} - ${data?.artist}`}
                error={mutationError}
                isLoading={!isNewMode && isLoading}
                isPending={isPending}
                isDirty={isDirty}
                onSubmit={handleSubmit}
                onDelete={isNewMode ? undefined : () => setIsDeleteModalOpen(true)}
                isDeletePending={deleteMutation.isPending}
                submitLabel={isNewMode ? "CREATE_MUSIC" : "UPDATE_MUSIC"}

                stats={
                    <>
                        <DashboardStatCard label="RELEASED" value={form.releaseYear} icon={<Calendar size={18} />} colorClass="text-blue-400 bg-blue-400/10" />
                        <DashboardStatCard label="RATING" value={form.myRating} icon={<Star size={18} />} colorClass="text-yellow-400 bg-yellow-400/10" />
                        <DashboardStatCard label="LISTENED" value={form.consumedYear} icon={<Headphones size={18} />} colorClass="text-purple-400 bg-purple-400/10" />
                        <DashboardStatCard label="GENRE" value={form.genre} icon={<Tag size={18} />} colorClass="text-cyan-400 bg-cyan-400/10" />
                    </>
                }

                sidebar={
                    <div className="space-y-6">
                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-4 text-center space-y-4">
                            <div className="w-24 h-24 mx-auto rounded shadow-lg overflow-hidden border border-white/10 relative group bg-black">
                                {form.coverImageUrl ? (<img src={getImageUrl(form.coverImageUrl)} className="w-full h-full object-cover" alt="Album Cover" />) : (<div className="w-full h-full flex items-center justify-center text-zinc-700"><MusicIcon /></div>)}
                            </div>
                            <TerminalImagePicker label="COVER IMAGE" value={form.coverImageUrl || ''} onChange={(val) => setForm({ ...form, coverImageUrl: val })} />
                        </div>

                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                            <CyberInput label="ARTIST" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} required />
                            <CyberInput label="ALBUM" value={form.album || ''} onChange={(e) => setForm({ ...form, album: e.target.value })} />
                            <CyberInput label="GENRE" value={form.genre || ''} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
                        </div>

                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <CyberInput label="YEAR" type="number" value={form.releaseYear?.toString() || ''} onChange={(e) => setForm({ ...form, releaseYear: e.target.value ? parseInt(e.target.value) : undefined })} />
                                <CyberInput label="RATING" type="number" value={form.myRating?.toString() || ''} onChange={(e) => setForm({ ...form, myRating: e.target.value ? parseInt(e.target.value) : undefined })} />
                            </div>
                            <CyberInput label="LISTENED_YEAR" type="number" value={form.consumedYear?.toString() || ''} onChange={(e) => setForm({ ...form, consumedYear: e.target.value ? parseInt(e.target.value) : undefined })} />
                            <CyberInput label="SPOTIFY_ID" value={form.spotifyId || ''} onChange={(e) => setForm({ ...form, spotifyId: e.target.value })} />
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

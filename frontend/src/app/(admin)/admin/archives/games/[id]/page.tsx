'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Gamepad2, Star, Eye, Calendar, Clock } from 'lucide-react';
import { gameAdminService } from '@/services/admin/archivesAdminService';
import { useResourceById, useUpdateResource, useDeleteResource, useCreateResource } from '@/hooks/admin';
import { LoadingState } from '@/components/admin/layout';
import { ArchiveDashboardLayout, DashboardStatCard } from '@/components/admin/archives';
import { CyberInput } from '@/components/ui/cyber/CyberInput';
import { CyberSelect } from '@/components/ui/cyber/CyberSelect';
import { TerminalImagePicker } from '@/components/admin/archives/TerminalImagePicker';
import { CyberConfirmationModal } from '@/components/ui/cyber/CyberConfirmationModal';
import { ValidationError } from '@/components/ui/cyber/ValidationError';
import type { Game, UpdateGame, CreateGame } from '@/types/archives';
import { GameStatus, gameStatusLabels } from '@/types/archives';

export default function EditGamePage() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const isNewMode = id === 'new';
    const hasRedirected = useRef(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [form, setForm] = useState<UpdateGame>({ title: '', status: GameStatus.Backlog });

    const { data, isLoading } = useResourceById<Game>(
        'archives-game',
        isNewMode ? '' : id,
        (id) => gameAdminService.getById(id),
        { enabled: !isNewMode }
    );

    useEffect(() => {
        if (data && !isNewMode) setForm({
            title: data.title,
            platform: data.platform || '',
            developer: data.developer || '',
            releaseYear: data.releaseYear,
            playtimeHours: data.playtimeHours,
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
        if (isNewMode) {
            setIsDirty(form.title !== '');
            return;
        }
        if (!data) return;
        const initial = { title: data.title, platform: data.platform || '', developer: data.developer || '', releaseYear: data.releaseYear, playtimeHours: data.playtimeHours, status: data.status, coverImageUrl: data.coverImageUrl || '', description: data.description || '', myReview: data.myReview || '', myRating: data.myRating, consumedYear: data.consumedYear };
        setIsDirty(JSON.stringify(form) !== JSON.stringify(initial));
    }, [form, data, isNewMode]);

    const createMutation = useCreateResource<Game, CreateGame>('archives-games', (d) => gameAdminService.createGame(d), { invalidateQueries: ['archives-games', 'archives-game'] });
    const updateMutation = useUpdateResource<Game>('archives-games', (id, d) => gameAdminService.updateGame(id, d as UpdateGame), { invalidateQueries: ['archives-games', 'archives-game'] });
    const deleteMutation = useDeleteResource('archives-games', (id) => gameAdminService.delete(id), { onSuccessRedirect: '/admin/archives/games' });

    // Redirect to edit page after successful creation
    useEffect(() => {
        if (createMutation.isSuccess && createMutation.data?.id && !hasRedirected.current) {
            hasRedirected.current = true;
            setIsDirty(false);
            router.replace(`/admin/archives/games/${createMutation.data.id}`);
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
        if (isNewMode) createMutation.mutate(form as CreateGame);
        else updateMutation.mutate({ id, data: form });
    };

    const statusOptions = Object.entries(gameStatusLabels).map(([v, l]) => ({ value: parseInt(v), label: l }));

    if (!isNewMode && isLoading) return <LoadingState />;

    const mutationError = isNewMode ? createMutation.error : (updateMutation.error || deleteMutation.error);
    const isPending = isNewMode ? createMutation.isPending : updateMutation.isPending;

    return (
        <>
            {!isNewMode && <CyberConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => deleteMutation.mutate(id)} title="DELETE_GAME" message="Are you sure?" confirmText="DELETE_PERMANENTLY" isLoading={deleteMutation.isPending} />}

            <ArchiveDashboardLayout
                backHref="/admin/archives/games"
                icon={<Gamepad2 size={18} className="text-cyan-400" />}
                title={isNewMode ? "NEW_GAME" : "EDIT_GAME"}
                subtitle={isNewMode ? "Add to collection" : (data?.title || '')}
                error={mutationError}
                isLoading={!isNewMode && isLoading}
                isPending={isPending}
                isDirty={isDirty}
                onSubmit={handleSubmit}
                onDelete={isNewMode ? undefined : () => setIsDeleteModalOpen(true)}
                isDeletePending={deleteMutation.isPending}
                submitLabel={isNewMode ? "CREATE_GAME" : "UPDATE_GAME"}

                stats={
                    <>
                        <DashboardStatCard label="STATUS" value={gameStatusLabels[form.status]} icon={<Eye size={18} />} colorClass="text-emerald-400 bg-emerald-400/10" />
                        <DashboardStatCard label="RATING" value={form.myRating} icon={<Star size={18} />} colorClass="text-yellow-400 bg-yellow-400/10" />
                        <DashboardStatCard label="YEAR" value={form.releaseYear} icon={<Calendar size={18} />} colorClass="text-blue-400 bg-blue-400/10" />
                        <DashboardStatCard label="HOURS" value={form.playtimeHours} icon={<Clock size={18} />} colorClass="text-purple-400 bg-purple-400/10" />
                    </>
                }

                sidebar={
                    <div className="space-y-6">
                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-4 text-center space-y-4">
                            <div className="w-24 h-36 mx-auto rounded shadow-lg overflow-hidden border border-white/10 relative group bg-black">
                                {form.coverImageUrl ? (<img src={form.coverImageUrl} className="w-full h-full object-cover" alt="Game Cover" />) : (<div className="w-full h-full flex items-center justify-center text-zinc-700"><Gamepad2 /></div>)}
                            </div>
                            <TerminalImagePicker label="COVER IMAGE" value={form.coverImageUrl || ''} onChange={(val) => setForm({ ...form, coverImageUrl: val })} />
                        </div>

                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                            <CyberInput label="DEVELOPER" value={form.developer || ''} onChange={(e) => setForm({ ...form, developer: e.target.value })} />
                            <CyberInput label="PLATFORM" value={form.platform || ''} onChange={(e) => setForm({ ...form, platform: e.target.value })} />
                            <CyberSelect label="STATUS" value={form.status} onChange={(v) => setForm({ ...form, status: v as GameStatus })} options={statusOptions} />
                        </div>

                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <CyberInput label="YEAR" type="number" value={form.releaseYear?.toString() || ''} onChange={(e) => setForm({ ...form, releaseYear: e.target.value ? parseInt(e.target.value) : undefined })} />
                                <CyberInput label="PLAYTIME" type="number" value={form.playtimeHours?.toString() || ''} onChange={(e) => setForm({ ...form, playtimeHours: e.target.value ? parseInt(e.target.value) : undefined })} />
                            </div>
                            <CyberInput label="RATING" type="number" value={form.myRating?.toString() || ''} onChange={(e) => setForm({ ...form, myRating: e.target.value ? parseInt(e.target.value) : undefined })} />
                            <CyberInput label="PLAYED_YEAR" type="number" value={form.consumedYear?.toString() || ''} onChange={(e) => setForm({ ...form, consumedYear: e.target.value ? parseInt(e.target.value) : undefined })} />
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

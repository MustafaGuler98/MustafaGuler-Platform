'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Dice6, Activity, User, Star, Scroll } from 'lucide-react';
import { ttrpgAdminService } from '@/services/admin/archivesAdminService';
import { useResourceById, useUpdateResource, useDeleteResource, useCreateResource } from '@/hooks/admin';
import { ArchiveDashboardLayout, DashboardStatCard } from '@/components/admin/archives';
import { TerminalImagePicker } from '@/components/admin/archives/TerminalImagePicker';
import { LoadingState } from '@/components/admin/layout';
import { CyberInput } from '@/components/ui/cyber/CyberInput';
import { CyberSelect } from '@/components/ui/cyber/CyberSelect';
import { CyberConfirmationModal } from '@/components/ui/cyber/CyberConfirmationModal';
import { ValidationError } from '@/components/ui/cyber/ValidationError';
import type { TTRPG, UpdateTTRPG, CreateTTRPG } from '@/types/archives';
import { TTRPGRole, CampaignStatus, ttrpgRoleLabels, campaignStatusLabels } from '@/types/archives';

export default function EditTTRPGPage() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const isNewMode = id === 'new';
    const hasRedirected = useRef(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [form, setForm] = useState<UpdateTTRPG>({ title: '', role: TTRPGRole.Player, campaignStatus: CampaignStatus.Active });

    const { data, isLoading } = useResourceById<TTRPG>(
        'archives-ttrpg',
        isNewMode ? '' : id,
        (id) => ttrpgAdminService.getById(id),
        { enabled: !isNewMode }
    );

    useEffect(() => {
        if (data && !isNewMode) setForm({
            title: data.title,
            system: data.system || '',
            campaignName: data.campaignName || '',
            role: data.role,
            campaignStatus: data.campaignStatus,
            sessionCount: data.sessionCount,
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
        const initial = { title: data.title, system: data.system || '', campaignName: data.campaignName || '', role: data.role, campaignStatus: data.campaignStatus, sessionCount: data.sessionCount, coverImageUrl: data.coverImageUrl || '', description: data.description || '', myReview: data.myReview || '', myRating: data.myRating, consumedYear: data.consumedYear };
        setIsDirty(JSON.stringify(form) !== JSON.stringify(initial));
    }, [form, data, isNewMode]);

    const createMutation = useCreateResource<TTRPG, CreateTTRPG>('archives-ttrpg', (d) => ttrpgAdminService.createTTRPG(d), { invalidateQueries: ['archives-ttrpg'] });
    const updateMutation = useUpdateResource<TTRPG>('archives-ttrpg', (id, d) => ttrpgAdminService.updateTTRPG(id, d as UpdateTTRPG), { invalidateQueries: ['archives-ttrpg'] });
    const deleteMutation = useDeleteResource('archives-ttrpg', (id) => ttrpgAdminService.delete(id), { onSuccessRedirect: '/admin/archives/ttrpg' });

    // Redirect to edit page after successful creation
    useEffect(() => {
        if (createMutation.isSuccess && createMutation.data?.id && !hasRedirected.current) {
            hasRedirected.current = true;
            setIsDirty(false);
            router.replace(`/admin/archives/ttrpg/${createMutation.data.id}`);
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
        if (isNewMode) createMutation.mutate(form as CreateTTRPG);
        else updateMutation.mutate({ id, data: form });
    };

    const roleOptions = Object.entries(ttrpgRoleLabels).map(([v, l]) => ({ value: parseInt(v), label: l }));
    const statusOptions = Object.entries(campaignStatusLabels).map(([v, l]) => ({ value: parseInt(v), label: l }));

    if (!isNewMode && isLoading) return <LoadingState />;

    const mutationError = isNewMode ? createMutation.error : (updateMutation.error || deleteMutation.error);
    const isPending = isNewMode ? createMutation.isPending : updateMutation.isPending;

    return (
        <>
            {!isNewMode && <CyberConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => deleteMutation.mutate(id)} title="DELETE_TTRPG" message="Are you sure?" confirmText="DELETE_PERMANENTLY" isLoading={deleteMutation.isPending} />}

            <ArchiveDashboardLayout
                backHref="/admin/archives/ttrpg"
                icon={<Dice6 size={18} className="text-orange-400" />}
                title={isNewMode ? "NEW_TTRPG" : "EDIT_TTRPG"}
                subtitle={isNewMode ? "Add to collection" : (data?.title || '')}
                error={mutationError}
                isLoading={!isNewMode && isLoading}
                isPending={isPending}
                isDirty={isDirty}
                onSubmit={handleSubmit}
                onDelete={isNewMode ? undefined : () => setIsDeleteModalOpen(true)}
                isDeletePending={deleteMutation.isPending}
                submitLabel={isNewMode ? "CREATE_TTRPG" : "UPDATE_TTRPG"}

                stats={
                    <>
                        <DashboardStatCard label="STATUS" value={campaignStatusLabels[form.campaignStatus]} icon={<Activity size={18} />} colorClass="text-emerald-400 bg-emerald-400/10" />
                        <DashboardStatCard label="ROLE" value={ttrpgRoleLabels[form.role]} icon={<User size={18} />} colorClass="text-blue-400 bg-blue-400/10" />
                        <DashboardStatCard label="RATING" value={form.myRating} icon={<Star size={18} />} colorClass="text-yellow-400 bg-yellow-400/10" />
                        <DashboardStatCard label="SESSIONS" value={form.sessionCount} icon={<Scroll size={18} />} colorClass="text-orange-400 bg-orange-400/10" />
                    </>
                }

                sidebar={
                    <div className="space-y-6">
                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-4 text-center space-y-4">
                            <div className="w-24 h-24 mx-auto rounded shadow-lg overflow-hidden border border-white/10 relative group bg-black">
                                {form.coverImageUrl ? (<img src={form.coverImageUrl} className="w-full h-full object-cover" alt="Campaign Cover" />) : (<div className="w-full h-full flex items-center justify-center text-zinc-700"><Dice6 /></div>)}
                            </div>
                            <TerminalImagePicker label="COVER IMAGE" value={form.coverImageUrl || ''} onChange={(val) => setForm({ ...form, coverImageUrl: val })} />
                        </div>

                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                            <CyberInput label="SYSTEM" value={form.system || ''} onChange={(e) => setForm({ ...form, system: e.target.value })} />
                            <CyberInput label="CAMPAIGN" value={form.campaignName || ''} onChange={(e) => setForm({ ...form, campaignName: e.target.value })} />
                            <CyberSelect label="ROLE" value={form.role} onChange={(v) => setForm({ ...form, role: v as TTRPGRole })} options={roleOptions} />
                            <CyberSelect label="STATUS" value={form.campaignStatus} onChange={(v) => setForm({ ...form, campaignStatus: v as CampaignStatus })} options={statusOptions} />
                        </div>

                        <div className="bg-slate-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <CyberInput label="SESSIONS" type="number" value={form.sessionCount?.toString() || ''} onChange={(e) => setForm({ ...form, sessionCount: e.target.value ? parseInt(e.target.value) : undefined })} />
                                <CyberInput label="RATING" type="number" value={form.myRating?.toString() || ''} onChange={(e) => setForm({ ...form, myRating: e.target.value ? parseInt(e.target.value) : undefined })} />
                            </div>
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

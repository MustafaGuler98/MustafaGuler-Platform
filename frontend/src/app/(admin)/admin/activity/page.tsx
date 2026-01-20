'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { CyberSaveButton } from '@/components/ui/cyber/CyberSaveButton';
import { LoadingOverlay } from '@/components/ui/cyber/LoadingOverlay';
import { useToast } from '@/components/ui/cyber/Toast';
import { Star, RefreshCw, BookOpen, Film, Tv, Headphones, MonitorPlay, Gamepad2, Dices, RotateCcw } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Activity } from '@/types/archives';
import { ActivityRow } from '@/components/admin/archives/ActivityRow';
import { ActivitySelectorModal } from '@/components/admin/archives/ActivitySelectorModal';
import { NavigationGuard } from '@/components/ui/cyber/NavigationGuard';
import { CyberButton } from '@/components/ui/cyber/CyberButton';

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    Book: { label: 'BOOK', icon: <BookOpen size={16} />, color: 'text-amber-400 border-amber-500/30' },
    Movie: { label: 'MOVIE', icon: <Film size={16} />, color: 'text-purple-400 border-purple-500/30' },
    TvSeries: { label: 'TV SERIES', icon: <Tv size={16} />, color: 'text-blue-500 border-blue-500/30' },
    Music: { label: 'MUSIC', icon: <Headphones size={16} />, color: 'text-pink-400 border-pink-500/30' },
    Anime: { label: 'ANIME', icon: <MonitorPlay size={16} />, color: 'text-rose-500 border-rose-500/30' },
    Game: { label: 'GAME', icon: <Gamepad2 size={16} />, color: 'text-indigo-400 border-indigo-500/30' },
    TTRPG: { label: 'TTRPG', icon: <Dices size={16} />, color: 'text-emerald-400 border-emerald-500/30' },
};

export default function ActivityPage() {
    const { showToast } = useToast();

    // State
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selections, setSelections] = useState<Record<string, string | null>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [activeType, setActiveType] = useState<string | null>(null);
    const [pendingDetails, setPendingDetails] = useState<Record<string, { title: string; imageUrl?: string | null }>>({});

    const fetchActivities = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<Activity[]>('/archives/activity/all');

            if (response.isSuccess && response.data) {
                setActivities(response.data);

                const initialSelections: Record<string, string | null> = {};
                response.data.forEach(item => {
                    initialSelections[item.activityType] = item.selectedItemId;
                });
                setSelections(initialSelections);
            } else {
                showToast('Failed to fetch activities', 'error');
            }
        } catch (error) {
            console.error('Failed to fetch activities:', error);
            showToast('Failed to fetch activities', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const handleOpenModal = (activityType: string) => {
        setActiveType(activityType);
        setModalOpen(true);
    };

    const handleSelect = (item: { id: string; title: string; imageUrl?: string | null }) => {
        if (!activeType) return;

        setSelections(prev => ({
            ...prev,
            [activeType]: item.id
        }));

        setPendingDetails(prev => ({
            ...prev,
            [activeType]: { title: item.title, imageUrl: item.imageUrl }
        }));
    };

    const handleCancelModal = () => {
        if (!activeType) return;

        // Revert to original (saved) value
        const originalValue = activities.find(a => a.activityType === activeType)?.selectedItemId || null;

        setSelections(prev => ({
            ...prev,
            [activeType]: originalValue
        }));

        // Clear pending detail for this type
        setPendingDetails(prev => {
            const next = { ...prev };
            delete next[activeType];
            return next;
        });

        setModalOpen(false);
    };

    // Just closes the modal, keeping the pending selection
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleClear = (activityType: string) => {
        setSelections(prev => ({
            ...prev,
            [activityType]: null
        }));
        setPendingDetails(prev => {
            const next = { ...prev };
            delete next[activityType];
            return next;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updates: { activityType: string; selectedItemId: string | null }[] = [];

            // Detect changes
            for (const activity of activities) {
                const currentSelection = selections[activity.activityType];
                if (currentSelection !== activity.selectedItemId) {
                    updates.push({
                        activityType: activity.activityType,
                        selectedItemId: currentSelection
                    });
                }
            }

            if (updates.length === 0) {
                showToast('No changes to save', 'info');
                setIsSaving(false);
                return;
            }

            // Batch Update Request
            const response = await apiClient.put('/archives/activity/batch', updates);

            if (response.isSuccess) {
                showToast('All changes saved successfully', 'success');
                setPendingDetails({}); // Clear all pending details as they are now saved
                await fetchActivities();
            } else {
                throw new Error(response.message || 'API returned failure');
            }

        } catch (error) {
            console.error('Failed to save activities:', error);
            showToast('Failed to save activities', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        const resetSelections: Record<string, string | null> = {};
        activities.forEach(item => {
            resetSelections[item.activityType] = item.selectedItemId;
        });
        setSelections(resetSelections);
        setPendingDetails({});
    };

    const hasChanges = activities.some(a => a.selectedItemId !== selections[a.activityType]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasChanges]);

    const getSelectionDetails = (activity: Activity) => {
        const selectedId = selections[activity.activityType];

        if (selectedId === activity.selectedItemId) {
            return {
                title: activity.selectedItemTitle,
                imageUrl: activity.selectedItemImageUrl
            };
        }
        if (!selectedId) return { title: null, imageUrl: null };

        const pending = pendingDetails[activity.activityType];
        if (pending) {
            return {
                title: pending.title,
                imageUrl: pending.imageUrl ?? null
            };
        }
        return {
            title: 'Selected Item',
            imageUrl: null
        };
    };

    const handleModalSave = async () => {
        if (!activeType) return;

        setIsSaving(true);
        try {
            const currentSelection = selections[activeType];

            const response = await apiClient.put(`/archives/activity/${activeType}`, {
                selectedItemId: currentSelection
            });

            if (!response.isSuccess) {
                throw new Error(response.message || 'Failed to update activity');
            }

            showToast(`${activeType} updated successfully`, 'success');
            await fetchActivities(); // Refresh to get the new titles/images

        } catch (error) {
            console.error('Failed to save activity:', error);
            showToast('Failed to save changes', 'error');
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading) {
        return (
            <div className="p-6">
                <AdminPageHeader
                    title="HIGHLIGHTED ACTIVITIES"
                    subtitle="Loading..."
                    backHref="/admin"
                    icon={<Star size={24} />}
                />
                <div className="flex justify-center py-20">
                    <RefreshCw className="w-8 h-8 animate-spin text-violet-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <NavigationGuard hasChanges={hasChanges} />
            <div className="flex items-center justify-between mb-4">
                <AdminPageHeader
                    title="HIGHLIGHTED ACTIVITIES"
                    subtitle="Manage highlighted content for the platform"
                    backHref="/admin"
                    icon={<Star size={24} />}
                />

                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <CyberButton
                            onClick={handleReset}
                            variant="ghost"
                            size="sm"
                            disabled={isSaving}
                        >
                            <RotateCcw size={16} className="mr-2" />
                            RESET
                        </CyberButton>
                    )}

                    <CyberSaveButton
                        isDirty={hasChanges}
                        isSaving={isSaving}
                        onClick={handleSave}
                        label="SAVE CHANGES"
                        savedLabel="SAVE CHANGES"
                        savingLabel="SAVING..."
                    />
                </div>
            </div>



            {/* Activities List */}
            <div className="space-y-3">
                {activities.map((activity) => {
                    const config = typeConfig[activity.activityType];
                    const details = getSelectionDetails(activity);

                    return (
                        <ActivityRow
                            key={activity.activityType}
                            recordType={activity.activityType}
                            label={config?.label || activity.activityType}
                            icon={config?.icon}
                            colorClass={config?.color || 'text-white border-white/10'}
                            selectedItemTitle={details.title}
                            selectedItemImageUrl={details.imageUrl}
                            onSelect={() => handleOpenModal(activity.activityType)}
                            onClear={() => handleClear(activity.activityType)}
                            isSaving={isSaving}
                        />
                    );
                })}
            </div>

            {/* Selection Modal */}
            {activeType && (
                <ActivitySelectorModal
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    onSelect={handleSelect}
                    activityType={activeType}
                    currentSelectionId={selections[activeType]}
                    onSave={handleModalSave}
                    isSaving={isSaving}
                    onCancel={handleCancelModal}
                />
            )}

            {isSaving && <LoadingOverlay isVisible={true} message="Saving changes..." />}
        </div>
    );
}

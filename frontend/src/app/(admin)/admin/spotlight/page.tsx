'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { CyberTable } from '@/components/ui/cyber/CyberTable';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberBadge } from '@/components/ui/cyber/CyberBadge';
import { LoadingOverlay } from '@/components/ui/cyber/LoadingOverlay';
import { useToast } from '@/components/ui/cyber/Toast';
import { Zap, Calendar, RefreshCw, BookOpen, Film, Music as MusicIcon, CheckCircle, Clock } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ActivitySelectorModal } from '@/components/admin/archives/ActivitySelectorModal';


interface SpotlightHistoryDto {
    id: string;
    itemId: string;
    itemTitle: string;
    itemImageUrl: string | null;
    startDate: string;
    endDate: string;
    isManualSelection: boolean;
    isActive: boolean;
}

const CATEGORIES = [
    { id: 'Book', label: 'Books', icon: <BookOpen size={16} /> },
    { id: 'Movie', label: 'Movies', icon: <Film size={16} /> },
    { id: 'Music', label: 'Music', icon: <MusicIcon size={16} /> },
];

export default function SpotlightPage() {
    const { showToast } = useToast();

    const [selectedCategory, setSelectedCategory] = useState('Book');
    const [history, setHistory] = useState<SpotlightHistoryDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [pendingItem, setPendingItem] = useState<{ id: string; title: string } | null>(null);
    const [endDate, setEndDate] = useState<string>(''); // YYYY-MM-DD

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<SpotlightHistoryDto[]>(`/archives/spotlight/admin/history/${selectedCategory}`);
            if (response.isSuccess && response.data) {
                setHistory(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
            showToast('Failed to fetch history', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [selectedCategory, showToast]);

    useEffect(() => {
        fetchHistory();
        setPendingItem(null);
        setEndDate('');
    }, [fetchHistory]);

    const handleSelect = (item: { id: string; title: string; imageUrl?: string | null }) => {
        setPendingItem({ id: item.id, title: item.title });
        setModalOpen(false);
    };

    const handleApplyOverride = async () => {
        if (!pendingItem || !endDate) {
            showToast('Please select an item and an end date', 'error');
            return;
        }

        setIsSaving(true);
        try {
            const response = await apiClient.post('/archives/spotlight/admin/manual', {
                category: selectedCategory,
                itemId: pendingItem.id,
                endDate: new Date(endDate).toISOString()
            });

            if (response.isSuccess) {
                showToast('Spotlight manually updated!', 'success');
                setPendingItem(null);
                setEndDate('');
                await fetchHistory();
            } else {
                showToast(response.message || 'Failed to update', 'error');
            }
        } catch (error) {
            console.error('Failed to override:', error);
            showToast('Failed to override spotlight', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const columns = [
        {
            key: 'isActive', label: 'Status', render: (item: SpotlightHistoryDto) => (
                item.isActive
                    ? <CyberBadge variant="success" label="ACTIVE" />
                    : <span className="text-slate-600 text-[10px] font-mono">EXPIRED</span>
            )
        },
        {
            key: 'itemTitle', label: 'Item', render: (item: SpotlightHistoryDto) => (
                <span className="text-white font-medium">{item.itemTitle}</span>
            )
        },
        {
            key: 'startDate', label: 'Start Date', render: (item: SpotlightHistoryDto) => (
                <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={12} />
                    {new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
            )
        },
        {
            key: 'endDate', label: 'End Date', render: (item: SpotlightHistoryDto) => (
                <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={12} />
                    {new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
            )
        },
        {
            key: 'isManualSelection', label: 'Type', render: (item: SpotlightHistoryDto) => (
                item.isManualSelection
                    ? <CyberBadge variant="warning" label="MANUAL" />
                    : <CyberBadge variant="primary" label="AUTO" />
            )
        },
    ];

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <AdminPageHeader
                title="SPOTLIGHT MANAGEMENT"
                subtitle="Manage and oversee automatic content rotation"
                backHref="/admin"
                icon={<Zap size={24} />}
            />

            {/* Category Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-900/50 rounded-lg w-fit border border-white/5">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono tracking-wider transition-all
                            ${selectedCategory === cat.id
                                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-[0_0_15px_-5px_rgba(139,92,246,0.5)]'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'}
                        `}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Manual Override Section */}
            <div className="p-6 rounded-xl bg-slate-900/40 border border-violet-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap size={120} />
                </div>

                <h3 className="text-sm font-mono text-violet-300 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={16} />
                    MANUAL OVERRIDE
                </h3>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Selected Item</label>
                        <div className="flex gap-2">
                            <CyberButton
                                variant="outline"
                                onClick={() => setModalOpen(true)}
                                className="w-full justify-start text-left"
                            >
                                {pendingItem ? pendingItem.title : "Select an item..."}
                            </CyberButton>
                        </div>
                    </div>

                    <div className="w-48 space-y-2">
                        <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">End Date</label>
                        <input
                            type="date"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 font-mono"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <CyberButton
                        variant="primary"
                        onClick={handleApplyOverride}
                        disabled={!pendingItem || !endDate || isSaving}
                    >
                        {isSaving ? <RefreshCw className="animate-spin" size={16} /> : 'APPLY OVERRIDE'}
                    </CyberButton>
                </div>
            </div>

            {/* History Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-mono text-slate-400 font-bold flex items-center gap-2">
                        <Clock size={16} />
                        ROTATION HISTORY
                    </h3>
                    <CyberButton variant="ghost" size="sm" onClick={fetchHistory}>
                        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                    </CyberButton>
                </div>

                <CyberTable
                    data={history}
                    columns={columns}
                    isLoading={isLoading}
                    emptyMessage="No history found for this category."
                />
            </div>

            <ActivitySelectorModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={handleSelect}
                activityType={selectedCategory}
                currentSelectionId={pendingItem?.id || null}
                onSave={() => { }}
                isSaving={false}
                onCancel={() => setModalOpen(false)}
            />

            {isSaving && <LoadingOverlay isVisible={true} message="Applying manual override..." />}
        </div>
    );
}

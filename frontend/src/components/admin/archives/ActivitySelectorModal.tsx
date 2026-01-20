import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { ActivityOption } from '@/types/archives';
import { Search, X, Calendar, Clock, Image as ImageIcon, ExternalLink, ChevronRight, Eye, RefreshCw } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useResourcePagedList } from '@/hooks/admin/useResourcePagedList';
import {
    movieAdminService, bookAdminService, quoteAdminService,
    tvSeriesAdminService, animeAdminService, gameAdminService,
    musicAdminService, ttrpgAdminService
} from '@/services/admin/archivesAdminService';
import { CyberPagination } from '@/components/ui/cyber/CyberPagination';

interface ActivitySelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (item: { id: string; title: string; imageUrl?: string | null }) => void;
    activityType: string;
    currentSelectionId: string | null;
    onSave: () => void;
    isSaving?: boolean;
    onCancel: () => void;
}

export function ActivitySelectorModal({
    isOpen,
    onClose,
    onSelect,
    activityType,
    currentSelectionId,
    onSave,
    isSaving = false,
    onCancel
}: ActivitySelectorModalProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Dynamic Service Selection
    const getServiceMethod = (page: number, pageSize: number, searchTerm?: string) => {
        switch (activityType) {
            case 'Movie': return movieAdminService.getPaged(page, pageSize, searchTerm);
            case 'Book': return bookAdminService.getPaged(page, pageSize, searchTerm);
            case 'Quote': return quoteAdminService.getPaged(page, pageSize, searchTerm);
            case 'TvSeries': return tvSeriesAdminService.getPaged(page, pageSize, searchTerm);
            case 'Anime': return animeAdminService.getPaged(page, pageSize, searchTerm);
            case 'Game': return gameAdminService.getPaged(page, pageSize, searchTerm);
            case 'Music': return musicAdminService.getPaged(page, pageSize, searchTerm);
            case 'TTRPG': return ttrpgAdminService.getPaged(page, pageSize, searchTerm);
            default: return movieAdminService.getPaged(page, pageSize, searchTerm); // Fallback
        }
    };

    const {
        items,
        page,
        setPage,
        totalPages,
        isLoading,
        searchTerm,
        setSearchTerm
    } = useResourcePagedList<any>({
        serviceMethod: getServiceMethod,
        queryKey: `activity-selector-${activityType}`,
        initialPageSize: 10
    });

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Cleanup when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setPreviewImage(null);
        }
    }, [isOpen, setSearchTerm]);

    if (!isOpen) return null;

    const displayItems: ActivityOption[] = items.map((item: any) => ({
        id: item.id,
        title: item.title || item.content || 'Unknown', // Quote uses content
        subtitle: item.author || item.director || item.platform || item.artist || item.system || item.studio || '',
        imageUrl: item.coverImageUrl,
        createdDate: item.createdDate
    }));

    const handleSelect = (item: any) => {
        onSelect({
            id: item.id,
            title: item.title || item.content || 'Unknown',
            imageUrl: item.imageUrl
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            {/* Image Preview Overlay */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-8 cursor-zoom-out"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-full max-h-full aspect-[2/3] h-[80vh]">
                        <Image
                            src={previewImage}
                            alt="Preview"
                            fill
                            className="object-contain"
                        />
                        <button
                            className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                            onClick={() => setPreviewImage(null)}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Content */}
            <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-900/20 flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/90 rounded-t-lg">
                    <div>
                        <h2 className="font-mono text-xl text-cyan-neon tracking-wide">SELECT {activityType.toUpperCase()}</h2>
                        <p className="font-mono text-xs text-slate-400 mt-1">
                            Select a Highlighted Item
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Controls */}
                <div className="p-4 space-y-4 bg-slate-900/50">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={`Search ${activityType}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-md py-2.5 pl-10 pr-4 font-mono text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                    </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                            <RefreshCw className="w-8 h-8 animate-spin text-cyan-neon" />
                        </div>
                    ) : displayItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                            <Search size={32} className="mb-2 opacity-50" />
                            <p className="font-mono text-sm">No items found matching "{searchTerm}"</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {displayItems.map((item) => {
                                const isSelected = currentSelectionId === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleSelect(item)}
                                        className={`group flex items-center gap-4 p-3 hover:bg-white/5 transition-colors cursor-pointer ${isSelected ? 'bg-cyan-950/20' : ''
                                            }`}
                                    >
                                        {/* Thumbnail / Preview Trigger */}
                                        <div
                                            className="relative w-10 h-14 rounded overflow-hidden border border-white/10 bg-black/40 flex-shrink-0 cursor-zoom-in group/image"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (item.imageUrl) setPreviewImage(item.imageUrl);
                                            }}
                                        >
                                            {item.imageUrl ? (
                                                <>
                                                    <Image
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover transition-opacity group-hover/image:opacity-50"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                                                        <Eye size={16} className="text-white drop-shadow-md" />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-700">
                                                    <ImageIcon size={16} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`font-mono text-sm font-bold truncate ${isSelected ? 'text-cyan-400' : 'text-slate-200 group-hover:text-white'
                                                    }`}>
                                                    {item.title}
                                                </h3>

                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                {item.subtitle && (
                                                    <span className="text-slate-400 font-medium truncate max-w-[200px]" title={item.subtitle}>
                                                        {item.subtitle}
                                                    </span>
                                                )}
                                                {item.createdDate && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                        <span className="font-mono text-[10px] opacity-70">
                                                            {new Date(item.createdDate).toLocaleDateString()}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <CyberButton

                                            variant={isSelected ? "ghost" : "secondary"}
                                            size="sm"
                                            className={`transition-colors w-24 hover:text-cyan-400 hover:border-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100`}
                                        >
                                            <span className="text-xs">
                                                {isSelected ? 'CURRENT' : 'SELECT'}
                                            </span>
                                            {!isSelected && <ChevronRight size={14} className="ml-1" />}
                                        </CyberButton>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 flex flex-col gap-4 bg-slate-900/90 rounded-b-lg">
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center w-full">
                            <CyberPagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}

                    <div className="flex justify-between items-center w-full">
                        <span className="font-mono text-[10px] text-slate-500">
                            Showing page {page} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <CyberButton
                                variant="secondary"
                                onClick={onCancel}
                                size="sm"
                                disabled={isSaving}
                                className="hover:text-red-400 hover:border-red-500/50 transition-colors"
                            >
                                CANCEL
                            </CyberButton>
                            <CyberButton
                                variant="primary"
                                onClick={onSave}
                                size="sm"
                                disabled={isSaving}
                                className="hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                            >
                                {isSaving ? 'SAVING...' : 'SAVE'}
                            </CyberButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

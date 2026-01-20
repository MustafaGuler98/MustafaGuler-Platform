'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Upload,
    Trash2,
    Copy,
    Check,
    Image as ImageIcon,
} from 'lucide-react';
import { imageAdminService } from '@/services/admin';
import { useDeleteResource } from '@/hooks/admin';
import { useResourcePagedList } from '@/hooks/admin/useResourcePagedList';
import { ErrorMessage } from '@/components/admin/layout';

import { CyberSearchInput } from '@/components/ui/cyber/CyberSearchInput';
import { AdminListHeader } from '@/components/admin/ui/AdminListHeader';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberNewButton } from '@/components/ui/cyber/CyberNewButton';
import { CyberActionLink } from '@/components/ui/cyber/CyberActionLink';
import { CyberPagination } from '@/components/ui/cyber/CyberPagination';
import { CyberConfirmationModal } from '@/components/ui/cyber/CyberConfirmationModal';
import { getImageUrl } from '@/lib/utils';
import type { ImageInfo } from '@/types/admin';

export default function ImagesPage() {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {
        items: images,
        page,
        setPage,
        totalPages,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        clearSearch
    } = useResourcePagedList({
        serviceMethod: (p, s, term) => imageAdminService.getPaged(p, s, term),
        initialPageSize: 12,
        queryKey: 'images'
    });

    const deleteMutation = useDeleteResource('images', (id) =>
        imageAdminService.delete(id)
    );

    const handleDeleteClick = (id: string) => setDeletingId(id);

    const handleConfirmDelete = () => {
        if (deletingId) {
            deleteMutation.mutate(deletingId, {
                onSuccess: () => setDeletingId(null),
            });
        }
    };

    const copyUrl = (url: string, id: string) => {
        const fullUrl = `${window.location.origin}${url}`;
        navigator.clipboard.writeText(fullUrl);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="space-y-6">
            <CyberConfirmationModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={handleConfirmDelete}
                title="DELETE_IMAGE"
                message="Are you sure you want to delete this image? This action cannot be undone."
                confirmText="DELETE_PERMANENTLY"
                isLoading={deleteMutation.isPending}
            />

            <AdminListHeader
                title="MEDIA"
                subtitle="IMAGE_LIBRARY"
                icon={<ImageIcon size={18} className="text-violet-400" />}
                actionButton={
                    <CyberNewButton
                        href="/admin/images/upload"
                        label="UPLOAD"
                        icon={<Upload size={12} />}
                    />
                }
            />

            <CyberSearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={clearSearch}
                placeholder="SEARCH"
            />

            <ErrorMessage
                error={error || deleteMutation.error}
                customMessage={error ? 'FAILED_TO_LOAD' : 'FAILED_TO_DELETE'}
            />

            {/* Loading Skeleton */}
            {isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="aspect-square bg-white/5 rounded animate-pulse" />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && images.length === 0 && (
                <div className="py-16 text-center">
                    <p className="font-mono text-xs text-muted-foreground/50 tracking-widest">
                        {'>'} NO_IMAGES_FOUND
                    </p>
                </div>
            )}

            {/* Image Grid */}
            {!isLoading && images.length > 0 && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                className="group relative aspect-square rounded overflow-hidden border border-transparent hover:border-violet-500/30 transition-all"
                            >
                                <img
                                    src={getImageUrl(img.url)}
                                    alt={img.fileName}
                                    className="w-full h-full object-cover group-hover:opacity-40 transition-opacity"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                    <div>
                                        <p className="font-mono text-[10px] text-violet-300 truncate">
                                            {img.fileName}
                                        </p>
                                        <p className="font-mono text-[9px] text-muted-foreground/60">
                                            {formatSize(img.sizeBytes)}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => copyUrl(img.url, img.id)}
                                            className="flex-1 py-1 rounded bg-white/10 hover:bg-violet-500/20 transition-colors flex items-center justify-center"
                                        >
                                            {copiedId === img.id ? (
                                                <Check size={10} className="text-green-400" />
                                            ) : (
                                                <Copy size={10} className="text-muted-foreground" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(img.id)}
                                            disabled={deleteMutation.isPending}
                                            className="flex-1 py-1 rounded bg-white/10 hover:bg-red-500/20 transition-colors flex items-center justify-center disabled:opacity-50"
                                        >
                                            <Trash2 size={10} className="text-muted-foreground hover:text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <CyberPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
    Upload,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Copy,
    Check,
    Image as ImageIcon,
} from 'lucide-react';
import { imageAdminService } from '@/services/admin';
import { useDeleteResource } from '@/hooks/admin';
import { useDebounce } from '@/hooks/useDebounce';
import { ErrorMessage } from '@/components/admin/layout';
import { CyberButton } from '@/components/admin/ui/CyberButton';
import { SearchInput } from '@/components/admin/ui/SearchInput';
import { CyberConfirmationModal } from '@/components/admin/ui/CyberConfirmationModal';
import type { ImageInfo } from '@/types/admin';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function ImagesPage() {
    const [page, setPage] = useState(1);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const pageSize = 12;

    const debouncedSearch = useDebounce(searchTerm);

    const { data, isLoading, error } = useQuery({
        queryKey: ['images', page, pageSize],
        queryFn: async () => {
            const response = await imageAdminService.getPaged(page, pageSize);
            if (!response.isSuccess || !response.data) {
                throw new Error(response.message || 'Failed to fetch images');
            }

            return response.data;
        },
    });

    const deleteMutation = useDeleteResource('images', (id) =>
        imageAdminService.delete(id)
    );

    const allImages = data?.items ?? [];
    const totalPages = data?.totalPages ?? 1;

    // Client-side filtering
    const images = allImages.filter((img) => {
        if (!debouncedSearch) return true;
        return img.fileName.toLowerCase().includes(debouncedSearch.toLowerCase());
    });

    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
    };

    // Confirm delete
    const handleConfirmDelete = () => {
        if (deletingId) {
            deleteMutation.mutate(deletingId, {
                onSuccess: () => {
                    setDeletingId(null);
                }
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

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded border border-primary/30 flex items-center justify-center">
                        <ImageIcon size={18} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="font-mono text-lg text-foreground tracking-wide">MEDIA</h1>
                        <p className="font-mono text-[10px] text-muted-foreground/60 tracking-widest">
                            IMAGE_LIBRARY
                        </p>
                    </div>
                </div>
                <Link href="/admin/images/upload">
                    <CyberButton variant="primary" size="sm">
                        <Upload size={12} />
                        UPLOAD
                    </CyberButton>
                </Link>
            </div>

            <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm('')}
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
                                className="group relative aspect-square rounded overflow-hidden border border-transparent hover:border-cyan-neon/30 transition-all"
                            >
                                <img
                                    src={`${API_URL?.replace('/api', '')}${img.url}`}
                                    alt={img.fileName}
                                    className="w-full h-full object-cover group-hover:opacity-40 transition-opacity"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                    <div>
                                        <p className="font-mono text-[10px] text-cyan-neon truncate">
                                            {img.fileName}
                                        </p>
                                        <p className="font-mono text-[9px] text-muted-foreground/60">
                                            {formatSize(img.sizeBytes)}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => copyUrl(img.url, img.id)}
                                            className="flex-1 py-1 rounded bg-white/10 hover:bg-cyan-neon/20 transition-colors flex items-center justify-center"
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

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-6 py-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="font-mono text-[10px] text-muted-foreground hover:text-cyan-neon disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={12} className="inline" />
                        </button>

                        <span className="font-mono text-[10px] tracking-widest">
                            <span className="text-cyan-neon">{page}</span>
                            <span className="text-muted-foreground"> / {totalPages}</span>
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="font-mono text-[10px] text-muted-foreground hover:text-cyan-neon disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={12} className="inline" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

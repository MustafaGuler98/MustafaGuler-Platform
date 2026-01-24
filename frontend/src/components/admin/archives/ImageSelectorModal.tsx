'use client';

import { useState, useEffect } from 'react';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberSearchInput } from '@/components/ui/cyber/CyberSearchInput';
import { CyberPagination } from '@/components/ui/cyber/CyberPagination';
import { LoadingOverlay } from '@/components/ui/cyber/LoadingOverlay';
import { X, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn, getImageUrl } from '@/lib/utils';

interface ImageInfoDto {
    id: string;
    fileName: string;
    url: string;
    sizeBytes: number;
    createdDate: string;
    contentType: string;
    alt?: string;
    title?: string;
    uploadedByName?: string;
}

interface ImageSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    initialFolder?: string;
}

export function ImageSelectorModal({ isOpen, onClose, onSelect, initialFolder }: ImageSelectorModalProps) {
    const [images, setImages] = useState<ImageInfoDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedFolder, setSelectedFolder] = useState<string>(''); // '' = All

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSearch('');
            setSelectedFolder('');
        } else if (initialFolder) {
            setSelectedFolder(initialFolder);
        }
    }, [isOpen, initialFolder]);

    useEffect(() => {
        if (isOpen) {
            fetchImages();
        }
    }, [isOpen, selectedFolder]); // Refetch when folder changes

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                fetchImages();
            }, 300); // Debounce search
            return () => clearTimeout(timer);
        }
    }, [search]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('pageNumber', '1');
            params.append('pageSize', '50');
            if (search) params.append('searchTerm', search);
            if (selectedFolder) params.append('folder', selectedFolder);

            const res = await fetch(`/api/images?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                if (data.isSuccess && data.data && Array.isArray(data.data.items)) {
                    setImages(data.data.items);
                } else if (data.data && Array.isArray(data.data.items)) {
                    setImages(data.data.items);
                }
            }
        } catch (error) {
            console.error('Failed to fetch images', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const folders = [
        { id: '', label: 'ALL IMAGES', icon: 'Box' },
        { id: 'articles', label: 'ARTICLES', icon: 'FileText' },
        { id: 'archives', label: 'ARCHIVES', icon: 'Archive' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-5xl bg-slate-900 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-900/20 flex flex-col h-[85vh] overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/90 flex-shrink-0">
                    <div>
                        <h2 className="font-mono text-xl text-cyan-neon tracking-wide">MEDIA LIBRARY</h2>
                        <p className="font-mono text-xs text-slate-400 mt-1">
                            Browse and select assets
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-48 border-r border-white/10 bg-black/20 flex flex-col p-2 space-y-1">
                        <div className="p-2 mb-2">
                            <h3 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">FOLDERS</h3>
                        </div>
                        {folders.map(folder => (
                            <button
                                type="button"
                                key={folder.id}
                                onClick={() => setSelectedFolder(folder.id)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all text-xs font-mono w-full text-left",
                                    selectedFolder === folder.id
                                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                                )}
                            >
                                <span className={cn("w-2 h-2 rounded-full", selectedFolder === folder.id ? "bg-cyan-500" : "bg-slate-600")} />
                                {folder.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Search Bar */}
                        <div className="p-4 bg-slate-900/50 border-b border-white/5 flex-shrink-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    placeholder={`SEARCH ${selectedFolder ? selectedFolder.toUpperCase() : 'ALL'}...`}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-md py-2.5 pl-10 pr-4 font-mono text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-black/10">
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {images.map((img) => (
                                        <button
                                            key={img.id}
                                            onClick={() => onSelect(img.url)}
                                            className="group relative aspect-[2/3] w-full rounded-md overflow-hidden border border-white/10 hover:border-cyan-500 transition-all text-left bg-black/50"
                                        >
                                            <Image
                                                src={getImageUrl(img.url)}
                                                alt={img.alt || img.fileName}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-[10px] font-mono text-cyan-400 truncate w-full">
                                                    {img.fileName}
                                                </p>
                                            </div>
                                            <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        </button>
                                    ))}
                                    {images.length === 0 && !loading && (
                                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
                                            <Search size={32} className="mb-2 opacity-30" />
                                            <span className="font-mono text-sm">NO IMAGES FOUND</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 flex justify-end bg-slate-900/90 flex-shrink-0">
                    <CyberButton variant="ghost" onClick={onClose} size="sm">
                        CANCEL
                    </CyberButton>
                </div>
            </div>
        </div>
    );
}


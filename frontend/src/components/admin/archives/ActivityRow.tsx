'use client';

import { CyberButton } from '@/components/ui/cyber/CyberButton';

import { CyberActionLink } from '@/components/ui/cyber/CyberActionLink';
import { CyberConfirmationModal } from '@/components/ui/cyber/CyberConfirmationModal';
import { Pencil, Trash2, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ActivityRowProps {
    recordType: string;
    label: string;
    icon: React.ReactNode;
    colorClass: string;
    selectedItemTitle: string | null;
    selectedItemImageUrl: string | null;
    onSelect: () => void;
    onClear: () => void;
    isSaving?: boolean;
}

export function ActivityRow({
    recordType,
    label,
    icon,
    colorClass,
    selectedItemTitle,
    selectedItemImageUrl,
    onSelect,
    onClear,
    isSaving = false
}: ActivityRowProps) {
    const textColor = colorClass.includes('text') ? colorClass.match(/text-[a-z]+-\d+/)?.[0] : 'text-white';

    // Extract base color name to map to specific tailwind classes
    const baseColorMatch = colorClass.match(/text-([a-z]+)-/);
    const baseColor = baseColorMatch ? baseColorMatch[1] : 'purple';

    const colorMap: Record<string, { hoverBorder: string }> = {
        amber: { hoverBorder: 'hover:border-amber-500/30' },
        purple: { hoverBorder: 'hover:border-purple-500/30' },
        blue: { hoverBorder: 'hover:border-blue-500/30' },
        pink: { hoverBorder: 'hover:border-pink-500/30' },
        rose: { hoverBorder: 'hover:border-rose-500/30' },
        indigo: { hoverBorder: 'hover:border-indigo-500/30' },
        emerald: { hoverBorder: 'hover:border-emerald-500/30' },
    };

    const styles = colorMap[baseColor] || colorMap['purple'];

    return (
        <div className={`group relative bg-slate-900/40 border border-white/5 rounded-lg overflow-hidden hover:bg-slate-900/60 ${styles.hoverBorder} transition-all duration-200`}>
            <div className="flex items-stretch h-20">
                {/* 1. Type Section (Fixed Width) */}
                <div className="w-32 flex items-center gap-3 pl-4 border-r border-white/5 bg-black/20">
                    <div className={`${textColor}`}>
                        {icon}
                    </div>
                    <span className="font-mono text-xs font-bold tracking-widest text-slate-300">
                        {label}
                    </span>
                </div>

                {/* 2. Selection Info (Grow) */}
                <div className="flex-1 flex items-center p-3 gap-4 min-w-0">
                    {/* Thumbnail */}
                    <div className="relative w-12 h-16 rounded overflow-hidden border border-white/10 bg-black/40 flex-shrink-0">
                        {selectedItemImageUrl ? (
                            <Image
                                src={selectedItemImageUrl}
                                alt={selectedItemTitle || recordType}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                {icon}
                            </div>
                        )}
                    </div>

                    {/* Title & Status */}
                    <div className="flex flex-col min-w-0">
                        {selectedItemTitle ? (
                            <>
                                <h4 className="font-mono text-sm font-bold text-white truncate pr-4">
                                    {selectedItemTitle}
                                </h4>

                            </>
                        ) : (
                            <span className="font-mono text-xs text-slate-500 italic flex items-center gap-2">
                                No item selected
                            </span>
                        )}
                    </div>
                </div>

                {/* 3. Actions (Right Aligned) */}
                <div className="flex items-center gap-2 pr-4 pl-4 border-l border-white/5 bg-black/10">
                    <CyberButton
                        onClick={onSelect}
                        variant="secondary"
                        size="sm"
                        disabled={isSaving}
                        className={`transition-colors ${!selectedItemTitle ? "opacity-90 hover:opacity-100" : ""} hover:text-violet-400 hover:border-violet-500/50`}
                    >
                        {selectedItemTitle ? (
                            <>
                                <Pencil size={14} className="mr-2" />
                                CHANGE
                            </>
                        ) : (
                            <>
                                SELECT
                                <ChevronRight size={14} className="ml-1 opacity-60" />
                            </>
                        )}
                    </CyberButton>

                    {selectedItemTitle && (
                        <button
                            onClick={onClear}
                            disabled={isSaving}
                            className="p-2.5 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                            title="Clear selection"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

interface RecordCardProps {
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

export function RecordCard({
    recordType,
    label,
    icon,
    colorClass,
    selectedItemTitle,
    selectedItemImageUrl,
    onSelect,
    onClear,
    isSaving = false
}: RecordCardProps) {
    // Extract base color name to map to specific tailwind classes
    const baseColorMatch = colorClass.match(/text-([a-z]+)-/);
    const baseColor = baseColorMatch ? baseColorMatch[1] : 'cyan';

    const colorMap: Record<string, { borderColor: string; textColor: string }> = {
        amber: { borderColor: 'border-amber-500/50', textColor: 'text-amber-500' },
        purple: { borderColor: 'border-purple-500/50', textColor: 'text-purple-500' },
        blue: { borderColor: 'border-blue-500/50', textColor: 'text-blue-500' },
        pink: { borderColor: 'border-pink-500/50', textColor: 'text-pink-500' },
        rose: { borderColor: 'border-rose-500/50', textColor: 'text-rose-500' },
        cyan: { borderColor: 'border-cyan-500/50', textColor: 'text-cyan-500' },
        emerald: { borderColor: 'border-emerald-500/50', textColor: 'text-emerald-500' },
    };

    const styles = colorMap[baseColor] || colorMap['cyan'];

    return (
        <div className={`relative group h-full flex flex-col bg-slate-900/40 border rounded-lg overflow-hidden transition-all duration-300 hover:bg-slate-900/60 ${styles.borderColor}`}>

            {/* Header / Type Label */}
            <div className="p-3 border-b border-white/5 bg-black/20 flex items-center gap-2">
                <div className={`${styles.textColor}`}>
                    {icon}
                </div>
                <span className="font-mono text-xs font-bold tracking-widest text-slate-300">
                    {label}
                </span>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative aspect-[2/3] bg-black/40 border-b border-white/5 group-hover:bg-black/30 transition-colors">
                {selectedItemImageUrl ? (
                    <Image
                        src={getImageUrl(selectedItemImageUrl)}
                        alt={selectedItemTitle || recordType}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-30">
                        <div className="mb-2 p-3 rounded-full bg-white/5">
                            {icon}
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-wider">Empty Slot</span>
                    </div>
                )}

                {/* Title Overlay */}
                {selectedItemTitle && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4">
                        <h4 className="font-mono text-sm font-bold text-white line-clamp-2 leading-tight">
                            {selectedItemTitle}
                        </h4>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-3 flex items-center gap-2 bg-black/20">
                <CyberButton
                    onClick={onSelect}
                    variant="secondary"
                    size="sm"
                    className="flex-1 text-[10px]"
                    disabled={isSaving}
                >
                    <Pencil size={12} className="mr-1.5" />
                    {selectedItemTitle ? 'CHANGE' : 'SELECT'}
                </CyberButton>

                {selectedItemTitle && (
                    <button
                        onClick={onClear}
                        disabled={isSaving}
                        className="p-2 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                        title="Clear selection"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}

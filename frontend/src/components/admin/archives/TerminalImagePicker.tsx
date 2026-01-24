'use client';

import { useState } from 'react';
import { cn, getImageUrl } from '@/lib/utils';
import { Image, X } from 'lucide-react';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { ImageSelectorModal } from './ImageSelectorModal';
import NextImage from 'next/image';

interface TerminalImagePickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    directory?: string;
}

export function TerminalImagePicker({
    label,
    value,
    onChange,
    placeholder = 'ENTER IMAGE URL OR SELECT...',
    className,
    required,
    directory
}: TerminalImagePickerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={cn("space-y-2", className)}>
            <label className="block w-fit text-[10px] text-purple-300 font-mono uppercase tracking-widest font-bold mb-1 pl-2 py-1 pr-3 border-l-2 border-purple-500 bg-gradient-to-r from-purple-500/10 to-transparent">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="flex gap-2">
                <div className="relative flex-1 group">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={cn(
                            'w-full bg-black/10 border border-white/5 rounded-md focus:border-white/20 focus:bg-black/20',
                            'px-3 py-2 text-foreground placeholder:text-muted-foreground/20',
                            'focus:outline-none transition-all duration-300 font-mono text-xs',
                            'hover:border-white/10 hover:bg-black/20 shadow-sm'
                        )}
                    />
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                <CyberButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    className="shrink-0"
                >
                    <Image size={14} className="mr-2" />
                    SELECT
                </CyberButton>
            </div>

            {/* Preview Section */}
            {value && (
                <div className="mt-2 relative w-full aspect-[21/9] rounded-md overflow-hidden border border-white/10 bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={getImageUrl(value)}
                        alt="Preview"
                        className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="bg-black/80 text-[10px] font-mono text-cyan-500 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            PREVIEW
                        </span>
                    </div>
                </div>
            )}

            <ImageSelectorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={(url) => {
                    onChange(url);
                    setIsModalOpen(false);
                }}
                initialFolder={directory}
            />
        </div>
    );
}

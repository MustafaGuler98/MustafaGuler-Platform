'use client';

import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { imageAdminService } from '@/services/admin';
import { AdminPageHeader, ErrorMessage } from '@/components/admin/layout';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberInput } from '@/components/ui/cyber/CyberInput';

export default function UploadImagePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [customName, setCustomName] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await imageAdminService.upload(formData);
            if (!response.isSuccess) {
                throw new Error(response.message || 'Upload failed');
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['images'] });
            router.push('/admin/images');
        },
    });

    const handleFileSelect = (selectedFile: File) => {
        setValidationError(null);

        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(selectedFile.type)) {
            setValidationError('Only JPG and PNG files are allowed.');
            return;
        }

        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            handleFileSelect(droppedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('customName', customName || file.name.split('.')[0]);

        mutation.mutate(formData);
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-8">
            <AdminPageHeader
                backHref="/admin/images"
                icon={<ImageIcon size={14} className="text-primary" />}
                title="UPLOAD"
                subtitle="ADD_TO_MEDIA"
            />

            <ErrorMessage error={mutation.error || (validationError ? new Error(validationError) : null)} />

            <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
                {/* Drop Zone */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
            relative border border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${isDragging
                            ? 'border-cyan-neon bg-cyan-neon/5'
                            : preview
                                ? 'border-white/20 bg-black/20'
                                : 'border-white/10 hover:border-white/30 bg-black/10'
                        }
          `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        className="hidden"
                    />

                    {preview ? (
                        <div className="relative inline-block">
                            <img src={preview} alt="Preview" className="max-h-48 rounded" />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearFile();
                                }}
                                className="absolute -top-2 -right-2 bg-red-500/80 rounded-full p-1 hover:bg-red-500 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded border border-dashed border-white/20 mx-auto mb-4 flex items-center justify-center">
                                <Upload size={18} className="text-muted-foreground/50" />
                            </div>
                            <p className="font-mono text-[10px] tracking-widest text-muted-foreground/60">
                                DROP_FILE_OR_CLICK
                            </p>
                            <p className="font-mono text-[9px] text-muted-foreground/40 mt-1">
                                JPG, PNG ONLY
                            </p>
                        </>
                    )}
                </div>

                {file && (
                    <div className="backdrop-blur-sm bg-black/20 border border-white/5 rounded-lg p-5">
                        <CyberInput
                            label="CUSTOM_NAME"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="Leave empty for original name"
                        />
                    </div>
                )}

                <div className="flex gap-3">
                    <CyberButton
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={!file || mutation.isPending}
                    >
                        <Upload size={12} />
                        {mutation.isPending ? 'UPLOADING...' : 'UPLOAD'}
                    </CyberButton>
                    <Link href="/admin/images">
                        <CyberButton type="button" variant="ghost" size="md">
                            CANCEL
                        </CyberButton>
                    </Link>
                </div>
            </form>
        </div>
    );
}

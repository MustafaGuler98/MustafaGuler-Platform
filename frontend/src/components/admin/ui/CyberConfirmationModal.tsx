'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { CyberButton } from '@/components/admin/ui/CyberButton';

interface CyberConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export function CyberConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'CONFIRM',
    cancelText = 'CANCEL',
    isLoading = false,
}: CyberConfirmationModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100 backdrop-blur-sm bg-black/60' : 'opacity-0'
                }`}
        >
            <div
                className={`relative w-full max-w-md transform overflow-hidden rounded-lg border border-red-500/30 bg-[#0a0118]/90 p-6 shadow-2xl transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-white transition-colors"
                    disabled={isLoading}
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-mono text-lg font-bold tracking-wide text-foreground">
                            {title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex w-full gap-3 mt-4">
                        <CyberButton
                            variant="ghost"
                            onClick={onClose}
                            disabled={isLoading}
                            fullWidth
                        >
                            {cancelText}
                        </CyberButton>
                        <CyberButton
                            variant="danger"
                            onClick={onConfirm}
                            isLoading={isLoading}
                            fullWidth
                        >
                            {confirmText}
                        </CyberButton>
                    </div>
                </div>

                {/* Decorative Corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500/50" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500/50" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500/50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500/50" />
            </div>
        </div>
    );
}

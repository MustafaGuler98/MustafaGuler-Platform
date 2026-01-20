'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    showToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType, duration = 3000) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({
    toasts,
    onDismiss,
}: {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

function ToastItem({
    toast,
    onDismiss,
}: {
    toast: Toast;
    onDismiss: (id: string) => void;
}) {
    const typeStyles = {
        success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-400',
        error: 'bg-red-950/90 border-red-500/50 text-red-400',
        info: 'bg-cyan-950/90 border-cyan-500/50 text-cyan-400',
    };

    return (
        <div
            className={cn(
                'p-4 rounded-lg border backdrop-blur-sm animate-in slide-in-from-right duration-200',
                'flex items-center gap-3 min-w-[280px] max-w-[400px]',
                typeStyles[toast.type]
            )}
        >
            <p className="font-mono text-sm flex-1">{toast.message}</p>
            <button
                onClick={() => onDismiss(toast.id)}
                className="opacity-60 hover:opacity-100 transition-opacity"
            >
                <X size={14} />
            </button>
        </div>
    );
}

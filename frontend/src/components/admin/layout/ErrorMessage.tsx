'use client';

interface ErrorMessageProps {
    error: Error | null | undefined;
    customMessage?: string;
}

// Standardized error display for admin pages
export function ErrorMessage({ error, customMessage }: ErrorMessageProps) {
    if (!error) return null;

    return (
        <div className="py-3 px-4 border border-red-500/30 rounded bg-red-500/5">
            <p className="font-mono text-xs text-red-400">
                {'>'} {customMessage || error.message}
            </p>
        </div>
    );
}

'use client';

import { AlertTriangle } from 'lucide-react';

interface ValidationErrorProps {
    errors: string[];
}


export function ValidationError({ errors }: ValidationErrorProps) {
    if (!errors || errors.length === 0) return null;

    return (
        <div className="py-3 px-4 border border-amber-500/30 rounded bg-amber-500/5 space-y-1">
            <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle size={14} />
                <span className="font-mono text-xs uppercase tracking-widest">VALIDATION_ERROR</span>
            </div>
            <ul className="space-y-1 ml-5">
                {errors.map((error, index) => (
                    <li key={index} className="font-mono text-xs text-amber-300/80 list-disc">
                        {error}
                    </li>
                ))}
            </ul>
        </div>
    );
}


export function useFormValidation<T extends Record<string, unknown>>(
    form: T,
    requiredFields: { field: keyof T; label: string }[]
): { errors: string[]; isValid: boolean; validate: () => boolean } {
    const validate = (): boolean => {
        const errors: string[] = [];

        for (const { field, label } of requiredFields) {
            const value = form[field];
            if (value === undefined || value === null || value === '') {
                errors.push(`${label} is required`);
            }
        }

        return errors.length === 0;
    };

    const errors: string[] = [];
    for (const { field, label } of requiredFields) {
        const value = form[field];
        if (value === undefined || value === null || value === '') {
            errors.push(`${label} is required`);
        }
    }

    return {
        errors,
        isValid: errors.length === 0,
        validate
    };
}

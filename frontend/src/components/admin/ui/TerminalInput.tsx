'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface TerminalInputProps {
    label: string;
    type?: 'text' | 'email' | 'password' | 'textarea' | 'number';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
    rows?: number;
}

const TerminalInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, TerminalInputProps>(
    ({ label, type = 'text', value, onChange, placeholder, required, className, rows = 6 }, ref) => {
        const inputStyles = cn(
            'w-full bg-transparent border-b border-white/20 focus:border-cyan-neon',
            'px-0 py-3 text-foreground placeholder:text-muted-foreground/30',
            'focus:outline-none transition-all duration-300 font-mono text-sm',
            'hover:border-white/40',
            className
        );

        return (
            <div className="space-y-2">
                <label className="block text-[10px] text-primary font-mono uppercase tracking-widest">
                    {label}
                </label>
                {type === 'textarea' ? (
                    <textarea
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        rows={rows}
                        className={cn(inputStyles, 'resize-y min-h-[120px]')}
                    />
                ) : (
                    <input
                        ref={ref as React.Ref<HTMLInputElement>}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        className={inputStyles}
                    />
                )}
            </div>
        );
    }
);

TerminalInput.displayName = 'TerminalInput';

export { TerminalInput };

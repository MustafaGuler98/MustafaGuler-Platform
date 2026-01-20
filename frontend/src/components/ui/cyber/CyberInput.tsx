'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    labelClassName?: string;
    rows?: number;
}

const CyberInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, CyberInputProps>(
    ({ label, type = 'text', className, labelClassName, rows = 6, ...props }, ref) => {
        const inputStyles = cn(
            'w-full bg-black/10 border border-white/5 rounded-md focus:border-white/20 focus:bg-black/20',
            'px-3 py-2 text-foreground placeholder:text-muted-foreground/20',
            'focus:outline-none transition-all duration-300 font-mono text-sm',
            'hover:border-white/10 hover:bg-black/20',
            'shadow-sm',
            className
        );

        return (
            <div className="space-y-2">
                <label className={cn("block w-fit text-[10px] text-purple-300 font-mono uppercase tracking-widest font-bold mb-1 pl-2 py-1 pr-3 border-l-2 border-purple-500 bg-gradient-to-r from-purple-500/10 to-transparent", labelClassName)}>
                    {label}
                </label>
                {type === 'textarea' ? (
                    <textarea
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        rows={rows}
                        className={cn(inputStyles, 'resize-y min-h-[120px]')}
                        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    />
                ) : (
                    <input
                        ref={ref as React.Ref<HTMLInputElement>}
                        type={type}
                        className={inputStyles}
                        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                    />
                )}
            </div>
        );
    }
);

CyberInput.displayName = 'CyberInput';

export { CyberInput };

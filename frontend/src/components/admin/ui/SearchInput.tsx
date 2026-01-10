'use client';

import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { ReactNode, useRef } from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    icon?: ReactNode;
}

export function SearchInput({
    value,
    onChange,
    onClear,
    placeholder = 'SEARCH',
    className,
    inputClassName,
    icon,
}: SearchInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const handleClear = () => {
        onChange('');
        onClear?.();
        inputRef.current?.focus();
    };

    return (
        <div
            className={cn(
                'relative flex items-center cursor-text transition-all',
                'border border-white/10 rounded-lg overflow-hidden',
                'focus-within:border-cyan-neon focus-within:shadow-[0_0_10px_rgba(34,211,238,0.3)]',
                className
            )}
            onClick={handleContainerClick}
        >
            {/* Icon */}
            <span className="absolute left-3 text-primary pointer-events-none">
                {icon || <Search size={14} />}
            </span>

            {/* Input */}
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    'w-full bg-transparent pl-10 pr-10 py-3',
                    'text-foreground placeholder:text-muted-foreground/30',
                    'focus:outline-none font-mono text-sm',
                    inputClassName
                )}
            />

            {/* Clear Button */}
            {value && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClear();
                    }}
                    className="absolute right-3 p-1 text-muted-foreground/50 hover:text-foreground transition-colors rounded-full hover:bg-white/5"
                    aria-label="Clear search"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}

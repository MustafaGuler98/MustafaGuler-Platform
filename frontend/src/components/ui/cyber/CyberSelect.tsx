'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface CyberSelectProps {
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    options: SelectOption[];
    required?: boolean;
    className?: string;
    labelClassName?: string;
}

export function CyberSelect({
    label,
    value,
    onChange,
    options,
    required,
    className,
    labelClassName,
}: CyberSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (newValue: string | number) => {
        onChange(newValue);
        setIsOpen(false);
    };

    const triggerStyles = cn(
        'w-full bg-black/10 border border-white/5 rounded-md h-9',
        'px-3 text-foreground flex items-center justify-between',
        'focus:outline-none transition-colors duration-200 font-mono text-sm',
        'hover:border-white/10 hover:bg-black/20 cursor-pointer',
        'shadow-sm',
        isOpen && 'border-white/10 bg-black/20',
        className
    );

    return (
        <div ref={containerRef}>
            <label className={cn("block w-fit text-[10px] text-purple-300 font-mono uppercase tracking-widest font-bold mb-2 pl-2 py-1 pr-3 border-l-2 border-purple-500 bg-gradient-to-r from-purple-500/10 to-transparent", labelClassName)}>
                {label}
            </label>

            {/* Trigger Wrapper - relative for dropdown positioning */}
            <div className="relative">
                {/* Custom Trigger */}
                <div
                    className={triggerStyles}
                    onClick={() => setIsOpen(!isOpen)}
                    role="button"
                    tabIndex={0}
                >
                    <span className={!selectedOption ? "text-muted-foreground/20" : ""}>
                        {selectedOption ? selectedOption.label : "Select..."}
                    </span>
                    <ChevronDown size={14} className={cn("text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
                </div>

                {/* Custom Cyber Menu - positioned relative to trigger */}
                {isOpen && (
                    <div className="absolute top-full left-0 z-[100] w-full mt-1 bg-[#05050a]/95 backdrop-blur-xl border border-white/10 rounded-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
                        <div className="max-h-60 overflow-y-auto py-1 space-y-0.5">
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={cn(
                                        "group px-3 py-2.5 text-sm font-mono cursor-pointer flex items-center justify-between transition-all duration-200",
                                        "border-l-2 border-transparent",
                                        "hover:bg-purple-500/5 hover:border-purple-500 hover:text-purple-100",
                                        option.value === value
                                            ? "bg-purple-500/10 border-purple-500 text-purple-300"
                                            : "text-zinc-400"
                                    )}
                                >
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                                        {option.label}
                                    </span>
                                    {option.value === value && (
                                        <Check size={12} className="text-purple-400 animate-in fade-in slide-in-from-left-2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

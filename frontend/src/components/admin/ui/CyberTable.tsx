'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Column<T> {
    key: keyof T | string;
    label: string | ReactNode;
    render?: (row: T) => ReactNode;
}

interface CyberTableProps<T> {
    columns: Column<T>[];
    data: T[];
    actions?: (row: T) => ReactNode;
    onRowClick?: (row: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
}

export function CyberTable<T extends Record<string, any>>({
    columns,
    data,
    actions,
    onRowClick,
    isLoading = false,
    emptyMessage = 'NO_DATA_FOUND',
}: CyberTableProps<T>) {
    if (isLoading) {
        return (
            <div className="w-full space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="h-12 bg-white/5 rounded animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="w-full py-16 text-center">
                <p className="font-mono text-xs tracking-widest text-muted-foreground/50">
                    {'>'} {emptyMessage}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-white/10">
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className="text-left py-3 px-4 font-mono text-[10px] tracking-widest text-primary"
                            >
                                {col.label}
                            </th>
                        ))}
                        {actions && (
                            <th className="text-right py-3 px-4 font-mono text-[10px] tracking-widest text-muted-foreground uppercase w-32">
                                {/* Hidden label for actions */}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => onRowClick?.(row)}
                            className={cn(
                                'group border-y border-white/[0.03] transition-all duration-200 relative',
                                // Hover effects: Top and Bottom borders + glow
                                'hover:bg-cyan-neon/5 hover:border-y-cyan-neon/40',
                                'hover:shadow-[0_4px_20px_-10px_rgba(34,211,238,0.2)]', // Subtle glow
                                'border-l-2 border-l-white/[0.03] hover:border-l-cyan-neon',
                                'cursor-pointer' // Make it look clickable
                            )}
                        >
                            {/* Inset box-shadow for stable top border
                            */}

                            {columns.map((col) => (
                                <td
                                    key={String(col.key)}
                                    className={cn(
                                        "py-3 px-4 text-sm text-foreground/80 font-mono relative",
                                        // Specific tweak to add top border visual on hover without breaking layout
                                        "group-hover:before:content-[''] group-hover:before:absolute group-hover:before:top-0 group-hover:before:left-0 group-hover:before:right-0 group-hover:before:h-[1px] group-hover:before:bg-cyan-neon/40"
                                    )}
                                >
                                    {col.render
                                        ? col.render(row)
                                        : String(row[col.key as keyof T] ?? '')}
                                </td>
                            ))}
                            {actions && (
                                <td className={cn(
                                    "py-3 px-4 text-right relative",
                                    "group-hover:before:content-[''] group-hover:before:absolute group-hover:before:top-0 group-hover:before:left-0 group-hover:before:right-0 group-hover:before:h-[1px] group-hover:before:bg-cyan-neon/40"
                                )}>
                                    <div
                                        className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking actions
                                    >
                                        {actions(row)}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

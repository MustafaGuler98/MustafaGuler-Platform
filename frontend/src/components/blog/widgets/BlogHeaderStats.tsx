'use client';

import type { ArchivesStats } from '@/types/archives';

interface BlogHeaderStatsProps {
    articleCount: number;
    stats: ArchivesStats | null;
}

export function BlogHeaderStats({ articleCount, stats }: BlogHeaderStatsProps) {

    const items = [
        { label: 'Articles', value: articleCount, color: 'text-cyan-400/70' },
        { label: 'Movies', value: stats?.movieCount ?? 0, color: 'text-purple-400/70' },
        { label: 'Books', value: stats?.bookCount ?? 0, color: 'text-amber-400/70' },
        { label: 'Songs', value: stats?.musicCount ?? 0, color: 'text-pink-400/70' },
        { label: 'Quotes', value: stats?.quoteCount ?? 0, color: 'text-slate-400/70' },
    ];

    return (
        <div className="hidden xl:flex items-end gap-6 mt-auto pt-6">
            {items.map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                    <div className="font-mono text-[10px] text-gray-500 tracking-wider uppercase">
                        {item.label}
                    </div>
                    <div className={`text-2xl font-bold font-heading ${item.color}`}>
                        {item.value}
                    </div>
                </div>
            ))}
        </div>
    );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import { ActivityCard } from '@/components/content/activity-card';
import { Film, Gamepad2, Headphones, BookOpen, MonitorPlay, Dices, Tv, type LucideIcon } from 'lucide-react';
import type { PublicActivities, PublicActivity } from '@/types/archives';
import { apiClient } from '@/lib/api-client';

// Default empty cards
const defaultSlots: Array<{ type: string; icon: LucideIcon; color: string }> = [
    { type: 'Book', icon: BookOpen, color: 'text-amber-400' },
    { type: 'Movie', icon: Film, color: 'text-purple-400' },
    { type: 'TvSeries', icon: Tv, color: 'text-blue-500' },
    { type: 'Music', icon: Headphones, color: 'text-pink-400' },
    { type: 'Anime', icon: MonitorPlay, color: 'text-rose-500' },
    { type: 'Game', icon: Gamepad2, color: 'text-cyan-400' },
    { type: 'TTRPG', icon: Dices, color: 'text-emerald-400' },
];

interface FeaturedActivityCardsProps {
    onItemCountChange?: (count: number) => void;
}

export function FeaturedActivityCards({ onItemCountChange }: FeaturedActivityCardsProps) {
    const [data, setData] = useState<PublicActivities | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const stableOnItemCountChange = useCallback(
        (count: number) => onItemCountChange?.(count),
        [onItemCountChange]
    );

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await apiClient.get<PublicActivities>('/archives/activity');
                if (response.isSuccess && response.data) {
                    setData(response.data);
                }
            } catch {
                // silent
            } finally {
                setIsLoading(false);
                stableOnItemCountChange(defaultSlots.length);
            }
        };
        fetchFeatured();
    }, [stableOnItemCountChange]);

    // Map type to data
    const getItemForType = (type: string): PublicActivity | null => {
        if (!data) return null;
        switch (type) {
            case 'Book': return data.book || null;
            case 'Movie': return data.movie || null;
            case 'TvSeries': return data.tvSeries || null;
            case 'Music': return data.music || null;
            case 'Anime': return data.anime || null;
            case 'Game': return data.game || null;
            case 'TTRPG': return data.ttrpg || null;
            default: return null;
        }
    };

    return (
        <>
            {defaultSlots.map((slot, index) => {
                const item = getItemForType(slot.type);
                return (
                    <div key={`${slot.type}-${index}`} className="min-w-[260px] md:min-w-[280px] snap-start">
                        <ActivityCard
                            title={slot.type === 'TvSeries' ? 'TV SERIES' : slot.type.toUpperCase()}
                            name={item?.title || (isLoading ? 'Loading...' : 'No data yet')}
                            description={item ? (item.subtitle ? `${item.subtitle}. ${item.description || ''}` : item.description || '') : ''}
                            Icon={slot.icon}
                            colorClass={slot.color}
                            imageUrl={item?.imageUrl || ''}
                            fontClass="font-[family-name:var(--font-rajdhani)] font-bold uppercase tracking-wide text-base md:text-lg"
                        />
                    </div>
                );
            })}
        </>
    );
}

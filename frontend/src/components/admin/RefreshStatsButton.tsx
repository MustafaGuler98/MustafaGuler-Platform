'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { refreshArchiveStats } from '@/actions/archives';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { useToast } from '@/components/ui/cyber/Toast';
import { useRouter } from 'next/navigation';

export function RefreshStatsButton() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshArchiveStats();
            router.refresh();
            showToast('Stats updated successfully', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to refresh stats', 'error');
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <CyberButton
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-white/10 hover:border-cyan-neon/50 text-muted-foreground hover:text-cyan-neon"
        >
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'UPDATING...' : 'REFRESH STATS'}
        </CyberButton>
    );
}

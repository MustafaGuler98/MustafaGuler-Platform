'use client';

import { useState } from 'react';
import { Home, RefreshCw } from 'lucide-react';
import { refreshHomepage } from '@/actions/archives';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { useToast } from '@/components/ui/cyber/Toast';
import { useRouter } from 'next/navigation';

export function RefreshHomepageButton() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshHomepage();
            router.refresh();
            showToast('Homepage cache refreshed', 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to refresh homepage', 'error');
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
            className="border-white/10 hover:border-purple-500/50 text-muted-foreground hover:text-purple-400"
        >
            {isRefreshing ? (
                <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : (
                <Home size={16} className="mr-2" />
            )}
            {isRefreshing ? 'REFRESHING...' : 'REFRESH HOME'}
        </CyberButton>
    );
}

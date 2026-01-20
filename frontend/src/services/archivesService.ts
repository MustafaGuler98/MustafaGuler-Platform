import { ArchivesStats } from '@/types/archives';
import { fetchApi } from '@/lib/api-client';

export const archivesService = {
    async getStats(): Promise<ArchivesStats | null> {
        try {
            const response = await fetchApi<ArchivesStats>('/archives/stats', {
                next: {
                    revalidate: 86400, // 24 hours
                    tags: ['archives-stats']
                }
            });

            return response.isSuccess ? response.data : null;
        } catch (error) {
            console.error('Failed to fetch archive stats:', error);
            return null;
        }
    }
};

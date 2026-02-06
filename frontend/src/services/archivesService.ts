import { ArchivesStats, PublicActivities } from '@/types/archives';
import { fetchApi, apiClient } from '@/lib/api-client';

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
    },

    async getActivity(): Promise<PublicActivities | null> {
        try {
            const response = await apiClient.get<PublicActivities>('/archives/activity', {
                next: { revalidate: 60 }
            });
            return response.isSuccess ? response.data : null;
        } catch (error) {
            console.error('Failed to fetch activities:', error);
            return null;
        }
    }
};

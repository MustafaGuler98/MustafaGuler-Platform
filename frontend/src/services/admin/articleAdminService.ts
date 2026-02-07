import { BaseAdminService } from './baseAdminService';
import { AdminArticle, ServiceResponse } from '@/types/admin';
import { apiClient } from '@/lib/api-client';

class ArticleAdminService extends BaseAdminService<AdminArticle> {
    constructor() {
        super('articles');
    }

    // Override getById to use /articles/id/{id} endpoint
    async getById(id: string): Promise<ServiceResponse<AdminArticle>> {
        return apiClient.get<AdminArticle>(`/articles/id/${id}`, { credentials: 'include' });
    }
}

export const articleAdminService = new ArticleAdminService();

import { BaseAdminService } from './baseAdminService';
import { Category, ServiceResponse } from '@/types/admin';
import { apiClient } from '@/lib/api-client';

class CategoryAdminService extends BaseAdminService<Category> {
    constructor() {
        super('categories');
    }

    async getBySlug(slug: string): Promise<ServiceResponse<Category>> {
        return apiClient.get<Category>(`/categories/slug/${slug}`, { credentials: 'include' });
    }
}

export const categoryAdminService = new CategoryAdminService();

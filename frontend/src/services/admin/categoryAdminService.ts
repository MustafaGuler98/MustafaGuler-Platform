import { BaseAdminService } from './baseAdminService';
import { Category } from '@/types/admin';

class CategoryAdminService extends BaseAdminService<Category> {
    constructor() {
        super('categories');
    }
}

export const categoryAdminService = new CategoryAdminService();

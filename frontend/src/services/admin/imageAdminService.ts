import { BaseAdminService } from './baseAdminService';
import { ImageInfo, ServiceResponse, PagedResult } from '@/types/admin';
import { apiClient, fetchApi } from '@/lib/api-client';

class ImageAdminService extends BaseAdminService<ImageInfo> {
    constructor() {
        super('images');
    }

    // Override getPaged - images use different query param format
    async getPaged(
        page: number,
        pageSize: number,
        searchTerm?: string
    ): Promise<ServiceResponse<PagedResult<ImageInfo>>> {
        let url = `/images?pageNumber=${page}&pageSize=${pageSize}`;
        if (searchTerm) {
            url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
        }
        return apiClient.get<PagedResult<ImageInfo>>(url, { credentials: 'include' });
    }

    // Custom upload method - FormData requires raw fetch, cannot use apiClient.post (enforces JSON)
    async upload(formData: FormData): Promise<ServiceResponse<ImageInfo>> {
        try {
            return await fetchApi<ImageInfo>('/images/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
        } catch {
            return {
                isSuccess: false,
                data: null as unknown as ImageInfo,
                message: 'Network error during upload',
                statusCode: 500,
                errors: ['Network error'],
            };
        }
    }
}

export const imageAdminService = new ImageAdminService();

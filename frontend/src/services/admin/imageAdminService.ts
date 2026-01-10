import { BaseAdminService } from './baseAdminService';
import { ImageInfo, ServiceResponse, PagedResult, PagedResponse } from '@/types/admin';
import { apiClient } from '@/lib/api-client';

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || '/api';

class ImageAdminService extends BaseAdminService<ImageInfo> {
    constructor() {
        super('images');
    }

    // Override getPaged - images use different query param format
    async getPaged(
        page: number,
        pageSize: number
    ): Promise<PagedResponse<ImageInfo>> {
        return apiClient.getPagedRaw<ImageInfo>(
            `/images?pageNumber=${page}&pageSize=${pageSize}`
        );
    }

    // Custom upload method - FormData requires raw fetch, cannot use apiClient
    async upload(formData: FormData): Promise<ServiceResponse<ImageInfo>> {
        try {
            const res = await fetch(`${getApiUrl()}/images/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                return {
                    isSuccess: false,
                    data: null as unknown as ImageInfo,
                    message: error.message || 'Failed to upload image',
                    statusCode: res.status,
                    errors: [error.message],
                };
            }

            return res.json();
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

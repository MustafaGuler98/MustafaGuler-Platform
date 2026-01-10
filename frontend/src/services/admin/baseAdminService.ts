import { apiClient } from '@/lib/api-client';
import { ServiceResponse, PagedResponse } from '@/types/admin';

export class BaseAdminService<T> {
    constructor(protected resourceName: string) { }

    async getAll(): Promise<ServiceResponse<T[]>> {
        return apiClient.get<T[]>(`/${this.resourceName}`);
    }

    async getById(id: string): Promise<ServiceResponse<T>> {
        return apiClient.get<T>(`/${this.resourceName}/${id}`);
    }

    async create(data: Partial<T>): Promise<ServiceResponse<T>> {
        return apiClient.post<T>(`/${this.resourceName}`, data);
    }

    async update(id: string, data: Partial<T>): Promise<ServiceResponse<T>> {
        return apiClient.put<T>(`/${this.resourceName}/${id}`, data);
    }

    async delete(id: string): Promise<ServiceResponse<void>> {
        return apiClient.delete<void>(`/${this.resourceName}/${id}`);
    }

    async getPaged(
        page: number,
        pageSize: number,
        searchTerm?: string,
        sortBy?: string,
        sortOrder: 'asc' | 'desc' = 'desc'
    ): Promise<PagedResponse<T>> {
        const params = new URLSearchParams({
            pageNumber: page.toString(),
            pageSize: pageSize.toString(),
        });

        if (searchTerm) params.append('searchTerm', searchTerm);
        if (sortBy) params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);

        return apiClient.getPagedRaw<T>(
            `/${this.resourceName}/paged?${params.toString()}`
        );
    }
}

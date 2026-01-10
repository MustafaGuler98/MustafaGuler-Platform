import { ServiceResponse } from '@/types/article';

// SSR uses INTERNAL_API_URL (direct backend), browser uses NEXT_PUBLIC_API_URL (proxy)
const API_URL = typeof window === 'undefined'
    ? `${process.env.INTERNAL_API_URL || 'http://localhost:5281'}/api`
    : (process.env.NEXT_PUBLIC_API_URL || '/api');

function createErrorResponse<T>(statusCode: number, message: string): ServiceResponse<T> {
    return {
        data: null as T,
        isSuccess: false,
        message,
        statusCode,
        errors: [message]
    };
}

export async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ServiceResponse<T>> {
    if (!API_URL) {
        return createErrorResponse<T>(500, 'API URL is not configured');
    }

    try {
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            credentials: 'include',
            ...options,
        });
        const json = await response.json();

        // Backend returns standard Result<T> structure
        return json as ServiceResponse<T>;
    } catch (error) {
        console.error('[API Client Error]', error);
        return createErrorResponse<T>(500, 'Network error or server unavailable');
    }
}

export const apiClient = {
    get<T>(endpoint: string, options?: RequestInit): Promise<ServiceResponse<T>> {
        return fetchApi<T>(endpoint, { ...options, method: 'GET' });
    },

    async getPagedRaw<T>(endpoint: string, options?: RequestInit): Promise<import('@/types/admin').PagedResponse<T>> {
        if (!API_URL) {
            return {
                isSuccess: false,
                message: 'API URL is not configured',
                statusCode: 500,
                errors: ['API URL is not configured'],
                data: [],
                totalCount: 0,
                pageNumber: 1,
                pageSize: 10,
                totalPages: 0,
            };
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                credentials: 'include',
                ...options,
                method: 'GET',
            });
            return response.json();
        } catch (error) {
            console.error('[API Client Error]', error);
            return {
                isSuccess: false,
                message: 'Network error or server unavailable',
                statusCode: 500,
                errors: ['Network error'],
                data: [],
                totalCount: 0,
                pageNumber: 1,
                pageSize: 10,
                totalPages: 0,
            };
        }
    },

    post<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<ServiceResponse<T>> {
        return fetchApi<T>(endpoint, {
            ...options,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...options?.headers },
            body: JSON.stringify(body)
        });
    },

    put<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<ServiceResponse<T>> {
        return fetchApi<T>(endpoint, {
            ...options,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...options?.headers },
            body: JSON.stringify(body)
        });
    },

    delete<T>(endpoint: string, options?: RequestInit): Promise<ServiceResponse<T>> {
        return fetchApi<T>(endpoint, { ...options, method: 'DELETE' });
    }
};

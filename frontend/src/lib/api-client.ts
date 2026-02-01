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

        if (response.status === 204) {
            return {
                data: null,
                isSuccess: true,
                message: 'No content',
                statusCode: 204,
                errors: null
            } as ServiceResponse<T>;
        }

        if (response.status === 304) {
            return {
                data: null,
                isSuccess: true,
                message: 'Not Modified',
                statusCode: 304,
                errors: null
            } as ServiceResponse<T>;
        }

        const text = await response.text();
        const json = text ? JSON.parse(text) : {};

        // Backend returns standard Result<T> structure
        const result = json as ServiceResponse<T>;
        result.headers = response.headers;
        return result;
    } catch (error) {
        console.error('[API Client Error]', error);
        return createErrorResponse<T>(500, 'Network error or server unavailable');
    }
}

export const apiClient = {
    get<T>(endpoint: string, options?: RequestInit): Promise<ServiceResponse<T>> {
        return fetchApi<T>(endpoint, { ...options, method: 'GET' });
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

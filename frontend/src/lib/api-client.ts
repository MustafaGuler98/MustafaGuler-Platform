import { ServiceResponse } from '@/types/article';

// Server-side uses internal Docker network, client-side uses public URL
const API_URL = typeof window === 'undefined'
    ? (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL)
    : process.env.NEXT_PUBLIC_API_URL;

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
        const response = await fetch(`${API_URL}${endpoint}`, options);
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

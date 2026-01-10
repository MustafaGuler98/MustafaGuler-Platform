import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ServiceResponse } from '@/types/admin';

// Generic hook for fetching a list of resources
export function useResourceList<T>(
    resourceName: string,
    fetchFn: () => Promise<ServiceResponse<T[]>>,
    options?: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [resourceName],
        queryFn: async () => {
            const response = await fetchFn();
            if (!response.isSuccess) {
                throw new Error(response.message || 'Failed to fetch');
            }
            return response.data;
        },
        ...options,
    });
}

// Generic hook for fetching a single resource by ID
export function useResourceById<T>(
    resourceName: string,
    id: string | undefined,
    fetchFn: (id: string) => Promise<ServiceResponse<T>>,
    options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [resourceName, id],
        queryFn: async () => {
            const response = await fetchFn(id!);
            if (!response.isSuccess) {
                throw new Error(response.message || 'Resource not found');
            }
            return response.data;
        },
        enabled: !!id,
        ...options,
    });
}

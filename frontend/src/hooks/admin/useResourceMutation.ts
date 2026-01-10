import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ServiceResponse } from '@/types/admin';

interface MutationConfig {
    onSuccessRedirect?: string;
    invalidateQueries?: string[];
}

// Generic hook for creating a resource with automatic cache invalidation
export function useCreateResource<TData, TVariables = Partial<TData>>(
    resourceName: string,
    createFn: (data: TVariables) => Promise<ServiceResponse<TData>>,
    config?: MutationConfig
) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: TVariables) => {
            const response = await createFn(data);
            if (!response.isSuccess) {
                throw new Error(response.message || 'Operation failed');
            }
            return response.data;
        },
        onSuccess: () => {
            const queriesToInvalidate = config?.invalidateQueries || [resourceName];
            queriesToInvalidate.forEach((query) => {
                queryClient.invalidateQueries({ queryKey: [query] });
            });

            if (config?.onSuccessRedirect) {
                router.push(config.onSuccessRedirect);
            }
        },
    });
}

export function useUpdateResource<TData>(
    resourceName: string,
    updateFn: (id: string, data: Partial<TData>) => Promise<ServiceResponse<TData>>,
    config?: MutationConfig
) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<TData> }) => {
            const response = await updateFn(id, data);
            if (!response.isSuccess) {
                throw new Error(response.message || 'Update failed');
            }
            return response.data;
        },
        onSuccess: () => {
            const queriesToInvalidate = config?.invalidateQueries || [resourceName];
            queriesToInvalidate.forEach((query) => {
                queryClient.invalidateQueries({ queryKey: [query] });
            });

            if (config?.onSuccessRedirect) {
                router.push(config.onSuccessRedirect);
            }
        },
    });
}

export function useDeleteResource(
    resourceName: string,
    deleteFn: (id: string) => Promise<ServiceResponse<void>>,
    config?: MutationConfig
) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await deleteFn(id);
            if (!response.isSuccess) {
                throw new Error(response.message || 'Delete failed');
            }
        },
        onSuccess: () => {
            const queriesToInvalidate = config?.invalidateQueries || [resourceName];
            queriesToInvalidate.forEach((query) => {
                queryClient.invalidateQueries({ queryKey: [query] });
            });

            if (config?.onSuccessRedirect) {
                router.push(config.onSuccessRedirect);
            }
        },
    });
}

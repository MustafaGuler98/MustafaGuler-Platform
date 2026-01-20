import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ServiceResponse } from '@/types/admin';

interface MutationConfig<TData = any> {
    onSuccessRedirect?: string | ((data: TData) => string);
    invalidateQueries?: string[];
    onSuccess?: (data: TData) => void;
}

// Generic hook for creating a resource with automatic cache invalidation
export function useCreateResource<TData, TVariables = Partial<TData>>(
    resourceName: string,
    createFn: (data: TVariables) => Promise<ServiceResponse<TData>>,
    config?: MutationConfig<TData>
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
        onSuccess: (data) => {
            const queriesToInvalidate = config?.invalidateQueries || [resourceName];
            queriesToInvalidate.forEach((query) => {
                queryClient.invalidateQueries({ queryKey: [query] });
            });

            if (config?.onSuccess) {
                config.onSuccess(data);
            }

            if (config?.onSuccessRedirect) {
                if (typeof config.onSuccessRedirect === 'function') {
                    router.replace(config.onSuccessRedirect(data));
                } else {
                    router.replace(config.onSuccessRedirect);
                }
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
        onSuccess: (data) => {
            const queriesToInvalidate = config?.invalidateQueries || [resourceName];
            queriesToInvalidate.forEach((query) => {
                queryClient.invalidateQueries({ queryKey: [query] });
            });

            if (config?.onSuccessRedirect) {
                if (typeof config.onSuccessRedirect === 'function') {
                    router.replace(config.onSuccessRedirect(data));
                } else {
                    router.replace(config.onSuccessRedirect);
                }
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
                if (typeof config.onSuccessRedirect === 'function') {
                    router.replace((config.onSuccessRedirect as any)());
                } else {
                    router.replace(config.onSuccessRedirect);
                }
            }
        },
    });
}

import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { PagedResult, ServiceResponse } from '@/types/admin';

// Simple debounce if not exists
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

interface UseResourcePagedListOptions<T> {
    serviceMethod: (page: number, pageSize: number, searchTerm?: string) => Promise<ServiceResponse<PagedResult<T>>>;
    initialPageSize?: number;
    queryKey: string; // "images", "movies", etc.
}

export function useResourcePagedList<T>({
    serviceMethod,
    initialPageSize = 20,
    queryKey,
}: UseResourcePagedListOptions<T>) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [searchTerm, setSearchTerm] = useState('');

    // Debounce search term to prevent excessive API calls
    const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

    // Reset page when search term changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm]);

    const query = useQuery({
        queryKey: [queryKey, page, pageSize, debouncedSearchTerm],
        queryFn: async () => {
            const response = await serviceMethod(page, pageSize, debouncedSearchTerm);
            if (!response.isSuccess || !response.data) {
                throw new Error(response.message || 'Failed to fetch data');
            }
            return response.data;
        },
        placeholderData: keepPreviousData, // Keep old data while fetching new page
    });

    return {
        // Data
        items: query.data?.items ?? [],
        totalCount: query.data?.totalCount ?? 0,
        totalPages: query.data?.totalPages ?? 0,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,

        // Pagination Actions
        page,
        setPage,
        pageSize,
        setPageSize,

        // Search Actions
        searchTerm,
        setSearchTerm,
        clearSearch: () => setSearchTerm(''),
    };
}

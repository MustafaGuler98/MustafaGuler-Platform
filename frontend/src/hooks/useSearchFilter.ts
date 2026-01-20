import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export function useSearchFilter<T>(
    data: T[],
    searchFields: (keyof T)[]
) {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm);

    const filteredData = useMemo(() => {
        if (!debouncedSearch) return data;

        const search = debouncedSearch.toLowerCase();
        return data.filter((item) =>
            searchFields.some((field) => {
                const value = item[field];
                return typeof value === 'string' && value.toLowerCase().includes(search);
            })
        );
    }, [data, debouncedSearch, searchFields]);

    const clearSearch = () => setSearchTerm('');

    return {
        searchTerm,
        setSearchTerm,
        filteredData,
        clearSearch,
    };
}

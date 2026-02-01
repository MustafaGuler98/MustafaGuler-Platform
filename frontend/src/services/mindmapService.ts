import { apiClient } from '@/lib/api-client';

const API_URL = '/mindmap';

export const mindmapService = {
    getAllActive: async (): Promise<string[]> => {
        const CACHE_KEY_ITEMS = "mindmap_items";
        const CACHE_KEY_ETAG = "mindmap_etag";

        let cachedItems: string[] = [];
        let cachedETag: string | null = null;

        if (typeof window !== 'undefined') {
            try {
                const storedItems = localStorage.getItem(CACHE_KEY_ITEMS);
                const storedETag = localStorage.getItem(CACHE_KEY_ETAG);

                if (storedItems) {
                    cachedItems = JSON.parse(storedItems);
                }
                if (storedETag) {
                    cachedETag = storedETag;
                }
            } catch (e) {
                console.warn("[Mindmap] Failed to read from localStorage", e);
            }
        }


        const headers: HeadersInit = {};
        if (cachedETag && cachedItems.length > 0) {
            headers["If-None-Match"] = cachedETag;
        }

        const response = await apiClient.get<string[]>(`${API_URL}/all-active`, { headers });

        if (response.statusCode === 304) {
            console.debug("[Mindmap] Using cached data (304)");
            return cachedItems;
        }

        if (response.isSuccess && response.data) {
            console.debug("[Mindmap] Fetched new data");

            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem(CACHE_KEY_ITEMS, JSON.stringify(response.data));

                    const newETag = response.headers?.get("ETag");
                    if (newETag) {
                        localStorage.setItem(CACHE_KEY_ETAG, newETag);
                    }
                } catch (e) {
                    console.warn("[Mindmap] Failed to save to localStorage", e);
                }
            }

            return response.data;
        }

        return [];
    }
};

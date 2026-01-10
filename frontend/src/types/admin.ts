import { ServiceResponse } from './article';


export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface AdminArticle {
    id: string;
    title: string;
    content: string;
    slug: string;
    categoryId: string;
    categoryName?: string;
    languageCode: string;
    mainImage?: string;
    createdDate: string;
}

export interface ImageInfo {
    id: string;
    fileName: string;
    url: string;
    sizeBytes: number;
    createdDate: string;
}

export interface PagedResponse<T> {
    isSuccess: boolean;
    message: string | null;
    statusCode: number;
    errors: string[] | null;
    data: T[];  // Items array - from Result<List<T>>
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

// Legacy alias for backward compatibility
export type PagedResult<T> = PagedResponse<T>;

export interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

export interface ArticleFormData {
    title: string;
    content: string;
    categoryId: string;
    languageCode: string;
    mainImage: string;
}

export interface CategoryFormData {
    name: string;
    description: string;
}

// Re-export ServiceResponse for convenience
export type { ServiceResponse };

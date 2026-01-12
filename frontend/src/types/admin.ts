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

export interface PagedResult<T> {
    items: T[];              // (renamed from 'data')
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}



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

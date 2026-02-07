import { Article, ArticleListWithoutImage, Category, ServiceResponse } from '@/types/article';
import { PagedResult } from '@/types/admin';
import { apiClient } from '@/lib/api-client';

class ApiError extends Error {
  statusCode: number;
  errors: string[] | null;

  constructor(message: string, statusCode: number, errors: string[] | null = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const articleService = {
  async getArticleBySlug(slug: string): Promise<Article> {
    const response = await apiClient.get<Article>(`/articles/${slug}`, {
      next: { revalidate: 86400, tags: ['articles'] }
    } as RequestInit);

    if (!response.isSuccess || !response.data) {
      throw new ApiError(
        response.message || 'Article not found',
        response.statusCode,
        response.errors
      );
    }

    return response.data;
  },

  async getAllArticles(languageCode?: string): Promise<Article[]> {
    const params = new URLSearchParams();
    if (languageCode) {
      params.append('languageCode', languageCode);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get<Article[]>(`/articles/all${query}`, {
      next: { revalidate: 86400, tags: ['articles'] }
    });

    if (!response.isSuccess) {
      console.error(`[Build/Runtime Error] Failed to fetch articles: ${response.message}`);
      return [];
    }

    return response.data || [];
  },

  async getPopularArticles(count: number = 9, languageCode?: string): Promise<Article[]> {
    const params = new URLSearchParams();
    params.append('count', count.toString());
    if (languageCode) {
      params.append('languageCode', languageCode);
    }
    const response = await apiClient.get<Article[]>(`/articles/popular?${params.toString()}`, {
      next: { revalidate: 86400, tags: ['articles'] }
    });

    if (!response.isSuccess) {
      console.error(`[Build/Runtime Error] Failed to fetch popular articles: ${response.message}`);
      return [];
    }

    return response.data || [];
  },

  async getPagedArticles(page: number, pageSize: number, languageCode?: string, categoryName?: string): Promise<ServiceResponse<PagedResult<Article>>> {
    const params = new URLSearchParams();
    params.append('PageNumber', page.toString());
    params.append('PageSize', pageSize.toString());
    if (languageCode) {
      params.append('LanguageCode', languageCode);
    }
    if (categoryName) {
      params.append('CategoryName', categoryName);
    }

    const response = await apiClient.get<PagedResult<Article>>(`/articles?${params.toString()}`, {
      next: { revalidate: 86400, tags: ['articles'] }
    });

    if (!response.isSuccess) {
      console.error(`[Build/Runtime Error] Failed to fetch paged articles: ${response.message}`);
      return {
        isSuccess: false,
        message: response.message,
        statusCode: response.statusCode,
        data: {
          items: [],
          totalCount: 0,
          pageNumber: page,
          pageSize: pageSize,
          totalPages: 0,
          hasPrevious: false,
          hasNext: false
        } as PagedResult<Article>,
        errors: response.errors
      };
    }
    return response;
  },

  async getPagedWithoutImageArticles(page: number, pageSize: number, languageCode?: string): Promise<ServiceResponse<PagedResult<ArticleListWithoutImage>>> {
    const params = new URLSearchParams();
    params.append('pageNumber', page.toString());
    params.append('pageSize', pageSize.toString());
    if (languageCode) {
      params.append('languageCode', languageCode);
    }

    const response = await apiClient.get<PagedResult<ArticleListWithoutImage>>(`/articles/without-image?${params.toString()}`, {
      next: { revalidate: 86400, tags: ['articles'] }
    });

    if (!response.isSuccess) {
      console.error(`[Build/Runtime Error] Failed to fetch paged list: ${response.message}`);
      return {
        isSuccess: false,
        message: response.message,
        statusCode: response.statusCode,
        data: {
          items: [],
          totalCount: 0,
          pageNumber: page,
          pageSize: pageSize,
          totalPages: 0,
          hasPrevious: false,
          hasNext: false
        } as PagedResult<ArticleListWithoutImage>,
        errors: response.errors
      };
    }
    return response;
  },

  async getAllCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories/active', {
      next: { revalidate: 3600 },
    });

    if (!response.isSuccess) {
      // Log but return empty to not break page
      console.error('Failed to fetch categories', response.message);
      return [];
    }
    return response.data || [];
  }
};

export { ApiError };
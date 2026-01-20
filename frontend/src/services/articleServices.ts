import { Article } from '@/types/article';
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
      next: { revalidate: 60 }
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
    const response = await apiClient.get<Article[]>(`/articles/all${query}`, { cache: 'no-store' });

    if (!response.isSuccess) {
      throw new ApiError(
        response.message || 'Failed to fetch articles',
        response.statusCode,
        response.errors
      );
    }

    return response.data || [];
  },

  async getPopularArticles(count: number = 9, languageCode?: string): Promise<Article[]> {
    const params = new URLSearchParams();
    params.append('count', count.toString());
    if (languageCode) {
      params.append('languageCode', languageCode);
    }
    const response = await apiClient.get<Article[]>(`/articles/popular?${params.toString()}`, { cache: 'no-store' });

    if (!response.isSuccess) {
      throw new ApiError(
        response.message || 'Failed to fetch popular articles',
        response.statusCode,
        response.errors
      );
    }

    return response.data || [];
  }
};

export { ApiError };
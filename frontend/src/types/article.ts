export interface Article {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  categoryName: string;
  languageCode: string;
  viewCount: number;
  slug: string;
  mainImage?: string;
  createdDate: string;
  author: string;
  nextArticle: ArticleNavigation | null;
  previousArticle: ArticleNavigation | null;
  summary?: string;
  authorImage?: string;
}
export interface ArticleNavigation {
  title: string;
  slug: string;
}

export interface ArticleListWithoutImage {
  id: string;
  title: string;
  slug: string;
  languageCode: string;
  viewCount: number;
  createdDate: string;
  categoryId: string;
  categoryName: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface ServiceResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  statusCode: number;
  errors: string[] | null;
  headers?: Headers;
}
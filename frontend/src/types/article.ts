export interface Article {
  id: string; 
  title: string;
  content: string;
  categoyId: string;
  categorySlug: string;
  languageCode: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  summary?: string;
  authorName?: string; 
}

export interface ServiceResponse<T> {
  data: T;
  success: boolean;
  message: string;
}
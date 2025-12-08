export interface Article {
  id: string; 
  title: string;
  content: string;
  categoryId: string;
  categoryName: string;
  languageCode: string;
  slug: string;
  mainImage?: string;
  createdDate: string;
  author: string;
  nextArticle: string | null;
  previousArticle: string | null;
  summary?: string;
}

export interface ServiceResponse<T> {
  data: T;
  isSuccess: boolean; 
  message: string;
}
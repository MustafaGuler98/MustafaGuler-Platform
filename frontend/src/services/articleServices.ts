import { Article, ServiceResponse } from "@/types/article";

const API_URL = process.env.NEXT_PUBLIC_API_URL; 

export const articleService = {
  
  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (!API_URL) return null;

    try {
      const res = await fetch(`${API_URL}/articles/${slug}`, { 
        next: { revalidate: 60 } 
      });

      if (!res.ok) return null;

      const result: ServiceResponse<Article> = await res.json();

      if (!result.success || !result.data) {
        return null;
      }

      return result.data;

    } catch (error) {
      console.error("Detay çekme hatası:", error);
      return null;
    }
  },
  async getAllArticles(): Promise<Article[]> {
    if (!API_URL) return [];

    try {
      // C# Controller'da [Route("api/[controller]")] olduğu için adres: /api/articles
      const res = await fetch(`${API_URL}/articles`, { 
        cache: 'no-store' 
      });

      if (!res.ok) return [];

      const result: ServiceResponse<Article[]> = await res.json();

      if (!result.success || !result.data) {
        return [];
      }

      return result.data;
    } catch (error) {
      console.error("Liste çekme hatası:", error);
      return [];
    }
  }
};
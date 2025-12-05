import { Article } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const articleService = {
  
  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (!API_URL) return null;

    try {
      const res = await fetch(`${API_URL}/articles/${slug}`, { 
        next: { revalidate: 60 } 
      });

      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error("Detay çekme hatası:", error);
      return null;
    }
  },

  async getLatestArticles(): Promise<Article[]> {
    if (!API_URL) return [];

    try {
      const res = await fetch(`${API_URL}/articles`, { 
      });

      if (!res.ok) {
        console.error("API Hatası (Status):", res.status);
        return [];
      }

      return await res.json();
    } catch (error) {
      console.error("Liste çekme hatası:", error);
      return [];
    }
  }
};
import { Article } from "@/types/article";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const articleService = {
  
  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (!API_URL) return null;

    try {
      const res = await fetch(`${API_URL}/articles/${slug}`, { 
        next: { revalidate: 60 } 
      });

      if (!res.ok) return null;

      const json = await res.json();
      console.log("📦[DEBUG] Raw JSON from API:", JSON.stringify(json, null, 2));

      const isSuccessful = json.isSuccess === true || json.success === true || json.Success === true;
      const data = json.data || json.Data;

      if (isSuccessful && data) {
        return {
            ...data,
            imageUrl: data.mainImage || data.imageUrl, 
            authorName: data.author || data.authorName
        };
      }

      return null;

    } catch (error) {
      console.error("Service Error:", error);
      return null;
    }
  },

  async getAllArticles(): Promise<Article[]> {
    if (!API_URL) return [];

    try {
        const res = await fetch(`${API_URL}/articles`, { cache: 'no-store' });
        if (!res.ok) return [];

        const json = await res.json();
        const isSuccessful = json.isSuccess === true || json.success === true;
        
        if (isSuccessful && json.data) {
            return json.data;
        }
        return [];
    } catch (error) {
        return [];
    }
  }
};
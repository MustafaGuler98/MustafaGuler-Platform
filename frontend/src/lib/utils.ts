import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Article } from "@/types/article";
export { formatCardDate };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

const formatCardDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', 
      day: 'numeric'
    });
  };

// Our wwwroot is in the backend folder.
export function getImageUrl(path: string | null | undefined): string {
  if (!path || path.includes("default-article")) return "/default-article.png";
  if (path.startsWith("http")) return path;

  const baseUrl = getBackendUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
}

function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
}

export function groupArticlesByYear(articles: Article[]): { [year: string]: Article[] } {
  return articles.reduce((acc, article) => {
    const year = new Date(article.createdDate).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(article);
    return acc;
  }, {} as { [year: string]: Article[] });
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Article } from "@/types/article";
export { formatCardDate };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(dateString));
}

const formatCardDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(dateString));
};

// Our wwwroot is in the backend folder.
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/default-article.webp";
  if (path.includes("default-article")) return "/default-article.webp";
  if (path.startsWith("http")) return path;

  const baseUrl = getBackendUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
}

function getBackendUrl(): string {
  // Static files (images) are served directly from backend
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5281';
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5281';
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
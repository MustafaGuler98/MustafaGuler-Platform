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

// Relative path for internal use
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/default-article.webp";
  if (path.includes("default-article")) return "/default-article.webp";
  if (path.startsWith("http")) return path;

  return path.startsWith("/") ? path : `/${path}`;
}

// Determines if the image should be optimized via the backend or handled by Next.js.
export function shouldUseBackendImageOptimization(src: string): boolean {
  return src.startsWith("/uploads/articles/") || src.startsWith("/uploads/avatars/");
}
export function backendImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  const q = quality || 75;
  return `/api/images/resize?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}

// Absolute URL for SEO meta tags only
export function getAbsoluteImageUrl(path: string | null | undefined): string {
  if (!path) return "/default-article.webp";
  if (path.includes("default-article")) return "/default-article.webp";
  if (path.startsWith("http")) return path;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5281";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
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

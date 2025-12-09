import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Our wwwroot is in the backend folder.
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return `${getBackendUrl()}/assets/images/default-article.png`;

  if (path.startsWith("http")) return path;

  const baseUrl = getBackendUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
}

function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
}
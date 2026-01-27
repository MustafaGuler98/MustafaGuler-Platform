
import { MetadataRoute } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://mustafaguler.me';
// Use internal API URL for server-side fetching if available, otherwise fallback to public
const API_URL = process.env.INTERNAL_API_URL || 'http://api:8080';

type ArticleSitemapDto = {
    slug: string;
    updatedDate?: string;
    createdDate: string;
};

async function getAllArticles(): Promise<ArticleSitemapDto[]> {
    try {
        const res = await fetch(`${API_URL}/api/articles/all`, {
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (!res.ok) {
            console.error('Failed to fetch articles for sitemap', res.statusText);
            return [];
        }

        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error('Sitemap Fetch Error:', error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const articles = await getAllArticles();

    // Static Routes
    const routes = [
        '',
        '/blog',
        '/about',
    ].map((route) => ({
        url: `${BACKEND_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Routes
    const articleRoutes = articles.map((article) => ({
        url: `${BACKEND_URL}/blog/${article.slug}`,
        lastModified: new Date(article.updatedDate || article.createdDate),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...routes, ...articleRoutes];
}

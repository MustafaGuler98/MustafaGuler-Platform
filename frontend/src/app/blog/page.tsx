import { articleService } from "@/services/articleServices";
import { archivesService } from "@/services/archivesService";
import BlogClient from "./blog-client";
import { constructMetadata } from "@/lib/seo";

export const dynamic = 'force-dynamic';

export const metadata = constructMetadata({
    title: "Blog",
    description: "A curated collection of articles exploring my journey.",
    path: "/blog",
});

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogPage(props: Props) {
    const searchParams = await props.searchParams;
    const pageParam = searchParams?.page;
    const categoryParam = searchParams?.category;
    const currentPage = typeof pageParam === 'string' ? parseInt(pageParam) : 1;
    const currentCategory = typeof categoryParam === 'string' ? categoryParam : undefined;
    const pageSize = 6;

    const pagedResult = await articleService.getPagedArticles(currentPage, pageSize, 'en', currentCategory);

    // Default values if fetch fails
    const articles = pagedResult.isSuccess && pagedResult.data ? pagedResult.data.items : [];
    const totalPages = pagedResult.isSuccess && pagedResult.data ? pagedResult.data.totalPages : 0;
    const totalCount = pagedResult.isSuccess && pagedResult.data ? pagedResult.data.totalCount : 0;

    const popularArticles = await articleService.getPopularArticles(9, 'en');
    const allCategories = await articleService.getAllCategories();
    const uniqueCategories = allCategories.map(c => c.name);

    const stats = await archivesService.getStats();

    return (
        <BlogClient
            articles={articles}
            popularArticles={popularArticles}
            categories={uniqueCategories}
            stats={stats}
            pagination={{
                currentPage,
                totalPages,
                totalCount
            }}
        />
    );
}

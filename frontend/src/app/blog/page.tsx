import { articleService } from "@/services/articleServices";
import BlogClient from "./blog-client";
import { constructMetadata } from "@/lib/seo";

export const dynamic = 'force-dynamic';

export const metadata = constructMetadata({
    title: "Blog",
    description: "Transmissions from the Digital Mind. Articles on Software Architecture, .NET, and Cyberpunk culture.",
    path: "/blog",
});

export default async function BlogPage() {
    const articles = await articleService.getAllArticles('en');
    const popularArticles = await articleService.getPopularArticles(9, 'en');

    return <BlogClient articles={articles} popularArticles={popularArticles} />;
}

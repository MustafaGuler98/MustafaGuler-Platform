import { Metadata } from "next";
import { getImageUrl } from "@/lib/utils";
import { Article } from "@/types/article";

/**
 * @param content 
 * @param maxLength
 */
export function processSeoDescription(content: string | null | undefined, maxLength: number = 160): string {
  if (!content) return "Software development, technology and coding articles.";

  const strippedContent = content.replace(/<[^>]*>?/gm, '');

  const cleanText = strippedContent.replace(/\s+/g, ' ').trim();
  return cleanText.length > maxLength 
    ? cleanText.substring(0, maxLength) + "..." 
    : cleanText;
}

/**
 * @param article
 * @param slug
 */

export function buildArticleMetadata(article: Article | null, slug: string): Metadata {
  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  const description = article.summary 
    ? article.summary 
    : processSeoDescription(article.content);

  const ogImage = article.mainImage 
    ? getImageUrl(article.mainImage) 
    : "/default-og-image.png";

  const pageUrl = `/blog/${slug}`;

  return {
    title: article.title,
    description: description,
    
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: article.title,
      description: description,
      url: pageUrl,
      type: "article",
      publishedTime: article.createdDate,
      authors: ["Mustafa Guler"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: description,
      images: [ogImage],
    },
  };
}
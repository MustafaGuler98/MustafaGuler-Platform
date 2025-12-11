import { Metadata } from "next";
import { getImageUrl } from "@/lib/utils";
import { Article } from "@/types/article"; // Assuming you have this type defined

/**
 * Strips HTML tags and truncates text to a specific length.
 * Used for generating SEO descriptions from rich text content.
 * 
 * @param content The raw HTML content
 * @param maxLength Maximum length of the description (default: 160)
 */
export function processSeoDescription(content: string | null | undefined, maxLength: number = 160): string {
  if (!content) return "Software development, technology and coding articles.";

  // 1. Remove HTML tags using Regex
  const strippedContent = content.replace(/<[^>]*>?/gm, '');

  // 2. Remove excess whitespace and newlines
  const cleanText = strippedContent.replace(/\s+/g, ' ').trim();

  // 3. Truncate to the desired length
  return cleanText.length > maxLength 
    ? cleanText.substring(0, maxLength) + "..." 
    : cleanText;
}

/**
 * Builds the Next.js Metadata object for a specific article.
 * This keeps the page.tsx file clean.
 * 
 * @param article The article data fetched from the database
 * @param slug The current page slug
 */
export function buildArticleMetadata(article: Article | null, slug: string): Metadata {
  // If no article is found, return a 404-style title
  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  // Determine the description: Summary > Content > Default
  const description = article.summary 
    ? article.summary 
    : processSeoDescription(article.content);

  // Prepare the image URL (ensure absolute path logic is handled in getImageUrl)
  const ogImage = article.mainImage 
    ? getImageUrl(article.mainImage) 
    : "/default-og-image.png";

  const pageUrl = `/blog/${slug}`;

  // Return the full Metadata object
  return {
    title: article.title,
    description: description,
    
    // Canonical URL for Google
    alternates: {
      canonical: pageUrl,
    },

    // Open Graph (Facebook, LinkedIn, WhatsApp)
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

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: description,
      images: [ogImage],
    },
  };
}
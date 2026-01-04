
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Zap } from "lucide-react";
import { articleService } from "@/services/articleServices";
import { formatDate, getImageUrl } from "@/lib/utils";
import { BottomNavButtons } from "@/components/articlePage/bottom-nav-buttons";
import { buildArticleMetadata } from "@/lib/seo";
import DOMPurify from "isomorphic-dompurify";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const article = await articleService.getArticleBySlug(slug);
    return buildArticleMetadata(article, slug);
  } catch {
    return buildArticleMetadata(null, slug);
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params;

  let post;
  try {
    post = await articleService.getArticleBySlug(resolvedParams.slug);
  } catch {
    notFound();
  }


  return (
    <div className="min-h-screen pb-20 mt-16">

      {/* Hero Image Section */}
      {getImageUrl(post.mainImage) && (
        <div className="relative max-w-3xl mx-auto mb-8 px-4">
          {/* Image Container with gradient border effect */}
          <div className="relative rounded-xl overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60 z-10" />

            {/* Image wrapper - fixed height for consistency */}
            <div className="relative h-[350px] w-full overflow-hidden border border-primary/30 rounded-xl bg-[#0f0518]">
              <Image
                src={getImageUrl(post.mainImage)}
                alt={post.title}
                fill
                className="object-cover opacity-80"
                priority
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020103] via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#020103]/40 via-transparent to-transparent" />
            </div>

            {/* Bottom glow accent */}
            <div className="absolute -bottom-1 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="container max-w-4xl mx-auto px-4 mt-10">

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-primary/20">
          {/* Category Badge */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 rounded flex items-center gap-1.5 uppercase tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.15)]">
              <Zap className="w-3 h-3" />
              {post.categoryName || "Article"}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground/80">
            <Calendar className="w-3.5 h-3.5 text-primary/70" />
            <span>{formatDate(post.createdDate)}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-foreground leading-tight mb-8 tracking-tight text-center">
          {post.title}
        </h1>

        {/* Decorative separator */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-primary/50 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-primary/50 shadow-[0_0_8px_rgba(147,51,234,0.5)]" />
          <div className="flex-1 h-[1px] bg-gradient-to-l from-cyan-500/50 to-transparent" />
        </div>

        {post.summary && (
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-light text-center">
            {post.summary}
          </p>
        )}

        {/* Article Content */}
        <div
          className="
            prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline hover:prose-a:text-cyan-400
            prose-img:rounded-xl prose-img:shadow-md prose-img:border prose-img:border-primary/20
            prose-p:leading-8 prose-p:text-foreground/85
            prose-strong:text-foreground prose-strong:font-semibold
            prose-code:text-cyan-400 prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-[#0f0518] prose-pre:border prose-pre:border-primary/20
            prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1
            prose-li:marker:text-primary
          "
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {/* Navigation Buttons */}
        <BottomNavButtons
          nextArticleTitle={post.nextArticle?.title}
          nextArticle={post.nextArticle?.slug}
          previousArticleTitle={post.previousArticle?.title}
          previousArticle={post.previousArticle?.slug}
        />

      </article>
    </div>
  );
}
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, ChevronLeft, User, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


import { articleService } from "@/services/articleServices";
import { formatDate, getImageUrl } from "@/lib/utils";
import { AvatarName } from "@/components/articlePage/avatar-name";


interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}


export default async function ArticlePage({ params }: PageProps) {
  
  const resolvedParams = await params;
  const post = await articleService.getArticleBySlug(resolvedParams.slug);
  

  if (!post) {
    notFound();
  }

  // const words = post.content ? post.content.split(/\s+/).length : 0;
  // const readTime = Math.ceil(words / 200);
  const displayCategory = post.categoryName; 

  return (
    <div className="min-h-screen bg-background pb-20">
            {/*Image*/}
            {getImageUrl(post.mainImage) && (
  <div className="relative w-full max-w-2xl mx-auto h-[300px] md:h-[300px] mb-12 rounded-2xl overflow-hidden shadow-sm bg-muted">
    <Image 
        src={getImageUrl(post.mainImage)} 
        alt={post.title}
        fill
        className="object-cover"
        priority
        unoptimized
              />
            </div>
            )}

      {/* Title */}

      <article className="container max-w-4xl mx-auto px-4 mt-10">
          <AvatarName name={post.author} authorImage={post.authorImage} createdDate={post.createdDate} readTime={post.viewCount}/>
        <div className="mb-6">
          
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {displayCategory}
          </Badge>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-6">
          {post.title}
          <Separator className="my-12" />
        </h1>
        

        {post.summary && (
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {post.summary}
          </p>
        )}

        {/* Content */}
        <div 
          className="
            prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-p:leading-8 text-foreground/90
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        
        {/* NEXT AND BACK ARTİCLE NAVIGATION BUTTONS */}
        {post.previousArticle?.slug ? (
            <Link
              href={`/blog/${post.previousArticle.slug}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-chart-5 transition-colors group text-sm sm:text-base"
            >
              <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs text-muted-foreground/70">Previous Article</span>
                <span className="font-medium">{post.previousArticle.title}</span>
              </div>
            </Link>
          ) : (
            <div className="hidden sm:block w-1/2" />
          )}
          
         {post.nextArticle?.slug ? (
            <Link
              href={`/blog/${post.nextArticle.slug}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group text-sm sm:text-base"
            >
              <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs text-muted-foreground/70">Previous Article</span>
                <span className="font-medium">{post.nextArticle.title}</span>
              </div>
            </Link>
          ) : (
            <div className="hidden sm:block w-1/2" />
          )}
      </article>
    </div>
  );
}
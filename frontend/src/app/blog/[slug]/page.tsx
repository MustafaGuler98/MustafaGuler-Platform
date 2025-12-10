
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, ChevronLeft, User, ChevronRight, Zap, LucideEye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


import { articleService } from "@/services/articleServices";
import { formatDate, getImageUrl } from "@/lib/utils";
import { AvatarName } from "@/components/articlePage/avatar-name";
import { BottomNavButtons } from "@/components/articlePage/bottom-nav-buttons";


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
    <div className="min-h-screen pb-20 mt-16">
            {/*Image*/}
            {getImageUrl(post.mainImage) && (
  <div className="
  relative w-full max-w-2xl mx-auto h-[300px] md:h-[300px]
   mb-12 rounded-2xl overflow-hidden shadow-[0_0_15px_2px_rgba(0,255,255,0.6)] border-3 border-cyan-600 ">
    <Image 
        src={getImageUrl(post.mainImage)} 
        alt={post.title}
        fill
        className="object-cover"
        priority
              />
            </div>
            )}

      {/* Title */}
      <article className="container max-w-4xl mx-auto px-4 mt-10">
        <div className="mb-6 flex items-center justify-between">
          
          <div className="flex gap-2">
             <span className="font-mono text-[11px] text-amber-400 border border-amber-500/20 bg-amber-500/5 px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                <Zap className="w-3 h-3" />
                {post.categoryName || "CategoryName"}
             </span>
          </div>
          <div className="hidden sm:block">
            <div className="font-mono text-[11px] flex items-center gap-2 text-sm text-muted-foreground mb-1 justify-end">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatDate(post.createdDate)}</span>
            </div>
            
            <div className="font-mono text-[11px] flex items-center gap-2 text-sm text-muted-foreground justify-end">
                <LucideEye className="w-4 h-4 text-primary" />
                <span>{post.viewCount} Views</span>
            </div>
          </div>
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
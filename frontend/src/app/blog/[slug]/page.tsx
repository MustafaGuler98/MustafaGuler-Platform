import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, ChevronLeft, Share2, Bookmark, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


import { articleService } from "@/services/articleServices";
import { formatDate } from "@/lib/utils";


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

  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  const finalImage = post.mainImage ? `${backendBaseUrl}${post.mainImage}` : null;

  const words = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.ceil(words / 200);

  const displayCategory = post.categoryName; 

  return (
    <div className="min-h-screen bg-background pb-20">
      
      <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          <div className="flex gap-2">
             <Button variant="ghost" size="icon">
                <Bookmark className="w-5 h-5 text-muted-foreground" />
             </Button>
             <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5 text-muted-foreground" />
             </Button>
          </div>
        </div>
      </div>

      <article className="container max-w-4xl mx-auto px-4 mt-10">

        <div className="mb-6">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {displayCategory}
          </Badge>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-6">
          {post.title}
        </h1>
        

        {post.summary && (
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {post.summary}
          </p>
        )}

        <div className="flex items-center justify-between py-6 border-y border-border mb-10">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-border bg-muted">
              <AvatarFallback>
                <User className="w-6 h-6 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">
                {post.author || "Blog Editor"}
              </p>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 justify-end">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.createdDate)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                <Clock className="w-4 h-4" />
                <span>{readTime} min read</span>
            </div>
          </div>
        </div>

        {finalImage && (
            <div className="relative w-full h-[300px] md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-sm bg-muted">
              <Image 
                  src={finalImage} 
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
              />
            </div>
        )}

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
        
        <Separator className="my-12" />
      </article>
    </div>
  );
}
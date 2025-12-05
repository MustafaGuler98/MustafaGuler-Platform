import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, ChevronLeft, Share2, Bookmark, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { articleService } from "@/services/articleServices";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: {
    category: string;
    slug: string;
  };
}

export default async function ArticlePage({ params }: PageProps) {

  const post = await articleService.getArticleBySlug(params.slug);

  if (!post) {
    notFound();
  }


  const words = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.ceil(words / 200);


  const displayCategory = params.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-background pb-20">
      
      <div className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/blog" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
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
              <AvatarFallback><User className="w-6 h-6 text-muted-foreground" /></AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">Blog Editörü</p>
              <p className="text-sm text-muted-foreground">Yazar</p>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 justify-end">
              <Calendar className="w-4 h-4" />

              <span>{formatDate(post.createdAt)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                <Clock className="w-4 h-4" />
                <span>{readTime} dk okuma</span>
            </div>
          </div>
        </div>

        {post.imageUrl && (
            <div className="relative w-full h-[300px] md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-sm bg-muted">
              <Image 
                  src={post.imageUrl} 
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
              />
            </div>
        )}

        <div 
          className="
            prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-bold 
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <Separator className="my-12" />

        <div className="bg-muted/50 p-8 rounded-2xl border border-border/50">
          <h3 className="text-lg font-bold mb-2">Like</h3>
          <p className="text-muted-foreground mb-4">Join Us</p>
          <Button>Subscribe</Button>
        </div>

      </article>
    </div>
  );
}
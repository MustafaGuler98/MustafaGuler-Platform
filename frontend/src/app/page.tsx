import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code2 } from "lucide-react";

import { articleService } from "@/services/articleServices";
import { formatDate } from "@/lib/utils";

export default async function Home() {
  
  const allArticles = await articleService.getAllArticles();
  
  const latestArticles = allArticles ? allArticles.slice(0, 6) : [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100/50 dark:bg-blue-500/10 rounded-full blur-3xl -z-10 opacity-70"></div>
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
            Welcome to Blog
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Share Knowledge <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Shape the Future
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            The latest articles from the world of software, technology, and design.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="rounded-full">Start Reading</Button>
          </div>
        </div>
      </section>

      {/* ARTICLES LIST SECTION */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Articles</h2>
              <p className="text-muted-foreground">Handpicked by our editors</p>
            </div>
          </div>

          {latestArticles.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No articles found yet. Please try again later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {latestArticles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/blog/${article.slug}`}
                  className="group block h-full"
                >
                  <div className="flex flex-col h-full bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                    
                    <div className="relative h-48 bg-muted w-full">
                      {article.imageUrl ? (
                         <Image 
                           src={article.imageUrl} 
                           alt={article.title}
                           fill
                           className="object-cover group-hover:scale-105 transition-transform duration-500"
                         />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground/30">
                          <Code2 className="w-12 h-12" />
                        </div>
                      )}
                      
                      <div className="absolute top-4 right-4 bg-background/90 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm">
                        {formatDate(article.createdAt)}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                        {article.summary || "Click to read more details about this article..."}
                      </p>
                      
                      <div className="flex items-center text-primary text-sm font-medium mt-auto">
                        Read More <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

            </div>
          )}
        </div>
      </section>

    </div>
  );
}
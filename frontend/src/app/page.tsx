import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code2 } from "lucide-react";

import { articleService } from "@/services/articleServices";
import { formatDate, getImageUrl } from "@/lib/utils";

export default async function Home() {
  
  const allArticles = await articleService.getAllArticles();
  
  // Get the latest 6 articles
  const latestArticles = allArticles ? allArticles.slice(0, 6) : [];

  // To do Hero Section

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* ARTICLES LIST SECTION */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Logs</h2>
              <p className="text-muted-foreground">Entries from the archive</p>
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
                  {/* Card Container with Hover Effects */}
                  <div className="flex flex-col h-full bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-red-500/10 hover:border-red-500/20 transition-all duration-300">
                    
                    <div className="relative h-48 bg-muted w-full">
                      {article.mainImage ? (
                         <Image 
                           src={getImageUrl(article.mainImage)} 
                           alt={article.title}
                           fill
                           className="object-cover group-hover:scale-105 transition-transform duration-500"
                           unoptimized={true} 
                         />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground/30">
                          <Code2 className="w-12 h-12" />
                        </div>
                      )}
                      
                      {/* Date Badge */}
                      <div className="absolute top-4 right-4 bg-background/90 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm border border-red-500/20 text-red-600 dark:text-red-400">
                        {formatDate(article.createdDate)}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      {/* Title Hover Color */}
                      <h3 className="text-xl font-bold mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                        {article.summary || "Click to read more details about this article..."}
                      </p>
                      
                      <div className="flex items-center text-primary text-sm font-medium mt-auto group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
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
import Link from "next/link";
import Image from "next/image";
import { Code2, ArrowRight, Sparkles } from "lucide-react";
import { articleService } from "@/services/articleServices";
import { formatDate, getImageUrl } from "@/lib/utils";

export default async function Home() {
  
  const allArticles = await articleService.getAllArticles();
  
  // Get the latest 6 articles
  const latestArticles = allArticles ? allArticles.slice(0, 6) : [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* ARTICLES LIST SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          
          {/* Header Section: Centered and subtitle removed */}
          <div className="flex flex-col items-center justify-center mb-16 text-center">
            <h2 className="text-5xl font-bold mb-2 font-magic text-primary flex items-center gap-3 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
              Latest Logs
              <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
            </h2>
          </div>

          {latestArticles.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-xl bg-card/50">
              <p className="text-muted-foreground">No articles found in the archive yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestArticles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/blog/${article.slug}`}
                  className="group block h-full"
                >
                  {/* Card Container: 
                      - Idle state: Border is 'border' (purple/grey)
                      - Hover state: Border becomes RED and Shadow becomes RED GLOW 
                  */}
                  <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden relative transition-all duration-500 
                                  hover:border-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:-translate-y-2">
                    
                    <div className="relative h-52 w-full bg-muted">
                      {article.mainImage ? (
                         <Image 
                           src={getImageUrl(article.mainImage)} 
                           alt={article.title}
                           fill
                           className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700"
                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                         />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground/30">
                          <Code2 className="w-16 h-16" />
                        </div>
                      )}

                      {/* Dark overlay for text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60" />
                      
                      {/* Date Badge: Kept Gold (Secondary) for contrast against the red hover */}
                      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold border border-secondary/40 text-secondary shadow-[0_0_10px_rgba(255,165,0,0.3)]">
                        {formatDate(article.createdDate)}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1 relative">
                      {/* Title Hover Color: Turns RED on hover */}
                      <h3 className="text-xl font-bold mb-3 font-heading tracking-wide text-foreground group-hover:text-red-500 transition-colors line-clamp-2">
                           {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                        {article.summary || "Click to access encrypted data..."}
                      </p>
                      
                       {/* Read More Link: Turns RED on hover */}
                      <div className="flex items-center text-muted-foreground text-sm font-medium mt-auto group-hover:text-red-500 group-hover:translate-x-2 transition-all duration-300">
                        Read More <ArrowRight className="ml-2 w-4 h-4" />
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
import Link from "next/link";
import Image from "next/image";
import { Code2, ArrowRight, Sparkles } from "lucide-react";

// Servisler ve Yardımcılar
import { articleService } from "@/services/articleServices";
import { formatDate, getImageUrl } from "@/lib/utils";
import { paginateData } from "@/lib/pagination"; 
import { PaginationBar } from "@/components/homePage/pagination-bar"; 

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  
  const resolvedParams = await searchParams;
  const allArticles = await articleService.getAllArticles();
  const { currentData: articles, meta } = paginateData(allArticles, resolvedParams.page, 9);

  return (
    <div className="flex flex-col min-h-screen text-foreground transition-colors duration-300">
      
      {/* ARTICLES LIST SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center mb-16 text-center">
            <h2 className="text-5xl font-bold mb-2 font-magic text-primary flex items-center gap-3 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
              Latest Logs
              <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
            </h2>
            <PaginationBar
              currentPage={meta.currentPage} 
              totalPages={meta.totalPages} 
              baseUrl="/"
            />
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-xl bg-card/50">
              <p className="text-muted-foreground">No articles found in the archive yet.</p>
            </div>
          ) : (
            <>
              {/* --- GRID LIST --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                {articles.map((article) => (
                  <Link 
                    key={article.id} 
                    href={`/blog/${article.slug}`}
                    className="group block h-full"
                  >
                    <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden relative transition-all duration-500 
                                    hover:border-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:-translate-y-2">
                      
                      {/* Image Area */}
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
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60" />
                        
                        {/* Date Badge */}
                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold border border-secondary/40 text-secondary shadow-[0_0_10px_rgba(255,165,0,0.3)]">
                          {formatDate(article.createdDate)}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex flex-col flex-1 relative">
                        <h3 className="text-xl font-bold mb-3 font-heading tracking-wide text-foreground group-hover:text-red-500 transition-colors line-clamp-2">
                             {article.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                          {article.summary || "Click to access encrypted data..."}
                        </p>
                        
                        <div className="flex items-center text-muted-foreground text-sm font-medium mt-auto group-hover:text-red-500 group-hover:translate-x-2 transition-all duration-300">
                          Read More <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {/* --- PAGINATION BAR --- */}
              <PaginationBar 
                currentPage={meta.currentPage} 
                totalPages={meta.totalPages} 
                baseUrl="/" 
              />
            </>
          )}
        </div>
      </section>

    </div>
  );
}
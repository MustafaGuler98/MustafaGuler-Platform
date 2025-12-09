"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Article } from "@/types/article";
import { Hourglass, Calendar, Tag, ArrowUpCircle, Search } from "lucide-react";

interface GroupedArticles {
  [year: string]: Article[];
}

interface TimelineClientProps {
  initialArticles: Article[];
}

export default function TimelineClient({ initialArticles }: TimelineClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredArticles = initialArticles.filter((article) => {
    const query = searchQuery.toLowerCase();
    const matchTitle = article.title.toLowerCase().includes(query);
    const matchCategory = article.categoryName?.toLowerCase().includes(query);
    return matchTitle || matchCategory;
  });

  const sortedArticles = filteredArticles.sort((a, b) => 
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );

  const grouped = sortedArticles.reduce<GroupedArticles>((acc, article) => {
    const date = new Date(article.createdDate);
    const year = date.getFullYear().toString();

    if (!acc[year]) acc[year] = [];
    
    acc[year].push(article);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  const formatCardDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });
  };

  if (!isMounted) {
      return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="container max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
           <h1 className="text-5xl md:text-6xl font-bold font-heading mb-6 flex items-center gap-4 text-foreground">
             <Hourglass className="w-8 h-8 text-primary rotate-180" />
             <span className="bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent drop-shadow-sm">
               TIMELINE
             </span>
             <Hourglass className="w-8 h-8 text-primary" />
           </h1>
           
           <div className="text-muted-foreground font-sans text-lg tracking-wide border-b border-border/30 pb-2 mb-8">
             Archive Logs
           </div>

           {/* SEARCH INPUT */}
           <div className="relative w-full max-w-md">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
             </div>
             <input 
               type="text" 
               placeholder="Search protocol..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-background/50 border border-primary/30 rounded-full py-2 pl-9 pr-4 text-sm
                          text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary 
                          focus:ring-1 focus:ring-primary shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all"
             />
           </div>
        </div>

        {/* CONTENT */}
        <div className="relative border-l-2 border-border/40 ml-4 md:ml-12 space-y-12 min-h-[300px]">
          
          {years.length === 0 ? (
             <div className="pl-12 pt-10 text-muted-foreground font-mono text-sm">
               No logs match your search criteria.
             </div>
          ) : (
            years.map((year) => (
              <div key={year} className="relative">
                
                {/* STICKY YEAR MARKER */}
                <div className="sticky top-24 z-30 -ml-[2.55rem] w-20 h-20 mb-6 flex items-center justify-center">
                   <div className="flex items-center justify-center w-20 h-20 bg-background border-4 border-background rounded-full">
                      <span className="flex items-center justify-center w-full h-full text-xl font-heading font-bold text-secondary bg-muted/20 border border-secondary/50 rounded-full shadow-[0_0_15px_rgba(255,165,0,0.2)]">
                        {year}
                      </span>
                   </div>
                </div>

                {/* YEAR CONTENT (Direct Articles List) */}
                <div className="pl-8 md:pl-16 -mt-20">
                    
                    <div className="space-y-4">
                    {grouped[year].map((article) => (
                        <Link 
                        href={`/blog/${article.slug}`} 
                        key={article.id}
                        className="group block relative pl-6 transition-all"
                        >
                        {/* Horizontal Line Connector */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-border group-hover:bg-red-600 transition-colors duration-300" />
                        
                        {/* Small Dot Connector */}
                        <div className="absolute -left-[3.0rem] md:-left-[5.05rem] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-background border border-muted-foreground 
                                        group-hover:border-red-600 group-hover:bg-red-600 group-hover:shadow-[0_0_10px_rgba(220,38,38,0.8)] 
                                        transition-all duration-300 z-20" />

                        {/* COMPACT CARD */}
                        <div className="bg-card border border-border rounded-md p-3 relative overflow-hidden transition-all duration-300
                                        group-hover:border-red-600 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] group-hover:-translate-x-[-4px]">
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                {/* Title & Category Wrapper */}
                                <div className="flex flex-col gap-1 min-w-0">
                                    <h4 className="text-base font-bold font-heading text-foreground group-hover:text-red-500 transition-colors leading-tight truncate">
                                    {article.title}
                                    </h4>
                                    
                                    <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-secondary/30 text-secondary bg-secondary/5 w-fit">
                                        <Tag className="w-3 h-3" />
                                        {article.categoryName || "Log"}
                                    </span>
                                    </div>
                                </div>

                                {/* Date Info (Right aligned on desktop) */}
                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground shrink-0 sm:text-right">
                                <Calendar className="w-3 h-3 text-secondary" />
                                <span>{formatCardDate(article.createdDate)}</span>
                                </div>
                            </div>
                        </div>
                        </Link>
                    ))}
                    </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SCROLL TO TOP */}
        <div className="flex justify-center mt-12 pb-10">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-mono border border-border px-4 py-2 rounded-full hover:bg-muted"
            >
                <ArrowUpCircle className="w-4 h-4" />
                Return to Surface
            </button>
        </div>
    </div>
  );
}
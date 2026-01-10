"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Article } from "@/types/article";
import { Calendar, Search, Activity, ChevronRight, Zap, X } from "lucide-react";
import { cn, formatCardDate } from "@/lib/utils";

interface GroupedArticles {
  [year: string]: Article[];
}

interface TimelineClientProps {
  initialArticles: Article[];
}

export default function TimelineClient({ initialArticles }: TimelineClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Using this to understand publish date of hovered article
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const safeArticles = initialArticles || [];
  const filteredArticles = safeArticles.filter((article) => {
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

  if (!isMounted) return <div className="min-h-screen bg-transparent" />;

  let globalIndex = 0;

  return (
    <div className="relative min-h-screen pb-32">

      <div className="relative z-10 container max-w-5xl mx-auto px-4 pt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pl-2 border-b border-primary/20 pb-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-neon tracking-widest uppercase animate-pulse">
              <Activity className="w-3 h-3" />
              <span>System_Ready</span>
            </div>
            <Link href="/blog/timeline" className="group/title w-fit no-underline">
              <h1 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-michroma)] text-gray-300 tracking-wider uppercase group-hover/title:text-white group-hover/title:drop-shadow-[0_0_15px_var(--cyan-neon)] transition-all duration-300">
                TIMELINE
              </h1>
            </Link>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-cyan-neon transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-white/100 rounded-md py-2.5 pl-10 pr-10 text-xs font-mono
                              text-foreground placeholder-muted-foreground/50 
                              transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground/50 hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="relative min-h-[300px]">
          <div className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-purple-900/40 to-transparent opacity-80"></div>
          {years.length === 0 ? (
            <div className="pl-16 pt-8 font-mono text-sm">
              {searchQuery ? (
                <span className="text-muted-foreground">[INFO]: No logs found matching "{searchQuery}"</span>
              ) : safeArticles.length === 0 ? (
                <span className="text-destructive">[WARNING]: No logs found. Please check database connection.</span>
              ) : (
                <span className="text-muted-foreground">[INFO]: No logs match your search criteria.</span>
              )}
            </div>
          ) : (
            years.map((year) => (
              <div key={year} className="relative mb-12 last:mb-0">

                <div className="sticky top-32 z-20 flex items-center mb-4 self-start">
                  <div className={cn(
                    "relative flex items-center justify-center w-12 h-12 bg-[#020103] border-2 rounded-full shrink-0 z-30 transition-all duration-300",
                    hoveredYear === year
                      ? "border-cyan-neon shadow-[0_0_20px_var(--cyan-neon)]"
                      : "border-white/50"
                  )}>
                    <span className="font-heading font-bold text-xs text-cyan-neon">
                      {year}
                    </span>
                  </div>
                </div>

                <div className="pl-6 md:pl-10 -mt-12 ml-6 space-y-4 pb-4">
                  {grouped[year].map((article) => {
                    const delay = globalIndex * 75;
                    globalIndex++;

                    return (
                      <Link
                        href={`/blog/${article.slug}`}
                        key={article.id}
                        className="group relative block animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
                        style={{ animationDelay: `${delay}ms` }}
                        // Mouse events to update the state ---
                        onMouseEnter={() => setHoveredYear(year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {/* Card */}
                        <div className="absolute -left-[1.7rem] md:-left-[2.8rem] top-1/2 -translate-y-1/2 w-8 md:w-14 h-[2px] bg-primary/50 group-hover:bg-cyan-neon group-hover:shadow-[0_0_8px_var(--cyan-neon)] transition-all duration-300 z-0"></div>
                        <div className={cn("relative overflow-hidden rounded-lg border transition-all duration-300 z-10", "bg-[#0f0518]/90 border-primary/20 backdrop-blur-sm", "hover:bg-[#1a0b2e] hover:border-cyan-neon/40 hover:translate-x-1 hover:shadow-[0_4px_20px_-10px_rgba(34,211,238,0.15)]")}>
                          <div className="py-4 px-4 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                            <div className="flex flex-col gap-1 min-w-0">
                              <h4 className="text-sm md:text-base font-bold font-heading text-white/90 group-hover:text-cyan-neon transition-colors truncate">
                                {article.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-amber-400 border border-amber-500/20 bg-amber-500/5 px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                                  <Zap className="w-3 h-3" />
                                  {article.categoryName || "LOG"}
                                </span>
                              </div>
                            </div>
                            <div className="flex sm:justify-between items-center gap-3 text-[10px] font-mono text-muted-foreground/60 shrink-0 sm:w-24 sm:pl-4 sm:border-l sm:border-white/5">
                              <div className="flex items-center gap-1.5 group-hover:text-primary transition-colors">
                                <Calendar className="w-3 h-3" />
                                <span>{formatCardDate(article.createdDate)}</span>
                              </div>
                              <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-neon" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
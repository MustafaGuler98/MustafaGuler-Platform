import Link from "next/link";
import { ChevronLeft, ChevronRight, Hash } from "lucide-react";
import { cn } from "@/lib/utils"; 

interface AvatarProps {
  previousArticleTitle?: string;
  nextArticleTitle?: string;
  previousArticle?: string;
  nextArticle?: string;
}

export function BottomNavButtons({
  previousArticleTitle,
  nextArticleTitle,
  previousArticle,
  nextArticle,
}: AvatarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl mx-auto px-4 mt-20 gap-12 md:gap-4 pb-20">
      
      {/* --- Previous Article --- */}
      {previousArticle ? (
        <Link
          href={`/blog/${previousArticle}`}
          className="group flex items-center gap-5 w-full md:w-auto justify-start"
        >
          {/* Icon */}
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-primary bg-transparent transition-all duration-500 
                          group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:scale-110">
             <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] group-hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2">
               <span className="w-8 h-[1px] bg-primary group-hover:bg-cyan-400 transition-colors"></span> PREV
            </span>
            <h4 className="text-lg md:text-xl font-bold text-gray-300 leading-tight group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 max-w-[250px] truncate">
              {previousArticleTitle}
            </h4>
          </div>
        </Link>
      ) : (
        <div className="hidden md:block w-1/3" />
      )}

      {/* --- Next Article --- */}
      {nextArticle ? (
        <Link
          href={`/blog/${nextArticle}`}
          className="group flex items-center gap-5 w-full md:w-auto justify-end text-right"
        >
          {/* Text */}
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] group-hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2">
               NEXT <span className="w-8 h-[1px] bg-primary group-hover:bg-cyan-400 transition-colors"></span>
            </span>
            <h4 className="text-lg md:text-xl font-bold text-gray-300 leading-tight group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 max-w-[250px] truncate">
              {nextArticleTitle}
            </h4>
          </div>

          {/* Icon */}
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-primary bg-transparent transition-all duration-500 
                          group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:scale-110">
             <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
          </div>
        </Link>
      ) : (
        <div className="hidden md:block w-1/3" />
      )}
    </div>
  );
}
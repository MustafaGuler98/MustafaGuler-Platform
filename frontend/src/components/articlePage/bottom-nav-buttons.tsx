import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="flex flex-row items-center justify-between w-full max-w-5xl mx-auto px-4 mt-24 gap-4 pb-20 pt-16 border-t border-primary/20">

      {/* --- Previous Article --- */}
      {previousArticle ? (
        <Link
          href={`/blog/${previousArticle}`}
          className="group flex items-center gap-4 w-auto justify-start"
        >
          {/* Icon */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full border-2 border-primary/50 bg-[#0f0518]/80 transition-all duration-500 
                          group-hover:border-cyan-400 group-hover:bg-[#0f0518] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.5),inset_0_0_15px_rgba(34,211,238,0.1)] group-hover:scale-110">
            <ChevronLeft className="w-6 h-6 text-primary group-hover:text-cyan-400 transition-colors duration-300" />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] text-primary uppercase tracking-[0.25em] group-hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2">
              <span className="w-10 h-[2px] bg-gradient-to-r from-primary to-primary/30 group-hover:from-cyan-400 group-hover:to-cyan-400/30 transition-all duration-300"></span>
              PREV
            </span>
            <h4 className="text-base font-bold text-gray-300 leading-tight transition-all duration-300 max-w-[200px] truncate
                           group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-300
                           group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
              {previousArticleTitle}
            </h4>
          </div>
        </Link>
      ) : (
        <div className="hidden w-1/3" />
      )}

      {/* --- Next Article --- */}
      {nextArticle ? (
        <Link
          href={`/blog/${nextArticle}`}
          className="group flex items-center gap-4 w-auto justify-end text-right"
        >
          {/* Text */}
          <div className="flex flex-col items-end gap-1.5">
            <span className="font-mono text-[10px] text-primary uppercase tracking-[0.25em] group-hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2">
              NEXT
              <span className="w-10 h-[2px] bg-gradient-to-l from-primary to-primary/30 group-hover:from-cyan-400 group-hover:to-cyan-400/30 transition-all duration-300"></span>
            </span>
            <h4 className="text-base font-bold text-gray-300 leading-tight transition-all duration-300 max-w-[200px] truncate
                           group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-white
                           group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
              {nextArticleTitle}
            </h4>
          </div>

          {/* Icon */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full border-2 border-primary/50 bg-[#0f0518]/80 transition-all duration-500 
                          group-hover:border-cyan-400 group-hover:bg-[#0f0518] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.5),inset_0_0_15px_rgba(34,211,238,0.1)] group-hover:scale-110">
            <ChevronRight className="w-6 h-6 text-primary group-hover:text-cyan-400 transition-colors duration-300" />
          </div>
        </Link>
      ) : (
        <div className="hidden w-1/3" />
      )}
    </div>
  );
}

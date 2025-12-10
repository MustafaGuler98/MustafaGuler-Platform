import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AvatarProps {
  articleTitle?: string;
  articleHref?: string;
}

export function BottomNavButtons({articleTitle,articleHref}:AvatarProps) {
    return (
        <div className="flex item center justify-between w-full max-w-4x1 mx-auto px-4">
            {articleHref ? (
                        <Link
                            href={`/blog/${articleHref}`}
                            className="flex items-center gap-2 text-muted-foreground hover:text-chart-5 transition-colors group text-sm sm:text-base"
                        >
                            <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <span className="block text-xs text-muted-foreground/70">Previous Article</span>
                                <span className="font-medium">{articleTitle}</span>
                            </div>
                        </Link>
                    ) : (
                        <div className="hidden md-16"></div>
                    )}

                    
                 {articleHref ? (
                        <Link
                            href={`/blog/${articleHref}`}
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group text-sm sm:text-base"
                        >
              <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs text-muted-foreground/70">Next Article</span>
                <span className="font-medium">{articleTitle}</span>
              </div>
            </Link>
          ) : (
           <div className="hidden md-16"></div>
          ) 
        }
        </div>
    )
}
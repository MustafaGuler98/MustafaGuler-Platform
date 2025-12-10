"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, Eye, LucideEye, User } from "lucide-react";
interface AvatarProps {
  name? : string;
  authorImage?: string;
  createdDate: string;
    readTime?: number;
}
export function AvatarName({name,authorImage,createdDate,readTime}:AvatarProps) {
    return (
        <div className="flex items-center justify-between border-border mb-6">
          {/*Author Info*/}
            <div className="flex items-center gap-4 hidden">
                {authorImage ? (
            <Avatar className="h-12 w-12 border border-border bg-muted">
                <img src={authorImage} alt={name} />
            </Avatar>
            ) : (
               <Avatar className="h-12 w-12 border border-border bg-muted">
              <AvatarFallback>
                <User className="w-6 h-6 text-muted-foreground" />
              </AvatarFallback>
            </Avatar> )}
            <div>
              <p className="font-semibold text-foreground">
                {name || "Blog Editor"}
              </p>
            </div>
          </div>
          {/*Time and read*/}
          <div className="text-right hidden sm:block">
            <div className="font-mono text-[11px] flex items-center gap-2 text-sm text-muted-foreground mb-1 justify-end">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(createdDate)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                <LucideEye className="w-4 h-4" />
                <span>{readTime} Views</span>
            </div>
          </div>
        </div>
          )
}
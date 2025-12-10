"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export function PaginationBar({ currentPage, totalPages, baseUrl = "/" }: PaginationBarProps) {
  const router = useRouter();
  
  // Input değerini tutmak için state
  const [inputVal, setInputVal] = useState(currentPage.toString());

  // Eğer dışarıdan sayfa değişirse input'u güncelle
  useEffect(() => {
    setInputVal(currentPage.toString());
  }, [currentPage]);

  // Sayfaya gitme fonksiyonu
  const handleGoToPage = () => {
    let pageNum = parseInt(inputVal);

    if (isNaN(pageNum)) {
      setInputVal(currentPage.toString());
      return;
    }

    if (pageNum < 1) pageNum = 1;
    else if (pageNum > totalPages) pageNum = totalPages;

    if (pageNum === currentPage) {
      setInputVal(currentPage.toString());
      return;
    }

    router.push(`${baseUrl}?page=${pageNum}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGoToPage();
      (e.target as HTMLInputElement).blur();
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-20">
      
      <div className="flex items-center justify-center gap-2">
        {/* --- BACK BUTTON --- */}
      <Button 
        variant="outline" 
        size="icon"
        disabled={currentPage <= 1}
        className="w-10 h-10 rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary hover:text-cyan-neon disabled:opacity-50 transition-all"
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link href={`${baseUrl}?page=${currentPage - 1}`}>
            <ChevronLeft className="w-5 h-5" />
          </Link>
        ) : (
          <span className="flex items-center justify-center">
             <ChevronLeft className="w-5 h-5" />
          </span>
        )}
      </Button>

      {/* --- INPUT FIELD --- */}
      <div className="flex items-center gap-2 font-mono text-sm bg-black/40 border border-primary/20 px-3 py-1.5 rounded-md backdrop-blur-sm">
        
        <input 
          type="text" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleGoToPage} 
          className="w-8 text-center bg-transparent border-b border-primary/50 focus:border-cyan-neon outline-none text-cyan-neon transition-colors"
        />
        
        <span className="text-muted-foreground">/ {totalPages}</span>
      </div>

      {/* --- NEXT BUTTON --- */}
      <Button 
        variant="outline" 
        size="icon"
        disabled={currentPage >= totalPages}
        className="w-10 h-10 rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary hover:text-cyan-neon disabled:opacity-50 transition-all"
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={`${baseUrl}?page=${currentPage + 1}`}>
             <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <span className="flex items-center justify-center">
             <ChevronRight className="w-5 h-5" />
          </span>
        )}
      </Button>
      </div>
    <div className="font-mono">
        <Button
        className="bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary text-white hover:text-cyan-neon transition-all">
      <Link 
      className="flex items-center gap-2"
      href={`${baseUrl}?page=${inputVal}`}>
      <span className=""
      >Go To Page</span>
            <Search className="w-5 h-5" />
          </Link>
      </Button>
      </div>
    </div>
  );
}
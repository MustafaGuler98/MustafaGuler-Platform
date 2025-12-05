"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">B</div>
          <span className="hidden sm:inline-block">Blog</span>
        </Link>

        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
          <Link 
            href="/blog" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/blog') ? 'text-primary font-bold' : 'text-muted-foreground'}`}
          >
            Blog
          </Link>

          <Link 
            href="/about" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/about') ? 'text-primary font-bold' : 'text-muted-foreground'}`}
          >
            About Us
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="justify-center cursor-pointer">Turkish (TR)</DropdownMenuItem>
              <DropdownMenuItem className="justify-center cursor-pointer">English (EN)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="default" size="sm" className="hidden md:flex rounded-full px-6 ml-2">
            Subscribe
          </Button>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

      </div>
    </header>
  );
}
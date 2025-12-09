"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import { use } from "react";

export function LangToggle() {
    return (
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
    )
}
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";

export default function HeaderWrapper() {
    const pathname = usePathname();

    // Hide header on portal page
    if (pathname === "/") {
        return null;
    }

    return (
        <div className="pt-0">
            <Header />
            <div className="h-36" /> {/* Spacer for fixed header */}
        </div>
    );
}

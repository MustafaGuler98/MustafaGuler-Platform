"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";

export default function FooterWrapper() {
    const pathname = usePathname();

    // Hide footer on admin pages
    if (pathname.startsWith("/admin")) {
        return null;
    }

    return <Footer />;
}

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Image from "next/image";
import HeaderWrapper from "@/components/header-wrapper";
import FooterWrapper from "@/components/footer-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import {
  Inter,
  Orbitron
} from "next/font/google";

// Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mustafaguler.me"),
  title: "Mustafa Güler",
  description: "The central hub of my digital footprint. A living archive of my work, thoughts, and personal interests. Curating experiences in software, TTRPGs, philosophy, culinary arts, travel, and more.",
  verification: {
    google: "V-c8EJyAeGGs7coLDY0vhF4Y5OrcYfT3cB_uvoyMQY4",
  },
  openGraph: {
    images: ["/logo1.webp"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/logo1.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`
        ${inter.variable} 
        ${orbitron.variable} 
        font-sans antialiased
        bg-transparent  
      `}>
        <div className="fixed inset-0 -z-50 h-full w-full pointer-events-none bg-black">

          <Image
            src="/bg-magic.webp"
            alt="background"
            width={1024}
            height={1024}
            loading="eager"
            sizes="100vw"
            className="object-cover opacity-30 h-full w-full"
            quality={75}
            title="Background"
          />
        </div>


        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange >
          <HeaderWrapper />
          <main className="min-h-screen bg transparent relative z-10">
            {children}
          </main>
          <FooterWrapper />
        </ThemeProvider>

        {/* Cloudflare Web Analytics */}
        <Script
          strategy="lazyOnload"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "9d73043c5ddc487090833d6338541928"}'
        />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Image from "next/image";
import HeaderWrapper from "@/components/header-wrapper";
import FooterWrapper from "@/components/footer-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import {
  Inter,
  Orbitron,
  Cinzel,
  Audiowide,
  Rajdhani,
  Syncopate,
  Michroma,
  Press_Start_2P
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

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-audiowide",
  display: "swap",
});

const rajdhani = Rajdhani({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: "swap",
});

const syncopate = Syncopate({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-syncopate",
  display: "swap",
});

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
  display: "swap",
});

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mustafa Güler",
  description: "Digital Mind",
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
        ${cinzel.variable} 
        ${audiowide.variable} 
        ${rajdhani.variable} 
        ${syncopate.variable}
        ${michroma.variable}
        ${pressStart.variable}
        font-sans antialiased
        bg-transparent  
      `}>
        <div className="fixed inset-0 -z-50 h-full w-full pointer-events-none bg-black">

          <Image
            src="/bg-magic.png"
            alt="background"
            width={1024}
            height={1024}
            priority
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
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "9d73043c5ddc487090833d6338541928"}'
        />
      </body>
    </html>
  );
}
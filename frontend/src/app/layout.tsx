import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter, Orbitron, Cinzel } from "next/font/google"; 

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

export const metadata: Metadata = {
  title: "My Blog",
  description: "With Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} ${cinzel.variable} font-sans antialiased`}>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        
          <Header />

         <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
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
  title: "Mustafa Guler",
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
      `}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Header />
          <main className="min-h-screen pt-36">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
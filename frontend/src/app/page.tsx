import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code2, Rocket, Zap, Globe, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100/50 dark:bg-blue-500/10 rounded-full blur-3xl -z-10 opacity-70"></div>

        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
            🚀 The New Era of Blogging
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Share Your Ideas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Shape the Future
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover the latest insights on Next.js, Web Development, and Technology. 
            A platform built for developers, by developers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/blog">
              <Button size="lg" className="h-12 px-8 rounded-full text-lg">
                Start Reading
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="h-12 px-8 rounded-full text-lg">
                About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose BlogTech?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We provide high-quality content curated by industry experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <Card className="border-border/50 shadow-lg shadow-blue-500/5 bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built with Next.js 14 App Router for optimal performance and SEO ranking.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-lg shadow-blue-500/5 bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6" />
                </div>
                <CardTitle>Deep Technical Dives</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Code snippets, architecture diagrams, and real-world examples in every article.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-lg shadow-blue-500/5 bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <CardTitle>Global Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with developers from around the world and share your knowledge.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Articles</h2>
              <p className="text-muted-foreground">Fresh from the editorial team</p>
            </div>
            <Link href="/blog" className="text-blue-600 font-medium hover:underline flex items-center dark:text-blue-400">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group cursor-pointer">
              <div className="bg-muted h-48 rounded-2xl mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 dark:text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm">
                  Technology
                </div>
                <div className="flex items-center justify-center h-full text-muted-foreground/50">
                   <Cpu className="w-12 h-12" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Understanding Server Actions in Next.js 14
              </h3>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                Server Actions allow you to build modern web applications without manually creating API routes...
              </p>
            </div>

             <div className="group cursor-pointer">
              <div className="bg-muted h-48 rounded-2xl mb-4 relative overflow-hidden">
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 dark:text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm">
                  Design
                </div>
                <div className="flex items-center justify-center h-full text-muted-foreground/50">
                   <Rocket className="w-12 h-12" /> 
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Mastering Tailwind CSS Grid Layouts
              </h3>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                Grid layout is a powerful system that allows you to create complex responsive web designs easily...
              </p>
            </div>

             <div className="group cursor-pointer">
              <div className="bg-muted h-48 rounded-2xl mb-4 relative overflow-hidden">
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 dark:text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm">
                  Career
                </div>
                <div className="flex items-center justify-center h-full text-muted-foreground/50">
                   <Globe className="w-12 h-12" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                How to Stand Out as a Junior Developer
              </h3>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                Tips and tricks for landing your first job in the tech industry during competitive times...
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 dark:bg-slate-950 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Join 10,000+ developers receiving the best tech news weekly. No spam, unsubscribe anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 py-6 text-md font-semibold px-8 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
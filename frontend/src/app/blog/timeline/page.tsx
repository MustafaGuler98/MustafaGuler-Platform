import { articleService } from "@/services/articleServices";
import TimelineClient from "./timeline-client";

export default async function TimelinePage() {
  // 1. Fetch data from Server
  const allArticles = await articleService.getAllArticles();

  // 2. Initial Filter (Only English)
  const englishArticles = allArticles.filter(
    (x) => x.languageCode === "en" || x.languageCode === "en-US"
  );

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 relative">
        <TimelineClient initialArticles={englishArticles} />
    </div>
  );
}
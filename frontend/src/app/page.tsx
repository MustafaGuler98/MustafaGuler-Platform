import { articleService } from "@/services/articleServices";
import { mindmapService } from "@/services/mindmapService";
import { archivesService } from "@/services/archivesService";
import { HeroSection } from "@/components/home/HeroSection";
import { RecentLogsSection } from "@/components/home/RecentLogsSection";
import { ActivitySectionServer } from "@/components/home/ActivitySectionServer";

export const revalidate = 60;


export default async function Home() {
  const [articlesResult, mindmapItems, activities] = await Promise.all([
    articleService.getPagedWithoutImageArticles(1, 3, 'en'),
    mindmapService.getAllActiveServer(),
    archivesService.getActivity(),
  ]);

  const articles = articlesResult.isSuccess && articlesResult.data
    ? articlesResult.data.items : [];
  const totalCount = articlesResult.isSuccess && articlesResult.data
    ? articlesResult.data.totalCount : 0;

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-foreground">
      <HeroSection mindmapItems={mindmapItems} />
      <RecentLogsSection articles={articles} totalCount={totalCount} />
      <ActivitySectionServer activities={activities} />
    </div>
  );
}
import { articleService } from "@/services/articleServices";
import TimelineClient from "./timeline-client";
import { constructMetadata } from "@/lib/seo";
import { getImageUrl } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export const metadata = constructMetadata({
  title: "Timeline",
  description: "A chronological journey through my professional milestones, projects, and life events.",
  path: "/blog/timeline",
  image: "/logo1.webp",
});

export default async function TimelinePage() {
  // TODO: Implement "Load More" or Infinite Scroll in Timeline for older logs.
  const response = await articleService.getPagedWithoutImageArticles(1, 100, 'en');
  const articles = response.data?.items || [];

  return (
    <TimelineClient initialArticles={articles} />
  );
}
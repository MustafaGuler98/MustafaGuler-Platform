import { articleService } from "@/services/articleServices";
import TimelineClient from "./timeline-client";
import { constructMetadata } from "@/lib/seo";
import { getImageUrl } from "@/lib/utils";

// --- METADATA ---
export const metadata = constructMetadata({
  title: "Timeline",
  description: "A chronological journey through my professional milestones, projects, and life events.",
  path: "/blog/timeline",
  image: getImageUrl("/assets/images/logo1.png"),
});

export default async function TimelinePage() {
  const allArticles = await articleService.getAllArticles('en');

  // The client component will handle grouping and filtering.
  return (
    <TimelineClient initialArticles={allArticles || []} />
  );
}
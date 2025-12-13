import { articleService } from "@/services/articleServices";
import TimelineClient from "./timeline-client";
import { constructMetadata } from "@/lib/seo";
import { getImageUrl } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Timeline",
  description: "A chronological journey through my professional milestones, projects, and life events.",
  path: "/blog/timeline",
  image: getImageUrl("/assets/images/logo1.png"),
});

export default async function TimelinePage() {
  const articles = await articleService.getAllArticles('en');

  return (
    <TimelineClient initialArticles={articles} />
  );
}
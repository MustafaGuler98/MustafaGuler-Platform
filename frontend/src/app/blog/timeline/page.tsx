import { articleService } from "@/services/articleServices";
import TimelineClient from "./timeline-client";
import { Metadata } from "next";

export default async function TimelinePage() {
  const allArticles = await articleService.getAllArticles();

  // The client component will handle grouping and filtering.
  return (
      <TimelineClient initialArticles={allArticles || []} />
  );
}
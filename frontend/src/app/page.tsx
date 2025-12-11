import { articleService } from "@/services/articleServices";
import PortalClient from "./portal-client";

export default async function Home() {
  const allArticles = await articleService.getAllArticles();

  const latestArticles = allArticles || [];

  return <PortalClient articles={latestArticles} />;
}
import { articleService } from "@/services/articleServices";
import PortalClient from "./portal-client";
import { constructMetadata } from "@/lib/seo";
import { get } from "http";
import { getImageUrl } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Portal",
  description: "Mustafa Guler's digital garden. Exploring software architecture, .NET, Next.js and cyberpunk aesthetics.",
  path: "/",
  image: getImageUrl("/assets/images/logo1.png"),
});
export default async function Home() {
  const allArticles = await articleService.getAllArticles();

  const latestArticles = allArticles || [];

  return <PortalClient articles={latestArticles} />;
}
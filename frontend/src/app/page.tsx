import { articleService } from "@/services/articleServices";
import PortalClient from "./portal-client";
import { constructMetadata } from "@/lib/seo";
import { getImageUrl } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Portal",
  description: "Mustafa Guler's digital garden. Exploring software architecture, .NET, Next.js and cyberpunk aesthetics.",
  path: "/",
  image: getImageUrl("/assets/images/logo1.png"),
});

export default async function Home() {
  const articles = await articleService.getAllArticles('en');

  return <PortalClient articles={articles} />;
}
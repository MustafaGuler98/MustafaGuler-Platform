import { articleService } from "@/services/articleServices";
import PortalClient from "./portal-client";
import { constructMetadata } from "@/lib/seo";
import { getImageUrl } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export const metadata = constructMetadata({
  title: "Mustafa Güler",
  description: "Mustafa Guler's digital garden. Exploring software architecture, .NET, Next.js and cyberpunk aesthetics.",
  path: "/",
  image: getImageUrl("/assets/images/logo1.png"),
});

export default async function Home() {
  const result = await articleService.getPagedWithoutImageArticles(1, 3, 'en');
  const articles = result.isSuccess && result.data ? result.data.items : [];
  const totalCount = result.isSuccess && result.data ? result.data.totalCount : 0;

  return <PortalClient articles={articles} totalCount={totalCount} />;
}
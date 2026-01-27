import { articleService } from "@/services/articleServices";
import PortalClient from "./portal-client";
import { constructMetadata } from "@/lib/seo";
import { getImageUrl } from "@/lib/utils";

export const dynamic = 'force-dynamic';



export default async function Home() {
  const result = await articleService.getPagedWithoutImageArticles(1, 3, 'en');
  const articles = result.isSuccess && result.data ? result.data.items : [];
  const totalCount = result.isSuccess && result.data ? result.data.totalCount : 0;

  return <PortalClient articles={articles} totalCount={totalCount} />;
}
import PortalShell from "@/components/portal-shell";
import { getRole } from "@/lib/portal";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; category?: string; request?: string }>;
}) {
  const { role, category, request } = await searchParams;
  const selectedBlogCategory = category === "main" || category === "sports" || category === "foodie" || category === "art"
    ? category
    : undefined;

  return <PortalShell role={getRole(role)} page="blog" selectedBlogCategory={selectedBlogCategory} isBlogRequestView={request === "true"} />;
}

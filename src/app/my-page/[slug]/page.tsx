import PortalShell from "@/components/portal-shell";
import { getRole } from "@/lib/portal";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const { slug } = await params;
  const { role } = await searchParams;

  return <PortalShell role={getRole(role)} page="my-page" selectedMyPageSlug={slug} />;
}

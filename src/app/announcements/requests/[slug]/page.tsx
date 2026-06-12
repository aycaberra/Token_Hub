import PortalShell from "@/components/portal-shell";
import { getRole } from "@/lib/portal";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const [{ slug }, { role }] = await Promise.all([params, searchParams]);

  return (
    <PortalShell
      role={getRole(role)}
      page="announcement-requests"
      selectedAnnouncementRequestSlug={slug}
    />
  );
}

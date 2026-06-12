import PortalShell from "@/components/portal-shell";
import { getAnnouncementBySlug, getLang, getRole } from "@/lib/portal";
import { notFound } from "next/navigation";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ role?: string; lang?: string }>;
}) {
  const [{ slug }, { role, lang }] = await Promise.all([params, searchParams]);

  if (!getAnnouncementBySlug(slug, getLang(lang))) {
    notFound();
  }

  return (
    <PortalShell
      role={getRole(role)}
      page="announcement-edit"
      selectedAnnouncementSlug={slug}
    />
  );
}

import PortalShell from "@/components/portal-shell";
import { announcements, getAnnouncementBySlug, getRole } from "@/lib/portal";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return announcements.map((announcement) => ({ slug: announcement.slug }));
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const [{ slug }, { role }] = await Promise.all([params, searchParams]);

  if (!getAnnouncementBySlug(slug)) {
    notFound();
  }

  return (
    <PortalShell
      role={getRole(role)}
      page="announcements"
      selectedAnnouncementSlug={slug}
    />
  );
}

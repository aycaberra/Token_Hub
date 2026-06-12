import PortalShell from "@/components/portal-shell";
import { getRole } from "@/lib/portal";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;

  return <PortalShell role={getRole(role)} page="publish" />;
}

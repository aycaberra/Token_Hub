import PortalShell from "@/components/portal-shell";
import { getRole } from "@/lib/portal";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    role?: string;
    section?: "benefits" | "clubs";
    item?: string;
  }>;
}) {
  const { role, section, item } = await searchParams;

  return (
    <PortalShell
      role={getRole(role)}
      page="social-hub-edit"
      selectedSocialHubSection={section === "clubs" ? "clubs" : "benefits"}
      selectedSocialHubItem={item}
    />
  );
}

import PortalShell from "@/components/portal-shell";
import { getPostBySlug, getRole, posts } from "@/lib/portal";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const [{ slug }, { role }] = await Promise.all([params, searchParams]);

  if (!getPostBySlug(slug)) {
    notFound();
  }

  return <PortalShell role={getRole(role)} page="blog" selectedPostSlug={slug} />;
}

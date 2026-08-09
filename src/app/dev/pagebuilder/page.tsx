import type { Metadata } from "next";
import { PagebuilderSection } from "@/components/sections/PagebuilderSection";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";
import { readSiteIdentity } from "@/utils/site-identity";
import { sanitizeClientSlug } from "@/utils/strategy-workspace";

export const metadata: Metadata = {
  title: "Pagebuilder",
  description: "Internal homepage section builder.",
};

type PagebuilderPageProps = {
  searchParams: Promise<{ client?: string | string[] }>;
};

export default async function PagebuilderPage({ searchParams }: PagebuilderPageProps) {
  const client = (await searchParams).client;
  const clientSlug = sanitizeClientSlug(Array.isArray(client) ? client[0] : client ?? "");
  const siteIdentity = await readSiteIdentity(clientSlug);

  return (
    <StyleGuidePreviewSurface>
      <main className="bg-bg-page text-text-main">
        <PagebuilderSection siteIdentity={siteIdentity} />
      </main>
    </StyleGuidePreviewSurface>
  );
}

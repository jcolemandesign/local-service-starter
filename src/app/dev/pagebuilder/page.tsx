import type { Metadata } from "next";
import { PagebuilderSection } from "@/components/sections/PagebuilderSection";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";
import { readSiteIdentity } from "@/utils/site-identity";
import {
  listProjectWorkspaces,
  sanitizeClientSlug,
} from "@/utils/strategy-workspace";

export const metadata: Metadata = {
  title: "Pagebuilder",
  description: "Internal homepage section builder.",
};

type PagebuilderPageProps = {
  searchParams: Promise<{ client?: string | string[] }>;
};

export default async function PagebuilderPage({ searchParams }: PagebuilderPageProps) {
  const client = (await searchParams).client;
  const requestedClientSlug = sanitizeClientSlug(
    Array.isArray(client) ? client[0] : client ?? "",
  );
  // Pagebuilder is also reachable from the global builder navigation, whose
  // URL has no project query string. In that entry path an empty slug used to
  // silently produce an empty identity, so the logo saved in /strategy was
  // replaced by the demo wordmark. Use the most recently edited workspace as
  // the same default project the project index presents first.
  const clientSlug =
    requestedClientSlug || (await listProjectWorkspaces())[0]?.clientSlug || "";
  const siteIdentity = await readSiteIdentity(clientSlug);

  return (
    <StyleGuidePreviewSurface>
      <main className="bg-bg-page text-text-main">
        <PagebuilderSection siteIdentity={siteIdentity} />
      </main>
    </StyleGuidePreviewSurface>
  );
}

import type { Metadata } from "next";
import { ContentEditorSection } from "@/components/sections";
import { getContentEditorPages } from "@/content/content-editor";
import { getAvailableImageAssets } from "@/utils/image-assets";
import { readSiteIdentity } from "@/utils/site-identity";

export const metadata: Metadata = {
  title: "Content Editor",
  description: "Pageworks content inventory and editing surface.",
};

// Staged pages are read from disk per request; without this the editor would
// serve a cached snapshot and drift from /dev/staged-pages again.
export const dynamic = "force-dynamic";

type ContentEditorPageProps = {
  searchParams: Promise<{
    client?: string | string[];
    page?: string | string[];
  }>;
};

export default async function ContentEditorPage({
  searchParams,
}: ContentEditorPageProps) {
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams.page;
  const clientParam = resolvedSearchParams.client;
  const initialPageId = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const initialClientSlug = Array.isArray(clientParam)
    ? clientParam[0]
    : clientParam;
  const pages = await getContentEditorPages();
  // One read per client represented in the editor, not per page - the identity
  // is shared by every page that client owns.
  const clientSlugs = [...new Set(pages.map((page) => page.clientSlug))].filter(
    Boolean,
  );
  const siteIdentities = Object.fromEntries(
    await Promise.all(
      clientSlugs.map(
        async (clientSlug) =>
          [clientSlug, await readSiteIdentity(clientSlug)] as const,
      ),
    ),
  );

  const imageAssets = await getAvailableImageAssets();

  return (
    <main>
      <ContentEditorSection
        imageAssets={imageAssets}
        initialClientSlug={initialClientSlug}
        initialPageId={initialPageId}
        pages={pages}
        siteIdentities={siteIdentities}
      />
    </main>
  );
}

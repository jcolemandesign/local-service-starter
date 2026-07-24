import type { Metadata } from "next";
import { ContentEditorSection } from "@/components/sections";
import { getContentEditorPages } from "@/content/content-editor";

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

  return (
    <main>
      <ContentEditorSection
        initialClientSlug={initialClientSlug}
        initialPageId={initialPageId}
        pages={pages}
      />
    </main>
  );
}

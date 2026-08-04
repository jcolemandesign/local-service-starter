import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StagedPageCanvas } from "@/components/sections";
import { readSiteIdentity } from "@/utils/site-identity";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";
import { isAltStagedPage, readStagedPages } from "@/utils/staged-pages";

export const dynamic = "force-dynamic";

type StagedPagePreviewProps = {
  params: Promise<{
    pageId: string;
  }>;
  searchParams: Promise<{
    client?: string | string[];
  }>;
};

/**
 * The tab title carries the alt number because comparing a page against its
 * alternate means two tabs of the same page - identical titles make the pair
 * indistinguishable once the tabs are narrow.
 */
export async function generateMetadata({
  params,
  searchParams,
}: StagedPagePreviewProps): Promise<Metadata> {
  const page = await findStagedPage(params, searchParams);

  if (!page) {
    return { title: "Staged Page Preview" };
  }

  const altSuffix = isAltStagedPage(page)
    ? ` (alt ${page.variant?.altIndex ?? ""})`.trimEnd()
    : "";

  return {
    description: "Live staged-site preview for assembled pages.",
    title: `${page.pageLabel}${altSuffix}`,
  };
}

async function findStagedPage(
  params: StagedPagePreviewProps["params"],
  searchParams: StagedPagePreviewProps["searchParams"],
) {
  const { pageId } = await params;
  const clientParam = (await searchParams).client;
  const clientSlug = Array.isArray(clientParam) ? clientParam[0] : clientParam;
  const stagedPages = await readStagedPages();

  return stagedPages.find(
    (currentPage) =>
      currentPage.pageId === pageId &&
      (!clientSlug || currentPage.snapshot.clientSlug === clientSlug),
  );
}

export default async function StagedPagePreview({
  params,
  searchParams,
}: StagedPagePreviewProps) {
  const stagedPages = await readStagedPages();
  const page = await findStagedPage(params, searchParams);

  if (!page) {
    notFound();
  }

  return (
    <StyleGuidePreviewSurface>
      <main className="min-h-svh bg-bg-page text-service-ink">
        <StagedPageCanvas
          allPages={stagedPages}
          chrome={false}
          page={page}
          siteIdentity={await readSiteIdentity(page.snapshot.clientSlug)}
        />
      </main>
    </StyleGuidePreviewSurface>
  );
}

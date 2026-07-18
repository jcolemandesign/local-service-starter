import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StagedPageCanvas } from "@/components/sections";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";
import { readStagedPages } from "@/utils/staged-pages";

export const metadata: Metadata = {
  title: "Staged Page Preview",
  description: "Live staged-site preview for assembled pages.",
};

export const dynamic = "force-dynamic";

type StagedPagePreviewProps = {
  params: Promise<{
    pageId: string;
  }>;
  searchParams: Promise<{
    client?: string | string[];
  }>;
};

export default async function StagedPagePreview({
  params,
  searchParams,
}: StagedPagePreviewProps) {
  const { pageId } = await params;
  const clientParam = (await searchParams).client;
  const clientSlug = Array.isArray(clientParam) ? clientParam[0] : clientParam;
  const stagedPages = await readStagedPages();
  const page = stagedPages.find(
    (currentPage) =>
      currentPage.pageId === pageId &&
      (!clientSlug || currentPage.snapshot.clientSlug === clientSlug),
  );

  if (!page) {
    notFound();
  }

  return (
    <StyleGuidePreviewSurface>
      <main className="min-h-svh bg-bg-page text-service-ink">
        <StagedPageCanvas allPages={stagedPages} chrome={false} page={page} />
      </main>
    </StyleGuidePreviewSurface>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StagedPageCanvas } from "@/components/sections";
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
};

export default async function StagedPagePreview({
  params,
}: StagedPagePreviewProps) {
  const { pageId } = await params;
  const stagedPages = await readStagedPages();
  const page = stagedPages.find((currentPage) => currentPage.pageId === pageId);

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-svh bg-white text-service-ink">
      <StagedPageCanvas allPages={stagedPages} chrome={false} page={page} />
    </main>
  );
}

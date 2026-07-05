import type { Metadata } from "next";
import { ContentEditorSection } from "@/components/sections";
import { contentEditorPages } from "@/content/content-editor";

export const metadata: Metadata = {
  title: "Content Editor",
  description: "Pageworks content inventory and editing surface.",
};

type ContentEditorPageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

export default async function ContentEditorPage({
  searchParams,
}: ContentEditorPageProps) {
  const pageParam = (await searchParams).page;
  const initialPageId = Array.isArray(pageParam) ? pageParam[0] : pageParam;

  return (
    <main>
      <ContentEditorSection
        initialPageId={initialPageId}
        pages={contentEditorPages}
      />
    </main>
  );
}

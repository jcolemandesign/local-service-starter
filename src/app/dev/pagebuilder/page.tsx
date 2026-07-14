import type { Metadata } from "next";
import { PagebuilderSection } from "@/components/sections/PagebuilderSection";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";

export const metadata: Metadata = {
  title: "Pagebuilder",
  description: "Internal homepage section builder.",
};

export default function PagebuilderPage() {
  return (
    <StyleGuidePreviewSurface>
      <main className="bg-bg-page text-text-main">
        <PagebuilderSection />
      </main>
    </StyleGuidePreviewSurface>
  );
}

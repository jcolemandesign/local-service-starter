import type { Metadata } from "next";
import { ContentEditorSection } from "@/components/sections";
import { contentEditorPages } from "@/content/content-editor";

export const metadata: Metadata = {
  title: "Content Editor",
  description: "Pageworks content inventory and editing surface.",
};

export default function ContentEditorPage() {
  return (
    <main>
      <ContentEditorSection pages={contentEditorPages} />
    </main>
  );
}

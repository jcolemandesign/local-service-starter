import type { Metadata } from "next";
import { CreatedPagesIndexSection } from "@/components/sections";
import { createdPagesIndexContent } from "@/content/created-pages";

export const metadata: Metadata = {
  title: "Created Pages | Pageworks",
  description: "Baked WIP pages generated from Pagebuilder instructions.",
};

export default function CreatedPagesPage() {
  return (
    <main>
      <CreatedPagesIndexSection {...createdPagesIndexContent} />
    </main>
  );
}

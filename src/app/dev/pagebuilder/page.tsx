import type { Metadata } from "next";
import { PagebuilderSection } from "@/components/sections/PagebuilderSection";

export const metadata: Metadata = {
  title: "Pagebuilder",
  description: "Internal homepage section builder.",
};

export default function PagebuilderPage() {
  return (
    <main className="bg-[#10141b] text-white">
      <PagebuilderSection />
    </main>
  );
}

import type { Metadata } from "next";
import { DesignLabSection } from "@/components/sections/DesignLabSection";

export const metadata: Metadata = {
  title: "Pagebuilder",
  description: "Internal homepage section builder.",
};

export default function PagebuilderPage() {
  return (
    <main className="bg-service-surface text-service-ink">
      <DesignLabSection />
    </main>
  );
}

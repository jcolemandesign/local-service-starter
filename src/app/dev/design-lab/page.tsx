import type { Metadata } from "next";
import { DesignLabSection } from "@/components/sections/DesignLabSection";

export const metadata: Metadata = {
  title: "Page Builder",
  description: "Internal homepage section builder.",
};

export default function DesignLabPage() {
  return (
    <main className="bg-service-surface text-service-ink">
      <DesignLabSection />
    </main>
  );
}

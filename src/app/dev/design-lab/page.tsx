import type { Metadata } from "next";
import { DesignLabSection } from "@/components/sections/DesignLabSection";

export const metadata: Metadata = {
  title: "Design Lab",
  description: "Internal homepage recipe and section mode design lab.",
};

export default function DesignLabPage() {
  return (
    <main className="bg-service-surface text-service-ink">
      <DesignLabSection />
    </main>
  );
}

import type { Metadata } from "next";
import { FontLabSection } from "@/components/sections/FontLabSection";

export const metadata: Metadata = {
  title: "Font Lab",
  description: "Internal font selection and typography role tuning lab.",
};

export default function FontLabPage() {
  return (
    <main className="bg-service-surface text-service-ink">
      <FontLabSection />
    </main>
  );
}

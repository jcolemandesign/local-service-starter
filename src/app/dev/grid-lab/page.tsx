import type { Metadata } from "next";
import { GridLabSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Grid Lab",
  description:
    "Internal CSS grid layout tests for seven-column section composition.",
};

export default function GridLabPage() {
  return (
    <main className="bg-white text-service-ink">
      <GridLabSection />
    </main>
  );
}

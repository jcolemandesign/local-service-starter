import type { Metadata } from "next";
import { PromptLibrarySection } from "@/components/sections/PromptLibrarySection";

export const metadata: Metadata = {
  title: "Prompt Library | Local Service Starter",
  description: "Internal prompt library for packet-based website copy workflows.",
};

export default function PromptLibraryPage() {
  return (
    <main>
      <PromptLibrarySection />
    </main>
  );
}

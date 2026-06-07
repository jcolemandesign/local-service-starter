import type { Metadata } from "next";
import { HomeIndexSection } from "@/components/sections";
import { homeIndexContent } from "@/content/home";

export const metadata: Metadata = {
  title: "Project Index | Local Service Starter",
  description:
    "Quick links for reviewing the local service starter, section library, design tools, and utility pages.",
};

export default function Home() {
  return (
    <main>
      <HomeIndexSection {...homeIndexContent} />
    </main>
  );
}

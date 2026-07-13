import type { Metadata } from "next";
import { HomeIndexSection } from "@/components/sections";
import { homeIndexContent } from "@/content/home";
import { RecoveryRedirect } from "./RecoveryRedirect";

export const metadata: Metadata = {
  title: "Project Index | Local Service Starter",
  description:
    "Quick links for reviewing the local service starter, section library, design tools, and utility pages.",
};

export default function Home() {
  return (
    <main>
      <RecoveryRedirect />
      <HomeIndexSection {...homeIndexContent} />
    </main>
  );
}

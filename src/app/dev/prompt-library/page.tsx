import type { Metadata } from "next";
import { PromptLibrarySection } from "@/components/sections/PromptLibrarySection";
import { readStrategyDigestText } from "@/utils/strategy-digest";
import {
  listProjectWorkspaces,
  sanitizeClientSlug,
} from "@/utils/strategy-workspace";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Prompt Library | Local Service Starter",
  description: "Internal prompt library for packet-based website copy workflows.",
};

type PromptLibraryPageProps = {
  searchParams: Promise<{
    project?: string | string[];
  }>;
};

export default async function PromptLibraryPage({
  searchParams,
}: PromptLibraryPageProps) {
  const projects = await listProjectWorkspaces();
  const selectedProjectParam = (await searchParams).project;
  const requestedClientSlug = sanitizeClientSlug(
    Array.isArray(selectedProjectParam)
      ? selectedProjectParam[0]
      : selectedProjectParam,
  );
  const selectedProject =
    projects.find((project) => project.clientSlug === requestedClientSlug) ??
    projects.find((project) => project.hasSourcePacket) ??
    null;
  const strategyDigestText = selectedProject?.hasSourcePacket
    ? await readStrategyDigestText(selectedProject.clientSlug)
    : "";

  return (
    <main>
      <PromptLibrarySection
        strategyDigestText={strategyDigestText}
      />
    </main>
  );
}

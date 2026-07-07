import type { Metadata } from "next";
import { PromptLibrarySection } from "@/components/sections/PromptLibrarySection";
import { readStrategyDigestText } from "@/utils/strategy-digest";
import { readStagedPages, type StagedPage } from "@/utils/staged-pages";
import {
  listProjectWorkspaces,
  readStrategyWorkspace,
  sanitizeClientSlug,
} from "@/utils/strategy-workspace";
import { buildTemplateCopyContract } from "@/utils/template-copy-contract";

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
  const strategyWorkspace = selectedProject
    ? await readStrategyWorkspace(selectedProject.clientSlug)
    : null;
  const stagedPages = await readStagedPages();
  const stagedPageContracts = selectedProject
    ? buildStagedPageContracts(stagedPages, selectedProject.clientSlug)
    : [];

  return (
    <main>
      <PromptLibrarySection
        clientSlug={selectedProject?.clientSlug ?? ""}
        stagedPageContracts={stagedPageContracts}
        strategyDigestText={strategyDigestText}
        strategyWorkspaceFields={strategyWorkspace?.fields ?? null}
      />
    </main>
  );
}

function buildStagedPageContracts(pages: StagedPage[], clientSlug: string) {
  return pages
    .filter((page) => page.snapshot.clientSlug === clientSlug)
    .filter((page) => page.template?.sections?.length)
    .map((page) => ({
      contract: buildTemplateCopyContract({
        pageLabel: page.pageLabel,
        pageSlug: page.pageId,
        template: {
          id: page.template?.id ?? "",
          name: page.template?.name ?? "Selected template",
          pageType: page.template?.pageType ?? "page",
          sectionCount:
            page.template?.sectionCount ?? page.template?.sections?.length ?? 0,
          sections: page.template?.sections ?? [],
        },
      }),
      pageHref: page.pageHref,
      pageId: page.pageId,
      pageLabel: page.pageLabel,
      pageType: page.template?.pageType ?? "",
      templateName: page.template?.name ?? "",
    }));
}

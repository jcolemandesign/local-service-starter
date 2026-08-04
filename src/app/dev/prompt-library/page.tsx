import type { Metadata } from "next";
import { PromptLibrarySection } from "@/components/sections/PromptLibrarySection";
import { readStrategyDigestText } from "@/utils/strategy-digest";
import { readStrategyPageSlots } from "@/utils/client-page-slots";
import { deriveStrategyPagesFromFields } from "@/utils/strategy-site-map";
import {
  getActiveStagedPages,
  readStagedPages,
  type StagedPage,
} from "@/utils/staged-pages";
import {
  listProjectWorkspaces,
  readStrategyWorkspace,
  sanitizeClientSlug,
} from "@/utils/strategy-workspace";
import {
  buildCopywritingAgentInstructions,
  buildGlobalCopywritingAgentInstructions,
} from "@/content/copywriting-personality-packets";
import { buildTemplateCopyContract } from "@/utils/template-copy-contract";
import { StyleGuideCloseAllButton } from "@/components/sections/StyleGuideCloseAllButton";

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
  // Built once per client and handed to every page spec, so a copied page
  // prompt carries its own voice rather than depending on being pasted into
  // the project-level agent instructions.
  const copywriting = strategyWorkspace
    ? [
        buildGlobalCopywritingAgentInstructions(),
        buildCopywritingAgentInstructions(strategyWorkspace.fields),
      ].join("\n\n")
    : undefined;
  const stagedPageContracts = selectedProject
    ? buildStagedPageContracts(
        stagedPages,
        selectedProject.clientSlug,
        copywriting,
      )
    : [];
  const strategyPages =
    strategyWorkspace && selectedProject
      ? deriveStrategyPagesFromFields(
          strategyWorkspace.fields,
          await readStrategyPageSlots(selectedProject.clientSlug),
        ).filter((page) => page.detected)
      : [];

  return (
    <main>
      <PromptLibrarySection
        clientSlug={selectedProject?.clientSlug ?? ""}
        stagedPageContracts={stagedPageContracts}
        strategyPages={strategyPages}
        strategyDigestText={strategyDigestText}
        strategyWorkspaceFields={strategyWorkspace?.fields ?? null}
      />
      <StyleGuideCloseAllButton />

    </main>
  );
}

function buildStagedPageContracts(
  pages: StagedPage[],
  clientSlug: string,
  copywriting?: string,
) {
  // One contract per live page. Alts share their base page's copy contract, so
  // including them would list the same contract twice.
  return getActiveStagedPages(pages)
    .filter((page) => page.snapshot.clientSlug === clientSlug)
    .filter((page) => page.template?.sections?.length)
    .map((page) => ({
      contract: buildTemplateCopyContract({
        copywriting,
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

import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  TemplateLibrarySection,
  type PageTemplateSummary,
} from "@/components/sections";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";
import { readStrategyPageSlots } from "@/utils/client-page-slots";
import { getStagedPreviewHref } from "@/utils/staged-page-links";
import { getActiveStagedPages, readStagedPages } from "@/utils/staged-pages";
import { listLatestStrategySnapshotSummaries } from "@/utils/strategy-snapshots";
import { readStrategyWorkspace } from "@/utils/strategy-workspace";
import {
  buildCopywritingAgentInstructions,
  buildGlobalCopywritingAgentInstructions,
} from "@/content/copywriting-personality-packets";
import { StyleGuideCloseAllButton } from "@/components/sections/StyleGuideCloseAllButton";

export const metadata: Metadata = {
  title: "Template Library",
  description: "Reusable page layouts promoted from Pagebuilder options.",
};

export const dynamic = "force-dynamic";

type PageTemplatesFile = {
  templates?: PageTemplateSummary[];
};

const pageTemplatesPath = path.join(
  process.cwd(),
  "src",
  "content",
  "page-templates.json",
);

export default async function TemplatesPage() {
  const templates = await readPageTemplates();
  const strategySnapshots = await listLatestStrategySnapshotSummaries();
  const stagedPages = await readStagedPages();

  const pageSlotsByClient = Object.fromEntries(
    await Promise.all(
      [
        ...new Set(
          strategySnapshots.map((snapshot) => snapshot.clientSlug),
        ),
      ].map(
        async (clientSlug) =>
          [clientSlug, await readStrategyPageSlots(clientSlug)] as const,
      ),
    ),
  );

  // One packet per client, read here because the strategy workspace is on
  // disk and the template library is a client component.
  const copywritingByClient = Object.fromEntries(
    await Promise.all(
      [...new Set(strategySnapshots.map((snapshot) => snapshot.clientSlug))].map(
        async (clientSlug) => {
          const workspace = await readStrategyWorkspace(clientSlug);

          return [
            clientSlug,
            [
              buildGlobalCopywritingAgentInstructions(),
              buildCopywritingAgentInstructions(workspace.fields),
            ].join("\n\n"),
          ] as const;
        },
      ),
    ),
  );

  return (
    <StyleGuidePreviewSurface>
      <main>
        <TemplateLibrarySection
          copywritingByClient={copywritingByClient}
          pageSlotsByClient={pageSlotsByClient}
          stagedTemplateAssignments={getActiveStagedPages(stagedPages)
            .filter((page) => page.template?.id)
            .map((page) => ({
              clientSlug: page.snapshot.clientSlug,
              pageHref: page.pageHref,
              pageId: page.pageId,
              pageLabel: page.pageLabel,
              previewHref: getStagedPreviewHref({
                clientSlug: page.snapshot.clientSlug,
                pageId: page.pageId,
                previewHref: page.previewHref,
              }),
              templateId: page.template?.id ?? "",
            }))}
          strategySnapshots={strategySnapshots}
          templates={templates}
        />
        <StyleGuideCloseAllButton />

      </main>
    </StyleGuidePreviewSurface>
  );
}

async function readPageTemplates() {
  try {
    const contents = await readFile(pageTemplatesPath, "utf8");
    const parsed = JSON.parse(contents) as PageTemplatesFile;

    return Array.isArray(parsed.templates) ? parsed.templates : [];
  } catch {
    return [];
  }
}

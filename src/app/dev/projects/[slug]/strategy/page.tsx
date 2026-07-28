import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound, redirect } from "next/navigation";
import { StrategyWorkspaceSection } from "@/components/sections/StrategyWorkspaceSection";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";
import type { PageTemplateSummary } from "@/components/sections/TemplateLibrarySection";
import { readStrategyPageSlots } from "@/utils/client-page-slots";
import { getStagedPreviewHref } from "@/utils/staged-page-links";
import { getActiveStagedPages, readStagedPages } from "@/utils/staged-pages";
import { readStrategyDigestText } from "@/utils/strategy-digest";
import {
  readSourcePacketText,
  readStrategyWorkspace,
  readStrategyWorkspacePacketSummary,
  sanitizeClientSlug,
} from "@/utils/strategy-workspace";
import { StyleGuideCloseAllButton } from "@/components/sections/StyleGuideCloseAllButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Strategy Workspace | Local Service Starter",
  description:
    "Local project workspace for research, strategy briefs, content plans, and page copy.",
};

type StrategyWorkspacePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type PageTemplatesFile = {
  templates?: PageTemplateSummary[];
};

const pageTemplatesPath = path.join(
  process.cwd(),
  "src",
  "content",
  "page-templates.json",
);

export default async function StrategyWorkspacePage({
  params,
}: StrategyWorkspacePageProps) {
  const { slug } = await params;
  const clientSlug = sanitizeClientSlug(slug);

  if (!clientSlug) {
    notFound();
  }

  if (clientSlug !== slug) {
    redirect(`/dev/projects/${clientSlug}/strategy`);
  }

  const [
    workspace,
    packetSummary,
    sourcePacketText,
    strategyDigestText,
    stagedPages,
    templates,
  ] =
    await Promise.all([
      readStrategyWorkspace(clientSlug),
      readStrategyWorkspacePacketSummary(clientSlug),
      readSourcePacketText(clientSlug),
      readStrategyDigestText(clientSlug),
      readStagedPages(),
      readPageTemplates(),
    ]);
  // Active pages only. An alt shares its base page's type, so leaving alts in
  // would list them as extra staged child pages under repeatable page types.
  const stagedPageSummaries = getActiveStagedPages(stagedPages)
    .filter((page) => page.snapshot.clientSlug === clientSlug)
    .map((page) => ({
      pageHref: page.pageHref,
      pageId: page.pageId,
      pageLabel: page.pageLabel,
      pageType: page.template?.pageType ?? "",
      previewHref: getStagedPreviewHref({
        clientSlug: page.snapshot.clientSlug,
        pageId: page.pageId,
        previewHref: page.previewHref,
      }),
      template: page.template
        ? {
            id: page.template.id,
            name: page.template.name,
            pageType: page.template.pageType,
            sectionCount: page.template.sectionCount,
            sections: page.template.sections ?? [],
          }
        : undefined,
      templateId: page.template?.id ?? "",
      templateName: page.template?.name ?? "",
    }));

  return (
    <StyleGuidePreviewSurface>
      <main>
        <StrategyWorkspaceSection
          clientSlug={clientSlug}
          initialWorkspace={workspace}
          packetSummary={packetSummary}
          pageSlots={await readStrategyPageSlots(clientSlug)}
          stagedPages={stagedPageSummaries}
          strategyDigestText={strategyDigestText}
          templates={templates}
          sourcePacketText={sourcePacketText}
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

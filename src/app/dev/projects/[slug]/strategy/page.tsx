import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { StrategyWorkspaceSection } from "@/components/sections/StrategyWorkspaceSection";
import { readStagedPages } from "@/utils/staged-pages";
import { readStrategyDigestText } from "@/utils/strategy-digest";
import {
  readSourcePacketText,
  readStrategyWorkspace,
  readStrategyWorkspacePacketSummary,
  sanitizeClientSlug,
} from "@/utils/strategy-workspace";

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
  ] =
    await Promise.all([
      readStrategyWorkspace(clientSlug),
      readStrategyWorkspacePacketSummary(clientSlug),
      readSourcePacketText(clientSlug),
      readStrategyDigestText(clientSlug),
      readStagedPages(),
    ]);
  const stagedPageSummaries = stagedPages
    .filter((page) => page.snapshot.clientSlug === clientSlug)
    .map((page) => ({
      pageId: page.pageId,
      previewHref: page.previewHref,
      status: page.status,
      templateName: page.template?.name ?? "",
    }));

  return (
    <main>
      <StrategyWorkspaceSection
        clientSlug={clientSlug}
        initialWorkspace={workspace}
        packetSummary={packetSummary}
        stagedPages={stagedPageSummaries}
        strategyDigestText={strategyDigestText}
        sourcePacketText={sourcePacketText}
      />
    </main>
  );
}

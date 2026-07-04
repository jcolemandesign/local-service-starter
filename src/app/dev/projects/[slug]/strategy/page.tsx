import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { StrategyWorkspaceSection } from "@/components/sections/StrategyWorkspaceSection";
import {
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

  const [workspace, packetSummary] = await Promise.all([
    readStrategyWorkspace(clientSlug),
    readStrategyWorkspacePacketSummary(clientSlug),
  ]);

  return (
    <main>
      <StrategyWorkspaceSection
        clientSlug={clientSlug}
        initialWorkspace={workspace}
        packetSummary={packetSummary}
      />
    </main>
  );
}

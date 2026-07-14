import type { Metadata } from "next";
import { ProjectWorkspacesSection } from "@/components/sections/ProjectWorkspacesSection";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";
import { listProjectWorkspaces } from "@/utils/strategy-workspace";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Workspace Archive | Local Service Starter",
  description:
    "Local project workspace archive for generated packets and saved strategy versions.",
};

export default async function ProjectWorkspacesPage() {
  const projects = await listProjectWorkspaces();

  return (
    <StyleGuidePreviewSurface>
      <main>
        <ProjectWorkspacesSection projects={projects} />
      </main>
    </StyleGuidePreviewSurface>
  );
}

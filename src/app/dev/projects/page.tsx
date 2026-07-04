import type { Metadata } from "next";
import { ProjectWorkspacesSection } from "@/components/sections/ProjectWorkspacesSection";
import { listProjectWorkspaces } from "@/utils/strategy-workspace";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Local Projects | Local Service Starter",
  description:
    "Local project workspace index for generated packets and strategy workspaces.",
};

export default async function ProjectWorkspacesPage() {
  const projects = await listProjectWorkspaces();

  return (
    <main>
      <ProjectWorkspacesSection projects={projects} />
    </main>
  );
}

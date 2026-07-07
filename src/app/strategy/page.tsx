import { redirect } from "next/navigation";
import { listProjectWorkspaces } from "@/utils/strategy-workspace";

export const dynamic = "force-dynamic";

export default async function StrategyShortcutPage() {
  const projects = await listProjectWorkspaces();
  const project =
    projects.find((currentProject) => currentProject.hasWorkspace) ??
    projects.find((currentProject) => currentProject.hasSourcePacket) ??
    projects[0];

  if (!project) {
    redirect("/dev/projects");
  }

  redirect(`/dev/projects/${project.clientSlug}/strategy`);
}

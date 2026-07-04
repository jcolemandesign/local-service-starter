import Link from "next/link";
import { Card, Container, Section } from "@/components/primitives";
import type { ProjectWorkspaceSummary } from "@/utils/strategy-workspace";

type ProjectWorkspacesSectionProps = {
  projects: ProjectWorkspaceSummary[];
};

export function ProjectWorkspacesSection({
  projects,
}: ProjectWorkspacesSectionProps) {
  return (
    <Section className="min-h-svh bg-service-surface text-service-ink">
      <Container>
        <div className="grid layout-gap-lrg">
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">Local Projects</p>
            <h1 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
              Strategy workspaces
            </h1>
            <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
              Local project folders with source packets and saved copy-machine
              workspace files.
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="grid card-grid-gap-med">
              {projects.map((project) => (
                <Card className="p-5" key={project.clientSlug}>
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div className="min-w-0">
                      <p className="type-label text-service-accent">
                        {project.hasSourcePacket
                          ? "Packet ready"
                          : "Packet missing"}
                      </p>
                      <h2 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                        {project.clientSlug}
                      </h2>
                      <div className="mt-4 grid gap-2 type-caption text-service-muted">
                        <span className="break-all rounded-[var(--radius-md-token)] bg-service-surface px-3 py-2 font-mono text-service-ink">
                          {project.sourcePacketPath}
                        </span>
                        <span className="break-all rounded-[var(--radius-md-token)] bg-service-surface px-3 py-2 font-mono text-service-ink">
                          {project.strategyWorkspacePath}
                        </span>
                        <span>
                          {project.updatedAt
                            ? `Workspace saved ${formatDate(project.updatedAt)}`
                            : "Workspace not saved yet"}
                        </span>
                      </div>
                    </div>

                    <Link
                      className="radius-button inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap border border-service-accent bg-service-accent px-5 type-caption font-semibold text-white transition-colors hover:bg-service-ink sm:w-auto"
                      href={`/dev/projects/${project.clientSlug}/strategy`}
                    >
                      Open strategy
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-5">
              <p className="type-text-sm text-service-muted">
                No local project folders found yet. Generate a packet from an
                intake to create the first project workspace folder.
              </p>
            </Card>
          )}
        </div>
      </Container>
    </Section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

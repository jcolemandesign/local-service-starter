import type { Metadata } from "next";
import { Button, Card, SevenColumnGrid, SevenColumnGridItem } from "@/components/primitives";
import { readStagedPages, type StagedPage } from "@/utils/staged-pages";

export const metadata: Metadata = {
  title: "Staged Pages",
  description: "Staged pages eligible for public promotion.",
};

export const dynamic = "force-dynamic";

export default async function StagedPagesPage() {
  const stagedPages = await readStagedPages();

  return (
    <main className="min-h-svh bg-bg-surface text-service-ink">
      <SevenColumnGrid minHeight="none" padding="med">
        <SevenColumnGridItem className="col-start-2 col-span-4 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <p className="type-label text-service-accent">Pageworks Pipeline</p>
          <h1 className="type-display-lg mt-eyebrow-display text-service-ink">
            Staged Pages
          </h1>
          <p className="type-text-xl wrap-pretty mt-display-body text-service-muted">
            Staged pages assembled from saved strategy snapshots and selected
            templates. Review the linked staged site before public route
            promotion.
          </p>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-start-2 col-span-5 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          {stagedPages.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
              {stagedPages.map((page) => (
                <Card className="p-5 shadow-none" key={page.pageId}>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 max-sm:grid-cols-1">
                    <div className="min-w-0">
                      <p className="type-label text-service-accent">
                        {page.status}
                      </p>
                      <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                        {page.pageLabel}
                      </h2>
                      <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                        Staged {formatDate(page.promotedAt)} from{" "}
                        {formatSource(page)}.
                      </p>
                    </div>
                    <div className="justify-self-end max-sm:justify-self-start">
                      <div className="flex flex-wrap justify-end gap-2 max-sm:justify-start">
                        <Button href={getPreviewHref(page)} variant="secondary">
                          Review Page
                        </Button>
                        <Button href={getContentEditorHref(page)}>
                          Edit Content
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <StatusPill label={`${page.fieldCounts.copy} copy`} />
                    <StatusPill label={`${page.fieldCounts.image ?? 0} image`} />
                    <StatusPill label={`${page.fieldCounts.link ?? 0} link`} />
                    <StatusPill label={`${page.fieldCounts.meta ?? 0} meta`} />
                    <StatusPill label={`${page.fields.length} total`} />
                    <StatusPill label={page.pageHref} />
                  </div>

                  <div className="mt-5 grid gap-2 border-t border-service-border pt-5">
                    {page.fields.slice(0, 6).map((field) => (
                      <div
                        className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 rounded-sm border border-service-border bg-service-surface px-3 py-2 max-md:grid-cols-1"
                        key={field.id}
                      >
                        <span className="type-caption font-semibold text-service-accent">
                          {field.kind}
                        </span>
                        <span className="type-caption truncate text-service-muted">
                          {field.path}
                        </span>
                      </div>
                    ))}
                    {page.fields.length > 6 ? (
                      <p className="type-caption text-service-muted">
                        + {page.fields.length - 6} more staged fields
                      </p>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 shadow-none">
              <p className="type-label text-service-accent">No staged pages</p>
              <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                Save a strategy snapshot and use a template first.
              </h2>
              <p className="type-text-md wrap-pretty mt-heading-body-md text-service-muted">
                Staged pages appear here after a template is applied to a saved
                strategy snapshot.
              </p>
              <div className="mt-body-actions-md">
                <Button href="/dev/templates">Open Template Library</Button>
              </div>
            </Card>
          )}
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </main>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
      {label}
    </span>
  );
}

function getPreviewHref(page: StagedPage) {
  return page.previewHref ?? `/dev/staged-pages/${page.pageId}`;
}

function getContentEditorHref(page: StagedPage) {
  return `/dev/content-editor?page=${encodeURIComponent(page.pageId)}`;
}

function formatSource(page: StagedPage) {
  if (page.sourceStage === "strategy-template" && page.snapshot) {
    return `${page.snapshot.clientSlug} v${page.snapshot.version}`;
  }

  return page.sourceStage;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

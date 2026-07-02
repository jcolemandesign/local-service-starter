import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Button, Card, SevenColumnGrid, SevenColumnGridItem } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Staged Pages",
  description: "Staged pages eligible for public promotion.",
};

export const dynamic = "force-dynamic";

type StagedPage = {
  fieldCounts: {
    copy: number;
    image: number;
    link: number;
  };
  fields: Array<{
    id: string;
    kind: "copy" | "image" | "link";
    path: string;
    value: string;
  }>;
  pageHref: string;
  pageId: string;
  pageLabel: string;
  promotedAt: string;
  sourceStage: string;
  status: string;
};

type StagedPagesFile = {
  pages: StagedPage[];
};

const stagedPagesPath = path.join(
  process.cwd(),
  "src",
  "content",
  "staged-pages.json",
);

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
            Staged pages promoted from Content Editor. These are eligible for
            public route promotion after style, content, and page structure are
            approved.
          </p>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-start-2 col-span-5 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          {stagedPages.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
              {stagedPages.map((page) => (
                <Card className="p-5 shadow-none" key={page.pageId}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="fluid-type-frame">
                      <p className="type-label text-service-accent">
                        {page.status}
                      </p>
                      <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                        {page.pageLabel}
                      </h2>
                      <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                        Promoted {formatDate(page.promotedAt)} from{" "}
                        {page.sourceStage}.
                      </p>
                    </div>
                    <Button href={page.pageHref} target="_blank" variant="secondary">
                      Review Page
                    </Button>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <StatusPill label={`${page.fieldCounts.copy} copy`} />
                    <StatusPill label={`${page.fieldCounts.image} image`} />
                    <StatusPill label={`${page.fieldCounts.link} link`} />
                    <StatusPill label={`${page.fields.length} total`} />
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
                Promote content from the Content Editor first.
              </h2>
              <p className="type-text-md wrap-pretty mt-heading-body-md text-service-muted">
                Staged pages will appear here after clean template output is
                promoted from the Content Editor.
              </p>
              <div className="mt-body-actions-md">
                <Button href="/dev/content-editor">Open Content Editor</Button>
              </div>
            </Card>
          )}
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </main>
  );
}

async function readStagedPages() {
  try {
    const contents = await readFile(stagedPagesPath, "utf8");
    const parsed = JSON.parse(contents) as Partial<StagedPagesFile>;

    return Array.isArray(parsed.pages) ? parsed.pages : [];
  } catch {
    return [];
  }
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
      {label}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

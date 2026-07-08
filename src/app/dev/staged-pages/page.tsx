import type { Metadata } from "next";
import {
  Button,
  Card,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";
import { StagedPageRemoveButton } from "@/components/sections/StagedPageRemoveButton";
import { readStagedPages, type StagedPage } from "@/utils/staged-pages";

export const metadata: Metadata = {
  title: "Staged Pages",
  description: "Staged pages eligible for public promotion.",
};

export const dynamic = "force-dynamic";

export default async function StagedPagesPage() {
  const stagedPages = await readStagedPages();
  const totalCopyFields = stagedPages.reduce(
    (total, page) => total + page.fieldCounts.copy,
    0,
  );
  const totalEmptyCopyFields = stagedPages.reduce(
    (total, page) => total + getEmptyCopyFields(page).length,
    0,
  );

  return (
    <StyleGuidePreviewSurface>
      <main className="min-h-svh bg-bg-surface text-service-ink">
        <SevenColumnGrid minHeight="none" padding="med">
        <SevenColumnGridItem className="col-start-2 col-span-4 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <p className="type-label text-service-accent">Pageworks Pipeline</p>
          <h1 className="type-display-lg mt-eyebrow-display text-service-ink">
            Staged Pages
          </h1>
          <p className="type-text-xl wrap-pretty mt-display-body text-service-muted">
            Review template-built pages after content entry. Each staged page
            keeps its visual preview, template assignment, copy completion, and
            editor handoff in one place.
          </p>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-start-6 col-span-1 self-end max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <div className="grid gap-2 rounded-sm border border-service-border bg-white p-4">
            <p className="type-label text-service-accent">Queue status</p>
            <p className="type-heading-sm text-service-ink">
              {stagedPages.length} staged
            </p>
            <p className="type-caption text-service-muted">
              {totalCopyFields - totalEmptyCopyFields} of {totalCopyFields} copy
              fields filled
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-start-2 col-span-5 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          {stagedPages.length > 0 ? (
            <div className="grid gap-5">
              {stagedPages.map((page) => {
                const emptyCopyFields = getEmptyCopyFields(page);
                const filledCopyCount =
                  page.fieldCounts.copy - emptyCopyFields.length;
                const completionPercent = getCompletionPercent(
                  filledCopyCount,
                  page.fieldCounts.copy,
                );

                return (
                  <Card className="p-5 shadow-none" key={page.pageId}>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-5 max-lg:grid-cols-1">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusPill label={page.status} tone="accent" />
                          <StatusPill label={page.pageHref} />
                          <StatusPill
                            label={page.template?.name ?? "Template unknown"}
                          />
                        </div>
                        <h2 className="type-heading-md mt-4 text-service-ink">
                          {page.pageLabel}
                        </h2>
                        <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                          Staged {formatDate(page.promotedAt)} from{" "}
                          {formatSource(page)}.
                        </p>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2 max-lg:justify-start">
                        <Button
                          href={getPreviewHref(page)}
                          rel="noreferrer"
                          target="_blank"
                          variant="secondary"
                        >
                          Preview
                        </Button>
                        <Button href={getContentEditorHref(page)}>
                          Edit Content
                        </Button>
                        <Button href={`${getPreviewHref(page)}/debug`} variant="secondary">
                          Debug
                        </Button>
                        <StagedPageRemoveButton
                          pageId={page.pageId}
                          pageLabel={page.pageLabel}
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-[minmax(0,1fr)_12rem] gap-5 border-t border-service-border pt-5 max-md:grid-cols-1">
                      <div className="min-w-0">
                        <div className="h-2 overflow-hidden rounded-full bg-service-surface">
                          <div
                            className="h-full rounded-full bg-service-accent"
                            style={{ width: `${completionPercent}%` }}
                          />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <StatusPill
                            label={`${filledCopyCount}/${page.fieldCounts.copy} copy filled`}
                            tone={
                              emptyCopyFields.length === 0
                                ? "complete"
                                : "default"
                            }
                          />
                          <StatusPill
                            label={`${emptyCopyFields.length} empty copy`}
                            tone={
                              emptyCopyFields.length > 0 ? "warning" : "default"
                            }
                          />
                          <StatusPill
                            label={`${page.template?.sectionCount ?? getSectionCount(page)} sections`}
                          />
                          <StatusPill
                            label={`${page.fieldCounts.meta ?? 0} reference`}
                          />
                          <StatusPill label={`${page.fields.length} fields`} />
                        </div>
                      </div>

                      <div className="grid content-start gap-2 rounded-sm border border-service-border bg-service-surface p-3">
                        <p className="type-label text-service-accent">
                          Workflow
                        </p>
                        <p className="type-caption text-service-muted">
                          Template selected. Fill copy fields, review visual
                          canvas, then keep staged until public promotion.
                        </p>
                      </div>
                    </div>

                    {emptyCopyFields.length > 0 ? (
                      <div className="mt-5 border-t border-service-border pt-5">
                        <p className="type-label text-service-accent">
                          Empty copy fields
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2 max-md:grid-cols-1">
                          {emptyCopyFields.slice(0, 6).map((field) => (
                            <div
                              className="rounded-sm border border-service-border bg-service-surface px-3 py-2"
                              key={field.id}
                            >
                              <p className="type-caption truncate font-semibold text-service-ink">
                                {formatFieldPath(field.path)}
                              </p>
                              <p className="type-caption truncate text-service-muted">
                                {field.path}
                              </p>
                            </div>
                          ))}
                        </div>
                        {emptyCopyFields.length > 6 ? (
                          <p className="type-caption mt-3 text-service-muted">
                            + {emptyCopyFields.length - 6} more empty copy
                            fields
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </Card>
                );
              })}
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
    </StyleGuidePreviewSurface>
  );
}

function StatusPill({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "accent" | "complete" | "default" | "warning";
}) {
  const toneClassNames = {
    accent: "border-service-accent bg-service-accent text-white",
    complete: "border-service-accent bg-white text-service-accent",
    default: "border-service-border bg-service-surface text-service-muted",
    warning: "border-amber-700 bg-amber-50 text-amber-900",
  } as const;

  return (
    <span
      className={`type-caption rounded-sm border px-3 py-1 ${toneClassNames[tone]}`}
    >
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

function getEmptyCopyFields(page: StagedPage) {
  return page.fields.filter(
    (field) => field.kind === "copy" && field.value.trim().length === 0,
  );
}

function getCompletionPercent(filledCount: number, totalCount: number) {
  if (totalCount === 0) {
    return 100;
  }

  return Math.round((filledCount / totalCount) * 100);
}

function getSectionCount(page: StagedPage) {
  return new Set(
    page.fields
      .map((field) => field.path.split(".")[0])
      .filter((sectionId) => sectionId !== "strategy"),
  ).size;
}

function formatFieldPath(path: string) {
  const fieldName = path.split(".").at(-1) ?? path;

  return fieldName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

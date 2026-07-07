import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Button,
  Card,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { StagedPageCanvas } from "@/components/sections";
import {
  extractBulkPasteCopy,
  readStagedPages,
  type StagedPage,
} from "@/utils/staged-pages";

export const metadata: Metadata = {
  title: "Staged Page Preview",
  description: "Linked staged-site preview for assembled pages.",
};

export const dynamic = "force-dynamic";

type StagedPagePreviewProps = {
  params: Promise<{
    pageId: string;
  }>;
};

export default async function StagedPagePreview({
  params,
}: StagedPagePreviewProps) {
  const { pageId } = await params;
  const stagedPages = await readStagedPages();
  const page = stagedPages.find((currentPage) => currentPage.pageId === pageId);

  if (!page) {
    notFound();
  }

  const navigation = getNavigation(page, stagedPages);
  const pageCopy = page.fields.find((field) => field.path === "strategy.pageCopy");
  const renderablePageCopy = pageCopy?.value
    ? extractBulkPasteCopy(pageCopy.value)
    : "";
  const sectionFields = page.fields.filter(
    (field) => !field.path.startsWith("strategy."),
  );

  return (
    <main className="min-h-svh bg-bg-surface text-service-ink">
      <SevenColumnGrid minHeight="none" padding="med">
        <SevenColumnGridItem className="col-start-2 col-span-5 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <nav
            aria-label="Staged site navigation"
            className="flex flex-wrap items-center gap-2 rounded-sm border border-service-border bg-white p-3"
          >
            {navigation.map((item) =>
              item.previewHref ? (
                <Link
                  className={`type-caption rounded-sm border px-3 py-1 transition-colors ${
                    item.isActive
                      ? "border-service-accent bg-service-accent text-white"
                      : "border-service-border bg-service-surface text-service-muted hover:border-service-accent hover:text-service-accent"
                  }`}
                  href={item.previewHref}
                  key={item.pageId}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted opacity-60"
                  key={item.pageId}
                >
                  {item.label} needs template
                </span>
              ),
            )}
          </nav>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-start-2 col-span-4 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <p className="type-label text-service-accent">Staged Preview</p>
          <h1 className="type-display-lg mt-eyebrow-display text-service-ink">
            {page.pageLabel}
          </h1>
          <p className="type-text-xl wrap-pretty mt-display-body text-service-muted">
            {formatPreviewMeta(page)}
          </p>
          <div className="mt-body-actions-md">
            <Button href={getContentEditorHref(page)}>Edit Content</Button>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-start-2 col-span-5 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <div className="grid gap-5">
            <StagedPageCanvas page={page} />

            <Card className="p-5 shadow-none">
              <p className="type-label text-service-accent">Strategy Copy</p>
              <div className="type-text-md mt-heading-body-md whitespace-pre-wrap text-service-ink">
                {renderablePageCopy || "No strategy copy was found for this page."}
              </div>
            </Card>

            <Card className="p-5 shadow-none">
              <p className="type-label text-service-accent">Template Fields</p>
              <div className="mt-5 grid gap-3">
                {sectionFields.map((field) => (
                  <div
                    className="rounded-sm border border-service-border bg-service-surface p-4"
                    key={field.id}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="type-caption font-semibold text-service-accent">
                        {field.path}
                      </p>
                      <span className="type-caption rounded-sm border border-service-border bg-white px-2 py-0.5 text-service-muted">
                        {field.kind}
                      </span>
                    </div>
                    <p className="type-text-sm mt-2 whitespace-pre-wrap text-service-muted">
                      {field.value || "Empty. Add reviewed copy in Content Editor."}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </main>
  );
}

function getNavigation(page: StagedPage, stagedPages: StagedPage[]) {
  const navigation =
    page.navigation?.length > 0
      ? page.navigation
      : stagedPages.map((stagedPage) => ({
          href: stagedPage.pageHref,
          label: stagedPage.pageLabel,
          pageId: stagedPage.pageId,
        }));

  return navigation.map((item) => {
    const stagedPage = stagedPages.find(
      (currentPage) =>
        currentPage.pageHref === item.href || currentPage.pageId === item.pageId,
    );

    return {
      ...item,
      isActive: stagedPage?.pageId === page.pageId,
      previewHref: stagedPage
        ? stagedPage.previewHref ?? `/dev/staged-pages/${stagedPage.pageId}`
        : "",
    };
  });
}

function formatPreviewMeta(page: StagedPage) {
  if (page.sourceStage === "strategy-template" && page.snapshot && page.template) {
    return `${page.pageHref} staged from ${page.snapshot.clientSlug} v${page.snapshot.version} using ${page.template.name}.`;
  }

  return `${page.pageHref} staged from ${page.sourceStage}.`;
}

function getContentEditorHref(page: StagedPage) {
  return `/dev/content-editor?page=${encodeURIComponent(page.pageId)}`;
}

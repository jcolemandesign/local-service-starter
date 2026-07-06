import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  Button,
  Card,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import {
  deleteStagedPage,
  readStagedPages,
  type StagedPage,
} from "@/utils/staged-pages";
import {
  SectionPreviewCanvas,
  type PreviewCanvasSection,
} from "@/components/sections/SectionPreviewCanvas";
import { semanticSectionOptions } from "@/content/semantic-section-options";
import { buildSemanticPageBlueprint } from "@/utils/semantic-page-blueprint";

export const metadata: Metadata = {
  title: "Staged Page Preview",
  description: "Linked staged-site preview for assembled pages.",
};

export const dynamic = "force-dynamic";

async function removeStagedPage(formData: FormData) {
  "use server";

  const pageId = formData.get("pageId");

  if (typeof pageId === "string") {
    await deleteStagedPage(pageId);
    revalidatePath("/dev/staged-pages");
    revalidatePath(`/dev/staged-pages/${pageId}`);
  }

  redirect("/dev/staged-pages");
}

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
  const previewSections = buildStagedPreviewSections(page);

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
                  {item.label} not staged
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
          <div className="mt-body-actions-md flex flex-wrap gap-2">
            <Button href={getContentEditorHref(page)}>Edit Content</Button>
            <form action={removeStagedPage}>
              <input name="pageId" type="hidden" value={page.pageId} />
              <button
                className="radius-button inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap border border-red-200 bg-white px-6 py-2 text-sm font-semibold text-red-700 transition duration-200 ease-out hover:border-red-400 hover:bg-red-50"
                type="submit"
              >
                Remove Staged Page
              </button>
            </form>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-start-2 col-span-5 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <div className="grid gap-5">
            {previewSections.length > 0 ? (
              <SectionPreviewCanvas
                eyebrow="Staged Visual Preview"
                pageLabel={page.pageLabel}
                sections={previewSections}
              />
            ) : (
              <Card className="p-5 shadow-none">
                <p className="type-label text-service-accent">Preview unavailable</p>
                <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                  Restage this page from Layout Preview.
                </h2>
                <p className="type-text-md wrap-pretty mt-heading-body-md text-service-muted">
                  This staged page does not include enough saved section copy to
                  render a visual review.
                </p>
                <div className="mt-body-actions-md">
                  <Button href="/dev/templates">Open Layout Preview</Button>
                </div>
              </Card>
            )}

            <Card className="p-5 shadow-none">
              <p className="type-label text-service-accent">Staged Details</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <StatusPill label={`${previewSections.length} visual sections`} />
                <StatusPill label={`${page.fields.length} editable fields`} />
                <StatusPill label={formatSourceLabel(page)} />
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
  if (isLayoutPreviewPage(page) && page.snapshot) {
    return `${page.pageHref} staged from ${page.snapshot.clientSlug} v${page.snapshot.version} via Layout Preview.`;
  }

  if (page.sourceStage === "strategy-template" && page.snapshot && page.template) {
    return `${page.pageHref} staged from ${page.snapshot.clientSlug} v${page.snapshot.version} using ${page.template.name}.`;
  }

  return `${page.pageHref} staged from ${page.sourceStage}.`;
}

function getContentEditorHref(page: StagedPage) {
  return `/dev/content-editor?page=${encodeURIComponent(page.pageId)}`;
}

function buildStagedPreviewSections(page: StagedPage): PreviewCanvasSection[] {
  if (page.sections?.length) {
    return page.sections
      .filter((section) => section.component && section.mode && section.name)
      .map((section) => ({
        body: section.body ?? getSectionBodyFallback(page, section.name),
        component: section.component,
        mode: section.mode,
        name: section.name,
        ratio: section.ratio,
        sourceRole: section.sourceRole ?? section.mode,
        summary: section.summary ?? section.instruction,
        variant: section.variant,
      }));
  }

  const pageCopy = page.fields.find((field) => field.path === "strategy.pageCopy");

  if (!pageCopy?.value) {
    return [];
  }

  return buildSemanticPageBlueprint(pageCopy.value).sections.map((section) => {
    const option =
      semanticSectionOptions.find(
        (currentOption) => currentOption.mode === section.mode,
      ) ?? semanticSectionOptions[0];

    return {
      body: section.body,
      component: option.component,
      mode: section.mode,
      name: section.title,
      sourceRole: section.sourceRole,
      summary: section.summary,
    };
  });
}

function getSectionBodyFallback(page: StagedPage, sectionName: string) {
  const normalizedName = normalizeText(sectionName);
  const pageCopy = page.fields.find((field) => field.path === "strategy.pageCopy");

  if (!pageCopy?.value) {
    return "";
  }

  return (
    buildSemanticPageBlueprint(pageCopy.value).sections.find(
      (section) => normalizeText(section.title) === normalizedName,
    )?.body ?? ""
  );
}

function formatSourceLabel(page: StagedPage) {
  if (isLayoutPreviewPage(page)) {
    return "Layout Preview";
  }

  if (page.sourceStage === "strategy-template") {
    return "Template Library";
  }

  return page.sourceStage;
}

function isLayoutPreviewPage(page: StagedPage) {
  return (
    page.sourceStage === "layout-preview" ||
    page.template?.id?.startsWith("semantic-") ||
    page.template?.name?.toLowerCase().includes("layout preview") ||
    page.template?.name?.toLowerCase().includes("semantic blueprint")
  );
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
      {label}
    </span>
  );
}

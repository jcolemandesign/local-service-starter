"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives/SevenColumnGrid";
import { SectionPreviewCanvas } from "@/components/sections/SectionPreviewCanvas";
import type {
  SemanticSectionLabel,
  SemanticSectionOption,
} from "@/content/semantic-section-options";
import {
  buildSemanticPageBlueprint,
  type SemanticBlueprintSection,
} from "@/utils/semantic-page-blueprint";
import type { StrategySnapshot } from "@/utils/strategy-snapshots";

type SemanticPrestageSectionProps = {
  sectionOptions: SemanticSectionOption[];
  snapshots: StrategySnapshot[];
};

type StagePageResponse =
  | {
      ok: true;
      page: {
        pageId: string;
        pageLabel: string;
        previewHref: string;
      };
    }
  | { ok: false; error?: string };

type PageBlueprint = {
  label: string;
  pageId: string;
  path: string;
  sections: SemanticBlueprintSection[];
};

type SelectedComponents = Record<string, Record<string, string>>;

export function SemanticPrestageSection({
  sectionOptions,
  snapshots,
}: SemanticPrestageSectionProps) {
  const [selectedClientSlug, setSelectedClientSlug] = useState(
    snapshots[0]?.clientSlug ?? "",
  );
  const [selectedComponents, setSelectedComponents] =
    useState<SelectedComponents>({});
  const [stagingPageId, setStagingPageId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const selectedSnapshot =
    snapshots.find((snapshot) => snapshot.clientSlug === selectedClientSlug) ??
    snapshots[0];
  const pageBlueprints = useMemo(
    () => buildPageBlueprints(selectedSnapshot),
    [selectedSnapshot],
  );
  const totalSections = pageBlueprints.reduce(
    (count, page) => count + page.sections.length,
    0,
  );

  function updateSelectedComponent(
    pageId: string,
    sectionId: string,
    component: string,
  ) {
    setSelectedComponents((currentSelections) => ({
      ...currentSelections,
      [pageId]: {
        ...currentSelections[pageId],
        [sectionId]: component,
      },
    }));
    setStatus("");
    setError("");
  }

  async function stagePage(page: PageBlueprint) {
    if (!selectedSnapshot) {
      setError("Save a strategy snapshot before staging pages.");
      return;
    }

    setStagingPageId(page.pageId);
    setStatus("");
    setError("");

    try {
      const response = await fetch("/api/staged-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSlug: selectedSnapshot.clientSlug,
          pageLabel: page.label,
          pageSlug: page.pageId,
          pageType: getPageType(page.pageId),
          sections: page.sections.map((section, index) =>
            buildSelectedSection(
              page.pageId,
              section,
              index,
              selectedComponents,
              sectionOptions,
            ),
          ),
          templateName: `${page.label} semantic blueprint`,
        }),
      });
      const result = (await response.json()) as StagePageResponse;

      if (!response.ok || !result.ok) {
        setError(
          result.ok
            ? "Page staging failed."
            : result.error ?? "Page staging failed.",
        );
        return;
      }

      setStatus(`${result.page.pageLabel} is staged from its semantic blueprint.`);
    } catch {
      setError("Page staging failed.");
    } finally {
      setStagingPageId("");
    }
  }

  return (
    <section className="min-h-svh bg-bg-surface text-service-ink">
      <SevenColumnGrid minHeight="none" padding="med">
        <SevenColumnGridItem className="col-start-2 col-span-4 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <p className="type-label text-service-accent">Pageworks Pre-Stage</p>
          <h1 className="type-display-lg mt-eyebrow-display text-service-ink">
            Semantic Page Blueprint
          </h1>
          <p className="type-text-xl wrap-pretty mt-display-body text-service-muted">
            Turn saved strategy and page copy into semantic page blueprints,
            choose layouts section by section, then stage the final page.
          </p>
          <div className="mt-body-actions-md flex flex-wrap gap-2">
            <StatusPill label={`${pageBlueprints.length} pages`} />
            <StatusPill label={`${totalSections} blueprint sections`} />
            <StatusPill label={`${sectionOptions.length} layout options`} />
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-start-2 col-span-5 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          {snapshots.length > 0 ? (
            <Card className="mb-5 p-5 shadow-none">
              <label className="type-caption font-semibold text-service-ink">
                Strategy snapshot
                <select
                  className="mt-2 block min-h-11 w-full max-w-lg rounded-sm border border-service-border bg-white px-3 text-sm font-normal text-service-ink outline-none transition-colors focus:border-service-accent"
                  value={selectedClientSlug}
                  onChange={(event) => {
                    setSelectedClientSlug(event.target.value);
                    setStatus("");
                    setError("");
                  }}
                >
                  {snapshots.map((snapshot) => (
                    <option key={snapshot.id} value={snapshot.clientSlug}>
                      {snapshot.clientSlug} v{snapshot.version} -{" "}
                      {snapshot.pages.filter((page) => page.detected).length} pages
                    </option>
                  ))}
                </select>
              </label>
            </Card>
          ) : null}

          {status || error ? (
            <div
              className={`mb-5 rounded-sm border px-4 py-3 ${
                error
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-service-border bg-white text-service-muted"
              }`}
              role="status"
            >
              <p className="type-caption">{error || status}</p>
              {status ? (
                <div className="mt-3">
                  <Button href="/dev/staged-pages" variant="secondary">
                    Open Staged Pages
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

          {pageBlueprints.length > 0 ? (
            <div className="grid gap-6">
              {pageBlueprints.map((page) => (
                <Card className="p-5 shadow-none" key={page.pageId}>
                  <div className="grid gap-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="fluid-type-frame min-w-0 flex-1">
                        <p className="type-label text-service-accent">
                          {page.path}
                        </p>
                        <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                          {page.label}
                        </h2>
                        <p className="type-text-sm wrap-pretty mt-heading-body-sm max-w-none text-service-muted">
                          {page.sections.length} semantic sections detected
                          from saved page copy.
                        </p>
                      </div>
                      <button
                        className="radius-button inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap border border-service-accent bg-service-accent px-6 py-2 text-sm font-semibold text-white transition duration-200 ease-out hover:bg-service-accent-strong disabled:cursor-wait disabled:opacity-60"
                        disabled={stagingPageId === page.pageId}
                        onClick={() => stagePage(page)}
                        type="button"
                      >
                        {stagingPageId === page.pageId
                          ? "Staging..."
                          : "Stage Page"}
                      </button>
                    </div>

                    <div className="grid grid-cols-[minmax(0,1fr)_minmax(24rem,34rem)] gap-5 max-xl:grid-cols-1">
                      <div className="grid content-start gap-3">
                        {page.sections.map((section, index) => {
                          const options = getOptionsForMode(
                            section.mode,
                            sectionOptions,
                          );
                          const selectedOption = getSelectedOption(
                            page.pageId,
                            section,
                            selectedComponents,
                            sectionOptions,
                          );

                          return (
                            <div
                              className="grid gap-4 rounded-sm border border-service-border bg-service-surface p-3"
                              key={section.id}
                            >
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                  <p className="type-caption font-semibold text-service-accent">
                                    {index + 1}. {section.mode}
                                  </p>
                                  {section.sourceRole ? (
                                    <p className="type-caption text-service-muted">
                                      Source: {section.sourceRole}
                                    </p>
                                  ) : null}
                                </div>
                                <h3 className="mt-2 text-base font-semibold text-service-ink">
                                  {section.title}
                                </h3>
                                <p className="type-caption mt-2 line-clamp-3 text-service-muted">
                                  {section.summary || selectedOption?.instruction}
                                </p>
                              </div>
                              <label className="type-caption font-semibold text-service-ink">
                                Layout
                                <select
                                  className="mt-2 block min-h-11 w-full rounded-sm border border-service-border bg-white px-3 text-sm font-normal text-service-ink outline-none transition-colors focus:border-service-accent"
                                  value={selectedOption?.component ?? ""}
                                  onChange={(event) =>
                                    updateSelectedComponent(
                                      page.pageId,
                                      section.id,
                                      event.target.value,
                                    )
                                  }
                                >
                                  {options.map((option) => (
                                    <option
                                      key={option.component}
                                      value={option.component}
                                    >
                                      {option.name}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                      <div className="sticky top-4 self-start max-xl:static">
                        <SectionPreviewCanvas
                          pageLabel={page.label}
                          sections={buildPreviewSections(
                            page,
                            selectedComponents,
                            sectionOptions,
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 shadow-none">
              <p className="type-label text-service-accent">No blueprints yet</p>
              <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                Save strategy page copy first.
              </h2>
              <p className="type-text-md wrap-pretty mt-heading-body-md text-service-muted">
                Page blueprints appear here after the strategy workspace has
                saved page copy with semantic roles.
              </p>
              <div className="mt-body-actions-md">
                <Button href="/dev/projects">Open Projects</Button>
              </div>
            </Card>
          )}
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

function buildPageBlueprints(snapshot?: StrategySnapshot): PageBlueprint[] {
  if (!snapshot) {
    return [];
  }

  return snapshot.pages
    .filter((page) => page.detected)
    .map((page) => {
      const copy = snapshot.fields[page.copyField];
      const blueprint = buildSemanticPageBlueprint(copy);

      return {
        label: page.label,
        pageId: page.id,
        path: page.path,
        sections: blueprint.sections,
      };
    })
    .filter((page) => page.sections.length > 0);
}

function buildSelectedSection(
  pageId: string,
  section: SemanticBlueprintSection,
  index: number,
  selectedComponents: SelectedComponents,
  sectionOptions: SemanticSectionOption[],
) {
  const option = getSelectedOption(
    pageId,
    section,
    selectedComponents,
    sectionOptions,
  );

  return {
    component: option?.component ?? "",
    instruction: [section.summary, option?.instruction].filter(Boolean).join("\n\n"),
    mode: section.mode,
    name: section.title,
    originalComponent: option?.component,
    originalIndex: index,
  };
}

function buildPreviewSections(
  page: PageBlueprint,
  selectedComponents: SelectedComponents,
  sectionOptions: SemanticSectionOption[],
) {
  return page.sections.map((section) => {
    const option = getSelectedOption(
      page.pageId,
      section,
      selectedComponents,
      sectionOptions,
    );

    return {
      component: option?.component ?? "",
      mode: section.mode,
      name: section.title,
    };
  });
}

function getSelectedOption(
  pageId: string,
  section: SemanticBlueprintSection,
  selectedComponents: SelectedComponents,
  sectionOptions: SemanticSectionOption[],
) {
  const selectedComponent = selectedComponents[pageId]?.[section.id];
  const options = getOptionsForMode(section.mode, sectionOptions);

  return (
    options.find((option) => option.component === selectedComponent) ??
    options[0] ??
    sectionOptions[0]
  );
}

function getOptionsForMode(
  mode: SemanticSectionLabel,
  sectionOptions: SemanticSectionOption[],
) {
  return sectionOptions.filter((option) => option.mode === mode);
}

function getPageType(pageId: string) {
  return pageId === "home" ? "homepage" : pageId;
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="type-caption rounded-sm border border-service-border bg-white px-3 py-1 text-service-muted">
      {label}
    </span>
  );
}

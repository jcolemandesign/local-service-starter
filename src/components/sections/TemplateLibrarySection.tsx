"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import { DownArrowIcon } from "@/components/primitives";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives/SevenColumnGrid";
import {
  getDefaultPageLabel,
  getDefaultPageSlug,
  getPageTypeRelationshipLabel,
  getPathFromSlugForPageType,
  isRepeatablePageType,
  slugify,
} from "@/utils/strategy-site-map";
import type { StrategySnapshotSummary } from "@/utils/strategy-snapshots";
import { buildTemplateCopyContract } from "@/utils/template-copy-contract";

export type PageTemplateSummary = {
  id: string;
  name: string;
  notes?: string;
  pageType: string;
  promotedAt: string;
  sectionCount: number;
  sections: Array<{
    cardFill?: import("@/content/section-color-recipes").SectionCardFill;
    colorRecipe?: import("@/content/section-color-recipes").SectionColorRecipe;
    component: string;
    instruction?: string;
    mode: string;
    name: string;
    originalComponent?: string;
    originalIndex?: number;
    reduceBottomPadding?: boolean;
    reduceTopPadding?: boolean;
    ratio?: string;
    variant?: string;
  }>;
  sourceOptionName: string;
  sourceRecipeId: string;
  sourceRecipeName: string;
};

type TemplateLibrarySectionProps = {
  stagedTemplateAssignments: StagedTemplateAssignment[];
  strategySnapshots: StrategySnapshotSummary[];
  templates: PageTemplateSummary[];
};

type CreatePageResponse =
  | {
      ok: true;
      page: {
        pageId: string;
        pageLabel: string;
        previewHref: string;
      };
    }
  | { ok: false; error?: string };

type DeleteTemplateResponse =
  | {
      ok: true;
      templateId: string;
    }
  | { ok: false; error?: string };

type RenameTemplateResponse =
  | { ok: true; template: PageTemplateSummary }
  | { ok: false; error?: string };

type SendTemplateToPagebuilderResponse =
  | {
      ok: true;
      option: {
        sectionCount: number;
      };
    }
  | { ok: false; error?: string };

type TemplateDraft = {
  label: string;
  slug: string;
};

type StagedTemplateFeedback = {
  pageLabel: string;
  previewHref: string;
};

type StagedTemplateAssignment = {
  clientSlug: string;
  pageHref: string;
  pageId: string;
  pageLabel: string;
  previewHref: string;
  templateId: string;
};

export function TemplateLibrarySection({
  stagedTemplateAssignments,
  strategySnapshots,
  templates,
}: TemplateLibrarySectionProps) {
  const [localTemplates, setLocalTemplates] = useState(templates);
  const [selectedClientSlug, setSelectedClientSlug] = useState(
    strategySnapshots[0]?.clientSlug ?? "",
  );
  const [drafts, setDrafts] = useState<Record<string, TemplateDraft>>(() =>
    Object.fromEntries(
      localTemplates.map((template) => [
        template.id,
        {
          label: getDefaultPageLabel(template.pageType, template.name),
          slug: getDefaultPageSlug(template.pageType, template.name),
        },
      ]),
    ),
  );
  const [submittingTemplateId, setSubmittingTemplateId] = useState("");
  const [openContractTemplateId, setOpenContractTemplateId] = useState("");
  const [copiedContractTemplateId, setCopiedContractTemplateId] = useState("");
  const [deleteCandidate, setDeleteCandidate] =
    useState<PageTemplateSummary | null>(null);
  const [renameCandidate, setRenameCandidate] =
    useState<PageTemplateSummary | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [pagebuilderCandidate, setPagebuilderCandidate] =
    useState<PageTemplateSummary | null>(null);
  const [deletingTemplateId, setDeletingTemplateId] = useState("");
  const [renamingTemplateId, setRenamingTemplateId] = useState("");
  const [sendingTemplateId, setSendingTemplateId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [stagedTemplateFeedback, setStagedTemplateFeedback] = useState<
    Record<string, StagedTemplateFeedback>
  >({});
  const activeClientSlug =
    selectedClientSlug || strategySnapshots[0]?.clientSlug || "";
  const activeAssignments = stagedTemplateAssignments.filter(
    (assignment) => assignment.clientSlug === activeClientSlug,
  );
  const assignmentsByTemplateId = groupAssignmentsByTemplateId(activeAssignments);
  const templateGroups = useMemo(
    () => groupTemplatesByPageType(localTemplates),
    [localTemplates],
  );

  const totalSections = localTemplates.reduce(
    (sectionCount, template) => sectionCount + template.sectionCount,
    0,
  );
  const stagedTemplateCount = assignmentsByTemplateId.size;

  function updateDraft(templateId: string, draft: Partial<TemplateDraft>) {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [templateId]: {
        ...currentDrafts[templateId],
        ...draft,
      },
    }));
    setStatus("");
    setError("");
    setStagedTemplateFeedback((currentFeedback) => {
      const nextFeedback = { ...currentFeedback };
      delete nextFeedback[templateId];

      return nextFeedback;
    });
  }

  async function copyTemplateContract(template: PageTemplateSummary) {
    const contract = getTemplateContract(template);

    setCopiedContractTemplateId("");
    setStatus("");
    setError("");

    if (!navigator.clipboard?.writeText) {
      setError("Clipboard access is unavailable in this browser.");
      return;
    }

    try {
      await navigator.clipboard.writeText(contract);
      setCopiedContractTemplateId(template.id);
      setOpenContractTemplateId(template.id);
      setStatus(`Template copy contract copied for ${template.name}.`);
    } catch {
      setError("Template copy contract could not be copied.");
    }
  }

  function getTemplateContract(template: PageTemplateSummary) {
    const draft = drafts[template.id] ?? {
      label: getDefaultPageLabel(template.pageType, template.name),
      slug: getDefaultPageSlug(template.pageType, template.name),
    };
    const selectedSnapshot = strategySnapshots.find(
      (snapshot) => snapshot.clientSlug === activeClientSlug,
    );

    return buildTemplateCopyContract({
      pageLabel: draft.label,
      pageSlug: draft.slug,
      strategySnapshot: selectedSnapshot,
      template,
    });
  }

  async function stageTemplate(template: PageTemplateSummary) {
    const draft = drafts[template.id];

    setSubmittingTemplateId(template.id);
    setStatus("");
    setError("");
    setStagedTemplateFeedback((currentFeedback) => {
      const nextFeedback = { ...currentFeedback };
      delete nextFeedback[template.id];

      return nextFeedback;
    });

    try {
      const response = await fetch("/api/staged-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSlug: activeClientSlug,
          pageLabel: draft?.label ?? template.name,
          pageSlug:
            draft?.slug ?? getDefaultPageSlug(template.pageType, template.name),
          templateId: template.id,
        }),
      });
      const result = (await response.json()) as CreatePageResponse;

      if (!response.ok || !result.ok) {
        setError(
          result.ok ? "Page staging failed." : result.error ?? "Page staging failed.",
        );
        return;
      }

      setStatus(
        `Template applied. ${result.page.pageLabel} is now staged and ready to edit.`,
      );
      setStagedTemplateFeedback((currentFeedback) => ({
        ...currentFeedback,
        [template.id]: {
          pageLabel: result.page.pageLabel,
          previewHref: result.page.previewHref,
        },
      }));
    } catch {
      setError("Page staging failed.");
    } finally {
      setSubmittingTemplateId("");
    }
  }

  async function deleteTemplate(template: PageTemplateSummary) {
    setDeletingTemplateId(template.id);
    setStatus("");
    setError("");

    try {
      const response = await fetch("/api/page-templates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
        }),
      });
      const result = (await response.json()) as DeleteTemplateResponse;

      if (!response.ok || !result.ok) {
        setError(
          result.ok
            ? "Template deletion failed."
            : result.error ?? "Template deletion failed.",
        );
        return;
      }

      setLocalTemplates((currentTemplates) =>
        currentTemplates.filter((currentTemplate) => currentTemplate.id !== template.id),
      );
      setDrafts((currentDrafts) => {
        const nextDrafts = { ...currentDrafts };
        delete nextDrafts[template.id];

        return nextDrafts;
      });
      setOpenContractTemplateId((currentId) =>
        currentId === template.id ? "" : currentId,
      );
      setCopiedContractTemplateId((currentId) =>
        currentId === template.id ? "" : currentId,
      );
      setStagedTemplateFeedback((currentFeedback) => {
        const nextFeedback = { ...currentFeedback };
        delete nextFeedback[template.id];

        return nextFeedback;
      });
      setDeleteCandidate(null);
      setStatus(`Deleted template ${template.name}.`);
    } catch {
      setError("Template deletion failed.");
    } finally {
      setDeletingTemplateId("");
    }
  }

  async function renameTemplate(template: PageTemplateSummary) {
    const name = renameValue.trim();

    if (!name) {
      setError("Enter a template name.");
      return;
    }

    setRenamingTemplateId(template.id);
    setStatus("");
    setError("");

    try {
      const response = await fetch("/api/page-templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id, name }),
      });
      const result = (await response.json()) as RenameTemplateResponse;

      if (!response.ok || !result.ok) {
        setError(
          result.ok
            ? "Template rename failed."
            : result.error ?? "Template rename failed.",
        );
        return;
      }

      setLocalTemplates((currentTemplates) =>
        currentTemplates.map((currentTemplate) =>
          currentTemplate.id === template.id ? result.template : currentTemplate,
        ),
      );
      setRenameCandidate(null);
      setStatus(`Renamed template to ${result.template.name}.`);
    } catch {
      setError("Template rename failed.");
    } finally {
      setRenamingTemplateId("");
    }
  }

  async function sendTemplateToPagebuilder(template: PageTemplateSummary) {
    if (!template.sourceRecipeId) {
      setError("This template is missing its Pagebuilder source.");
      return;
    }

    setSendingTemplateId(template.id);
    setStatus("");
    setError("");

    try {
      const response = await fetch("/api/pagebuilder-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designStyle: {
            showSectionMarkers: false,
            viewportId: "main",
          },
          optionIndex: 0,
          optionName: "Page Layout",
          recipeId: template.sourceRecipeId,
          recipeName: template.sourceRecipeName,
          sections: template.sections.map((section, index) => ({
            component: section.component,
            id: `${template.sourceRecipeId}-template-${template.id}-${index}`,
            included: true,
            instruction: section.instruction ?? "",
            mode: section.mode,
            name: section.name,
            originalComponent: section.originalComponent ?? section.component,
            originalIndex:
              typeof section.originalIndex === "number"
                ? section.originalIndex
                : index,
            reduceBottomPadding: section.reduceBottomPadding ?? false,
            reduceTopPadding: section.reduceTopPadding ?? false,
            cardFill: section.cardFill,
            colorRecipe: section.colorRecipe,
            ratio: section.ratio,
            variant: section.variant,
          })),
        }),
      });
      const result =
        (await response.json()) as SendTemplateToPagebuilderResponse;

      if (!response.ok || !result.ok) {
        setError(
          result.ok
            ? "Template could not be sent to Pagebuilder."
            : result.error ?? "Template could not be sent to Pagebuilder.",
        );
        return;
      }

      setStatus(
        `${template.name} sent to Pagebuilder with ${result.option.sectionCount} sections.`,
      );
      setPagebuilderCandidate(null);
    } catch {
      setError("Template could not be sent to Pagebuilder.");
    } finally {
      setSendingTemplateId("");
    }
  }

  return (
    <section className="template-library-chrome token-chrome min-h-svh">
      <SevenColumnGrid minHeight="none" padding="med">
        <SevenColumnGridItem className="col-start-2 col-span-4 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <p className="type-label text-service-accent">Pageworks Templates</p>
          <h1 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
            Template Library
          </h1>
          <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
            Reusable page layouts promoted from Pagebuilder options. Use a
            template to stage a page from the latest saved strategy snapshot.
          </p>
          <div className="mt-body-actions-md flex flex-wrap gap-2">
            <StatusPill label={`${localTemplates.length} templates`} />
            <StatusPill label={`${totalSections} saved sections`} />
            <StatusPill label={`${stagedTemplateCount} active on staging`} />
            {strategySnapshots[0] ? (
              <StatusPill
                label={`Latest strategy ${strategySnapshots[0].clientSlug} v${strategySnapshots[0].version}`}
              />
            ) : (
              <StatusPill label="No saved strategy snapshot" />
            )}
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-start-2 col-span-5 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          {strategySnapshots.length > 0 ? (
            <Card className="mb-5 bg-white p-5 shadow-none">
              <label className="type-caption font-semibold text-service-ink">
                Strategy snapshot
                <select
                  className="mt-2 block min-h-11 w-full max-w-lg rounded-sm border border-service-border bg-white px-3 text-sm font-normal text-service-ink outline-none transition-colors focus:border-service-accent"
                  value={activeClientSlug}
                  onChange={(event) => {
                    setSelectedClientSlug(event.target.value);
                    setStatus("");
                    setError("");
                  }}
                >
                  {strategySnapshots.map((snapshot) => (
                    <option key={snapshot.id} value={snapshot.clientSlug}>
                      {snapshot.clientSlug} v{snapshot.version} -{" "}
                      {snapshot.pageCount} pages
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
                  <Button
                    href={
                      status.includes("Pagebuilder")
                        ? "/dev/pagebuilder"
                        : "/dev/staged-pages"
                    }
                    variant="secondary"
                  >
                    {status.includes("Pagebuilder")
                      ? "Open Pagebuilder"
                      : "Open Staged Pages"}
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

          {localTemplates.length > 0 ? (
            <div className="grid gap-5">
              {templateGroups.map((group) => (
                <details
                  className="token-chrome-panel group/template-group overflow-hidden rounded-[var(--chrome-radius-panel)] border"
                  key={group.pageType}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 marker:hidden">
                    <span>
                      <span className="token-chrome-accent type-label">
                        {group.pageType}
                      </span>
                      <span className="type-heading-sm mt-1 block text-[var(--chrome-text)]">
                        {group.templates.length}{" "}
                        {group.templates.length === 1 ? "template" : "templates"}
                      </span>
                      <span className="token-chrome-muted type-caption mt-2 block">
                        {countAssignmentsForTemplates(
                          group.templates,
                          assignmentsByTemplateId,
                        )}{" "}
                        active on staging
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="token-chrome-muted type-caption font-semibold">
                        <span className="group-open/template-group:hidden">Closed</span>
                        <span className="hidden group-open/template-group:inline">Open</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="token-chrome-badge flex size-8 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-transform group-open/template-group:rotate-180"
                      >
                        <DownArrowIcon className="size-4" />
                      </span>
                    </span>
                  </summary>
                  <div className="grid grid-cols-2 items-start gap-5 border-t border-service-border p-5 max-lg:grid-cols-1">
                    {group.templates.map((template) => {
                      const draft = drafts[template.id] ?? {
                        label: getDefaultPageLabel(template.pageType, template.name),
                        slug: getDefaultPageSlug(template.pageType, template.name),
                      };
                      const isSubmitting = submittingTemplateId === template.id;
                      const isContractOpen = openContractTemplateId === template.id;
                      const isContractCopied =
                        copiedContractTemplateId === template.id;
                      const contract = isContractOpen
                        ? getTemplateContract(template)
                        : "";
                      const stagedFeedback = stagedTemplateFeedback[template.id];
                      const activeAssignmentsForTemplate =
                        assignmentsByTemplateId.get(template.id) ?? [];
                      const activeAssignment = activeAssignmentsForTemplate[0];
                      const isRepeatable = isRepeatablePageType(template.pageType);
                      const relationshipLabel = getPageTypeRelationshipLabel(
                        template.pageType,
                      );
                      const publicPath = getPathFromSlugForPageType(
                        draft.slug,
                        template.pageType,
                      );
                      const mismatchWarning = getRepeatableMismatchWarning(
                        template.pageType,
                        draft.label,
                        draft.slug,
                      );

                      return (
                        <Card className="token-chrome-card overflow-hidden rounded-[var(--chrome-radius-control)] border shadow-none" key={template.id}>
                          <details className="group/template relative">
                            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 marker:hidden">
                              <span className="flex min-w-0 items-center gap-2">
                                {activeAssignment ? (
                                  <>
                                    <span
                                      aria-hidden="true"
                                      className="size-2.5 shrink-0 rounded-full bg-service-accent"
                                      title="Active on staging"
                                    />
                                    <span className="sr-only">Active on staging</span>
                                  </>
                                ) : null}
                                <span className="type-heading-sm block text-[var(--chrome-text)]">
                                  {template.name}
                                </span>
                              </span>
                              <span className="flex shrink-0 items-center gap-3">
                                <button
                                  aria-label={`Delete ${template.name}`}
                                  className="flex size-9 items-center justify-center rounded-[var(--chrome-radius-control)] border border-red-300/60 bg-red-950/30 text-red-100 transition-colors hover:border-red-300 hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
                                  disabled={deletingTemplateId === template.id}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setDeleteCandidate(template);
                                  }}
                                  title="Delete template"
                                  type="button"
                                >
                                  <TrashIcon />
                                </button>
                                <button
                                  aria-label={`Rename ${template.name}`}
                                  className="token-chrome-control flex size-9 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setRenameCandidate(template);
                                    setRenameValue(template.name);
                                    setStatus("");
                                    setError("");
                                  }}
                                  title="Rename template"
                                  type="button"
                                >
                                  <RenameIcon />
                                </button>
                                <button
                                  aria-label={`Copy ${template.name} contract`}
                                  className="token-chrome-control flex size-9 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    void copyTemplateContract(template);
                                  }}
                                  title="Copy contract"
                                  type="button"
                                >
                                  <CopyIcon />
                                </button>
                                <button
                                  aria-label={`Send ${template.name} to Pagebuilder`}
                                  className="token-chrome-control flex size-9 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors disabled:cursor-wait disabled:opacity-60"
                                  disabled={sendingTemplateId === template.id}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setPagebuilderCandidate(template);
                                    setStatus("");
                                    setError("");
                                  }}
                                  title="Send to Pagebuilder"
                                  type="button"
                                >
                                  <PagebuilderIcon />
                                </button>
                                <Link
                                  aria-label={`Preview ${template.name}`}
                                  className="token-chrome-control flex size-9 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors"
                                  href={`/dev/templates/${template.id}`}
                                  onClick={(event) => event.stopPropagation()}
                                  target="_blank"
                                  title="Preview template"
                                >
                                  <PreviewIcon />
                                </Link>
                                <button
                                  aria-controls={`template-use-${template.id}`}
                                  aria-label={`Use ${template.name}`}
                                  className="flex size-9 items-center justify-center rounded-[var(--chrome-radius-control)] border border-service-accent bg-service-accent text-white transition-colors hover:border-white hover:bg-service-ink"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();

                                    const details = event.currentTarget.closest(
                                      "details",
                                    );

                                    if (details) {
                                      details.open = true;
                                    }

                                    window.requestAnimationFrame(() => {
                                      document
                                        .getElementById(
                                          `template-use-${template.id}`,
                                        )
                                        ?.scrollIntoView({
                                          behavior: "smooth",
                                          block: "center",
                                        });
                                    });
                                  }}
                                  title="Use template"
                                  type="button"
                                >
                                  <UseTemplateIcon />
                                </button>
                                <span
                                  aria-hidden="true"
                                  className="token-chrome-badge flex size-9 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-transform group-open/template:rotate-180"
                                >
                                  <DownArrowIcon className="size-4" />
                                </span>
                              </span>
                            </summary>

                            <div className="token-chrome-control grid gap-5 border-t p-5">
                              <div className="grid gap-5">
                                <div className="grid gap-5">
                                  <div className="fluid-type-frame">
                                    <div className="flex flex-wrap gap-2">
                                      <StatusPill
                                        label={`${template.sectionCount} sections`}
                                      />
                                      <StatusPill label={relationshipLabel} />
                                      <StatusPill label={template.id} />
                                      {activeAssignment ? (
                                        <StatusPill
                                          label={
                                            isRepeatable
                                              ? `${activeAssignmentsForTemplate.length} staged`
                                              : "Active on staging"
                                          }
                                        />
                                      ) : null}
                                    </div>
                                    <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                                      Promoted from {template.sourceRecipeName} /{" "}
                                      {template.sourceOptionName} on{" "}
                                      {formatDate(template.promotedAt)}.
                                    </p>
                                    {template.notes ? (
                                      <p className="type-caption mt-3 text-service-muted">
                                        {template.notes}
                                      </p>
                                    ) : null}
                                  </div>

                                  {isRepeatable &&
                                  activeAssignmentsForTemplate.length > 0 ? (
                                    <div className="rounded-sm border border-green-200 bg-green-50 p-3">
                                      <p className="type-caption font-semibold text-green-800">
                                        Staged pages using this repeatable template
                                      </p>
                                      <div className="mt-2 flex flex-wrap gap-2">
                                        {activeAssignmentsForTemplate.map(
                                          (assignment) => (
                                            <Link
                                              className="type-caption rounded-sm border border-green-200 bg-white px-3 py-1 font-semibold text-green-800 transition-colors hover:border-service-accent hover:text-service-accent"
                                              href={assignment.previewHref}
                                              key={assignment.pageId}
                                            >
                                              {assignment.pageLabel}
                                            </Link>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  ) : null}

                                  <details className="rounded-sm border border-service-border bg-white">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 marker:hidden">
                                      <span className="type-caption font-semibold text-service-ink">
                                        Sections
                                      </span>
                                      <span className="type-caption text-service-muted">
                                        {template.sections.length}
                                      </span>
                                    </summary>
                                    <div className="grid gap-2 border-t border-service-border p-3">
                                      {template.sections.map((section, index) => (
                                        <div
                                          className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3 rounded-sm border border-service-border bg-service-surface px-3 py-2 max-md:grid-cols-1"
                                          key={`${template.id}-${section.component}-${index}`}
                                        >
                                          <span className="type-caption font-semibold text-service-accent">
                                            {index + 1}. {section.mode}
                                          </span>
                                          <span className="type-caption text-service-muted">
                                            {section.name}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </details>

                                  <div
                                    className="grid gap-3 rounded-sm border border-service-border bg-white p-4"
                                    id={`template-use-${template.id}`}
                                  >
                                    <label className="type-caption font-semibold text-service-ink">
                                      Staged page name
                                      <input
                                        className="mt-2 block min-h-11 w-full rounded-sm border border-service-border bg-white px-3 text-sm font-normal text-service-ink outline-none transition-colors focus:border-service-accent"
                                        value={draft.label}
                                        onChange={(event) => {
                                          const nextLabel = event.target.value;

                                          updateDraft(template.id, {
                                            label: nextLabel,
                                            slug: slugify(nextLabel),
                                          });
                                        }}
                                      />
                                    </label>
                                    <label className="type-caption font-semibold text-service-ink">
                                      Intended route slug
                                      <input
                                        className="mt-2 block min-h-11 w-full rounded-sm border border-service-border bg-white px-3 text-sm font-normal text-service-ink outline-none transition-colors focus:border-service-accent"
                                        value={draft.slug}
                                        onChange={(event) =>
                                          updateDraft(template.id, {
                                            slug: slugify(event.target.value),
                                          })
                                        }
                                      />
                                    </label>
                                    <div className="rounded-sm border border-service-border bg-service-surface px-3 py-2">
                                      <p className="type-caption font-semibold text-service-ink">
                                        Public path preview
                                      </p>
                                      <p className="mt-1 break-all font-mono text-xs text-service-muted">
                                        {publicPath}
                                      </p>
                                    </div>
                                    {isRepeatable ? (
                                      <div className="grid gap-2">
                                        <p className="type-caption rounded-sm border border-amber-200 bg-amber-50 px-3 py-2 font-semibold text-amber-800">
                                          Stage this once per real{" "}
                                          {getRepeatableInstanceLabel(
                                            template.pageType,
                                          )}. Reusing the same slug updates that
                                          existing staged page.
                                        </p>
                                        {mismatchWarning ? (
                                          <p className="type-caption rounded-sm border border-red-200 bg-red-50 px-3 py-2 font-semibold text-red-700">
                                            {mismatchWarning}
                                          </p>
                                        ) : null}
                                      </div>
                                    ) : null}
                                  </div>

                                  <div className="grid gap-3 border-t border-service-border pt-5">
                                    <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
                                      <div className="grid gap-2">
                                        <button
                                          className="radius-4 min-h-11 border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                                          onClick={() => {
                                            setOpenContractTemplateId(
                                              isContractOpen ? "" : template.id,
                                            );
                                            setStatus("");
                                            setError("");
                                          }}
                                          type="button"
                                        >
                                          {isContractOpen
                                            ? "Hide Contract"
                                            : "Show Contract"}
                                        </button>
                                        <button
                                          className="radius-4 min-h-11 border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                                          onClick={() =>
                                            void copyTemplateContract(template)
                                          }
                                          type="button"
                                        >
                                          {isContractCopied
                                            ? "Copied"
                                            : "Copy Contract"}
                                        </button>
                                      </div>
                                      <div className="grid gap-2">
                                        <Link
                                          className="radius-4 inline-flex min-h-11 items-center justify-center border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                                          href={`/dev/templates/${template.id}`}
                                          target="_blank"
                                        >
                                          Preview
                                        </Link>
                                        <button
                                          className="radius-4 min-h-11 border border-service-accent bg-white px-4 text-sm font-semibold text-service-accent transition-colors hover:border-service-ink hover:text-service-ink disabled:cursor-wait disabled:opacity-60"
                                          disabled={
                                            sendingTemplateId === template.id
                                          }
                                          onClick={() => {
                                            setPagebuilderCandidate(template);
                                            setStatus("");
                                            setError("");
                                          }}
                                          type="button"
                                        >
                                          {sendingTemplateId === template.id
                                            ? "Sending..."
                                            : "Send to Pagebuilder"}
                                        </button>
                                      </div>
                                    </div>
                                    {!isRepeatable && activeAssignment ? (
                                      <Link
                                        className="radius-4 inline-flex min-h-11 items-center justify-center border border-emerald-400/35 bg-emerald-950/30 px-4 text-sm font-semibold text-emerald-100 transition-colors hover:border-emerald-300 hover:bg-emerald-900/50"
                                        href={activeAssignment.previewHref}
                                      >
                                        Open {activeAssignment.pageLabel}
                                      </Link>
                                    ) : null}
                                    {isContractOpen ? (
                                      <textarea
                                        className="min-h-72 resize-y rounded-sm border border-service-border bg-white px-3 py-3 font-mono text-xs leading-5 text-service-ink outline-none focus:border-service-accent"
                                        onFocus={(event) =>
                                          event.currentTarget.select()
                                        }
                                        readOnly
                                        value={contract}
                                      />
                                    ) : null}
                                  <button
                                    className="radius-4 min-h-11 border border-emerald-400 bg-emerald-600 px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.18)] transition-colors hover:border-emerald-300 hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60"
                                    disabled={isSubmitting || !activeClientSlug}
                                    onClick={() => void stageTemplate(template)}
                                    type="button"
                                  >
                                    {isSubmitting
                                      ? "Staging..."
                                      : isRepeatable
                                        ? "Stage Child Page"
                                        : "Use Template"}
                                  </button>
                                  </div>
                                </div>
                              </div>

                              {stagedFeedback ? (
                                <div
                                  className="rounded-sm border border-emerald-400/35 bg-emerald-950/30 px-4 py-3 text-emerald-100"
                                  role="status"
                                >
                                  <p className="type-caption font-semibold">
                                    Template applied. {stagedFeedback.pageLabel} is
                                    now staged and ready to edit.
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <Link
                                      className="radius-4 inline-flex min-h-10 items-center justify-center border border-emerald-400/35 bg-emerald-950/35 px-4 text-sm font-semibold text-emerald-100 transition-colors hover:border-emerald-300 hover:bg-emerald-900/50"
                                      href={stagedFeedback.previewHref}
                                    >
                                      Open staged page
                                    </Link>
                                    <Link
                                      className="radius-4 inline-flex min-h-10 items-center justify-center border border-emerald-400/35 bg-emerald-950/35 px-4 text-sm font-semibold text-emerald-100 transition-colors hover:border-emerald-300 hover:bg-emerald-900/50"
                                      href="/dev/staged-pages"
                                    >
                                      Open staged pages
                                    </Link>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </details>
                        </Card>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <Card className="token-chrome-panel rounded-[var(--chrome-radius-panel)] border p-6 shadow-none">
              <p className="token-chrome-accent type-label">No templates yet</p>
              <h2 className="type-heading-md mt-eyebrow-heading-sm text-[var(--chrome-text)]">
                Promote a Pagebuilder layout first.
              </h2>
              <p className="token-chrome-muted type-text-md wrap-pretty mt-heading-body-md">
                Go to Pagebuilder, choose a page type, then use Promote
                to Template. Promoted templates will appear here.
              </p>
              <div className="mt-body-actions-md">
                <Button href="/dev/pagebuilder">Open Pagebuilder</Button>
              </div>
            </Card>
          )}
        </SevenColumnGridItem>
      </SevenColumnGrid>
      {deleteCandidate ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-service-ink/45 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteCandidate(null);
            }
          }}
        >
          <div
            aria-labelledby="delete-template-title"
            aria-modal="true"
            className="w-full max-w-md rounded-md border border-service-border bg-white p-6 text-service-ink shadow-service"
            role="dialog"
          >
            <p className="type-label text-red-700">Delete template</p>
            <h2
              className="type-heading-sm mt-eyebrow-heading-sm text-service-ink"
              id="delete-template-title"
            >
              Delete {deleteCandidate.name}?
            </h2>
            <p className="type-text-sm mt-heading-body-sm text-service-muted">
              This removes the saved template from the library. Staged pages that
              already use it are not deleted.
            </p>
            <div className="mt-body-actions-md flex justify-end gap-3">
              <button
                className="radius-4 min-h-10 border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                disabled={Boolean(deletingTemplateId)}
                onClick={() => setDeleteCandidate(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="radius-4 min-h-10 border border-red-700 bg-red-700 px-4 text-sm font-semibold text-white transition-colors hover:border-service-ink hover:bg-service-ink disabled:cursor-wait disabled:opacity-60"
                disabled={Boolean(deletingTemplateId)}
                onClick={() => void deleteTemplate(deleteCandidate)}
                type="button"
              >
                {deletingTemplateId ? "Deleting..." : "Delete Template"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {renameCandidate ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-service-ink/45 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !renamingTemplateId) {
              setRenameCandidate(null);
            }
          }}
        >
          <form
            aria-labelledby="rename-template-title"
            aria-modal="true"
            className="w-full max-w-md rounded-md border border-service-border bg-white p-6 text-service-ink shadow-service"
            role="dialog"
            onSubmit={(event) => {
              event.preventDefault();
              void renameTemplate(renameCandidate);
            }}
          >
            <p className="type-label text-service-accent">Rename template</p>
            <h2
              className="type-heading-sm mt-eyebrow-heading-sm text-service-ink"
              id="rename-template-title"
            >
              Update template name
            </h2>
            <label className="type-text-sm mt-5 block font-semibold text-service-ink" htmlFor="template-name">
              Template name
            </label>
            <input
              autoFocus
              className="radius-4 mt-2 min-h-11 w-full border border-service-border bg-white px-3 text-service-ink outline-none transition-colors focus:border-service-accent focus:ring-2 focus:ring-service-accent/20"
              id="template-name"
              onChange={(event) => setRenameValue(event.target.value)}
              value={renameValue}
            />
            <div className="mt-body-actions-md flex justify-end gap-3">
              <button
                className="radius-4 min-h-10 border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                disabled={Boolean(renamingTemplateId)}
                onClick={() => setRenameCandidate(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="radius-4 min-h-10 border border-service-ink bg-service-ink px-4 text-sm font-semibold text-white transition-colors hover:border-service-accent hover:bg-service-accent disabled:cursor-wait disabled:opacity-60"
                disabled={Boolean(renamingTemplateId)}
                type="submit"
              >
                {renamingTemplateId ? "Saving..." : "Save Name"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
      {pagebuilderCandidate ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-service-ink/45 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !sendingTemplateId) {
              setPagebuilderCandidate(null);
            }
          }}
        >
          <div
            aria-labelledby="send-template-title"
            aria-modal="true"
            className="w-full max-w-lg rounded-md border border-service-border bg-white p-6 text-service-ink shadow-service"
            role="dialog"
          >
            <p className="type-label text-service-accent">Send to Pagebuilder</p>
            <h2
              className="type-heading-sm mt-eyebrow-heading-sm text-service-ink"
              id="send-template-title"
            >
              Replace Pagebuilder layout with {pagebuilderCandidate.name}?
            </h2>
            <p className="type-text-sm mt-heading-body-sm text-service-muted">
              This will replace the current saved Pagebuilder layout for{" "}
              {pagebuilderCandidate.sourceRecipeName}. The template section stack
              will load as included sections so you can quickly swap or rearrange
              from there.
            </p>
            <div className="mt-4 rounded-sm border border-service-border bg-service-surface px-3 py-2">
              <p className="type-caption font-semibold text-service-ink">
                {pagebuilderCandidate.sectionCount} sections will be sent.
              </p>
            </div>
            <div className="mt-body-actions-md flex justify-end gap-3">
              <button
                className="radius-4 min-h-10 border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                disabled={Boolean(sendingTemplateId)}
                onClick={() => setPagebuilderCandidate(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="radius-4 min-h-10 border border-service-ink bg-service-ink px-4 text-sm font-semibold text-white transition-colors hover:border-service-accent hover:bg-service-accent disabled:cursor-wait disabled:opacity-60"
                disabled={Boolean(sendingTemplateId)}
                onClick={() => void sendTemplateToPagebuilder(pagebuilderCandidate)}
                type="button"
              >
                {sendingTemplateId
                  ? "Sending..."
                  : "Replace Pagebuilder Layout"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function groupTemplatesByPageType(templates: PageTemplateSummary[]) {
  const groups = new Map<string, PageTemplateSummary[]>();

  for (const template of templates) {
    const pageType = template.pageType || "Page";
    groups.set(pageType, [...(groups.get(pageType) ?? []), template]);
  }

  return Array.from(groups.entries())
    .map(([pageType, groupTemplates]) => ({
      pageType,
      templates: groupTemplates,
    }))
    .sort((a, b) => a.pageType.localeCompare(b.pageType));
}

function groupAssignmentsByTemplateId(assignments: StagedTemplateAssignment[]) {
  const groups = new Map<string, StagedTemplateAssignment[]>();

  for (const assignment of assignments) {
    groups.set(assignment.templateId, [
      ...(groups.get(assignment.templateId) ?? []),
      assignment,
    ]);
  }

  return groups;
}

function countAssignmentsForTemplates(
  templates: PageTemplateSummary[],
  assignmentsByTemplateId: Map<string, StagedTemplateAssignment[]>,
) {
  return templates.reduce(
    (count, template) =>
      count + (assignmentsByTemplateId.get(template.id)?.length ?? 0),
    0,
  );
}

function getRepeatableInstanceLabel(pageType: string) {
  const normalizedPageType = normalizePageType(pageType);

  if (normalizedPageType === "individualservice") {
    return "service";
  }

  if (normalizedPageType === "servicearea") {
    return "location";
  }

  if (normalizedPageType === "blogpost") {
    return "article";
  }

  return "page";
}

function getRepeatableMismatchWarning(
  pageType: string,
  pageLabel: string,
  pageSlug: string,
) {
  const normalizedPageType = normalizePageType(pageType);
  const normalizedDraft = normalizeSearchText(`${pageLabel} ${pageSlug}`);

  if (!normalizedDraft) {
    return "";
  }

  if (
    normalizedPageType === "servicearea" &&
    serviceNameSignals.some((signal) => normalizedDraft.includes(signal))
  ) {
    return "This looks like a service name. Use an Individual Service template for service pages.";
  }

  if (
    normalizedPageType === "individualservice" &&
    locationNameSignals.some((signal) => normalizedDraft.includes(signal))
  ) {
    return "This looks like a location name. Use a Service Area template for location pages.";
  }

  return "";
}

function normalizePageType(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const serviceNameSignals = [
  "ac",
  "air conditioning",
  "cooling",
  "furnace",
  "heat pump",
  "heating",
  "hvac",
  "maintenance",
  "repair",
  "replacement",
  "tune up",
];

const locationNameSignals = [
  "charlotte",
  "cornelius",
  "davidson",
  "denver",
  "huntersville",
  "lake norman",
  "mooresville",
];

function StatusPill({ label }: { label: string }) {
  return (
    <span className="token-chrome-badge type-caption rounded-[var(--chrome-radius-control)] border px-3 py-1">
      {label}
    </span>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function RenameIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m4 20 4.1-1 10.5-10.5a2.1 2.1 0 0 0-3-3L5.1 16.1 4 20Z" />
      <path d="m13.8 7.3 3 3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <rect x="8" y="8" width="11" height="11" rx="1.5" />
      <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
    </svg>
  );
}

function PagebuilderIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m15 12-8.4 8.4a1 1 0 0 1-1.4 0l-1.6-1.6a1 1 0 0 1 0-1.4L12 9" />
      <path d="m18 15 4-4" />
      <path d="m21.5 11.5-1.9-1.9A2 2 0 0 1 19 8.2V7l-2.3-2.3a6 6 0 0 0-7.3-.9L5.5 6.5 8 9l3.5-1.5L14 10l-1 1 2 2 1-1Z" />
    </svg>
  );
}

function PreviewIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M3 12s3.2-5 9-5 9 5 9 5-3.2 5-9 5-9-5-9-5Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function UseTemplateIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 20V5" />
      <path d="m6.5 10.5 5.5-5.5 5.5 5.5" />
    </svg>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

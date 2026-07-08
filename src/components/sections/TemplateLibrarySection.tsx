"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
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
    component: string;
    instruction?: string;
    mode: string;
    name: string;
    variant?: string;
  }>;
  sourceOptionName: string;
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
  const [deletingTemplateId, setDeletingTemplateId] = useState("");
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

  return (
    <section className="min-h-svh bg-bg-surface text-service-ink">
      <SevenColumnGrid minHeight="none" padding="med">
        <SevenColumnGridItem className="col-start-2 col-span-4 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <p className="type-label text-service-accent">Pageworks Templates</p>
          <h1 className="type-display-lg mt-eyebrow-display text-service-ink">
            Template Library
          </h1>
          <p className="type-text-xl wrap-pretty mt-display-body text-service-muted">
            Reusable page layouts promoted from Pagebuilder options. Use a
            template to stage a page from the latest saved strategy snapshot.
          </p>
          <div className="mt-body-actions-md flex flex-wrap gap-2">
            <StatusPill label={`${localTemplates.length} templates`} />
            <StatusPill label={`${totalSections} saved sections`} />
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
            <Card className="mb-5 p-5 shadow-none">
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
                  <Button href="/dev/staged-pages" variant="secondary">
                    Open Staged Pages
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

          {localTemplates.length > 0 ? (
            <div className="grid gap-5">
              {templateGroups.map((group) => (
                <details
                  className="rounded-[var(--radius-md-token)] border border-service-border bg-white shadow-service"
                  key={group.pageType}
                  open
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 marker:hidden">
                    <span>
                      <span className="type-label text-service-accent">
                        {group.pageType}
                      </span>
                      <span className="type-heading-sm mt-1 block text-service-ink">
                        {group.templates.length}{" "}
                        {group.templates.length === 1 ? "template" : "templates"}
                      </span>
                    </span>
                    <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
                      Expand
                    </span>
                  </summary>
                  <div className="grid grid-cols-2 gap-5 border-t border-service-border p-5 max-lg:grid-cols-1">
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
                        <Card className="p-5 shadow-none" key={template.id}>
                          <div className="grid gap-5">
                            <div className="fluid-type-frame">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="type-label text-service-accent">
                                    {template.pageType}
                                  </p>
                                  <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                                    {template.name}
                                  </h2>
                                </div>
                                {activeAssignment ? (
                                  <StatusPill
                                    label={
                                      isRepeatable
                                        ? `${activeAssignmentsForTemplate.length} staged`
                                        : `Staged: ${activeAssignment.pageLabel}`
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

                            <div className="flex flex-wrap gap-2">
                              <StatusPill
                                label={`${template.sectionCount} sections`}
                              />
                              <StatusPill label={relationshipLabel} />
                              <StatusPill label={template.id} />
                              {!isRepeatable && activeAssignment ? (
                                <Link
                                  className="type-caption rounded-sm border border-green-200 bg-green-50 px-3 py-1 font-semibold text-green-800 transition-colors hover:border-service-accent hover:text-service-accent"
                                  href={activeAssignment.previewHref}
                                >
                                  Open staged
                                </Link>
                              ) : null}
                            </div>

                            {isRepeatable && activeAssignmentsForTemplate.length > 0 ? (
                              <div className="rounded-sm border border-green-200 bg-green-50 p-3">
                                <p className="type-caption font-semibold text-green-800">
                                  Staged pages using this repeatable template
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {activeAssignmentsForTemplate.map((assignment) => (
                                    <Link
                                      className="type-caption rounded-sm border border-green-200 bg-white px-3 py-1 font-semibold text-green-800 transition-colors hover:border-service-accent hover:text-service-accent"
                                      href={assignment.previewHref}
                                      key={assignment.pageId}
                                    >
                                      {assignment.pageLabel}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ) : null}

                            <details className="rounded-sm border border-service-border bg-service-surface">
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
                                    className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3 rounded-sm border border-service-border bg-white px-3 py-2 max-md:grid-cols-1"
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

                            <div className="grid gap-3 border-t border-service-border pt-5">
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
                                    {getRepeatableInstanceLabel(template.pageType)}.
                                    Reusing the same slug updates that existing
                                    staged page.
                                  </p>
                                  {mismatchWarning ? (
                                    <p className="type-caption rounded-sm border border-red-200 bg-red-50 px-3 py-2 font-semibold text-red-700">
                                      {mismatchWarning}
                                    </p>
                                  ) : null}
                                </div>
                              ) : null}
                              <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
                                <Link
                                  className="radius-4 inline-flex min-h-11 items-center justify-center border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                                  href={`/dev/templates/${template.id}`}
                                  target="_blank"
                                >
                                  Preview
                                </Link>
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
                                  {isContractOpen ? "Hide Contract" : "Show Contract"}
                                </button>
                                <button
                                  className="radius-4 min-h-11 border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                                  onClick={() => void copyTemplateContract(template)}
                                  type="button"
                                >
                                  {isContractCopied ? "Copied" : "Copy Contract"}
                                </button>
                                <button
                                  className="radius-4 min-h-11 border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-white disabled:cursor-wait disabled:opacity-60"
                                  disabled={deletingTemplateId === template.id}
                                  onClick={() => setDeleteCandidate(template)}
                                  type="button"
                                >
                                  Delete
                                </button>
                              </div>
                              {isContractOpen ? (
                                <textarea
                                  className="min-h-72 resize-y rounded-sm border border-service-border bg-service-surface px-3 py-3 font-mono text-xs leading-5 text-service-ink outline-none focus:border-service-accent"
                                  onFocus={(event) => event.currentTarget.select()}
                                  readOnly
                                  value={contract}
                                />
                              ) : null}
                              <button
                                className="radius-4 min-h-11 border border-service-ink bg-service-ink px-4 text-sm font-semibold text-white transition-colors hover:border-service-accent hover:bg-service-accent disabled:cursor-wait disabled:opacity-60"
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
                              {stagedFeedback ? (
                                <div
                                  className="rounded-sm border border-green-200 bg-green-50 px-4 py-3 text-green-800"
                                  role="status"
                                >
                                  <p className="type-caption font-semibold">
                                    Template applied. {stagedFeedback.pageLabel} is
                                    now staged and ready to edit.
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <Link
                                      className="radius-4 inline-flex min-h-10 items-center justify-center border border-green-300 bg-white px-4 text-sm font-semibold text-green-800 transition-colors hover:border-service-accent hover:text-service-accent"
                                      href={stagedFeedback.previewHref}
                                    >
                                      Open staged page
                                    </Link>
                                    <Link
                                      className="radius-4 inline-flex min-h-10 items-center justify-center border border-green-300 bg-white px-4 text-sm font-semibold text-green-800 transition-colors hover:border-service-accent hover:text-service-accent"
                                      href="/dev/staged-pages"
                                    >
                                      Open staged pages
                                    </Link>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <Card className="p-6 shadow-none">
              <p className="type-label text-service-accent">No templates yet</p>
              <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                Promote a Pagebuilder layout first.
              </h2>
              <p className="type-text-md wrap-pretty mt-heading-body-md text-service-muted">
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

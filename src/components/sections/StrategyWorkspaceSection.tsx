"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, DownArrowIcon, Section } from "@/components/primitives";
import type { PageTemplateSummary } from "@/components/sections/TemplateLibrarySection";
import {
  buildStrategyNavigation,
  deriveStrategyPagesFromFields,
  getStrategyPageCopyField,
  getPageTypeRelationshipLabel,
  isRepeatablePageType,
  type StrategyPageSummary,
  type StrategyPageStatus,
} from "@/utils/strategy-site-map";
import type {
  StrategyWorkspace,
  StrategyWorkspaceFields,
  StrategyWorkspacePacketIssue,
  StrategyWorkspacePacketSummary,
} from "@/utils/strategy-workspace";
import type { StrategySnapshot } from "@/utils/strategy-snapshots";

type SaveState = "idle" | "saving" | "saved" | "error";
type ContentPlanReferenceState = "idle" | "generated" | "error";

type StrategyWorkspaceSectionProps = {
  clientSlug: string;
  initialWorkspace: StrategyWorkspace;
  packetSummary: StrategyWorkspacePacketSummary;
  stagedPages: StagedStrategyPageSummary[];
  strategyDigestText: string;
  templates: PageTemplateSummary[];
  sourcePacketText: string;
};

type StagedStrategyPageSummary = {
  pageHref: string;
  pageId: string;
  pageLabel: string;
  pageType: string;
  previewHref: string;
  status: "staged" | "ready";
  templateName: string;
};

type StagePageResponse =
  | {
      ok: true;
      page: {
        pageHref: string;
        pageId: string;
        pageLabel: string;
        pageType?: string;
        previewHref: string;
        status: "staged" | "ready";
        template?: {
          name?: string;
          pageType?: string;
        };
      };
    }
  | { ok: false; error?: string };

const baseFieldGroups: {
  description: string;
  fields: {
    key: keyof StrategyWorkspaceFields;
    label: string;
    minRows: number;
    placeholder: string;
  }[];
  title: string;
}[] = [
  {
    description:
      "Optional internal research to copy alongside the strategy digest when running Phase 2.",
    fields: [
      {
        key: "supplementalResearch",
        label: "Supplemental research (Phase 1 output)",
        minRows: 10,
        placeholder:
          "Paste optional context like GBP notes, current website research, call notes, competitor observations, or other source material. Copy this together with the strategy digest when running Phase 2.",
      },
    ],
    title: "Inputs",
  },
  {
    description: "Paste the output from Phase 2 and Phase 3 here so each next step has a durable local source.",
    fields: [
      {
        key: "strategyBrief",
        label: "Website Strategy Brief (Phase 2 output)",
        minRows: 14,
        placeholder: "Paste Phase 2 output here.",
      },
      {
        key: "contentPlan",
        label: "Website Content Plan (Phase 3 output)",
        minRows: 14,
        placeholder: "Paste Phase 3 output here.",
      },
    ],
    title: "Planning Outputs",
  },
  {
    description: "Use this for approvals, open questions, client comments, and final implementation notes.",
    fields: [
      {
        key: "generalNotes",
        label: "General notes",
        minRows: 8,
        placeholder: "Track open questions, decisions, approvals, and implementation notes.",
      },
    ],
    title: "Notes",
  },
];

function createPageCopyFieldGroup(strategyPages: StrategyPageSummary[]) {
  const detectedPages = strategyPages.filter((page) => page.detected);
  const pageFields = detectedPages.map((page) => ({
    key: getStrategyPageCopyField(page),
    label: `${page.label} copy`,
    minRows: page.id === "thank-you" ? 8 : 12,
    placeholder: `Paste Phase 4 ${page.label} output here.`,
  }));

  return {
    description:
      "After choosing page templates, run Phase 4 with each Template Copy Contract and paste the reviewed output into the matching page slot.",
    fields:
      pageFields.length > 0
        ? pageFields
        : [
            {
              key: getStrategyPageCopyField({ id: "home" }),
              label: "Home copy",
              minRows: 12,
              placeholder: "Paste Phase 4 Home output here.",
            },
          ],
    title: "Page Copy",
  };
}

export function StrategyWorkspaceSection({
  clientSlug,
  initialWorkspace,
  packetSummary,
  stagedPages,
  strategyDigestText,
  templates,
  sourcePacketText,
}: StrategyWorkspaceSectionProps) {
  const [fields, setFields] = useState<StrategyWorkspaceFields>(
    initialWorkspace.fields,
  );
  const [snapshot, setSnapshot] = useState<StrategySnapshot | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [packetCopyState, setPacketCopyState] = useState<
    "idle" | "copied" | "error"
  >("idle");
  const [digestCopyState, setDigestCopyState] = useState<
    "idle" | "copied" | "error"
  >("idle");
  const [fieldCopyState, setFieldCopyState] = useState<
    Partial<Record<string, "copied" | "error">>
  >({});
  const [contentPlanReferenceState, setContentPlanReferenceState] =
    useState<ContentPlanReferenceState>("idle");
  const [openFieldGroups, setOpenFieldGroups] = useState<string[]>([]);
  const [localStagedPages, setLocalStagedPages] = useState(stagedPages);
  const [templatePickerPageId, setTemplatePickerPageId] = useState("");
  const [stagingTemplateId, setStagingTemplateId] = useState("");
  const [templatePickerError, setTemplatePickerError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(initialWorkspace.updatedAt);

  const filledCount = useMemo(
    () =>
      Object.values(fields).filter((value) => value.trim().length > 0).length,
    [fields],
  );
  const strategyPages = useMemo(
    () => deriveStrategyPagesFromFields(fields),
    [fields],
  );
  const fieldGroups = useMemo(
    () => [
      ...baseFieldGroups.slice(0, 2),
      createPageCopyFieldGroup(strategyPages),
      ...baseFieldGroups.slice(2),
    ],
    [strategyPages],
  );
  const fieldGroupStatuses = useMemo(
    () =>
      new Map(
        fieldGroups.map((group) => {
          const filledFields = group.fields.filter(
            (field) => (fields[field.key] ?? "").trim().length > 0,
          ).length;

          return [
            group.title,
            {
              filledFields,
              totalFields: group.fields.length,
            },
          ];
        }),
      ),
    [fieldGroups, fields],
  );
  const stagedPagesById = useMemo(
    () => new Map(localStagedPages.map((page) => [page.pageId, page])),
    [localStagedPages],
  );
  const stagedPagesByPageType = useMemo(
    () => groupStagedPagesByPageType(localStagedPages),
    [localStagedPages],
  );
  const assemblyPages = useMemo(
    () =>
      strategyPages.filter((page) => page.detected).map((page) => {
        const matchingStagedPages = page.repeatable
          ? stagedPagesByPageType.get(normalizePageType(page.pageType)) ?? []
          : [];
        const stagedPage = stagedPagesById.get(page.id) ?? matchingStagedPages[0];
        const repeatableStatus =
          matchingStagedPages.length > 0 ? "staged" : page.status;

        return {
          ...page,
          childPages: matchingStagedPages,
          previewHref: stagedPage?.previewHref ?? "",
          status: stagedPage?.status ?? repeatableStatus,
          templateName: stagedPage?.templateName ?? "",
        };
      }),
    [stagedPagesById, stagedPagesByPageType, strategyPages],
  );
  const navigation = useMemo(
    () => buildStrategyNavigation(strategyPages),
    [strategyPages],
  );
  const detectedPageCount = strategyPages.filter((page) => page.detected).length;
  const templatePickerPage =
    assemblyPages.find((page) => page.id === templatePickerPageId) ?? null;
  const matchingTemplates = useMemo(
    () =>
      templatePickerPage
        ? templates.filter(
            (template) =>
              normalizePageType(template.pageType) ===
              normalizePageType(templatePickerPage.pageType),
          )
        : [],
    [templatePickerPage, templates],
  );
  const showAssemblyOverview = Boolean(updatedAt) || saveState === "saved";

  function updateField(key: keyof StrategyWorkspaceFields, value: string) {
    setFields((currentFields) => ({
      ...currentFields,
      [key]: value,
    }));
    clearWorkspaceFieldCopyState(key);

    if (key === "contentPlan" && contentPlanReferenceState !== "idle") {
      setContentPlanReferenceState("idle");
    }

    if (saveState !== "idle") {
      setSaveState("idle");
    }
  }

  async function saveWorkspace() {
    setSaveState("saving");

    try {
      const response = await fetch("/api/strategy-workspace", {
        body: JSON.stringify({
          clientSlug,
          fields,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const result = (await response.json()) as {
        message?: string;
        ok?: boolean;
        snapshot?: StrategySnapshot;
        workspace?: StrategyWorkspace;
      };

      if (!response.ok || !result.ok || !result.workspace) {
        throw new Error(result.message ?? "Strategy workspace save failed.");
      }

      setFields(result.workspace.fields);
      setSnapshot(result.snapshot ?? null);
      setUpdatedAt(result.workspace.updatedAt);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  async function copyStrategyDigest() {
    if (!strategyDigestText) {
      setDigestCopyState("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(strategyDigestText);
      setDigestCopyState("copied");
    } catch {
      setDigestCopyState("error");
    }
  }

  async function copySourcePacket() {
    if (!sourcePacketText) {
      setPacketCopyState("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(sourcePacketText);
      setPacketCopyState("copied");
    } catch {
      setPacketCopyState("error");
    }
  }

  function clearWorkspaceFieldCopyState(key: keyof StrategyWorkspaceFields) {
    setFieldCopyState((currentState) => {
      const nextState = { ...currentState };

      delete nextState[String(key)];

      return nextState;
    });
  }

  function setWorkspaceFieldCopyState(
    key: keyof StrategyWorkspaceFields,
    state: "copied" | "error",
  ) {
    setFieldCopyState((currentState) => ({
      ...currentState,
      [String(key)]: state,
    }));
  }

  async function copyWorkspaceField(key: keyof StrategyWorkspaceFields) {
    const value = fields[key] ?? "";

    if (!value) {
      setWorkspaceFieldCopyState(key, "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setWorkspaceFieldCopyState(key, "copied");
    } catch {
      setWorkspaceFieldCopyState(key, "error");
    }
  }

  function toggleFieldGroup(title: string) {
    setOpenFieldGroups((currentGroups) =>
      currentGroups.includes(title)
        ? currentGroups.filter((groupTitle) => groupTitle !== title)
        : [...currentGroups, title],
    );
  }

  function openContentPlanReference() {
    const contentPlan = fields.contentPlan.trim();

    if (!contentPlan) {
      setContentPlanReferenceState("error");
      return;
    }

    const referenceBlob = new Blob(
      [
        buildContentPlanDocumentHtml({
          clientSlug,
          content: contentPlan,
        }),
      ],
      { type: "text/html" },
    );
    const referenceUrl = URL.createObjectURL(referenceBlob);
    const docWindow = window.open(referenceUrl, "_blank");

    if (!docWindow) {
      setContentPlanReferenceState("error");
      return;
    }

    docWindow.opener = null;

    window.setTimeout(() => {
      URL.revokeObjectURL(referenceUrl);
    }, 60_000);

    setContentPlanReferenceState("generated");
  }

  function openTemplatePicker(pageId: string) {
    setTemplatePickerPageId(pageId);
    setTemplatePickerError("");
  }

  async function stageTemplateForPage(template: PageTemplateSummary) {
    if (!templatePickerPage) {
      return;
    }

    setStagingTemplateId(template.id);
    setTemplatePickerError("");

    try {
      const response = await fetch("/api/staged-pages", {
        body: JSON.stringify({
          clientSlug,
          pageLabel: templatePickerPage.label,
          pageSlug: templatePickerPage.id,
          templateId: template.id,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as StagePageResponse;

      if (!response.ok || !result.ok) {
        setTemplatePickerError(
          result.ok
            ? "Template could not be applied."
            : result.error ?? "Template could not be applied.",
        );
        return;
      }

      const nextPage: StagedStrategyPageSummary = {
        pageHref: result.page.pageHref,
        pageId: result.page.pageId,
        pageLabel: result.page.pageLabel,
        pageType: result.page.template?.pageType ?? template.pageType,
        previewHref: result.page.previewHref,
        status: result.page.status,
        templateName: result.page.template?.name ?? template.name,
      };

      setLocalStagedPages((currentPages) => [
        nextPage,
        ...currentPages.filter((page) => page.pageId !== nextPage.pageId),
      ]);
      setTemplatePickerPageId("");
    } catch {
      setTemplatePickerError("Template could not be applied.");
    } finally {
      setStagingTemplateId("");
    }
  }

  return (
    <Section className="min-h-svh bg-service-surface text-service-ink">
      <div className="fixed right-[var(--container-gutter)] top-4 z-40 flex flex-wrap items-center justify-end gap-3">
        <Link
          className="type-caption font-semibold text-service-accent hover:text-service-ink"
          href="/dev/pagebuilder"
          rel="noreferrer"
          target="_blank"
        >
          Page Builder
        </Link>
        <Link
          className="type-caption font-semibold text-service-accent hover:text-service-ink"
          href="/sections"
          rel="noreferrer"
          target="_blank"
        >
          Section Library
        </Link>
        <Link
          className="type-caption font-semibold text-service-accent hover:text-service-ink"
          href="/dev/style-guide"
          rel="noreferrer"
          target="_blank"
        >
          Style Guide
        </Link>
        <button
          className="type-caption font-semibold text-service-accent hover:text-service-ink"
          onClick={openContentPlanReference}
          type="button"
        >
          Build plan
        </button>
        <Link
          className={secondaryButtonClass}
          href="/dev/templates"
          rel="noreferrer"
          target="_blank"
        >
          Template library
        </Link>
        <Link
          className={secondaryButtonClass}
          href={`/dev/prompt-library?project=${clientSlug}`}
          rel="noreferrer"
          target="_blank"
        >
          Prompt library
        </Link>
        <button
          className={primaryButtonClass}
          disabled={saveState === "saving"}
          onClick={() => void saveWorkspace()}
          type="button"
        >
          {saveState === "saving" ? "Saving" : "Save workspace"}
        </button>
      </div>
      <div className="w-full px-[var(--container-gutter)]">
        <div className="grid layout-gap-lrg">
          <div className="grid gap-5">
            <div className="fluid-type-frame">
              <p className="type-label text-service-accent">
                Strategy Workspace
              </p>
              <h1 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
                {clientSlug}
              </h1>
              <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
                Local saved workspace for research, strategy outputs, content
                planning, and page copy tied to this project.
              </p>
            </div>
          </div>

          {showAssemblyOverview ? (
            <Card className="p-5 shadow-none">
              <div className="grid gap-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="fluid-type-frame min-w-0 flex-1">
                    <p className="type-label text-service-accent">
                      Site Assembly Overview
                    </p>
                    <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                      {detectedPageCount} pages detected from the saved strategy
                    </h2>
                  <p className="type-text-sm wrap-pretty mt-heading-body-sm max-w-none text-service-muted">
                    Use templates to stage these pages from snapshot
                    {snapshot ? ` ${snapshot.id}` : ""}. Content Editor edits
                    can then sit on top as manual overrides.
                  </p>
                </div>
                </div>

                <div className="grid grid-cols-5 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
                  {assemblyPages.map((page) => {
                    const hasTemplateReady =
                      Boolean(page.previewHref) ||
                      Boolean(page.repeatable && page.childPages.length > 0);

                    return (
                      <div
                        className={`relative rounded-[var(--radius-md-token)] border p-3 pr-12 transition-colors ${
                          hasTemplateReady
                            ? "border-service-accent/35 bg-white"
                            : "border-service-border bg-service-surface"
                        }`}
                        key={page.id}
                      >
                        <TemplateReadyIcon isReady={hasTemplateReady} />
                        <p
                          className={`type-caption font-semibold ${getPageStatusClassName(
                            page.detected,
                            page.status,
                          )}`}
                        >
                          {getPageStatusLabel(page.detected, page.status)}
                        </p>
                        <h3 className="mt-2 text-base font-semibold text-service-ink">
                          {page.label}
                        </h3>
                        <p className="type-caption mt-1 text-service-muted">
                          {page.path}
                        </p>
                        <p className="type-caption mt-2 text-service-muted">
                          {getPageTypeRelationshipLabel(page.pageType)}
                        </p>
                        {page.templateName ? (
                          <p className="type-caption mt-2 text-service-muted">
                            {page.templateName}
                          </p>
                        ) : null}
                        {page.repeatable && page.childPages.length > 0 ? (
                          <div className="mt-3 grid gap-2">
                            <p className="type-caption font-semibold text-service-ink">
                              {page.childPages.length} staged{" "}
                              {page.childPages.length === 1 ? "page" : "pages"}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {page.childPages.map((childPage) => (
                                <Link
                                  className="type-caption rounded-sm border border-service-border bg-white px-2 py-1 font-semibold text-service-accent hover:text-service-ink"
                                  href={childPage.previewHref}
                                  key={childPage.pageId}
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  {childPage.pageLabel}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : null}
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          {page.previewHref ? (
                            <Link
                              className="type-caption inline-flex font-semibold text-service-accent hover:text-service-ink"
                              href={page.previewHref}
                              rel="noreferrer"
                              target="_blank"
                            >
                              Open staged page
                            </Link>
                          ) : null}
                          <button
                            className={`type-caption inline-flex font-semibold ${
                              !page.previewHref
                                ? "text-service-accent hover:text-service-ink"
                                : "text-service-muted hover:text-service-accent"
                            }`}
                            onClick={() => openTemplatePicker(page.id)}
                            type="button"
                          >
                            {page.previewHref ? "Change template" : "Choose template"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-[var(--radius-md-token)] border border-service-border bg-white p-4">
                  <p className="type-caption font-semibold text-service-accent">
                    Navigation
                  </p>
                  {navigation.length > 0 ? (
                    <nav className="mt-3 flex flex-wrap gap-2" aria-label="Strategy sitemap">
                      {navigation.map((item) => (
                        <span
                          className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted"
                          key={item.pageId}
                        >
                          {item.label} {item.href}
                        </span>
                      ))}
                    </nav>
                  ) : (
                    <p className="type-text-sm mt-2 text-service-muted">
                      Add page copy to populate the staged-site navigation.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ) : null}

          <div className="grid card-grid-gap-med">
            {fieldGroups.map((group) => {
              const groupStatus = fieldGroupStatuses.get(group.title) ?? {
                filledFields: 0,
                totalFields: group.fields.length,
              };
              const hasContentPlanReference = group.fields.some(
                (field) => field.key === "contentPlan",
              );

              return (
                <Card className="overflow-hidden shadow-none" key={group.title}>
                  <details
                    className="group"
                    open={openFieldGroups.includes(group.title)}
                  >
                    <summary
                      className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 marker:hidden max-md:items-start"
                      onClick={(event) => {
                        event.preventDefault();
                        toggleFieldGroup(group.title);
                      }}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <InputStatusBadge
                            filledCount={groupStatus.filledFields}
                            totalCount={groupStatus.totalFields}
                          />
                          <p className="type-label text-service-accent">
                            {group.title}
                          </p>
                        </div>
                        <p className="type-text-sm mt-heading-body-sm text-service-muted">
                          {group.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        {hasContentPlanReference ? (
                          <button
                            className="type-caption inline-flex font-semibold text-service-accent hover:text-service-ink"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              openContentPlanReference();
                            }}
                            type="button"
                          >
                            Build plan
                          </button>
                        ) : null}
                        <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 font-semibold text-service-muted">
                          {groupStatus.filledFields}/{groupStatus.totalFields}{" "}
                          filled
                        </span>
                        <span
                          className="flex size-10 items-center justify-center rounded-[var(--radius-md-token)] border border-service-border text-service-accent transition-transform group-open:rotate-180"
                          aria-hidden="true"
                        >
                          <DownArrowIcon className="size-4" />
                        </span>
                      </div>
                    </summary>

                    <div className="grid gap-5 border-t border-service-border bg-service-surface p-5">
                      {group.fields.map((field) => {
                      const fieldValue = fields[field.key] ?? "";
                      const isPageCopyField = group.title === "Page Copy";
                      const fieldBlock = (
                        <>
                          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
                            <label
                              className={
                                isPageCopyField
                                  ? "sr-only"
                                  : "text-sm font-semibold text-service-ink"
                              }
                              htmlFor={`strategy-field-${field.key}`}
                            >
                              {field.label}
                            </label>
                            <div className="flex flex-wrap items-center gap-2">
                              {fieldCopyState[field.key] === "copied" ? (
                                <span className="type-caption font-semibold text-green-700">
                                  Copied.
                                </span>
                              ) : null}
                              {fieldCopyState[field.key] === "error" ? (
                                <span className="type-caption font-semibold text-red-700">
                                  Nothing to copy.
                                </span>
                              ) : null}
                              {field.key === "contentPlan" &&
                              contentPlanReferenceState === "generated" ? (
                                <span className="type-caption font-semibold text-green-700">
                                  Reference opened.
                                </span>
                              ) : null}
                              {field.key === "contentPlan" &&
                              contentPlanReferenceState === "error" ? (
                                <span className="type-caption font-semibold text-red-700">
                                  Add Phase 3 output first.
                                </span>
                              ) : null}
                              <button
                                className={secondaryButtonClass}
                                onClick={() => void copyWorkspaceField(field.key)}
                                type="button"
                              >
                                Copy field
                              </button>
                            </div>
                          </div>
                          <textarea
                            className="mx-auto aspect-[4/5] min-h-96 w-full max-w-4xl resize-y rounded-[var(--radius-md-token)] border border-service-border bg-service-surface p-4 text-sm font-normal leading-relaxed text-service-ink outline-none transition-colors placeholder:text-service-muted focus:border-service-accent max-md:aspect-auto max-md:min-h-[32rem]"
                            id={`strategy-field-${field.key}`}
                            onChange={(event) =>
                              updateField(field.key, event.currentTarget.value)
                            }
                            placeholder={field.placeholder}
                            rows={field.minRows}
                            value={fieldValue}
                          />
                        </>
                      );

                      if (isPageCopyField) {
                        const hasFieldValue = fieldValue.trim().length > 0;

                        return (
                          <details
                            className="overflow-hidden rounded-[var(--radius-md-token)] border border-service-border bg-white"
                            key={field.key}
                          >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 marker:hidden max-md:items-start">
                              <span className="flex min-w-0 items-center gap-3 text-sm font-semibold text-service-ink">
                                <InputStatusIcon isComplete={hasFieldValue} />
                                <span className="min-w-0">{field.label}</span>
                              </span>
                              <InputStatusPill isComplete={hasFieldValue} />
                            </summary>
                            <div className="grid gap-2 border-t border-service-border bg-white p-4">
                              {fieldBlock}
                            </div>
                          </details>
                        );
                      }

                      return (
                        <div
                          className="grid gap-2 rounded-[var(--radius-md-token)] border border-service-border bg-white p-4"
                          key={field.key}
                        >
                          {fieldBlock}
                        </div>
                      );
                      })}
                    </div>
                  </details>
                </Card>
              );
            })}
          </div>

          <Card className="p-4 shadow-none">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
              <div className="min-w-0">
                <p className="type-label text-service-accent">
                  Strategy Inputs Report
                </p>
                <p className="type-text-sm mt-heading-body-sm text-service-muted">
                  {packetSummary.exists
                    ? "Source packet found. Strategy digest is the prompt-ready version."
                    : "No source packet found for this project slug."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 type-caption text-service-muted">
                  <span className="break-all rounded-[var(--radius-md-token)] bg-service-surface px-3 py-2 font-mono text-service-ink">
                    {packetSummary.outputPath}
                  </span>
                  <span className="break-all rounded-[var(--radius-md-token)] bg-service-surface px-3 py-2 font-mono text-service-ink">
                    src/content/projects/{clientSlug}/strategy-digest.md
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 type-caption text-service-muted">
                  <span>{filledCount} saved workspace sections started</span>
                  {updatedAt ? (
                    <span>Last saved {formatDate(updatedAt)}</span>
                  ) : (
                    <span>Not saved yet</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 xl:col-span-2 max-lg:grid-cols-2 max-sm:grid-cols-1">
                <Metric label="Source items" value={packetSummary.totalSourceItems} />
                <Metric
                  label="Verified quotes"
                  value={packetSummary.verifiedQuoteItems}
                />
                <Metric label="Conflicts" value={packetSummary.conflictItems} />
                <Metric label="Missing info" value={packetSummary.missingInfoItems} />
              </div>

              <div className="grid gap-3 xl:col-span-2 lg:grid-cols-2">
                {strategyDigestText ? (
                  <details className="rounded-[var(--radius-md-token)] border border-service-border bg-service-surface">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 type-caption font-semibold text-service-ink marker:hidden">
                      <span>Strategy digest</span>
                      <span className="text-service-muted">Open</span>
                    </summary>
                    <div className="grid gap-3 border-t border-service-border bg-white p-3">
                      <button
                        className={secondaryButtonClass}
                        onClick={() => void copyStrategyDigest()}
                        type="button"
                      >
                        Copy strategy digest
                      </button>
                      {digestCopyState === "copied" ? (
                        <p className="type-caption font-semibold text-green-700">
                          Strategy digest copied.
                        </p>
                      ) : null}
                      {digestCopyState === "error" ? (
                        <p className="type-caption font-semibold text-red-700">
                          Could not copy strategy digest.
                        </p>
                      ) : null}
                      <textarea
                        className="min-h-48 w-full resize-y rounded-[var(--radius-md-token)] border border-service-border bg-service-surface p-3 font-mono text-xs leading-relaxed text-service-ink"
                        readOnly
                        value={strategyDigestText}
                      />
                    </div>
                  </details>
                ) : null}
                {sourcePacketText ? (
                  <details className="rounded-[var(--radius-md-token)] border border-service-border bg-service-surface">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 type-caption font-semibold text-service-ink marker:hidden">
                      <span>Source packet audit text</span>
                      <span className="text-service-muted">Open</span>
                    </summary>
                    <div className="grid gap-3 border-t border-service-border bg-white p-3">
                      <button
                        className={secondaryButtonClass}
                        onClick={() => void copySourcePacket()}
                        type="button"
                      >
                        Copy source packet
                      </button>
                      {packetCopyState === "copied" ? (
                        <p className="type-caption font-semibold text-green-700">
                          Source packet copied.
                        </p>
                      ) : null}
                      {packetCopyState === "error" ? (
                        <p className="type-caption font-semibold text-red-700">
                          Could not copy source packet.
                        </p>
                      ) : null}
                      <textarea
                        className="min-h-48 w-full resize-y rounded-[var(--radius-md-token)] border border-service-border bg-service-surface p-3 font-mono text-xs leading-relaxed text-service-ink"
                        readOnly
                        value={sourcePacketText}
                      />
                    </div>
                  </details>
                ) : null}
              </div>

              {(packetSummary.conflicts.length > 0 ||
                packetSummary.missingInfo.length > 0) ? (
                <details className="rounded-[var(--radius-md-token)] border border-service-border bg-service-surface xl:col-span-2">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3 text-sm font-semibold text-service-ink marker:hidden">
                    <span>Review packet issues</span>
                    <span className="text-xs font-semibold text-service-muted">
                      {packetSummary.conflicts.length} conflicts /{" "}
                      {packetSummary.missingInfo.length} missing
                    </span>
                  </summary>
                  <div className="grid gap-4 border-t border-service-border bg-white p-3">
                    <p className="text-sm leading-relaxed text-service-muted">
                      Verify these before using packet material in strategy,
                      planning, or final website copy.
                    </p>

                    {packetSummary.conflicts.length > 0 ? (
                      <IssueList
                        items={packetSummary.conflicts}
                        title="Conflicts"
                        tone="warning"
                      />
                    ) : null}

                    {packetSummary.missingInfo.length > 0 ? (
                      <IssueList
                        items={packetSummary.missingInfo}
                        title="Missing info"
                        tone="neutral"
                      />
                    ) : null}
                  </div>
                </details>
              ) : null}

              {saveState === "saved" ? (
                <p className="type-caption font-semibold text-green-700 xl:col-span-2">
                  Workspace saved. Strategy snapshot frozen.
                </p>
              ) : null}
              {saveState === "error" ? (
                <p className="type-caption font-semibold text-red-700 xl:col-span-2">
                  Unable to save workspace.
                </p>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
      {templatePickerPage ? (
        <div
          aria-labelledby="strategy-template-picker-title"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-service-ink/55 p-4"
          role="dialog"
        >
          <div className="max-h-[min(90vh,52rem)] w-full max-w-5xl overflow-y-auto rounded-[var(--radius-md-token)] border border-service-border bg-white shadow-service">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-service-border bg-white p-5">
              <div className="min-w-0">
                <p className="type-label text-service-accent">
                  Template selector
                </p>
                <h2
                  className="type-heading-md mt-eyebrow-heading-sm text-service-ink"
                  id="strategy-template-picker-title"
                >
                  {templatePickerPage.label}
                </h2>
                <p className="type-text-sm mt-heading-body-sm text-service-muted">
                  {templatePickerPage.pageType} template for{" "}
                  <span className="font-mono">{templatePickerPage.path}</span>
                </p>
              </div>
              <button
                aria-label="Close template selector"
                className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md-token)] border border-service-border text-service-muted transition-colors hover:border-service-accent hover:text-service-accent"
                onClick={() => {
                  setTemplatePickerPageId("");
                  setTemplatePickerError("");
                }}
                type="button"
              >
                x
              </button>
            </div>

            <div className="grid gap-4 p-5">
              {templatePickerError ? (
                <p className="type-caption rounded-sm border border-red-200 bg-red-50 px-3 py-2 font-semibold text-red-700">
                  {templatePickerError}
                </p>
              ) : null}

              {matchingTemplates.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                  {matchingTemplates.map((template) => {
                    const isStaging = stagingTemplateId === template.id;

                    return (
                      <article
                        className="rounded-[var(--radius-md-token)] border border-service-border bg-service-surface p-4"
                        key={template.id}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="type-heading-sm text-service-ink">
                              {template.name}
                            </h3>
                            <p className="type-caption mt-2 text-service-muted">
                              {template.sectionCount} sections from{" "}
                              {template.sourceRecipeName}
                            </p>
                          </div>
                          <span className="type-caption rounded-sm border border-service-border bg-white px-3 py-1 text-service-muted">
                            {template.pageType}
                          </span>
                        </div>

                        {template.notes ? (
                          <p className="type-text-sm mt-3 text-service-muted">
                            {template.notes}
                          </p>
                        ) : null}

                        <details className="mt-4 rounded-sm border border-service-border bg-white">
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
                                className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 rounded-sm border border-service-border bg-service-surface px-3 py-2 max-md:grid-cols-1"
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

                        <div className="mt-4 grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                          <Link
                            className={secondaryButtonClass}
                            href={`/dev/templates/${template.id}`}
                            target="_blank"
                          >
                            Preview
                          </Link>
                          <button
                            className={primaryButtonClass}
                            disabled={Boolean(stagingTemplateId)}
                            onClick={() => void stageTemplateForPage(template)}
                            type="button"
                          >
                            {isStaging ? "Applying" : "Use template"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[var(--radius-md-token)] border border-service-border bg-service-surface p-5">
                  <p className="type-heading-sm text-service-ink">
                    No {templatePickerPage.pageType} templates yet.
                  </p>
                  <p className="type-text-sm mt-heading-body-sm text-service-muted">
                    Promote a matching page layout from Pagebuilder, then return
                    here to assign it to this detected page.
                  </p>
                  <Link
                    className={`${secondaryButtonClass} mt-4`}
                    href="/dev/pagebuilder"
                  >
                    Open Pagebuilder
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </Section>
  );
}

function IssueList({
  items,
  title,
  tone,
}: {
  items: StrategyWorkspacePacketIssue[];
  title: string;
  tone: "neutral" | "warning";
}) {
  const badgeClass =
    tone === "warning"
      ? "border-amber-300 bg-amber-50 text-amber-800"
      : "border-service-border bg-service-surface text-service-ink";

  return (
    <div className="grid gap-3">
      <h2 className="text-base font-semibold text-service-ink">{title}</h2>
      <div className="grid gap-3">
        {items.map((item) => (
          <div
            className={`rounded-[var(--radius-md-token)] border p-4 ${badgeClass}`}
            key={item.id}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-[var(--radius-sm-token)] border border-current/20 bg-white/70 px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em]">
                {item.id}
              </span>
              {item.sourceField ? (
                <span className="break-all text-xs font-semibold">
                  {item.sourceField}
                </span>
              ) : null}
              {item.confidence !== null ? (
                <span className="text-xs text-service-muted">
                  Confidence {item.confidence}
                </span>
              ) : null}
            </div>

            <p className="mt-3 text-sm font-semibold leading-relaxed text-service-ink">
              {item.notes || "No note provided."}
            </p>

            {item.value ? (
              <p className="mt-3 break-words rounded-[var(--radius-sm-token)] bg-white/75 p-3 font-mono text-xs leading-relaxed text-service-ink">
                {item.value}
              </p>
            ) : null}

            {item.relatedItems.length > 0 ? (
              <p className="mt-3 break-words text-xs text-service-muted">
                Related packet items: {item.relatedItems.join(", ")}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplateReadyIcon({ isReady }: { isReady: boolean }) {
  const label = isReady ? "Template ready" : "Waiting for template";

  return (
    <span
      aria-label={label}
      className={`absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border ${
        isReady
          ? "border-service-accent/30 bg-service-accent/10 text-service-accent"
          : "border-service-border bg-white/70 text-service-muted/55"
      }`}
      title={label}
    >
      <span
        aria-hidden="true"
        className="relative block h-4 w-3 rounded-[2px] border border-current"
      >
        <span className="absolute left-1 top-1 h-px w-1.5 bg-current" />
        <span className="absolute left-1 top-2 h-px w-1.5 bg-current" />
        {isReady ? (
          <span className="absolute -bottom-1 -right-1 flex size-3 items-center justify-center rounded-full bg-current">
            <span className="block size-1 rounded-full bg-white" />
          </span>
        ) : null}
      </span>
    </span>
  );
}

function Metric({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-[var(--radius-md-token)] border border-service-border bg-service-surface p-3">
      <p className="type-caption text-service-muted">{label}</p>
      <p className="type-heading-xs mt-1 text-service-ink">
        {value ?? "-"}
      </p>
    </div>
  );
}

function InputStatusBadge({
  filledCount,
  totalCount,
}: {
  filledCount: number;
  totalCount: number;
}) {
  const isComplete = filledCount === totalCount;
  const hasStarted = filledCount > 0;
  const label = isComplete
    ? "All inputs filled"
    : hasStarted
      ? `${filledCount} of ${totalCount} inputs filled`
      : "No inputs filled";

  return (
    <span
      aria-label={label}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 type-caption font-semibold ${
        isComplete
          ? "border-green-200 bg-green-50 text-green-800"
          : hasStarted
            ? "border-amber-200 bg-amber-50 text-amber-800"
            : "border-service-border bg-service-surface text-service-muted"
      }`}
      title={label}
    >
      <InputStatusIcon isComplete={isComplete} isStarted={hasStarted} />
      <span>
        {filledCount}/{totalCount}
      </span>
    </span>
  );
}

function InputStatusPill({ isComplete }: { isComplete: boolean }) {
  return (
    <span
      className={`type-caption rounded-sm border px-3 py-1 font-semibold ${
        isComplete
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-service-border bg-service-surface text-service-muted"
      }`}
    >
      {isComplete ? "Filled" : "Empty"}
    </span>
  );
}

function InputStatusIcon({
  isComplete,
  isStarted = isComplete,
}: {
  isComplete: boolean;
  isStarted?: boolean;
}) {
  const iconLabel = isComplete
    ? "Filled"
    : isStarted
      ? "Partially filled"
      : "Empty";

  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full border text-[0.6875rem] font-bold leading-none ${
        isComplete
          ? "border-green-600 bg-green-600 text-white"
          : isStarted
            ? "border-amber-500 bg-amber-100 text-amber-800"
            : "border-service-border bg-white text-service-muted"
      }`}
      title={iconLabel}
    >
      {isComplete ? "✓" : isStarted ? "•" : ""}
    </span>
  );
}

function buildContentPlanDocumentHtml({
  clientSlug,
  content,
}: {
  clientSlug: string;
  content: string;
}) {
  const title = `${clientSlug} Page-Building Reference`;
  const generatedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color: #1d2520;
        background: #f5f2eb;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: #f5f2eb;
      }

      main {
        width: min(880px, calc(100% - 32px));
        margin: 0 auto;
        padding: 56px 0 72px;
      }

      header {
        border-bottom: 1px solid #d8d2c6;
        margin-bottom: 32px;
        padding-bottom: 28px;
      }

      .eyebrow {
        color: #8a5f2d;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        margin: 0 0 12px;
        text-transform: uppercase;
      }

      h1 {
        font-size: clamp(36px, 6vw, 64px);
        line-height: 0.95;
        margin: 0;
      }

      .intro {
        color: #5b655e;
        font-size: 16px;
        line-height: 1.65;
        margin: 18px 0 0;
        max-width: 720px;
      }

      .meta {
        color: #6d746f;
        font-size: 13px;
        margin-top: 16px;
      }

      h2 {
        border-top: 1px solid #d8d2c6;
        font-size: 28px;
        line-height: 1.15;
        margin: 36px 0 14px;
        padding-top: 28px;
      }

      h3 {
        color: #27342d;
        font-size: 20px;
        line-height: 1.25;
        margin: 28px 0 10px;
      }

      p {
        color: #3f4a43;
        font-size: 16px;
        line-height: 1.72;
        margin: 0 0 14px;
      }

      ul,
      ol {
        color: #3f4a43;
        font-size: 16px;
        line-height: 1.62;
        margin: 0 0 18px;
        padding-left: 24px;
      }

      li {
        margin: 6px 0;
      }

      strong {
        color: #1d2520;
        font-weight: 800;
      }

      .table-wrap {
        border: 1px solid #d8d2c6;
        border-radius: 8px;
        margin: 22px 0 30px;
        overflow: auto;
        background: #fffdf8;
      }

      table {
        border-collapse: collapse;
        min-width: 760px;
        width: 100%;
      }

      th,
      td {
        border-bottom: 1px solid #e4ded2;
        padding: 14px 16px;
        text-align: left;
        vertical-align: top;
      }

      th {
        background: #eee7db;
        color: #1d2520;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      td {
        color: #3f4a43;
        font-size: 15px;
        line-height: 1.55;
      }

      td:first-child {
        color: #1d2520;
        font-weight: 800;
      }

      tr:last-child td {
        border-bottom: 0;
      }

      .toolbar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
      }

      button {
        background: #1d2520;
        border: 1px solid #1d2520;
        border-radius: 6px;
        color: #fff;
        cursor: pointer;
        font: inherit;
        font-size: 13px;
        font-weight: 800;
        padding: 12px 16px;
      }

      @media print {
        body {
          background: #fff;
        }

        main {
          padding: 0;
          width: 100%;
        }

        .toolbar {
          display: none;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="toolbar">
        <button type="button" onclick="window.print()">Print / Save PDF</button>
      </div>
      <header>
        <p class="eyebrow">Phase 3 Reference</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="intro">A formatted planning reference for page building. Use this to interpret structure, priorities, page intent, messaging notes, and content requirements while assembling the site.</p>
        <p class="meta">Generated ${escapeHtml(generatedAt)}</p>
      </header>
      ${formatReferenceContent(content)}
    </main>
  </body>
</html>`;
}

function formatReferenceContent(content: string) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let listType: "ol" | "ul" | null = null;

  function closeList() {
    if (!listType) {
      return;
    }

    html.push(`</${listType}>`);
    listType = null;
  }

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line) {
      closeList();
      continue;
    }

    if (
      isMarkdownTableRow(line) &&
      index + 1 < lines.length &&
      isMarkdownTableSeparator(lines[index + 1].trim())
    ) {
      closeList();
      const tableLines = [line];
      index += 2;

      while (
        index < lines.length &&
        isMarkdownTableRow(lines[index].trim())
      ) {
        tableLines.push(lines[index].trim());
        index += 1;
      }

      index -= 1;
      html.push(formatMarkdownTable(tableLines));
      continue;
    }

    const headingMatch = /^(#{1,4})\s+(.+)$/.exec(line);
    const unorderedMatch = /^[-*•]\s+(.+)$/.exec(line);
    const orderedMatch = /^\d+[.)]\s+(.+)$/.exec(line);

    if (headingMatch) {
      closeList();
      const level = Math.min(headingMatch[1].length + 1, 3);
      html.push(
        `<h${level}>${formatInlineText(headingMatch[2])}</h${level}>`,
      );
      continue;
    }

    if (orderedMatch || unorderedMatch) {
      const nextListType = orderedMatch ? "ol" : "ul";

      if (listType !== nextListType) {
        closeList();
        html.push(`<${nextListType}>`);
        listType = nextListType;
      }

      html.push(`<li>${formatInlineText((orderedMatch ?? unorderedMatch)?.[1] ?? "")}</li>`);
      continue;
    }

    if (line.endsWith(":") && line.length <= 90) {
      closeList();
      html.push(`<h2>${formatInlineText(line.replace(/:$/, ""))}</h2>`);
      continue;
    }

    closeList();
    html.push(`<p>${formatInlineText(line)}</p>`);
  }

  closeList();

  return html.join("\n");
}

function formatMarkdownTable(tableLines: string[]) {
  const [headerLine, ...bodyLines] = tableLines;
  const headers = splitMarkdownTableRow(headerLine);
  const rows = bodyLines
    .map((line) => splitMarkdownTableRow(line))
    .map((row) => normalizeContentPlanTableRow(headers, row))
    .filter((row) => row.some((cell) => cell.length > 0));

  return `<div class="table-wrap">
  <table>
    <thead>
      <tr>${headers
        .map((header) => `<th>${formatInlineText(header)}</th>`)
        .join("")}</tr>
    </thead>
    <tbody>
      ${rows
        .map(
          (row) =>
            `<tr>${headers
              .map(
                (_header, cellIndex) =>
                  `<td>${formatInlineText(row[cellIndex] ?? "")}</td>`,
              )
              .join("")}</tr>`,
        )
        .join("\n")}
    </tbody>
  </table>
</div>`;
}

function normalizeContentPlanTableRow(headers: string[], row: string[]) {
  const sectionIndex = headers.findIndex((header) =>
    /^section$/i.test(header),
  );
  const semanticRoleIndex = headers.findIndex((header) =>
    /^semantic role$/i.test(header),
  );

  if (sectionIndex < 0 || semanticRoleIndex < 0) {
    return row;
  }

  const sectionName = row[sectionIndex] ?? "";
  const semanticRole = row[semanticRoleIndex] ?? "";

  if (!/\bfaq\b/i.test(sectionName) || !/\bdecision\b/i.test(semanticRole)) {
    return row;
  }

  const nextRow = [...row];
  nextRow[semanticRoleIndex] = semanticRole.replace(/\bDecision\b/gi, "Utility");

  return nextRow;
}

function splitMarkdownTableRow(line: string) {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isMarkdownTableRow(line: string) {
  return line.startsWith("|") && line.endsWith("|") && line.includes("|");
}

function isMarkdownTableSeparator(line: string) {
  if (!isMarkdownTableRow(line)) {
    return false;
  }

  return splitMarkdownTableRow(line).every((cell) => /^:?-{3,}:?$/.test(cell));
}

function formatInlineText(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getPageStatusLabel(
  detected: boolean,
  status: StrategyPageStatus,
) {
  if (!detected) {
    return "No Copy Yet";
  }

  if (status === "ready") {
    return "Ready";
  }

  if (status === "staged") {
    return "Staged";
  }

  return "Needs Template";
}

function getPageStatusClassName(
  detected: boolean,
  status: StrategyPageStatus,
) {
  if (!detected) {
    return "text-service-muted";
  }

  if (status === "ready") {
    return "text-green-700";
  }

  if (status === "staged") {
    return "text-service-accent";
  }

  return "text-amber-700";
}

function groupStagedPagesByPageType(pages: StagedStrategyPageSummary[]) {
  const groups = new Map<string, StagedStrategyPageSummary[]>();

  for (const page of pages) {
    if (!isRepeatablePageType(page.pageType)) {
      continue;
    }

    const key = normalizePageType(page.pageType);
    groups.set(key, [...(groups.get(key) ?? []), page]);
  }

  return groups;
}

function normalizePageType(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

const primaryButtonClass =
  "radius-button inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap border border-service-accent bg-service-accent px-5 type-caption font-semibold text-white transition-colors hover:bg-service-ink disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto";

const secondaryButtonClass =
  "radius-button inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap border border-service-border bg-white px-5 type-caption font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent sm:w-auto";

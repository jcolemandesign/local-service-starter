"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
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
import {
  buildTemplateCopyContract,
  type TemplateCopyContractTemplate,
} from "@/utils/template-copy-contract";
import {
  buildCopywritingAgentInstructions,
  copywritingLeverDefinitions,
  copywritingPersonalityPackets,
  getCopywritingLeverInstruction,
  getCopywritingPersonalityPacket,
  normalizeCopywritingSettings,
} from "@/content/copywriting-personality-packets";
import type {
  StrategyWorkspace,
  StrategyWorkspaceFields,
  StrategyWorkspacePacketIssue,
  StrategyWorkspacePacketSummary,
} from "@/utils/strategy-workspace";
import type { StrategySnapshot } from "@/utils/strategy-snapshots";

type SaveState = "idle" | "saving" | "saved" | "error";
type ContentPlanReferenceState = "idle" | "generated" | "error";
type ContractCopyState = "copied" | "error";

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
  template?: TemplateCopyContractTemplate;
  templateId: string;
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
          id?: string;
          name?: string;
          pageType?: string;
        };
      };
    }
  | { ok: false; error?: string };

function cx(...classes: Array<false | string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
  const [fields, setFieldsState] = useState<StrategyWorkspaceFields>(
    initialWorkspace.fields,
  );
  const fieldsRef = useRef(initialWorkspace.fields);
  const [snapshot, setSnapshot] = useState<StrategySnapshot | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [packetCopyState, setPacketCopyState] = useState<
    "idle" | "copied" | "error"
  >("idle");
  const [digestCopyState, setDigestCopyState] = useState<
    "idle" | "copied" | "error"
  >("idle");
  const [voicePacketCopyState, setVoicePacketCopyState] = useState<
    "idle" | "copied" | "error"
  >("idle");
  const [fieldCopyState, setFieldCopyState] = useState<
    Partial<Record<string, "copied" | "error">>
  >({});
  const [contractCopyState, setContractCopyState] = useState<
    Partial<Record<string, ContractCopyState>>
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
      Object.entries(fields).filter(
        ([key, value]) =>
          !key.startsWith("layoutApproval.") && value.trim().length > 0,
      ).length,
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
          stagedPageId: stagedPage?.pageId ?? "",
          stagedPageLabel: stagedPage?.pageLabel ?? "",
          stagedTemplate: stagedPage?.template,
          templateId: stagedPage?.templateId ?? "",
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
  const copywritingSettings = useMemo(
    () => normalizeCopywritingSettings(fields),
    [fields],
  );
  const selectedCopywritingPacket = useMemo(
    () => getCopywritingPersonalityPacket(copywritingSettings.personalityId),
    [copywritingSettings.personalityId],
  );
  const showAssemblyOverview = Boolean(updatedAt) || saveState === "saved";

  function setFields(
    nextFields:
      | StrategyWorkspaceFields
      | ((currentFields: StrategyWorkspaceFields) => StrategyWorkspaceFields),
  ) {
    const resolvedFields =
      typeof nextFields === "function"
        ? nextFields(fieldsRef.current)
        : nextFields;

    fieldsRef.current = resolvedFields;
    setFieldsState(resolvedFields);
  }

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

  async function saveWorkspace(nextFields = fieldsRef.current) {
    setSaveState("saving");

    try {
      const response = await fetch("/api/strategy-workspace", {
        body: JSON.stringify({
          clientSlug,
          fields: nextFields,
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

  function updateLayoutApproval(pageId: string, isApproved: boolean) {
    const layoutApprovalKey = getPageLayoutApprovalField(pageId);
    const nextFields = {
      ...fieldsRef.current,
      [layoutApprovalKey]: isApproved ? "approved" : "",
    };

    setFields(nextFields);
    clearWorkspaceFieldCopyState(layoutApprovalKey);
    void saveWorkspace(nextFields);
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

  async function copyCopywritingVoicePacket() {
    if (!navigator.clipboard?.writeText) {
      setVoicePacketCopyState("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(buildCopywritingAgentInstructions(fields));
      setVoicePacketCopyState("copied");
    } catch {
      setVoicePacketCopyState("error");
    }
  }

  function updateCopywritingPersonality(personalityId: string) {
    const nextPacket = getCopywritingPersonalityPacket(personalityId);
    const nextLeverFields = Object.fromEntries(
      copywritingLeverDefinitions.map((lever) => [
        lever.fieldKey,
        String(nextPacket.defaultLevers[lever.id]),
      ]),
    );

    setFields((currentFields) => ({
      ...currentFields,
      ...nextLeverFields,
      copywritingPersonalityId: nextPacket.id,
    }));

    if (saveState !== "idle") {
      setSaveState("idle");
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

  async function copyPageTemplateContract(page: (typeof assemblyPages)[number]) {
    const copyKey = page.stagedPageId || page.id;
    const template =
      templates.find((item) => item.id === page.templateId) ??
      page.stagedTemplate;

    if (!template || !navigator.clipboard?.writeText) {
      setContractCopyFeedback(copyKey, "error");
      return;
    }

    const contract = buildTemplateCopyContract({
      pageLabel: page.stagedPageLabel || page.label,
      pageSlug: page.stagedPageId || page.id,
      strategySnapshot: snapshot
        ? {
            clientSlug: snapshot.clientSlug,
            id: snapshot.id,
            pageCount: detectedPageCount,
            version: snapshot.version,
          }
        : undefined,
      template,
    });

    try {
      await navigator.clipboard.writeText(contract);
      setContractCopyFeedback(copyKey, "copied");
    } catch {
      setContractCopyFeedback(copyKey, "error");
    }
  }

  function setContractCopyFeedback(copyKey: string, state: ContractCopyState) {
    setContractCopyState((currentState) => ({
      ...currentState,
      [copyKey]: state,
    }));

    window.setTimeout(() => {
      setContractCopyState((currentState) => {
        const nextState = { ...currentState };
        delete nextState[copyKey];
        return nextState;
      });
    }, 1600);
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
        templateId: result.page.template?.id ?? template.id,
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
    <Section className="strategy-workspace strategy-chrome token-chrome min-h-svh">
      <div className="strategy-toolbar fixed inset-x-0 top-0 z-40 flex flex-wrap items-center justify-end gap-2 border-b px-[var(--container-gutter)] py-3">
        <Link
          className={strategyNavButtonClass}
          href="/dev/pagebuilder"
          rel="noreferrer"
          target="_blank"
        >
          <StrategyNavIcon icon="pagebuilder" />
          Page Builder
        </Link>
        <Link
          className={strategyNavButtonClass}
          href="/sections"
          rel="noreferrer"
          target="_blank"
        >
          <StrategyNavIcon icon="sections" />
          Section Library
        </Link>
        <Link
          className={strategyNavButtonClass}
          href="/dev/style-guide"
          rel="noreferrer"
          target="_blank"
        >
          <StrategyNavIcon icon="style" />
          Style Guide
        </Link>
        <button
          className={strategyNavButtonClass}
          onClick={openContentPlanReference}
          type="button"
        >
          <StrategyNavIcon icon="plan" />
          Build plan
        </button>
        <Link
          className={strategyNavButtonClass}
          href="/dev/templates"
          rel="noreferrer"
          target="_blank"
        >
          <StrategyNavIcon icon="templates" />
          Template library
        </Link>
        <Link
          className={strategyNavButtonClass}
          href={`/dev/prompt-library?project=${clientSlug}`}
          rel="noreferrer"
          target="_blank"
        >
          <StrategyNavIcon icon="prompts" />
          Prompt library
        </Link>
        <Link
          className={strategyNavButtonClass}
          href={`/api/agent-export?clientSlug=${encodeURIComponent(clientSlug)}`}
          rel="noreferrer"
          target="_blank"
        >
          <StrategyNavIcon icon="download" />
          Agent doc
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
              <h1 className="type-heading-xl mt-eyebrow-heading-lg text-text-main">
                {clientSlug}
              </h1>
              <p className="type-text-lg wrap-pretty mt-heading-body-md text-text-muted">
                Local saved workspace for research, strategy outputs, content
                planning, and page copy tied to this project.
              </p>
            </div>
          </div>

          {showAssemblyOverview ? (
            <div>
              <div className="grid gap-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="fluid-type-frame min-w-0 flex-1">
                    <p className="type-label text-service-accent">
                      Site Assembly Overview
                    </p>
                    <h2 className="type-heading-md mt-eyebrow-heading-sm text-text-main">
                      {detectedPageCount} pages detected from the saved strategy
                    </h2>
                  <p className="type-text-sm wrap-pretty mt-heading-body-sm max-w-none text-text-muted">
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
                    const pageCopyValue =
                      fields[getStrategyPageCopyField(page)] ?? "";
                    const hasPageCopy = pageCopyValue.trim().length > 0;
                    const templateCopyKey = page.stagedPageId || page.id;
                    const layoutApprovalKey = getPageLayoutApprovalField(page.id);
                    const isLayoutApproved =
                      fields[layoutApprovalKey] === "approved";

                    return (
                      <div
                        className={`token-chrome-card relative rounded-[var(--chrome-radius-control)] border p-4 pr-16 transition-colors ${
                          hasTemplateReady
                            ? "strategy-page-card-ready"
                            : ""
                        }`}
                        key={page.id}
                      >
                        <TemplateReadyIcon
                          copyState={contractCopyState[templateCopyKey]}
                          isReady={hasTemplateReady}
                          onCopy={
                            hasTemplateReady
                              ? () => void copyPageTemplateContract(page)
                              : undefined
                          }
                        />
                        <PageCopyReadyIcon isReady={hasPageCopy} />
                        <label
                          className="absolute right-3 top-[7.25rem] flex size-10 cursor-pointer items-center justify-center"
                          title={
                            isLayoutApproved
                              ? "Layout approved"
                              : "Mark layout approved"
                          }
                        >
                          <input
                            aria-label="Layout approved"
                            checked={isLayoutApproved}
                            className="peer sr-only"
                            onChange={(event) =>
                              updateLayoutApproval(page.id, event.target.checked)
                            }
                            type="checkbox"
                          />
                          <span className="pointer-events-none flex size-5 shrink-0 items-center justify-center rounded-[3px] border border-service-border bg-bg-surface transition-colors peer-checked:border-service-accent peer-checked:bg-service-accent peer-checked:[&>svg]:opacity-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-service-accent">
                            <svg
                              aria-hidden="true"
                              className="size-2.5 text-white opacity-0 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 12 12"
                            >
                              <path d="m3 6.2 2 2L9 4" />
                            </svg>
                          </span>
                        </label>
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
                                  className="type-caption rounded-sm border border-service-border bg-bg-surface px-2 py-1 font-semibold text-service-accent hover:text-service-ink"
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

                <div className="token-chrome-panel rounded-[var(--chrome-radius-panel)] border p-5">
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
            </div>
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
                <Card className="token-chrome-panel overflow-hidden rounded-[var(--chrome-radius-panel)] border shadow-none" key={group.title}>
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
                            className="overflow-hidden rounded-[var(--radius-md-token)] border border-service-border bg-bg-surface"
                            key={field.key}
                          >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 marker:hidden max-md:items-start">
                              <span className="flex min-w-0 items-center gap-3 text-sm font-semibold text-service-ink">
                                <InputStatusIcon isComplete={hasFieldValue} />
                                <span className="min-w-0">{field.label}</span>
                              </span>
                              <InputStatusPill isComplete={hasFieldValue} />
                            </summary>
                            <div className="grid gap-2 border-t border-service-border bg-service-surface p-4">
                              {fieldBlock}
                            </div>
                          </details>
                        );
                      }

                      return (
                        <div
                          className="grid gap-2 rounded-[var(--radius-md-token)] border border-service-border bg-bg-surface p-4"
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

          <Card className="token-chrome-panel rounded-[var(--chrome-radius-panel)] border p-5 shadow-none">
            <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-5 max-xl:grid-cols-1">
              <div className="min-w-0">
                <p className="type-label text-service-accent">
                  Copywriting Voice
                </p>
                <h2 className="type-heading-sm mt-eyebrow-heading-sm text-text-main">
                  {selectedCopywritingPacket.name}
                </h2>
                <p className="type-text-sm mt-heading-body-sm text-service-muted">
                  Select the base personality that should be injected into the
                  downloadable page-copy agent instructions. Save the workspace
                  before downloading the agent doc.
                </p>

                <label
                  className="mt-4 grid gap-2 text-sm font-semibold text-service-ink"
                  htmlFor="copywriting-personality"
                >
                  Personality packet
                  <select
                    className="min-h-12 rounded-[var(--radius-md-token)] border border-service-border bg-bg-surface px-3 text-sm font-semibold text-service-ink outline-none transition-colors focus:border-service-accent"
                    id="copywriting-personality"
                    onChange={(event) =>
                      updateCopywritingPersonality(event.currentTarget.value)
                    }
                    value={selectedCopywritingPacket.id}
                  >
                    {copywritingPersonalityPackets.map((packet) => (
                      <option key={packet.id} value={packet.id}>
                        {packet.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="mt-4 grid gap-3 rounded-[var(--radius-md-token)] border border-service-border bg-service-surface p-3">
                  <p className="type-caption font-semibold text-service-accent">
                    Core impression
                  </p>
                  <p className="text-sm leading-relaxed text-service-ink">
                    {selectedCopywritingPacket.coreImpression}
                  </p>
                  <p className="type-caption leading-relaxed text-service-muted">
                    Risk to avoid: {selectedCopywritingPacket.risk}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                  {copywritingLeverDefinitions.map((lever) => {
                    const leverValue = copywritingSettings.levers[lever.id];

                    return (
                      <label
                        className="grid gap-2 rounded-[var(--radius-md-token)] border border-service-border bg-service-surface p-3"
                        htmlFor={`copywriting-lever-${lever.id}`}
                        key={lever.id}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-service-ink">
                            {lever.label}
                          </span>
                          <span className="type-caption font-semibold text-service-accent">
                            {leverValue}/5
                          </span>
                        </span>
                        <input
                          className="accent-service-accent"
                          id={`copywriting-lever-${lever.id}`}
                          max={5}
                          min={1}
                          onChange={(event) =>
                            updateField(lever.fieldKey, event.currentTarget.value)
                          }
                          type="range"
                          value={leverValue}
                        />
                        <span className="flex justify-between gap-3 type-caption text-service-muted">
                          <span>{lever.lowLabel}</span>
                          <span>{lever.highLabel}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="rounded-[var(--radius-md-token)] border border-service-border bg-bg-surface p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="type-caption font-semibold text-service-accent">
                      Agent instruction preview
                    </p>
                    <button
                      className={secondaryButtonClass}
                      onClick={() => void copyCopywritingVoicePacket()}
                      type="button"
                    >
                      Copy voice packet
                    </button>
                  </div>
                  <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-service-muted">
                    {copywritingLeverDefinitions.map((lever) => (
                      <li key={lever.id}>
                        {getCopywritingLeverInstruction(
                          lever,
                          copywritingSettings.levers[lever.id],
                        )}
                      </li>
                    ))}
                  </ul>
                  {voicePacketCopyState === "copied" ? (
                    <p className="type-caption mt-3 font-semibold text-green-700">
                      Voice packet copied.
                    </p>
                  ) : null}
                  {voicePacketCopyState === "error" ? (
                    <p className="type-caption mt-3 font-semibold text-red-700">
                      Could not copy voice packet.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>

          <Card className="token-chrome-panel rounded-[var(--chrome-radius-panel)] border p-5 shadow-none">
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
                    <div className="grid gap-3 border-t border-service-border bg-service-surface p-3">
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
                    <div className="grid gap-3 border-t border-service-border bg-service-surface p-3">
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
                  <div className="grid gap-4 border-t border-service-border bg-service-surface p-3">
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
          className="strategy-template-backdrop fixed inset-0 z-50 grid place-items-center p-4"
          role="dialog"
        >
          <div className="token-chrome-panel-strong max-h-[min(90vh,52rem)] w-full max-w-5xl overflow-y-auto rounded-[var(--chrome-radius-panel)] border">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-service-border bg-bg-surface p-5">
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
                          <span className="type-caption rounded-sm border border-service-border bg-bg-surface px-3 py-1 text-service-muted">
                            {template.pageType}
                          </span>
                        </div>

                        {template.notes ? (
                          <p className="type-text-sm mt-3 text-service-muted">
                            {template.notes}
                          </p>
                        ) : null}

                        <details className="mt-4 rounded-sm border border-service-border bg-bg-surface">
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
              <span className="rounded-[var(--radius-sm-token)] border border-current/20 bg-bg-surface/70 px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em]">
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
              <p className="mt-3 break-words rounded-[var(--radius-sm-token)] bg-bg-surface/75 p-3 font-mono text-xs leading-relaxed text-service-ink">
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

function TemplateReadyIcon({
  copyState,
  isReady,
  onCopy,
}: {
  copyState?: ContractCopyState;
  isReady: boolean;
  onCopy?: () => void;
}) {
  const label =
    copyState === "copied"
      ? "Template contract copied"
      : copyState === "error"
        ? "Template contract could not be copied"
        : isReady
          ? "Copy template contract"
          : "Waiting for template";
  const className = cx(
    "absolute right-3 top-3 flex size-10 items-center justify-center rounded-sm border transition-[background-color,border-color,color,box-shadow,transform] duration-150 active:translate-y-px active:scale-95",
    isReady
      ? "border-service-accent bg-service-accent text-white hover:shadow-service"
      : "strategy-status-icon-inert",
    isReady &&
      copyState === "copied" &&
      "motion-safe:animate-[template-copy-confirm_560ms_ease-out]",
  );
  const icon = (
    <svg
      aria-hidden="true"
      className="size-7"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.25"
      viewBox="0 0 24 24"
    >
      <rect height="15" rx="0.75" width="14" x="5" y="4.5" />
      <path d="M5 8.5h14" />
      <rect height="3.5" rx="0.35" width="3.5" x="8" y="11.5" />
      <path d="M14 11.75h2.5M14 14.25h2.5" />
    </svg>
  );

  if (!isReady || !onCopy) {
    return (
      <>
        <span aria-label={label} className={className} title={label}>
          {icon}
        </span>
        {copyState === "error" ? (
          <span className="pointer-events-none absolute right-14 top-4 type-caption font-semibold text-service-muted">
            Not copied
          </span>
        ) : null}
      </>
    );
  }

  return (
    <>
      <button
        aria-label={label}
        className={className}
        onClick={onCopy}
        title={label}
        type="button"
      >
        {icon}
      </button>
      {copyState === "copied" ? (
        <span className="pointer-events-none absolute right-14 top-4 type-caption font-semibold text-service-accent motion-safe:animate-[template-copy-message_1200ms_ease-out_both]">
          Copied!
        </span>
      ) : null}
      {copyState === "error" ? (
        <span className="pointer-events-none absolute right-14 top-4 type-caption font-semibold text-service-muted">
          Not copied
        </span>
      ) : null}
    </>
  );
}

function PageCopyReadyIcon({ isReady }: { isReady: boolean }) {
  const label = isReady ? "Page copy filled" : "Page copy empty";

  return (
    <span
      aria-label={label}
      className={`absolute right-3 top-16 flex size-10 items-center justify-center rounded-sm border ${
        isReady
          ? "border-accent bg-accent text-white"
          : "strategy-status-icon-inert"
      }`}
      title={label}
    >
      <svg
        aria-hidden="true"
        className="size-7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
        viewBox="0 0 24 24"
      >
        <path d="M7.25 3.75h7.5l3 3v13.5H7.25z" />
        <path d="M14.75 3.75v3h3" />
        <path d="M10 12h5M10 15h5" />
      </svg>
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
            : "border-service-border bg-bg-surface text-service-muted"
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
  const formattedContent = formatReferenceContent(content);
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
        scroll-margin-top: 24px;
      }

      h3 {
        color: #27342d;
        font-size: 20px;
        line-height: 1.25;
        margin: 28px 0 10px;
        scroll-margin-top: 24px;
      }

      .toc {
        background: #fffdf8;
        border: 1px solid #d8d2c6;
        border-radius: 8px;
        margin: 0 0 36px;
        padding: 20px;
      }

      .toc-title {
        color: #1d2520;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.06em;
        margin: 0 0 12px;
        text-transform: uppercase;
      }

      .toc-list {
        display: grid;
        gap: 4px 20px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .toc-list a {
        color: #3f4a43;
        font-size: 15px;
        font-weight: 700;
        line-height: 1.3;
        text-decoration: none;
      }

      .toc-list a:hover {
        color: #8a5f2d;
      }

      @media (max-width: 720px) {
        .toc-list {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 480px) {
        .toc-list {
          grid-template-columns: 1fr;
        }
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
      ${formatReferenceToc(formattedContent.headings)}
      ${formattedContent.html}
    </main>
  </body>
</html>`;
}

type ReferenceHeading = {
  id: string;
  label: string;
  sourceLevel: number;
};

function formatReferenceContent(content: string) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  const headings: ReferenceHeading[] = [];
  const headingIds = new Map<string, number>();
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
      const label = stripMarkdownFormatting(headingMatch[2]);
      const id = createReferenceHeadingId(label, headingIds);
      headings.push({
        id,
        label,
        sourceLevel: headingMatch[1].length,
      });
      html.push(
        `<h${level} id="${escapeHtml(id)}">${formatInlineText(headingMatch[2])}</h${level}>`,
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

  return { headings, html: html.join("\n") };
}

function createReferenceHeadingId(label: string, headingIds: Map<string, number>) {
  const baseId =
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "section";
  const count = headingIds.get(baseId) ?? 0;
  headingIds.set(baseId, count + 1);

  return count === 0 ? baseId : `${baseId}-${count + 1}`;
}

function formatReferenceToc(headings: ReferenceHeading[]) {
  const pageMapHeadingIndex = headings.findIndex((heading) =>
    /page-by-page content map/i.test(heading.label),
  );

  if (pageMapHeadingIndex === -1) {
    return "";
  }

  const pageMapHeading = headings[pageMapHeadingIndex];
  const pageHeadings: ReferenceHeading[] = [];

  for (const heading of headings.slice(pageMapHeadingIndex + 1)) {
    if (heading.sourceLevel <= pageMapHeading.sourceLevel) {
      break;
    }

    if (heading.sourceLevel === pageMapHeading.sourceLevel + 1) {
      pageHeadings.push(heading);
    }
  }

  if (pageHeadings.length === 0) {
    return "";
  }

  return `<nav class="toc" aria-label="Page instructions table of contents">
  <p class="toc-title">Page instructions</p>
  <ul class="toc-list">
    ${pageHeadings
      .map(
        (heading) =>
          `<li><a href="#${escapeHtml(heading.id)}">${escapeHtml(heading.label)}</a></li>`,
      )
      .join("\n    ")}
  </ul>
</nav>`;
}

function stripMarkdownFormatting(value: string) {
  return value
    .replace(/!?(?:\[([^\]]+)\])\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
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

function getPageLayoutApprovalField(pageId: string) {
  return `layoutApproval.${pageId}`;
}

type StrategyNavIconName =
  | "agent"
  | "download"
  | "pagebuilder"
  | "plan"
  | "prompts"
  | "sections"
  | "style"
  | "templates";

function StrategyNavIcon({ icon }: { icon: StrategyNavIconName }) {
  const paths: Record<StrategyNavIconName, string[]> = {
    agent: ["M8 5h8", "M7 9h10", "M7 13h6", "M5 3h14v18H5z"],
    download: ["M12 4v10", "M8 10l4 4 4-4", "M5 20h14"],
    pagebuilder: ["M4 5h7v7H4z", "M13 5h7v4h-7z", "M13 11h7v8h-7z", "M4 14h7v5H4z"],
    plan: ["M7 4h10l3 3v13H7z", "M17 4v4h4", "M10 11h7", "M10 15h5"],
    prompts: ["M5 6h14v10H8l-3 3z", "M8 10h8", "M8 13h5"],
    sections: ["M5 5h14v4H5z", "M5 11h14v4H5z", "M5 17h14v2H5z"],
    style: ["M12 4l7 4v8l-7 4-7-4V8z", "M12 4v16", "M5 8l7 4 7-4"],
    templates: ["M4 5h16v14H4z", "M8 5v14", "M4 10h16", "M12 10v9"],
  };

  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      {paths[icon].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}

const strategyNavButtonClass =
  "token-chrome-control inline-flex min-h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[var(--chrome-radius-control)] border px-3 type-caption font-semibold transition-colors";

const primaryButtonClass =
  "token-chrome-primary inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-[var(--chrome-radius-control)] border px-5 type-caption font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto";

const secondaryButtonClass =
  "token-chrome-control inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-[var(--chrome-radius-control)] border px-5 type-caption font-semibold transition-colors sm:w-auto";

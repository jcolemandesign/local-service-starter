"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, Section } from "@/components/primitives";
import {
  buildStrategyNavigation,
  deriveStrategyPagesFromFields,
} from "@/utils/strategy-site-map";
import type {
  StrategyWorkspace,
  StrategyWorkspaceFields,
  StrategyWorkspacePacketIssue,
  StrategyWorkspacePacketSummary,
} from "@/utils/strategy-workspace";
import type { StrategySnapshot } from "@/utils/strategy-snapshots";

type SaveState = "idle" | "saving" | "saved" | "error";

type StrategyWorkspaceSectionProps = {
  clientSlug: string;
  initialWorkspace: StrategyWorkspace;
  packetSummary: StrategyWorkspacePacketSummary;
  strategyDigestText: string;
  sourcePacketText: string;
};

const fieldGroups: {
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
        label: "Supplemental research",
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
        label: "Website Strategy Brief",
        minRows: 14,
        placeholder: "Paste Phase 2 output here.",
      },
      {
        key: "contentPlan",
        label: "Website Content Plan",
        minRows: 14,
        placeholder: "Paste Phase 3 output here.",
      },
    ],
    title: "Planning Outputs",
  },
  {
    description: "After choosing page templates, run Phase 4 with each Template Copy Contract and paste the reviewed output into the matching page slot.",
    fields: [
      {
        key: "homepageCopy",
        label: "Homepage copy",
        minRows: 12,
        placeholder: "Paste Phase 4 homepage output here.",
      },
      {
        key: "servicesCopy",
        label: "Services page copy",
        minRows: 12,
        placeholder: "Paste Phase 4 services page output here.",
      },
      {
        key: "aboutCopy",
        label: "About page copy",
        minRows: 10,
        placeholder: "Paste Phase 4 about page output here.",
      },
      {
        key: "contactCopy",
        label: "Contact page copy",
        minRows: 10,
        placeholder: "Paste Phase 4 contact page output here.",
      },
      {
        key: "thankYouCopy",
        label: "Thank you page copy",
        minRows: 8,
        placeholder: "Paste Phase 4 thank-you page output here.",
      },
    ],
    title: "Page Copy",
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

export function StrategyWorkspaceSection({
  clientSlug,
  initialWorkspace,
  packetSummary,
  strategyDigestText,
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
    Partial<Record<keyof StrategyWorkspaceFields, "copied" | "error">>
  >({});
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
  const navigation = useMemo(
    () => buildStrategyNavigation(strategyPages),
    [strategyPages],
  );
  const detectedPageCount = strategyPages.filter((page) => page.detected).length;
  const showAssemblyOverview = Boolean(updatedAt) || saveState === "saved";

  function updateField(key: keyof StrategyWorkspaceFields, value: string) {
    setFields((currentFields) => ({
      ...currentFields,
      [key]: value,
    }));
    setFieldCopyState((currentState) => ({
      ...currentState,
      [key]: undefined,
    }));

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

  async function copyWorkspaceField(key: keyof StrategyWorkspaceFields) {
    const value = fields[key];

    if (!value) {
      setFieldCopyState((currentState) => ({
        ...currentState,
        [key]: "error",
      }));
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setFieldCopyState((currentState) => ({
        ...currentState,
        [key]: "copied",
      }));
    } catch {
      setFieldCopyState((currentState) => ({
        ...currentState,
        [key]: "error",
      }));
    }
  }

  return (
    <Section className="min-h-svh bg-service-surface text-service-ink">
      <div className="w-full px-[var(--container-gutter)]">
        <div className="grid layout-gap-lrg">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.45fr)] lg:items-end">
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

            <Card className="p-5">
              <div className="grid gap-4">
                <div>
                  <p className="type-label text-service-accent">Strategy Inputs</p>
                  <p className="type-text-sm mt-heading-body-sm text-service-muted">
                    {packetSummary.exists
                      ? "Source packet found. Strategy digest is the prompt-ready version."
                      : "No source packet found for this project slug."}
                  </p>
                </div>
                <div className="grid gap-2 type-caption text-service-muted">
                  <span className="break-all rounded-[var(--radius-md-token)] bg-service-surface px-3 py-2 font-mono text-service-ink">
                    {packetSummary.outputPath}
                  </span>
                  <span className="break-all rounded-[var(--radius-md-token)] bg-service-surface px-3 py-2 font-mono text-service-ink">
                    src/content/projects/{clientSlug}/strategy-digest.md
                  </span>
                  {strategyDigestText ? (
                    <details className="rounded-[var(--radius-md-token)] border border-service-border bg-white">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3 font-semibold text-service-ink marker:hidden">
                        <span>Strategy digest</span>
                        <span className="text-service-muted">Open</span>
                      </summary>
                      <div className="grid gap-3 border-t border-service-border p-3">
                        <button
                          className={secondaryButtonClass}
                          onClick={() => void copyStrategyDigest()}
                          type="button"
                        >
                          Copy strategy digest
                        </button>
                        {digestCopyState === "copied" ? (
                          <p className="font-semibold text-green-700">
                            Strategy digest copied.
                          </p>
                        ) : null}
                        {digestCopyState === "error" ? (
                          <p className="font-semibold text-red-700">
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
                    <details className="rounded-[var(--radius-md-token)] border border-service-border bg-white">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3 font-semibold text-service-ink marker:hidden">
                        <span>Source packet audit text</span>
                        <span className="text-service-muted">Open</span>
                      </summary>
                      <div className="grid gap-3 border-t border-service-border p-3">
                        <button
                          className={secondaryButtonClass}
                          onClick={() => void copySourcePacket()}
                          type="button"
                        >
                          Copy source packet
                        </button>
                        {packetCopyState === "copied" ? (
                          <p className="font-semibold text-green-700">
                            Source packet copied.
                          </p>
                        ) : null}
                        {packetCopyState === "error" ? (
                          <p className="font-semibold text-red-700">
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
                  <span>{filledCount} saved workspace sections started</span>
                  {updatedAt ? (
                    <span>Last saved {formatDate(updatedAt)}</span>
                  ) : (
                    <span>Not saved yet</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Metric label="Source items" value={packetSummary.totalSourceItems} />
                  <Metric
                    label="Verified quotes"
                    value={packetSummary.verifiedQuoteItems}
                  />
                  <Metric label="Conflicts" value={packetSummary.conflictItems} />
                  <Metric label="Missing info" value={packetSummary.missingInfoItems} />
                </div>
                {(packetSummary.conflicts.length > 0 ||
                  packetSummary.missingInfo.length > 0) ? (
                  <details className="rounded-[var(--radius-md-token)] border border-service-border bg-service-surface">
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
                <div className="flex flex-wrap gap-2">
                  <Link
                    className={secondaryButtonClass}
                    href={`/dev/prompt-library?project=${clientSlug}`}
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
                {saveState === "saved" ? (
                  <p className="type-caption font-semibold text-green-700">
                    Workspace saved. Strategy snapshot frozen.
                  </p>
                ) : null}
                {saveState === "error" ? (
                  <p className="type-caption font-semibold text-red-700">
                    Unable to save workspace.
                  </p>
                ) : null}
              </div>
            </Card>
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
                  <Link className={secondaryButtonClass} href="/dev/templates">
                    Choose templates
                  </Link>
                </div>

                <div className="grid grid-cols-5 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
                  {strategyPages.map((page) => (
                    <div
                      className="rounded-[var(--radius-md-token)] border border-service-border bg-service-surface p-3"
                      key={page.id}
                    >
                      <p className="type-caption font-semibold text-service-accent">
                        {page.detected ? "Needs Template" : "No Copy Yet"}
                      </p>
                      <h3 className="mt-2 text-base font-semibold text-service-ink">
                        {page.label}
                      </h3>
                      <p className="type-caption mt-1 text-service-muted">
                        {page.path}
                      </p>
                    </div>
                  ))}
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

          <div className="grid card-grid-gap-lrg">
            {fieldGroups.map((group) => (
              <Card className="p-5" key={group.title}>
                <div className="grid card-grid-gap-med">
                  <div>
                    <p className="type-label text-service-accent">
                      {group.title}
                    </p>
                    <p className="type-text-sm mt-heading-body-sm text-service-muted">
                      {group.description}
                    </p>
                  </div>

                  <div className="grid gap-5">
                    {group.fields.map((field) => (
                      <div
                        className="grid gap-2 rounded-[var(--radius-md-token)] border border-service-border bg-service-surface p-4"
                        key={field.key}
                      >
                        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
                          <label
                            className="text-sm font-semibold text-service-ink"
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
                          className="mx-auto min-h-48 w-full max-w-5xl rounded-[var(--radius-md-token)] border border-service-border bg-white p-4 text-sm font-normal leading-relaxed text-service-ink outline-none transition-colors placeholder:text-service-muted focus:border-service-accent"
                          id={`strategy-field-${field.key}`}
                          onChange={(event) =>
                            updateField(field.key, event.currentTarget.value)
                          }
                          placeholder={field.placeholder}
                          rows={field.minRows}
                          value={fields[field.key]}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const primaryButtonClass =
  "radius-button inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap border border-service-accent bg-service-accent px-5 type-caption font-semibold text-white transition-colors hover:bg-service-ink disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto";

const secondaryButtonClass =
  "radius-button inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap border border-service-border bg-white px-5 type-caption font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent sm:w-auto";

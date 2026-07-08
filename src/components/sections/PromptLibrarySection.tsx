"use client";

import { useState } from "react";
import { Card, Container, Section } from "@/components/primitives";
import {
  promptLibraryPrompts,
  promptLibraryWorkflow,
  type PromptLibraryPrompt,
} from "@/content/prompt-library-prompts";
import type { StrategyPageSummary } from "@/utils/strategy-site-map";
import type { StrategyWorkspaceFields } from "@/utils/strategy-workspace";

const strategyDigestPlaceholders = [
  "[paste strategy-digest.md here]",
  "[paste strategy digest here]",
];

const workspacePromptPlaceholders: Array<{
  key: keyof StrategyWorkspaceFields;
  placeholders: string[];
}> = [
  {
    key: "supplementalResearch",
    placeholders: [
      "[paste existing site notes, GBP notes, reviews, competitor notes, or asset notes here if available]",
    ],
  },
  {
    key: "strategyBrief",
    placeholders: [
      "[paste Website Strategy Brief here]",
    ],
  },
  {
    key: "contentPlan",
    placeholders: [
      "[paste page-specific plan from sitemap/content plan here]",
    ],
  },
  {
    key: "generalNotes",
    placeholders: [
      "[paste optional manual notes here]",
    ],
  },
];

function copyWithFallback(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

type PromptLibrarySectionProps = {
  clientSlug: string;
  stagedPageContracts: StagedPageContract[];
  strategyPages: StrategyPageSummary[];
  strategyDigestText: string;
  strategyWorkspaceFields: StrategyWorkspaceFields | null;
};

type StagedPageContract = {
  contract: string;
  pageHref: string;
  pageId: string;
  pageLabel: string;
  pageType: string;
  templateName: string;
};

type PromptLibraryWorkspaceResponse =
  | {
      ok: true;
      workspace: {
        fields: StrategyWorkspaceFields;
      };
    }
  | {
      ok: false;
    };

type FinalPageOption = {
  fieldKey: keyof StrategyWorkspaceFields;
  href: string;
  id: string;
  label: string;
  pageType: string;
  promptValue: string;
};

type FinalPageGroup = {
  description: string;
  key: string;
  label: string;
  pages: FinalPageOption[];
  sortOrder: number;
};

const fallbackFinalPageOptions = [
  {
    fieldKey: "homepageCopy",
    href: "/",
    id: "homepage",
    label: "Home",
    pageType: "home",
    promptValue: "Home",
  },
  {
    fieldKey: "servicesCopy",
    href: "/services",
    id: "services",
    label: "Services",
    pageType: "services",
    promptValue: "Services",
  },
  {
    fieldKey: "aboutCopy",
    href: "/about",
    id: "about",
    label: "About",
    pageType: "about",
    promptValue: "About",
  },
  {
    fieldKey: "contactCopy",
    href: "/contact",
    id: "contact",
    label: "Contact",
    pageType: "contact",
    promptValue: "Contact",
  },
  {
    fieldKey: "thankYouCopy",
    href: "/thank-you",
    id: "thank-you",
    label: "Thank You",
    pageType: "thank-you",
    promptValue: "Thank You",
  },
] satisfies FinalPageOption[];

export function PromptLibrarySection({
  clientSlug,
  stagedPageContracts,
  strategyPages,
  strategyDigestText,
  strategyWorkspaceFields,
}: PromptLibrarySectionProps) {
  const finalPageOptions = createFinalPageOptions(
    strategyPages,
    stagedPageContracts,
  );
  const phasePrompts = promptLibraryPrompts.filter(
    (prompt) => prompt.id !== "final-page-copy",
  );
  const finalPagePrompt = promptLibraryPrompts.find(
    (prompt) => prompt.id === "final-page-copy",
  );
  const finalPageGroups = groupFinalPageOptions(finalPageOptions);
  const finalPageReadiness = getFinalPageReadiness({
    finalPageOptions,
    stagedPageContracts,
    strategyDigestText,
    strategyWorkspaceFields,
  });
  const [copiedPromptId, setCopiedPromptId] = useState("");

  async function copyPrompt(
    prompt: PromptLibraryPrompt,
    finalPageOption = finalPageOptions[0],
  ) {
    const selectedFinalPageContract = findStagedPageContract(
      stagedPageContracts,
      finalPageOption,
    );
    const freshWorkspaceFields = await readFreshWorkspaceFields({
      clientSlug,
      fallbackFields: strategyWorkspaceFields,
    });
    const clipboardPrompt = buildClipboardPrompt({
      prompt,
      selectedFinalPage: finalPageOption,
      selectedFinalPageContract,
      strategyDigestText,
      strategyWorkspaceFields: freshWorkspaceFields,
    });

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }

      await navigator.clipboard.writeText(clipboardPrompt);
    } catch {
      copyWithFallback(clipboardPrompt);
    }

    const copiedId =
      prompt.id === "final-page-copy"
        ? `${prompt.id}:${finalPageOption.id}`
        : prompt.id;
    setCopiedPromptId(copiedId);
    window.setTimeout(() => {
      setCopiedPromptId((current) => (current === copiedId ? "" : current));
    }, 1800);
  }

  return (
    <Section className="min-h-svh bg-service-surface text-service-ink">
      <Container>
        <div className="grid layout-gap-lrg">
          <div className="grid gap-5">
            <div className="fluid-type-frame">
              <p className="type-label text-service-accent">Prompt Library</p>
              <h1 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
                Prompt Library
              </h1>
              <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
                Canonical prompts for turning a generated strategy digest into a
                strategy brief, content plan, and final page copy.
              </p>
            </div>

            <Card className="p-4 shadow-none">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="min-w-0">
                  <p className="type-label text-service-accent">
                    Auto-filled on copy
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <HydrationPill
                      isFilled={Boolean(strategyDigestText.trim())}
                      label="Strategy digest"
                    />
                    <HydrationPill
                      isFilled={Boolean(
                        strategyWorkspaceFields?.supplementalResearch.trim(),
                      )}
                      label="Supplemental research"
                    />
                    <HydrationPill
                      isFilled={Boolean(
                        strategyWorkspaceFields?.strategyBrief.trim(),
                      )}
                      label="Strategy brief"
                    />
                    <HydrationPill
                      isFilled={Boolean(
                        strategyWorkspaceFields?.contentPlan.trim(),
                      )}
                      label="Content plan"
                    />
                    <HydrationPill
                      isFilled={Boolean(strategyWorkspaceFields?.generalNotes.trim())}
                      label="Manual notes"
                    />
                  </div>
                </div>

                <details className="rounded-[var(--radius-sm-token)] border border-service-border bg-service-surface">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 marker:hidden">
                    <span className="type-caption font-semibold text-service-ink">
                      Workflow
                    </span>
                    <span className="type-caption text-service-muted">
                      Open
                    </span>
                  </summary>
                  <ol className="grid gap-3 border-t border-service-border p-4">
                    {promptLibraryWorkflow.map((step, index) => (
                      <li className="flex gap-3" key={step}>
                        <span className="radius-round flex size-7 shrink-0 items-center justify-center bg-service-accent type-caption font-semibold text-white">
                          {index + 1}
                        </span>
                        <span className="type-text-sm text-service-muted">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </details>
              </div>
            </Card>
          </div>

          <div className="grid card-grid-gap-med">
            {phasePrompts.map((prompt, index) => {
              const isCopied = copiedPromptId === prompt.id;
              const readiness = getPromptReadiness({
                prompt,
                strategyDigestText,
                strategyWorkspaceFields,
              });

              return (
                <Card className="overflow-hidden" key={prompt.id}>
                  <details>
                    <summary className="flex cursor-pointer list-none flex-col gap-4 p-5 marker:hidden lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="type-label text-service-accent">
                            Phase {index + 1}
                          </p>
                          <ReadinessPill readiness={readiness} />
                        </div>
                        <h2 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                          {prompt.title}
                        </h2>
                        <p className="type-text-sm mt-heading-body-sm text-service-muted">
                          {prompt.description}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          className="radius-button inline-flex min-h-11 items-center justify-center border border-service-border px-4 type-caption font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent"
                          onClick={(event) => {
                            event.preventDefault();
                            void copyPrompt(prompt);
                          }}
                          type="button"
                        >
                          {isCopied ? "Copied" : "Copy prompt"}
                        </button>
                        <span className="radius-button inline-flex min-h-11 items-center justify-center border border-service-border px-4 type-caption font-semibold text-service-muted">
                          Review prompt
                        </span>
                      </div>
                    </summary>

                    <div className="grid card-grid-gap-med border-t border-service-border bg-white p-5">
                      <div>
                        <p className="type-label text-service-muted">
                          Required inputs
                        </p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {prompt.inputs.map((input) => (
                            <li
                              className="radius-round bg-service-surface px-3 py-1 type-caption font-semibold text-service-accent"
                              key={input}
                            >
                              {input}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <pre className="max-h-[560px] overflow-auto rounded-[var(--radius-md-token)] bg-service-surface p-4 type-caption leading-relaxed text-service-ink">
                        <code>{prompt.prompt}</code>
                      </pre>
                    </div>
                  </details>
                </Card>
              );
            })}
          </div>

          {finalPagePrompt ? (
            <div className="grid gap-6 border-t border-service-border pt-[var(--section-space-sml)]">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)] lg:items-end">
                <div className="fluid-type-frame">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="type-label text-service-accent">Phase 4</p>
                    <ReadinessPill readiness={finalPageReadiness} />
                  </div>
                  <h2 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
                    Page Copy Queue
                  </h2>
                  <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
                    Copy a page-specific prompt for each detected page from the
                    saved strategy. Template contracts are inserted when that
                    page has already been staged from a selected template.
                  </p>
                </div>
                <Card className="p-5 shadow-none">
                  <p className="type-label text-service-accent">Detected pages</p>
                  <p className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                    {finalPageOptions.length}
                  </p>
                  <p className="type-caption mt-heading-body-sm text-service-muted">
                    {stagedPageContracts.length} with staged template contracts
                  </p>
                </Card>
              </div>

              <div className="grid card-grid-gap-med">
                {finalPageGroups.map((group) => (
                  <details
                    className="rounded-[var(--radius-md-token)] border border-service-border bg-white shadow-service"
                    key={group.key}
                    open
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 marker:hidden">
                      <span>
                        <span className="type-label text-service-accent">
                          {group.label}
                        </span>
                        <span className="type-heading-sm mt-1 block text-service-ink">
                          {group.pages.length}{" "}
                          {group.pages.length === 1 ? "page" : "pages"}
                        </span>
                        <span className="type-caption mt-2 block max-w-2xl text-service-muted">
                          {group.description}
                        </span>
                      </span>
                      <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
                        Open group
                      </span>
                    </summary>
                    <div className="grid gap-3 border-t border-service-border p-5">
                      {group.pages.map((page) => {
                        const contract = findStagedPageContract(
                          stagedPageContracts,
                          page,
                        );
                        const copiedId = `${finalPagePrompt.id}:${page.id}`;
                        const isCopied = copiedPromptId === copiedId;

                        return (
                          <div
                            className="grid gap-4 rounded-[var(--radius-md-token)] border border-service-border bg-service-surface p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
                            key={page.id}
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="type-heading-sm text-service-ink">
                                  {page.label}
                                </h3>
                                <StatusPill
                                  label={
                                    contract
                                      ? `Template: ${contract.templateName}`
                                      : "Needs template"
                                  }
                                  tone={contract ? "ready" : "warning"}
                                />
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <StatusPill label={page.pageType} />
                                <StatusPill label={page.href} />
                              </div>
                            </div>

                            <button
                              className="radius-button inline-flex min-h-11 items-center justify-center border border-service-accent bg-service-accent px-4 type-caption font-semibold text-white transition-colors hover:border-service-ink hover:bg-service-ink disabled:cursor-not-allowed disabled:border-service-border disabled:bg-white disabled:text-service-muted"
                              disabled={!contract}
                              onClick={() => void copyPrompt(finalPagePrompt, page)}
                              type="button"
                            >
                              {contract
                                ? isCopied
                                  ? "Copied"
                                  : "Copy Prompt"
                                : "Needs template"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                ))}
              </div>

              <details className="rounded-[var(--radius-md-token)] border border-service-border bg-white shadow-service">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 marker:hidden">
                  <span>
                    <span className="type-label text-service-accent">
                      Prompt reference
                    </span>
                    <span className="type-heading-sm mt-1 block text-service-ink">
                      {finalPagePrompt.title}
                    </span>
                  </span>
                  <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
                    Review prompt
                  </span>
                </summary>
                <div className="grid card-grid-gap-med border-t border-service-border p-5">
                  <div>
                    <p className="type-label text-service-muted">
                      Required inputs
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {finalPagePrompt.inputs.map((input) => (
                        <li
                          className="radius-round bg-service-surface px-3 py-1 type-caption font-semibold text-service-accent"
                          key={input}
                        >
                          {input}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <pre className="max-h-[560px] overflow-auto rounded-[var(--radius-md-token)] bg-service-surface p-4 type-caption leading-relaxed text-service-ink">
                    <code>{finalPagePrompt.prompt}</code>
                  </pre>
                </div>
              </details>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

function HydrationPill({
  isFilled,
  label,
}: {
  isFilled: boolean;
  label: string;
}) {
  return (
    <span
      className={`radius-round border px-3 py-1 type-caption font-semibold ${
        isFilled
          ? "border-service-accent bg-white text-service-accent"
          : "border-service-border bg-service-surface text-service-muted"
      }`}
    >
      {label}: {isFilled ? "ready" : "empty"}
    </span>
  );
}

function StatusPill({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "ready" | "warning";
}) {
  const toneClasses = {
    default: "border-service-border bg-white text-service-muted",
    ready: "border-service-accent bg-white text-service-accent",
    warning: "border-amber-700 bg-amber-50 text-amber-900",
  } as const;

  return (
    <span
      className={`type-caption rounded-sm border px-3 py-1 font-semibold ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}

type PromptReadiness = {
  label: string;
  tone: "manual" | "missing" | "ready" | "warning";
};

function ReadinessPill({ readiness }: { readiness: PromptReadiness }) {
  const toneClasses = {
    manual: "border-service-border bg-service-surface text-service-muted",
    missing: "border-red-200 bg-red-50 text-red-700",
    ready: "border-service-accent bg-white text-service-accent",
    warning: "border-amber-700 bg-amber-50 text-amber-900",
  } as const;

  return (
    <span
      className={`type-caption rounded-sm border px-2 py-0.5 font-semibold ${toneClasses[readiness.tone]}`}
    >
      {readiness.label}
    </span>
  );
}

function getPromptReadiness({
  prompt,
  strategyDigestText,
  strategyWorkspaceFields,
}: {
  prompt: PromptLibraryPrompt;
  strategyDigestText: string;
  strategyWorkspaceFields: StrategyWorkspaceFields | null;
}): PromptReadiness {
  if (prompt.id === "current-website-scrape") {
    return {
      label: "Manual URL",
      tone: "manual",
    };
  }

  if (prompt.id === "strategy-brief") {
    return getFieldReadiness([
      Boolean(strategyDigestText.trim()),
      Boolean(strategyWorkspaceFields?.supplementalResearch.trim()),
    ]);
  }

  if (prompt.id === "content-plan") {
    return getFieldReadiness([
      Boolean(strategyDigestText.trim()),
      Boolean(strategyWorkspaceFields?.strategyBrief.trim()),
    ]);
  }

  return {
    label: "Ready",
    tone: "ready",
  };
}

function getFinalPageReadiness({
  finalPageOptions,
  stagedPageContracts,
  strategyDigestText,
  strategyWorkspaceFields,
}: {
  finalPageOptions: FinalPageOption[];
  stagedPageContracts: StagedPageContract[];
  strategyDigestText: string;
  strategyWorkspaceFields: StrategyWorkspaceFields | null;
}): PromptReadiness {
  const hasRequiredStrategyFields =
    Boolean(strategyDigestText.trim()) &&
    Boolean(strategyWorkspaceFields?.strategyBrief.trim()) &&
    Boolean(strategyWorkspaceFields?.contentPlan.trim());

  if (!hasRequiredStrategyFields) {
    return {
      label: "Missing inputs",
      tone: "missing",
    };
  }

  const readyPageCount = finalPageOptions.filter((page) =>
    findStagedPageContract(stagedPageContracts, page),
  ).length;

  if (readyPageCount === finalPageOptions.length) {
    return {
      label: "Ready",
      tone: "ready",
    };
  }

  return {
    label: `${readyPageCount}/${finalPageOptions.length} ready`,
    tone: readyPageCount > 0 ? "warning" : "missing",
  };
}

function getFieldReadiness(isReadyValues: boolean[]): PromptReadiness {
  const readyCount = isReadyValues.filter(Boolean).length;

  if (readyCount === isReadyValues.length) {
    return {
      label: "Ready",
      tone: "ready",
    };
  }

  return {
    label: `${readyCount}/${isReadyValues.length} ready`,
    tone: readyCount > 0 ? "warning" : "missing",
  };
}

function buildClipboardPrompt(
  {
    prompt,
    selectedFinalPage,
    selectedFinalPageContract,
    strategyDigestText,
    strategyWorkspaceFields,
  }: {
    prompt: PromptLibraryPrompt;
    selectedFinalPage: FinalPageOption;
    selectedFinalPageContract: StagedPageContract | undefined;
    strategyDigestText: string;
    strategyWorkspaceFields: StrategyWorkspaceFields | null;
  },
) {
  const trimmedStrategyDigest = strategyDigestText.trim();
  let clipboardPrompt = prompt.prompt;

  if (trimmedStrategyDigest) {
    clipboardPrompt = strategyDigestPlaceholders.reduce(
      (currentPrompt, placeholder) =>
        currentPrompt.replaceAll(placeholder, trimmedStrategyDigest),
      clipboardPrompt,
    );
  }

  if (!strategyWorkspaceFields) {
    return hydrateFinalPagePrompt({
      clipboardPrompt,
      prompt,
      selectedFinalPage,
      selectedFinalPageContract,
    });
  }

  clipboardPrompt = workspacePromptPlaceholders.reduce((currentPrompt, replacement) => {
    const fieldValue = strategyWorkspaceFields[replacement.key].trim();

    if (!fieldValue) {
      return currentPrompt;
    }

    return replacement.placeholders.reduce(
      (nextPrompt, placeholder) => nextPrompt.replaceAll(placeholder, fieldValue),
      currentPrompt,
    );
  }, clipboardPrompt);

  return hydrateFinalPagePrompt({
    clipboardPrompt,
    prompt,
    selectedFinalPage,
    selectedFinalPageContract,
  });
}

function hydrateFinalPagePrompt({
  clipboardPrompt,
  prompt,
  selectedFinalPage,
  selectedFinalPageContract,
}: {
  clipboardPrompt: string;
  prompt: PromptLibraryPrompt;
  selectedFinalPage: FinalPageOption;
  selectedFinalPageContract: StagedPageContract | undefined;
}) {
  if (prompt.id !== "final-page-copy") {
    return clipboardPrompt;
  }

  let hydratedPrompt = clipboardPrompt.replaceAll(
    "[Homepage / Services / About / Contact / Thank You / Specific service page / Landing page]",
    selectedFinalPage.promptValue,
  );

  if (selectedFinalPageContract?.contract.trim()) {
    hydratedPrompt = hydratedPrompt.replaceAll(
      "[paste Template Copy Contract here]",
      selectedFinalPageContract.contract.trim(),
    );
    hydratedPrompt = hydratedPrompt.replaceAll(
      "[paste selected template name here]",
      selectedFinalPageContract.templateName,
    );
  }

  return hydratedPrompt;
}

async function readFreshWorkspaceFields({
  clientSlug,
  fallbackFields,
}: {
  clientSlug: string;
  fallbackFields: StrategyWorkspaceFields | null;
}) {
  if (!clientSlug) {
    return fallbackFields;
  }

  try {
    const response = await fetch(
      `/api/strategy-workspace?clientSlug=${encodeURIComponent(clientSlug)}`,
      { cache: "no-store" },
    );
    const result = (await response.json()) as PromptLibraryWorkspaceResponse;

    if (!response.ok || !result.ok) {
      return fallbackFields;
    }

    return result.workspace.fields;
  } catch {
    return fallbackFields;
  }
}

function findStagedPageContract(
  contracts: StagedPageContract[],
  selectedPage: FinalPageOption,
) {
  return contracts.find((contract) => {
    const normalizedPageId = normalizePageKey(contract.pageId);
    const normalizedPageLabel = normalizePageKey(contract.pageLabel);
    const normalizedPageType = normalizePageKey(contract.pageType);

    return (
      contract.pageHref === selectedPage.href ||
      normalizedPageId === selectedPage.id ||
      normalizedPageLabel === normalizePageKey(selectedPage.label) ||
      normalizedPageType === normalizePageKey(selectedPage.pageType) ||
      normalizedPageId.includes(selectedPage.id)
    );
  });
}

function normalizePageKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function createFinalPageOptions(
  strategyPages: StrategyPageSummary[],
  stagedPageContracts: StagedPageContract[],
) {
  const detectedOptions: FinalPageOption[] = strategyPages
    .filter((page) => page.detected)
    .map((page) => ({
      fieldKey: page.copyField,
      href: page.path,
      id: page.id,
      label: page.label,
      pageType: page.pageType,
      promptValue: page.label,
    }));
  const stagedOptions: FinalPageOption[] = stagedPageContracts.map((contract) => ({
    fieldKey: getWorkspaceFieldForPageType(contract.pageType),
    href: contract.pageHref,
    id: contract.pageId,
    label: `${contract.pageLabel} (${contract.pageType})`,
    pageType: contract.pageType,
    promptValue: `${contract.pageLabel} (${contract.pageType}) at ${contract.pageHref}`,
  }));
  const optionsById = new Map<string, FinalPageOption>();

  for (const option of [...detectedOptions, ...stagedOptions]) {
    optionsById.set(option.id, option);
  }

  const mergedOptions = Array.from(optionsById.values());

  return mergedOptions.length > 0 ? mergedOptions : fallbackFinalPageOptions;
}

function groupFinalPageOptions(options: FinalPageOption[]) {
  const groups = new Map<string, FinalPageGroup>();

  for (const option of options) {
    const bucket = getFinalPageBucket(option);
    const currentGroup = groups.get(bucket.key) ?? {
      ...bucket,
      pages: [],
    };

    groups.set(bucket.key, {
      ...currentGroup,
      pages: [...currentGroup.pages, option],
    });
  }

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      pages: group.pages.toSorted((a, b) => sortFinalPageOptions(a, b, group.key)),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function sortFinalPageOptions(
  a: FinalPageOption,
  b: FinalPageOption,
  groupKey: string,
) {
  if (groupKey === "core") {
    return getCorePageSortOrder(a) - getCorePageSortOrder(b);
  }

  return a.label.localeCompare(b.label);
}

function getCorePageSortOrder(option: FinalPageOption) {
  const normalizedId = normalizePageKey(option.id);
  const normalizedType = normalizePageKey(option.pageType);
  const normalizedLabel = normalizePageKey(option.label);
  const normalizedValues = [normalizedId, normalizedType, normalizedLabel];
  const coreOrder = [
    ["home", "homepage"],
    ["about"],
    ["services", "services-overview"],
    ["contact"],
  ];
  const matchIndex = coreOrder.findIndex((aliases) =>
    aliases.some((alias) => normalizedValues.includes(alias)),
  );

  return matchIndex === -1 ? coreOrder.length : matchIndex;
}

function getFinalPageBucket(option: FinalPageOption) {
  const normalizedPageType = normalizePageKey(option.pageType);
  const normalizedId = normalizePageKey(option.id);

  if (
    ["home", "services", "about", "contact"].includes(normalizedId) ||
    ["home", "services-overview", "about", "contact"].includes(normalizedPageType)
  ) {
    return {
      description:
        "Primary site pages that shape the main navigation, trust path, and conversion path.",
      key: "core",
      label: "Core pages",
      sortOrder: 10,
    };
  }

  if (normalizedPageType === "individual-service") {
    return {
      description:
        "Repeatable child pages that use one service template for each priority service.",
      key: "repeatable-services",
      label: "Repeatable service pages",
      sortOrder: 20,
    };
  }

  if (normalizedPageType === "service-area") {
    return {
      description:
        "Coverage pages for the service area overview or individual location pages.",
      key: "service-areas",
      label: "Service area pages",
      sortOrder: 30,
    };
  }

  if (
    normalizedPageType.includes("blog") ||
    normalizedPageType.includes("product")
  ) {
    return {
      description:
        "Resource, article, or product-listing structures that usually come after the core site.",
      key: "content-resources",
      label: "Content and resource pages",
      sortOrder: 40,
    };
  }

  return {
    description:
      "Secondary conversion, offer, plan, financing, confirmation, or utility pages.",
    key: "supporting",
    label: "Supporting pages",
    sortOrder: 50,
  };
}

function getWorkspaceFieldForPageType(
  pageType: string,
): keyof StrategyWorkspaceFields {
  const normalizedPageType = normalizePageKey(pageType);

  if (normalizedPageType.includes("home")) {
    return "homepageCopy";
  }

  if (
    normalizedPageType.includes("service") ||
    normalizedPageType.includes("product")
  ) {
    return "servicesCopy";
  }

  if (normalizedPageType.includes("about")) {
    return "aboutCopy";
  }

  if (normalizedPageType.includes("contact")) {
    return "contactCopy";
  }

  if (normalizedPageType.includes("thank")) {
    return "thankYouCopy";
  }

  return "contentPlan";
}

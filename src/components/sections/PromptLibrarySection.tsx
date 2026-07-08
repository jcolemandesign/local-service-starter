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

const fallbackFinalPageOptions = [
  {
    fieldKey: "homepageCopy",
    href: "/",
    id: "homepage",
    label: "Homepage",
    pageType: "home",
    promptValue: "Homepage",
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
  const finalPageOptions = createFinalPageOptions(strategyPages);
  const [copiedPromptId, setCopiedPromptId] = useState("");
  const [selectedFinalPageId, setSelectedFinalPageId] = useState(
    finalPageOptions[0].id,
  );
  const selectedFinalPage =
    finalPageOptions.find((page) => page.id === selectedFinalPageId) ??
    finalPageOptions[0];
  const selectedFinalPageContract = findStagedPageContract(
    stagedPageContracts,
    selectedFinalPage,
  );

  async function copyPrompt(prompt: PromptLibraryPrompt) {
    const freshWorkspaceFields = await readFreshWorkspaceFields({
      clientSlug,
      fallbackFields: strategyWorkspaceFields,
    });
    const clipboardPrompt = buildClipboardPrompt({
      prompt,
      selectedFinalPage,
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

    setCopiedPromptId(prompt.id);
    window.setTimeout(() => {
      setCopiedPromptId((current) => (current === prompt.id ? "" : current));
    }, 1800);
  }

  return (
    <Section className="min-h-svh bg-service-surface text-service-ink">
      <Container>
        <div className="grid layout-gap-lrg">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(320px,0.45fr)] lg:items-end">
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

            <Card className="p-5">
              <p className="type-label text-service-accent">Workflow</p>
              <ol className="mt-4 grid gap-3">
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
              <div className="mt-5 grid gap-2 border-t border-service-border pt-4">
                <p className="type-label text-service-accent">
                  Auto-filled on copy
                </p>
                <div className="flex flex-wrap gap-2">
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
            </Card>
          </div>

          <div className="grid card-grid-gap-med">
            {promptLibraryPrompts.map((prompt, index) => {
              const isCopied = copiedPromptId === prompt.id;

              return (
                <Card className="overflow-hidden" key={prompt.id}>
                  <details>
                    <summary className="flex cursor-pointer list-none flex-col gap-4 p-5 marker:hidden lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <p className="type-label text-service-accent">
                          Phase {index + 1}
                        </p>
                        <h2 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                          {prompt.title}
                        </h2>
                        <p className="type-text-sm mt-heading-body-sm text-service-muted">
                          {prompt.description}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        {prompt.id === "final-page-copy" ? (
                          <label
                            className="type-caption grid gap-1 font-semibold text-service-muted"
                            onClick={(event) => event.stopPropagation()}
                          >
                            Page
                            <select
                              className="min-h-11 rounded-sm border border-service-border bg-white px-3 text-sm font-normal text-service-ink outline-none transition-colors focus:border-service-accent"
                              value={selectedFinalPageId}
                              onChange={(event) =>
                                setSelectedFinalPageId(event.target.value)
                              }
                            >
                              {finalPageOptions.map((page) => (
                                <option key={page.id} value={page.id}>
                                  {page.label}
                                </option>
                              ))}
                            </select>
                          </label>
                        ) : null}
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
                      {prompt.id === "final-page-copy" ? (
                        <div className="rounded-[var(--radius-md-token)] border border-service-border bg-service-surface p-4">
                          <p className="type-label text-service-accent">
                            Phase 4 target
                          </p>
                          <p className="type-text-sm mt-2 text-service-muted">
                            Copy Prompt will set Page to write to{" "}
                            <span className="font-semibold text-service-ink">
                              {selectedFinalPage.promptValue}
                            </span>
                            {selectedFinalPageContract
                              ? ` and insert the staged template contract for ${selectedFinalPageContract.templateName}.`
                              : ". No staged template contract is available for this page yet."}
                          </p>
                        </div>
                      ) : null}
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

function createFinalPageOptions(strategyPages: StrategyPageSummary[]) {
  const detectedOptions = strategyPages
    .filter((page) => page.detected)
    .map((page) => ({
      fieldKey: page.copyField,
      href: page.path,
      id: page.id,
      label: page.label,
      pageType: page.pageType,
      promptValue: page.label,
    }));

  return detectedOptions.length > 0 ? detectedOptions : fallbackFinalPageOptions;
}

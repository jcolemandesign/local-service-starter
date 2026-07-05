"use client";

import { useState } from "react";
import { Card, Container, Section } from "@/components/primitives";
import {
  promptLibraryPrompts,
  promptLibraryWorkflow,
  type PromptLibraryPrompt,
} from "@/content/prompt-library-prompts";

const strategyDigestPlaceholders = [
  "[paste strategy-digest.md here]",
  "[paste strategy digest here]",
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
  strategyDigestText: string;
};

export function PromptLibrarySection({
  strategyDigestText,
}: PromptLibrarySectionProps) {
  const [copiedPromptId, setCopiedPromptId] = useState("");

  async function copyPrompt(prompt: PromptLibraryPrompt) {
    const clipboardPrompt = buildClipboardPrompt(prompt, strategyDigestText);

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
        </div>
      </Container>
    </Section>
  );
}

function buildClipboardPrompt(
  prompt: PromptLibraryPrompt,
  strategyDigestText: string,
) {
  const trimmedStrategyDigest = strategyDigestText.trim();

  if (!trimmedStrategyDigest) {
    return prompt.prompt;
  }

  return strategyDigestPlaceholders.reduce(
    (clipboardPrompt, placeholder) =>
      clipboardPrompt.replaceAll(placeholder, trimmedStrategyDigest),
    prompt.prompt,
  );
}

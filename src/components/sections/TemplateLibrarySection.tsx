"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives/SevenColumnGrid";

export type PageTemplateSummary = {
  id: string;
  name: string;
  notes?: string;
  pageType: string;
  promotedAt: string;
  sectionCount: number;
  sections: Array<{
    component: string;
    mode: string;
    name: string;
  }>;
  sourceOptionName: string;
  sourceRecipeName: string;
};

type TemplateLibrarySectionProps = {
  templates: PageTemplateSummary[];
};

type CreatePageResponse =
  | {
      ok: true;
      page: {
        href: string;
        id: string;
        label: string;
      };
    }
  | { ok: false; error: string };

type TemplateDraft = {
  label: string;
  slug: string;
};

export function TemplateLibrarySection({
  templates,
}: TemplateLibrarySectionProps) {
  const [drafts, setDrafts] = useState<Record<string, TemplateDraft>>(() =>
    Object.fromEntries(
      templates.map((template) => [
        template.id,
        {
          label: template.name,
          slug: slugify(template.name),
        },
      ]),
    ),
  );
  const [submittingTemplateId, setSubmittingTemplateId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const totalSections = templates.reduce(
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
  }

  async function createContentEditorPage(template: PageTemplateSummary) {
    const draft = drafts[template.id];

    setSubmittingTemplateId(template.id);
    setStatus("");
    setError("");

    try {
      const response = await fetch("/api/content-editor-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageLabel: draft?.label ?? template.name,
          pageSlug: draft?.slug ?? slugify(template.name),
          templateId: template.id,
        }),
      });
      const result = (await response.json()) as CreatePageResponse;

      if (!response.ok || !result.ok) {
        setError(result.ok ? "Page creation failed." : result.error);
        return;
      }

      setStatus(`${result.page.label} is ready in Content Editor.`);
    } catch {
      setError("Page creation failed.");
    } finally {
      setSubmittingTemplateId("");
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
            Reusable page layouts promoted from Pagebuilder options. Create a
            Content Editor page from a template when a client copy deck is ready
            to become editable page content.
          </p>
          <div className="mt-body-actions-md flex flex-wrap gap-2">
            <StatusPill label={`${templates.length} templates`} />
            <StatusPill label={`${totalSections} saved sections`} />
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-start-2 col-span-5 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
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
                  <Button href="/dev/content-editor" variant="secondary">
                    Open Content Editor
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

          {templates.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
              {templates.map((template) => {
                const draft = drafts[template.id] ?? {
                  label: template.name,
                  slug: slugify(template.name),
                };
                const isSubmitting = submittingTemplateId === template.id;

                return (
                  <Card className="p-5 shadow-none" key={template.id}>
                    <div className="grid gap-5">
                      <div className="fluid-type-frame">
                        <p className="type-label text-service-accent">
                          {template.pageType}
                        </p>
                        <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                          {template.name}
                        </h2>
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
                        <StatusPill label={`${template.sectionCount} sections`} />
                        <StatusPill label={template.id} />
                      </div>

                      <div className="grid gap-2 border-t border-service-border pt-5">
                        {template.sections.slice(0, 6).map((section, index) => (
                          <div
                            className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3 rounded-sm border border-service-border bg-service-surface px-3 py-2 max-md:grid-cols-1"
                            key={`${template.id}-${section.component}-${index}`}
                          >
                            <span className="type-caption font-semibold text-service-accent">
                              {section.mode}
                            </span>
                            <span className="type-caption truncate text-service-muted">
                              {section.name}
                            </span>
                          </div>
                        ))}
                        {template.sections.length > 6 ? (
                          <p className="type-caption text-service-muted">
                            + {template.sections.length - 6} more sections
                          </p>
                        ) : null}
                      </div>

                      <div className="grid gap-3 border-t border-service-border pt-5">
                        <label className="type-caption font-semibold text-service-ink">
                          Content Editor page name
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
                        <button
                          className="radius-4 min-h-11 border border-service-ink bg-service-ink px-4 text-sm font-semibold text-white transition-colors hover:border-service-accent hover:bg-service-accent disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={isSubmitting}
                          onClick={() => void createContentEditorPage(template)}
                          type="button"
                        >
                          {isSubmitting
                            ? "Creating..."
                            : "Create Content Editor Page"}
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-6 shadow-none">
              <p className="type-label text-service-accent">No templates yet</p>
              <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                Promote a Pagebuilder option first.
              </h2>
              <p className="type-text-md wrap-pretty mt-heading-body-md text-service-muted">
                Go to Pagebuilder, choose a recipe and option, then use Promote
                to Template. Promoted templates will appear here.
              </p>
              <div className="mt-body-actions-md">
                <Button href="/dev/pagebuilder">Open Pagebuilder</Button>
              </div>
            </Card>
          )}
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
      {label}
    </span>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

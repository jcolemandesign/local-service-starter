"use client";

import { useMemo, useState } from "react";
import type {
  ContentEditorField,
  ContentEditorPage,
} from "@/content/content-editor";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives/SevenColumnGrid";

type ContentEditorSectionProps = {
  pages: ContentEditorPage[];
};

type StoredDraft = {
  savedAt: string;
  values: Record<string, string>;
};

type PromotionSnapshot = {
  fields: Array<{
    id: string;
    kind: ContentEditorField["kind"];
    path: string;
    value: string;
  }>;
  pageHref: string;
  pageId: string;
  pageLabel: string;
  promotedAt: string;
};

const draftStorageKey = "pageworks-content-editor-draft-v1";
const promotionStorageKey = "pageworks-content-editor-promotion-v1";

export function ContentEditorSection({ pages }: ContentEditorSectionProps) {
  const [activePageId, setActivePageId] = useState(pages[0]?.id ?? "");
  const originalValues = useMemo(() => getOriginalValues(pages), [pages]);
  const [initialDraft] = useState(() => readStoredDraft(originalValues));
  const [values, setValues] = useState<Record<string, string>>(
    initialDraft.values,
  );
  const [savedAt, setSavedAt] = useState(initialDraft.savedAt);
  const [promotedAt, setPromotedAt] = useState("");
  const [status, setStatus] = useState("");

  const activePage = pages.find((page) => page.id === activePageId) ?? pages[0];
  const allFields = pages.flatMap((page) =>
    page.sections.flatMap((section) => section.fields),
  );
  const activeFields =
    activePage?.sections.flatMap((section) => section.fields) ?? [];
  const dirtyFieldIds = allFields
    .filter((field) => values[field.id] !== originalValues[field.id])
    .map((field) => field.id);
  const activeDirtyCount = activeFields.filter((field) =>
    dirtyFieldIds.includes(field.id),
  ).length;
  const fieldCounts = getFieldCounts(activeFields);

  function updateField(fieldId: string, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldId]: value,
    }));
    setStatus("");
  }

  function resetActivePage() {
    if (!activePage) {
      return;
    }

    setValues((currentValues) => {
      const nextValues = { ...currentValues };

      for (const field of activeFields) {
        nextValues[field.id] = originalValues[field.id];
      }

      return nextValues;
    });
    setStatus("Page reset.");
  }

  function saveDraft() {
    const nextSavedAt = new Date().toISOString();
    const draft: StoredDraft = {
      savedAt: nextSavedAt,
      values,
    };

    window.localStorage.setItem(draftStorageKey, JSON.stringify(draft));
    setSavedAt(nextSavedAt);
    setStatus("Draft saved.");
  }

  function promoteActivePage() {
    if (!activePage) {
      return;
    }

    const nextPromotedAt = new Date().toISOString();
    const snapshot: PromotionSnapshot = {
      fields: activeFields.map((field) => ({
        id: field.id,
        kind: field.kind,
        path: field.path,
        value: values[field.id] ?? field.value,
      })),
      pageHref: activePage.href,
      pageId: activePage.id,
      pageLabel: activePage.label,
      promotedAt: nextPromotedAt,
    };

    window.localStorage.setItem(
      promotionStorageKey,
      JSON.stringify(snapshot, null, 2),
    );
    setPromotedAt(nextPromotedAt);
    setStatus("Promotion snapshot saved.");
  }

  return (
    <section className="min-h-svh bg-bg-surface text-service-ink">
      <SevenColumnGrid className="fluid-type-frame" minHeight="none" padding="med">
        <SevenColumnGridItem className="col-start-2 col-span-4 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <p className="type-label text-service-accent">Pageworks / Content Editor</p>
          <h1 className="type-display-lg mt-eyebrow-display text-service-ink">
            Content Editor
          </h1>
          <p className="type-text-xl measure-copy wrap-pretty mt-display-body text-service-muted">
            Created Pages copy and image-placement fields grouped by page and
            section.
          </p>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-start-2 col-span-1 max-lg:col-start-1 max-lg:col-span-1 max-md:col-span-3 max-sm:col-span-1">
          <nav aria-label="Content pages" className="grid gap-2">
            {pages.map((page) => {
              const pageFields = page.sections.flatMap(
                (section) => section.fields,
              );
              const pageDirtyCount = pageFields.filter((field) =>
                dirtyFieldIds.includes(field.id),
              ).length;
              const isActive = page.id === activePage?.id;

              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setActivePageId(page.id)}
                  className={`rounded-sm border px-3 py-3 text-left transition-colors ${
                    isActive
                      ? "border-service-accent bg-white text-service-ink shadow-service"
                      : "border-service-border bg-transparent text-service-muted hover:border-service-accent hover:text-service-accent"
                  }`}
                >
                  <span className="type-caption block font-semibold">
                    {page.sourceRecipe}
                  </span>
                  <span className="type-text-sm mt-1 block font-semibold">
                    {page.label}
                  </span>
                  <span className="type-caption mt-2 block">
                    {pageFields.length} fields
                    {pageDirtyCount > 0 ? ` / ${pageDirtyCount} edited` : ""}
                  </span>
                </button>
              );
            })}
          </nav>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-start-3 col-span-5 max-lg:col-start-2 max-lg:col-span-4 max-md:col-start-1 max-md:col-span-3 max-sm:col-span-1">
          {activePage ? (
            <div className="grid gap-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 rounded-sm border border-service-border bg-white p-5 shadow-service max-md:grid-cols-1">
                <div>
                  <p className="type-label text-service-accent">
                    {activePage.label}
                  </p>
                  <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                    {activePage.href}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatusPill label={`${fieldCounts.copy} copy`} />
                    <StatusPill label={`${fieldCounts.image} image`} />
                    <StatusPill label={`${fieldCounts.link} link`} />
                    <StatusPill label={`${activeDirtyCount} edited`} />
                  </div>
                </div>
                <div className="flex flex-wrap items-start justify-end gap-2 max-md:justify-start">
                  <ActionButton onClick={saveDraft}>Save Draft</ActionButton>
                  <ActionButton onClick={promoteActivePage} tone="dark">
                    Promote Snapshot
                  </ActionButton>
                  <ActionButton onClick={resetActivePage} tone="quiet">
                    Reset Page
                  </ActionButton>
                </div>
                {status || savedAt || promotedAt ? (
                  <div className="type-caption col-span-2 flex flex-wrap gap-3 border-t border-service-border pt-4 text-service-muted max-md:col-span-1">
                    {status ? <span>{status}</span> : null}
                    {savedAt ? <span>Saved {formatDate(savedAt)}</span> : null}
                    {promotedAt ? (
                      <span>Promoted {formatDate(promotedAt)}</span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-5">
                {activePage.sections.map((section) => (
                  <section
                    key={section.id}
                    aria-labelledby={`content-editor-${activePage.id}-${section.id}`}
                    className="rounded-sm border border-service-border bg-white p-5 shadow-service"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="type-label text-service-accent">
                          {section.id}
                        </p>
                        <h3
                          id={`content-editor-${activePage.id}-${section.id}`}
                          className="type-heading-sm mt-eyebrow-heading-sm text-service-ink"
                        >
                          {section.label}
                        </h3>
                      </div>
                      <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
                        {section.fields.length} fields
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                      {section.fields.map((field) => (
                        <FieldEditor
                          key={field.id}
                          field={field}
                          value={values[field.id] ?? field.value}
                          originalValue={originalValues[field.id] ?? field.value}
                          onChange={(nextValue) =>
                            updateField(field.id, nextValue)
                          }
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          ) : null}
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

function FieldEditor({
  field,
  onChange,
  originalValue,
  value,
}: {
  field: ContentEditorField;
  onChange: (value: string) => void;
  originalValue: string;
  value: string;
}) {
  const isDirty = value !== originalValue;
  const isLongCopy = field.kind === "copy" && value.length > 72;

  return (
    <label className="grid gap-2 rounded-sm border border-service-border bg-service-surface p-4">
      <span className="flex flex-wrap items-center justify-between gap-2">
        <span className="type-caption font-semibold text-service-ink">
          {field.label}
        </span>
        <span
          className={`type-caption rounded-sm px-2 py-0.5 font-semibold ${
            isDirty
              ? "bg-service-accent text-white"
              : "border border-service-border bg-white text-service-muted"
          }`}
        >
          {field.kind}
        </span>
      </span>
      <span className="type-caption text-service-muted">{field.path}</span>
      {isLongCopy ? (
        <textarea
          className="min-h-32 resize-y rounded-sm border border-service-border bg-white px-3 py-3 text-sm leading-6 text-service-ink outline-none transition-colors focus:border-service-accent"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="min-h-11 rounded-sm border border-service-border bg-white px-3 text-sm text-service-ink outline-none transition-colors focus:border-service-accent"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function ActionButton({
  children,
  onClick,
  tone = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "dark" | "default" | "quiet";
}) {
  const toneClass =
    tone === "dark"
      ? "border-service-ink bg-service-ink text-white hover:border-service-accent hover:bg-service-accent"
      : tone === "quiet"
        ? "border-service-border bg-white text-service-muted hover:border-service-accent hover:text-service-accent"
        : "border-service-accent bg-service-accent text-white hover:border-service-ink hover:bg-service-ink";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center rounded-sm border px-4 text-sm font-semibold transition-colors ${toneClass}`}
    >
      {children}
    </button>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
      {label}
    </span>
  );
}

function getOriginalValues(pages: ContentEditorPage[]) {
  return Object.fromEntries(
    pages.flatMap((page) =>
      page.sections.flatMap((section) =>
        section.fields.map((field) => [field.id, field.value]),
      ),
    ),
  );
}

function readStoredDraft(originalValues: Record<string, string>): StoredDraft {
  if (typeof window === "undefined") {
    return {
      savedAt: "",
      values: originalValues,
    };
  }

  try {
    const stored = window.localStorage.getItem(draftStorageKey);

    if (!stored) {
      return {
        savedAt: "",
        values: originalValues,
      };
    }

    const draft = JSON.parse(stored) as StoredDraft;

    return {
      savedAt: draft.savedAt ?? "",
      values: { ...originalValues, ...(draft.values ?? {}) },
    };
  } catch {
    return {
      savedAt: "",
      values: originalValues,
    };
  }
}

function getFieldCounts(fields: ContentEditorField[]) {
  return fields.reduce(
    (counts, field) => ({
      ...counts,
      [field.kind]: counts[field.kind] + 1,
    }),
    { copy: 0, image: 0, link: 0 },
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

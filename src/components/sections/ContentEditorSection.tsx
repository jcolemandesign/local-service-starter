"use client";

import { useEffect, useMemo, useState } from "react";
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

type PromotionResponse =
  | { ok: true; page: PromotionSnapshot }
  | { ok: false; error: string };

type FieldFilter = "all" | ContentEditorField["kind"];

const draftStorageKey = "pageworks-content-editor-draft-v1";
const promotionStorageKey = "pageworks-content-editor-promotion-v1";
const fieldFilterOptions: Array<{ label: string; value: FieldFilter }> = [
  { label: "All fields", value: "all" },
  { label: "Copy + items", value: "copy" },
  { label: "Images", value: "image" },
  { label: "Meta", value: "meta" },
  { label: "Links", value: "link" },
];

export function ContentEditorSection({ pages }: ContentEditorSectionProps) {
  const [activePageId, setActivePageId] = useState(pages[0]?.id ?? "");
  const originalValues = useMemo(() => getOriginalValues(pages), [pages]);
  const [values, setValues] = useState<Record<string, string>>(
    originalValues,
  );
  const [savedAt, setSavedAt] = useState("");
  const [promotedAt, setPromotedAt] = useState("");
  const [status, setStatus] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);
  const [openSectionIds, setOpenSectionIds] = useState<string[]>([]);
  const [fieldFilter, setFieldFilter] = useState<FieldFilter>("all");

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const storedDraft = readStoredDraft(originalValues);

      setValues(storedDraft.values);
      setSavedAt(storedDraft.savedAt);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [originalValues]);

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
  const visibleActiveFieldCount =
    fieldFilter === "all"
      ? activeFields.length
      : activeFields.filter((field) => field.kind === fieldFilter).length;

  function updateField(fieldId: string, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldId]: value,
    }));
    setStatus("");
  }

  function selectPage(pageId: string) {
    setActivePageId(pageId);
    setOpenSectionIds([]);
  }

  function toggleSection(sectionId: string) {
    setOpenSectionIds((currentSectionIds) =>
      currentSectionIds.includes(sectionId)
        ? currentSectionIds.filter(
            (currentSectionId) => currentSectionId !== sectionId,
          )
        : [...currentSectionIds, sectionId],
    );
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

  async function promoteActivePage() {
    if (!activePage) {
      return;
    }

    setIsPromoting(true);
    setStatus("");

    const snapshot = {
      fields: activeFields.map((field) => ({
        id: field.id,
        kind: field.kind,
        path: field.path,
        value: values[field.id] ?? field.value,
      })),
      pageHref: activePage.href,
      pageId: activePage.id,
      pageLabel: activePage.label,
    };

    try {
      const response = await fetch("/api/content-editor-promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });
      const result = (await response.json()) as PromotionResponse;

      if (!response.ok || !result.ok) {
        setStatus(result.ok ? "Promotion failed." : result.error);
        return;
      }

      window.localStorage.setItem(
        promotionStorageKey,
        JSON.stringify(result.page, null, 2),
      );
      setPromotedAt(result.page.promotedAt);
      setStatus("Staged content promoted.");
    } catch {
      setStatus("Promotion failed.");
    } finally {
      setIsPromoting(false);
    }
  }

  return (
    <section className="min-h-svh bg-bg-surface text-service-ink">
      <SevenColumnGrid className="fluid-type-frame" minHeight="none" padding="med">
        <SevenColumnGridItem className="col-start-2 col-span-4 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <p className="type-label text-service-accent">Pageworks / Content Editor</p>
          <h1 className="type-display-lg mt-eyebrow-display text-service-ink">
            Content Editor
          </h1>
          <p className="type-text-xl wrap-pretty mt-display-body text-service-muted">
            Template Builder copy and image-placement fields will appear here
            once clean generated pages are ready for editing.
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
                  onClick={() => selectPage(page.id)}
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
                    <StatusPill label={`${fieldCounts.meta} meta`} />
                    <StatusPill label={`${fieldCounts.link} link`} />
                    <StatusPill label={`${activeDirtyCount} edited`} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {fieldFilterOptions.map((option) => {
                      const isActive = option.value === fieldFilter;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          className={`radius-4 min-h-9 border px-3 type-caption font-semibold transition-colors ${
                            isActive
                              ? "border-service-ink bg-service-ink text-white"
                              : "border-service-border bg-service-surface text-service-muted hover:border-service-accent hover:text-service-accent"
                          }`}
                          onClick={() => setFieldFilter(option.value)}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                  {fieldFilter !== "all" ? (
                    <p className="type-caption mt-3 rounded-sm border border-service-border bg-service-surface px-3 py-2 text-service-muted">
                      Showing {visibleActiveFieldCount} of{" "}
                      {activeFields.length} fields. Switch to All fields to see
                      hidden copy, media, and links together.
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-start justify-end gap-2 max-md:justify-start">
                  <ActionButton onClick={saveDraft}>Save Draft</ActionButton>
                  <ActionButton onClick={promoteActivePage} tone="dark">
                    {isPromoting ? "Promoting..." : "Promote To Staged"}
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
                {activePage.sections.map((section) => {
                  const isOpen = openSectionIds.includes(section.id);
                  const visibleFields =
                    fieldFilter === "all"
                      ? section.fields
                      : section.fields.filter(
                          (field) => field.kind === fieldFilter,
                        );
                  const sectionDirtyCount = section.fields.filter((field) =>
                    dirtyFieldIds.includes(field.id),
                  ).length;
                  const sectionFieldCounts = getFieldCounts(section.fields);
                  const panelId = `content-editor-${activePage.id}-${section.id}-panel`;
                  const buttonId = `content-editor-${activePage.id}-${section.id}-button`;

                  return (
                    <section
                      key={section.id}
                      aria-labelledby={buttonId}
                      className="overflow-hidden rounded-sm border border-service-border bg-white shadow-service"
                    >
                      <button
                        id={buttonId}
                        type="button"
                        aria-controls={panelId}
                        aria-expanded={isOpen}
                        onClick={() => toggleSection(section.id)}
                        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-service-surface/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-service-accent focus-visible:ring-inset"
                      >
                        <span className="min-w-0">
                          <span className="type-label block text-service-accent">
                            {section.id}
                          </span>
                          <span className="type-heading-sm mt-eyebrow-heading-sm block text-service-ink">
                            {section.label}
                          </span>
                          <span className="mt-3 flex flex-wrap gap-2">
                            <StatusPill label={`${section.fields.length} fields`} />
                            <StatusPill label={`${sectionFieldCounts.copy} copy`} />
                            <StatusPill label={`${sectionFieldCounts.image} image`} />
                            <StatusPill label={`${sectionFieldCounts.meta} meta`} />
                            <StatusPill label={`${sectionFieldCounts.link} link`} />
                            {fieldFilter !== "all" ? (
                              <StatusPill
                                label={`${visibleFields.length} shown`}
                              />
                            ) : null}
                            <StatusPill label={`${sectionDirtyCount} edited`} />
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`mt-1 flex size-9 shrink-0 items-center justify-center rounded-sm border border-service-border text-xl leading-none text-service-accent transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          v
                        </span>
                      </button>

                      {isOpen ? (
                        <div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          className="grid gap-3 border-t border-service-border p-5"
                        >
                          {fieldFilter !== "all" ? (
                            <p className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-2 text-service-muted">
                              This section is filtered to{" "}
                              {getFieldFilterLabel(fieldFilter)}. Switch to All
                              fields to see hidden copy, media, and links
                              together.
                            </p>
                          ) : null}
                          {visibleFields.length > 0 ? (
                            visibleFields.map((field) => (
                              <FieldEditor
                                key={field.id}
                                field={field}
                                value={values[field.id] ?? field.value}
                                originalValue={
                                  originalValues[field.id] ?? field.value
                                }
                                onChange={(nextValue) =>
                                  updateField(field.id, nextValue)
                                }
                              />
                            ))
                          ) : (
                            <p className="type-text-sm rounded-sm border border-service-border bg-service-surface p-4 text-service-muted">
                              No {fieldFilter} fields in this section.
                            </p>
                          )}
                        </div>
                      ) : null}
                    </section>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-sm border border-service-border bg-white p-6 shadow-service">
              <p className="type-label text-service-accent">No pages connected</p>
              <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                Waiting for clean template output
              </h2>
              <p className="type-text-md mt-heading-body text-service-muted">
                The old generated page inventory has been retired. This editor
                is ready to receive pages from the completed template builder.
              </p>
            </div>
          )}
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
  const useTextarea = field.kind === "copy" || value.length > 72;

  return (
    <label className="grid grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)] gap-4 rounded-sm border border-service-border bg-white p-4 shadow-sm max-lg:grid-cols-1">
      <span className="grid content-start gap-2">
        <span className="flex flex-wrap items-center gap-2">
          <span
            className={`type-caption rounded-sm px-2 py-0.5 font-semibold ${
              isDirty
                ? "bg-service-accent text-white"
                : "border border-service-border bg-white text-service-muted"
            }`}
          >
            {field.kind}
          </span>
          {isDirty ? (
            <span className="type-caption font-semibold text-service-accent">
              edited
            </span>
          ) : null}
        </span>
        <span className="type-text-sm font-semibold text-service-ink">
          {field.label}
        </span>
        <span
          className="type-caption break-words text-service-muted"
        >
          {field.path}
        </span>
      </span>
      {useTextarea ? (
        <textarea
          className="min-h-36 resize-y rounded-sm border border-service-border bg-white px-4 py-3 text-base leading-7 text-service-ink outline-none transition-colors focus:border-service-accent max-md:text-sm"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="min-h-12 rounded-sm border border-service-border bg-white px-4 text-base text-service-ink outline-none transition-colors focus:border-service-accent max-md:text-sm"
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

function getFieldFilterLabel(fieldFilter: FieldFilter) {
  return (
    fieldFilterOptions.find((option) => option.value === fieldFilter)?.label ??
    "All fields"
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
    { copy: 0, image: 0, link: 0, meta: 0 },
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

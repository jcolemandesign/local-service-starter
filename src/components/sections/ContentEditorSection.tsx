"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { DownArrowIcon } from "@/components/primitives";
import type {
  ContentEditorField,
  ContentEditorPage,
} from "@/content/content-editor";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives/SevenColumnGrid";
import {
  isStyleFieldPath,
  splitImageRatioFieldOptions,
  styleFieldOptions,
} from "@/content/section-style-options";

type ContentEditorSectionProps = {
  initialClientSlug?: string;
  initialPageId?: string;
  pages: ContentEditorPage[];
};

// "style" is not a field kind - style overrides are stored as `meta` and
// identified by path - so the filter carries it alongside the real kinds.
type FieldFilter = "all" | "style" | ContentEditorField["kind"];
type SaveStagedPageResponse =
  | {
      ok: true;
    }
  | {
      error?: string;
      ok: false;
    };

const fieldFilterOptions: Array<{ label: string; value: FieldFilter }> = [
  { label: "All fields", value: "all" },
  { label: "Copy + items", value: "copy" },
  { label: "Images", value: "image" },
  { label: "Meta", value: "meta" },
  { label: "Links", value: "link" },
  { label: "Style", value: "style" },
];
const imageRatioOptions = splitImageRatioFieldOptions;

export function ContentEditorSection({
  initialClientSlug,
  initialPageId,
  pages,
}: ContentEditorSectionProps) {
  const initialPageKey = initialClientSlug && initialPageId
    ? `${initialClientSlug}:${initialPageId}`
    : pages.find((page) => page.id === initialPageId)?.key;
  const [activePageKey, setActivePageKey] = useState(() =>
    pages.some((page) => page.key === initialPageKey)
      ? (initialPageKey ?? "")
      : (pages[0]?.key ?? ""),
  );
  const originalValues = useMemo(() => getOriginalValues(pages), [pages]);
  const [values, setValues] = useState<Record<string, string>>(
    originalValues,
  );
  const [baselineValues, setBaselineValues] =
    useState<Record<string, string>>(originalValues);
  const [isSavingPage, setIsSavingPage] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  const [status, setStatus] = useState("");
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [fieldFilter, setFieldFilter] = useState<FieldFilter>("all");

  // Persisted staged-page fields are the only source of truth here. Resync
  // whenever the server sends new page data (navigation, router.refresh) so the
  // editor never shows values that have already been superseded on disk.
  const [syncedValues, setSyncedValues] = useState(originalValues);

  if (syncedValues !== originalValues) {
    setSyncedValues(originalValues);
    setValues(originalValues);
    setBaselineValues(originalValues);
  }

  const activePage = pages.find((page) => page.key === activePageKey) ?? pages[0];
  const allFields = pages.flatMap((page) =>
    page.sections.flatMap((section) => section.fields),
  );
  const activeFields =
    activePage?.sections.flatMap((section) => section.fields) ?? [];
  const dirtyFieldIds = allFields
    .filter((field) => values[field.id] !== baselineValues[field.id])
    .map((field) => field.id);
  const activeDirtyCount = activeFields.filter((field) =>
    dirtyFieldIds.includes(field.id),
  ).length;
  const activeEmptyCount = activeFields.filter((field) =>
    isEmptyEditableField(field, values[field.id] ?? field.value),
  ).length;
  const fieldCounts = getFieldCounts(activeFields);
  const activeCopySectionIds =
    activePage?.sections
      .filter((section) =>
        section.fields.some((field) => field.kind === "copy"),
      )
      .map((section) => section.id) ?? [];
  const activeEmptySectionIds =
    activePage?.sections
      .filter((section) =>
        section.fields.some((field) =>
          isEmptyEditableField(field, values[field.id] ?? field.value),
        ),
      )
      .map((section) => section.id) ?? [];
  const visibleActiveFieldCount =
    fieldFilter === "all"
      ? activeFields.length
      : activeFields.filter((field) => matchesFieldFilter(field, fieldFilter))
          .length;

  function updateField(fieldId: string, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldId]: value,
    }));
    setStatus("");
  }

  function selectPage(pageKey: string) {
    setActivePageKey(pageKey);
    setOpenSectionId(null);
  }

  function toggleSection(sectionId: string) {
    setOpenSectionId((currentSectionId) =>
      currentSectionId === sectionId ? null : sectionId,
    );
  }

  function openFirstSection(sectionIds: string[]) {
    setOpenSectionId(sectionIds[0] ?? null);
  }

  function resetActivePage() {
    if (!activePage) {
      return;
    }

    setValues((currentValues) => {
      const nextValues = { ...currentValues };

      for (const field of activeFields) {
        nextValues[field.id] = baselineValues[field.id];
      }

      return nextValues;
    });
    setStatus("Page reset.");
  }

  async function savePage() {
    if (!activePage) {
      return;
    }

    const nextSavedAt = new Date().toISOString();

    setIsSavingPage(true);
    setStatus("");

    try {
      const fields = activeFields.map((field) => ({
        id: field.sourceId ?? field.id,
        kind: field.kind,
        path: field.path,
        value: values[field.id] ?? "",
      }));
      const response = await fetch("/api/staged-pages", {
        body: JSON.stringify({
          clientSlug: activePage.clientSlug,
          fields,
          pageId: activePage.id,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const result = (await response.json()) as SaveStagedPageResponse;

      if (!response.ok || !result.ok) {
        setStatus(result.ok ? "Page save failed." : result.error ?? "Page save failed.");
        return;
      }

      setBaselineValues((currentValues) => {
        const nextValues = { ...currentValues };

        for (const field of activeFields) {
          nextValues[field.id] = values[field.id] ?? "";
        }

        return nextValues;
      });
      setSavedAt(nextSavedAt);
      setStatus("Staged page saved.");
    } catch {
      setStatus("Page save failed.");
    } finally {
      setIsSavingPage(false);
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
            Fill the selected page template with reviewed copy. Use the
            template directions as reference, edit only the fields that need
            human judgment, then save back to the staged preview.
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
              const isActive = page.key === activePage?.key;

              return (
                <button
                  key={page.key}
                  type="button"
                  onClick={() => selectPage(page.key)}
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
                  <p className="type-heading-lg text-service-ink">
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
                    <StatusPill label={`${activeEmptyCount} empty`} />
                  </div>
                  <p className="type-caption mt-3 rounded-sm border border-service-border bg-service-surface px-3 py-2 text-service-muted">
                    Start with copy fields. Meta fields explain the template
                    intent and should usually be left alone.
                  </p>
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
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-service-border pt-4">
                    <ControlButton
                      disabled={activeEmptySectionIds.length === 0}
                      onClick={() => openFirstSection(activeEmptySectionIds)}
                    >
                      First Empty
                    </ControlButton>
                    <ControlButton
                      disabled={activeCopySectionIds.length === 0}
                      onClick={() => openFirstSection(activeCopySectionIds)}
                    >
                      First Copy
                    </ControlButton>
                    <ControlButton onClick={() => setOpenSectionId(null)}>
                      Close
                    </ControlButton>
                  </div>
                </div>
                <div className="flex flex-wrap items-start justify-end gap-2 max-md:justify-start">
                  <ActionButton disabled={isSavingPage} onClick={() => void savePage()}>
                    {isSavingPage ? "Saving..." : "Save Staged Page"}
                  </ActionButton>
                  <ActionLink
                    href={getStagedPreviewHref(activePage.id)}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View Staged Page
                  </ActionLink>
                  <ActionLink href="/dev/staged-pages" tone="quiet">
                    Staged Pages
                  </ActionLink>
                  <ActionButton onClick={resetActivePage} tone="quiet">
                    Reset Page
                  </ActionButton>
                </div>
                {status || savedAt ? (
                  <div className="type-caption col-span-2 flex flex-wrap gap-3 border-t border-service-border pt-4 text-service-muted max-md:col-span-1">
                    {status ? <span>{status}</span> : null}
                    {savedAt ? <span>Saved {formatDate(savedAt)}</span> : null}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-5">
                {activePage.sections.map((section) => {
                  const isOpen = openSectionId === section.id;
                  const visibleFields =
                    fieldFilter === "all"
                      ? section.fields
                      : section.fields.filter((field) =>
                          matchesFieldFilter(field, fieldFilter),
                        );
                  const sectionDirtyCount = section.fields.filter((field) =>
                    dirtyFieldIds.includes(field.id),
                  ).length;
                  const sectionEmptyCount = section.fields.filter((field) =>
                    isEmptyEditableField(field, values[field.id] ?? field.value),
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
                            <StatusPill label={`${sectionEmptyCount} empty`} />
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
                          className={`mt-1 flex size-9 shrink-0 items-center justify-center rounded-sm border border-service-border text-service-accent transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          <DownArrowIcon className="size-4" />
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
                                  baselineValues[field.id] ?? field.value
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

      {/* An open section runs long enough that collapsing it means scrolling
          back to its header. This stays reachable at the bottom of the
          viewport, and only appears while something is actually open. */}
      {openSectionId ? (
        <button
          className="radius-button fixed bottom-5 right-5 z-50 min-h-10 border border-service-border bg-bg-page/88 px-3.5 text-xs font-semibold text-service-muted shadow-sm backdrop-blur transition-colors hover:border-service-accent hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
          onClick={() => setOpenSectionId(null)}
          type="button"
        >
          Close all
        </button>
      ) : null}
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
  if (field.path.endsWith(".imageRatio")) {
    return (
      <OptionToggleFieldEditor
        badge="image framing"
        field={field}
        helperText="Choose a page-specific image frame, or use the ratio saved on the template."
        legend="Image framing"
        onChange={onChange}
        options={imageRatioOptions}
        originalValue={originalValue}
        value={value}
      />
    );
  }

  const styleField = getStyleFieldSpec(field);

  if (styleField) {
    return (
      <OptionToggleFieldEditor
        badge="style"
        field={field}
        helperText="Restyle this section on this page only, or inherit the template value. Styling never changes which copy the section asks for."
        legend={styleField.label}
        onChange={onChange}
        options={styleField.options}
        originalValue={originalValue}
        value={value}
      />
    );
  }

  const isDirty = value !== originalValue;
  const isEmpty = isEmptyEditableField(field, value);
  const helperText = getFieldHelperText(field);
  const controlId = getFieldControlId(field);
  const reference = getFieldReference(field, originalValue);
  const useTextarea = shouldUseTextarea(field, value);

  return (
    <div
      className={`grid gap-4 rounded-sm border bg-white p-4 shadow-sm ${
        isEmpty ? "border-service-accent" : "border-service-border"
      }`}
    >
      <div className="grid content-start gap-2">
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
          {isEmpty ? (
            <span className="type-caption rounded-sm bg-service-accent px-2 py-0.5 font-semibold text-white">
              empty
            </span>
          ) : null}
        </span>
        <label
          className="type-text-sm font-semibold text-service-ink"
          htmlFor={controlId}
        >
          {field.label}
        </label>
        <span className="type-caption text-service-muted">{helperText}</span>
        <span className="type-caption break-words text-service-muted">
          {field.path}
        </span>
      </div>
      {reference ? <FieldReferenceBlock reference={reference} /> : null}
      {useTextarea ? (
        <AutoGrowingTextarea
          className={`${getTextareaMinimumHeight(field)} w-full resize-none overflow-y-hidden rounded-sm border border-service-border bg-white px-4 py-3 text-base leading-8 text-service-ink outline-none transition-colors focus:border-service-accent max-md:text-sm`}
          id={controlId}
          onChange={onChange}
          placeholder={helperText}
          value={value}
        />
      ) : (
        <input
          className="min-h-14 w-full rounded-sm border border-service-border bg-white px-4 text-base text-service-ink outline-none transition-colors focus:border-service-accent max-md:text-sm"
          id={controlId}
          onChange={(event) => onChange(event.target.value)}
          placeholder={helperText}
          value={value}
        />
      )}
    </div>
  );
}

type FieldReference = {
  description: string;
  label: string;
  value: string;
};

function FieldReferenceBlock({
  reference,
}: {
  reference: FieldReference;
}) {
  const shouldCollapse =
    reference.value.length > 240 || reference.value.split(/\r?\n/).length > 3;
  const contentClassName =
    "type-text-sm whitespace-pre-wrap break-words leading-6 text-service-ink";

  if (!shouldCollapse) {
    return (
      <div className="rounded-sm border border-service-border bg-service-surface p-4">
        <p className="type-caption font-semibold text-service-accent">
          {reference.label}
        </p>
        <p className="type-caption mt-1 text-service-muted">
          {reference.description}
        </p>
        <p className={`${contentClassName} mt-3`}>{reference.value}</p>
      </div>
    );
  }

  return (
    <details className="group/reference rounded-sm border border-service-border bg-service-surface p-4">
      <summary className="cursor-pointer list-none">
        <span className="flex items-start justify-between gap-4">
          <span>
            <span className="type-caption block font-semibold text-service-accent">
              {reference.label}
            </span>
            <span className="type-caption mt-1 block text-service-muted">
              {reference.description}
            </span>
          </span>
          <span className="type-caption shrink-0 font-semibold text-service-accent">
            <span className="group-open/reference:hidden">Show full</span>
            <span className="hidden group-open/reference:inline">Collapse</span>
          </span>
        </span>
        <span
          className={`${contentClassName} mt-3 line-clamp-3 group-open/reference:hidden`}
        >
          {reference.value}
        </span>
      </summary>
      <p className={`${contentClassName} mt-3 border-t border-service-border pt-3`}>
        {reference.value}
      </p>
    </details>
  );
}

function AutoGrowingTextarea({
  className,
  id,
  onChange,
  placeholder,
  value,
}: {
  className: string;
  id: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    resizeTextareaToContent(textareaRef.current);
  }, [value]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea || typeof ResizeObserver === "undefined") {
      return;
    }

    let previousWidth = textarea.clientWidth;
    const resizeObserver = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? previousWidth;

      if (nextWidth === previousWidth) {
        return;
      }

      previousWidth = nextWidth;
      resizeTextareaToContent(textarea);
    });

    resizeObserver.observe(textarea);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <textarea
      className={className}
      id={id}
      onChange={(event) => {
        resizeTextareaToContent(event.currentTarget);
        onChange(event.currentTarget.value);
      }}
      placeholder={placeholder}
      ref={textareaRef}
      rows={3}
      value={value}
    />
  );
}

function resizeTextareaToContent(textarea: HTMLTextAreaElement | null) {
  if (!textarea) {
    return;
  }

  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function getFieldControlId(field: ContentEditorField) {
  return `content-editor-field-${field.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function getFieldReference(
  field: ContentEditorField,
  originalValue: string,
): FieldReference | null {
  if (originalValue.trim()) {
    return {
      description: "The value currently saved for this staged page.",
      label: "Saved value",
      value: originalValue,
    };
  }

  if (!field.fallback?.value.trim()) {
    return null;
  }

  if (field.fallback.exact) {
    return {
      description:
        "The exact template default used when this staged field is empty.",
      label: "Template default",
      value: field.fallback.value,
    };
  }

  return {
    description:
      "A writing reference from the template contract. The staged preview may differ.",
    label: "Template example",
    value: field.fallback.value,
  };
}

function shouldUseTextarea(field: ContentEditorField, value: string) {
  if (value.includes("\n") || value.length > 72) {
    return true;
  }

  if (field.kind !== "copy") {
    return false;
  }

  const normalizedPath = field.path.toLowerCase();

  return multilineFieldPathParts.some((part) => normalizedPath.includes(part));
}

function getTextareaMinimumHeight(field: ContentEditorField) {
  const normalizedPath = field.path.toLowerCase();

  return multilineFieldPathParts.some((part) => normalizedPath.includes(part))
    ? "min-h-40"
    : "min-h-28";
}

const multilineFieldPathParts = [
  "body",
  "bullets",
  "cards",
  "content",
  "description",
  "detail",
  "intro",
  "items",
  "legal",
  "links",
  "notes",
  "paragraph",
  "quote",
  "services",
  "steps",
  "supporting",
  "testimonials",
] as const;

function ActionButton({
  children,
  disabled = false,
  onClick,
  tone = "default",
}: {
  children: React.ReactNode;
  disabled?: boolean;
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
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center rounded-sm border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${toneClass}`}
    >
      {children}
    </button>
  );
}

/**
 * Toggle-group editor for fields with a fixed option list. Used for image
 * framing and for the per-section style overrides - both are "pick one, or
 * inherit the template value", so they share one control rather than growing a
 * second near-identical panel.
 */
function OptionToggleFieldEditor({
  badge,
  helperText,
  legend,
  onChange,
  options,
  originalValue,
  field,
  value,
}: {
  badge: string;
  helperText: string;
  legend: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ label: string; value: string }>;
  originalValue: string;
  field: ContentEditorField;
  value: string;
}) {
  const isDirty = value !== originalValue;

  return (
    <fieldset className="grid gap-3 rounded-sm border border-service-border bg-white p-4 shadow-sm">
      <legend className="sr-only">{legend}</legend>
      <div className="grid gap-2">
        <span className="flex flex-wrap items-center gap-2">
          <span className={`type-caption rounded-sm px-2 py-0.5 font-semibold ${
            isDirty
              ? "bg-service-accent text-white"
              : "border border-service-border bg-white text-service-muted"
          }`}>
            {badge}
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
        <span className="type-caption text-service-muted">{helperText}</span>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={legend}>
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              aria-pressed={isActive}
              className={`min-h-9 rounded-sm border px-3 text-xs font-semibold transition-colors ${
                isActive
                  ? "border-service-accent bg-service-accent text-white"
                  : "border-service-border bg-white text-service-muted hover:border-service-accent hover:text-service-accent"
              }`}
              key={option.value || "template-default"}
              onClick={() => onChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ControlButton({
  children,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-9 items-center justify-center rounded-sm border border-service-border bg-white px-3 text-xs font-semibold text-service-muted transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function ActionLink({
  children,
  href,
  rel,
  target,
  tone = "dark",
}: {
  children: React.ReactNode;
  href: string;
  rel?: string;
  target?: string;
  tone?: "dark" | "quiet";
}) {
  const toneClass =
    tone === "quiet"
      ? "border-service-border bg-white text-service-muted hover:border-service-accent hover:text-service-accent"
      : "border-service-ink bg-service-ink text-white hover:border-service-accent hover:bg-service-accent";

  return (
    <Link
      className={`inline-flex min-h-10 items-center justify-center rounded-sm border px-4 text-sm font-semibold transition-colors ${toneClass}`}
      href={href}
      rel={rel}
      target={target}
    >
      {children}
    </Link>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
      {label}
    </span>
  );
}

function getStagedPreviewHref(pageId: string) {
  return `/dev/staged-pages/${encodeURIComponent(pageId)}`;
}

function matchesFieldFilter(field: ContentEditorField, filter: FieldFilter) {
  if (filter === "all") {
    return true;
  }

  // Style overrides are stored as `meta`, so they would otherwise clutter the
  // Meta tab - which is for template directions and page metadata.
  if (filter === "style") {
    return isStyleFieldPath(field.path);
  }

  return field.kind === filter && !isStyleFieldPath(field.path);
}

/**
 * Style fields are keyed by path rather than by field kind: they are stored as
 * `meta` so they ride the existing staged-field save path with no schema
 * change, and the `style.` path segment is what distinguishes them.
 */
function getStyleFieldSpec(field: ContentEditorField) {
  if (!isStyleFieldPath(field.path)) {
    return undefined;
  }

  const name = field.path.split(".").pop();

  return name && name in styleFieldOptions
    ? {
        label: humanizeStyleFieldName(name),
        options: styleFieldOptions[name as keyof typeof styleFieldOptions],
      }
    : undefined;
}

function humanizeStyleFieldName(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function getFieldFilterLabel(fieldFilter: FieldFilter) {
  return (
    fieldFilterOptions.find((option) => option.value === fieldFilter)?.label ??
    "All fields"
  );
}

function isEmptyEditableField(field: ContentEditorField, value: string) {
  return field.kind === "copy" && value.trim().length === 0;
}

function getFieldHelperText(field: ContentEditorField) {
  const normalizedPath = field.path.toLowerCase();

  if (normalizedPath.endsWith(".contentdirection")) {
    return "Template intent reference. Use this to guide nearby copy fields.";
  }

  if (field.kind === "meta") {
    return "Reference information for this staged page.";
  }

  if (field.kind === "image") {
    return "Image source, alt text, caption, or visual placeholder.";
  }

  if (field.kind === "link") {
    return "Destination path, URL, phone link, or CTA href.";
  }

  if (normalizedPath.includes(".links.")) {
    return "Navigation or footer link label.";
  }

  if (normalizedPath.includes(".items.") || normalizedPath.includes(".cards.")) {
    return "Repeated card, bullet, testimonial, service, or proof item.";
  }

  if (normalizedPath.endsWith(".title") || normalizedPath.endsWith(".heading")) {
    return "Section headline sized to the selected template.";
  }

  if (normalizedPath.endsWith(".body") || normalizedPath.endsWith(".intro")) {
    return "Supporting copy for this section. Keep it close to the template length.";
  }

  if (normalizedPath.includes("action")) {
    return "Short CTA label or action copy.";
  }

  return "Reviewed page copy for this template field.";
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

function getFieldCounts(fields: ContentEditorField[]) {
  return fields.reduce(
    (counts, field) =>
      isStyleFieldPath(field.path)
        ? { ...counts, style: counts.style + 1 }
        : { ...counts, [field.kind]: counts[field.kind] + 1 },
    { copy: 0, image: 0, link: 0, meta: 0, style: 0 },
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

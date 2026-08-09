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
  styleFieldPrefix,
} from "@/content/section-style-options";
import { BackgroundImageFocusEditor } from "@/components/sections/BackgroundImageFocusEditor";

type ContentEditorSectionProps = {
  /**
   * Paths under `public/images`, offered as a picker on image fields. Empty is
   * valid - the manual path input still works, it just has nothing to suggest.
   */
  imageAssets?: string[];
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
  imageAssets = [],
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
    <section className="min-h-svh bg-zinc-300 text-zinc-900">
      <SevenColumnGrid className="fluid-type-frame" minHeight="none" padding="med">
        <SevenColumnGridItem className="col-start-2 col-span-4 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <p className="type-label text-zinc-900">Pageworks / Content Editor</p>
          <h1 className="type-heading-xl mt-eyebrow-heading-lg text-zinc-900">
            Content Editor
          </h1>
          <p className="type-text-xl wrap-pretty mt-display-body text-zinc-500">
            Fill the selected page template with reviewed copy. Use the
            template directions as reference, edit only the fields that need
            human judgment, then save back to the staged preview.
          </p>
        </SevenColumnGridItem>

        {/* Two columns rather than one: the page list carries a recipe name, a
         * page label, and a field count per row. */}
        <SevenColumnGridItem className="col-start-2 col-span-2 max-lg:col-start-1 max-lg:col-span-2 max-md:col-span-3 max-sm:col-span-1">
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
                      ? "border-zinc-900 bg-zinc-50 text-zinc-900 shadow"
                      : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-slate-400 hover:text-slate-700"
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

        <SevenColumnGridItem className="col-start-4 col-span-4 max-lg:col-start-3 max-lg:col-span-3 max-md:col-start-1 max-md:col-span-3 max-sm:col-span-1">
          {activePage ? (
            <div className="grid gap-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 rounded-sm bg-zinc-200 p-5 shadow-md max-md:grid-cols-1">
                <div>
                  <p className="type-heading-lg text-zinc-900">
                    {activePage.label}
                  </p>
                  <h2 className="type-heading-md mt-eyebrow-heading-sm text-zinc-900">
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
                  <p className="type-caption mt-3 rounded-sm bg-zinc-50 px-3 py-2 text-zinc-600">
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
                              ? "border-slate-700 bg-slate-700 text-white"
                              : "border-zinc-200 bg-white text-zinc-600 hover:border-slate-400 hover:text-slate-700"
                          }`}
                          onClick={() => setFieldFilter(option.value)}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                  {fieldFilter !== "all" ? (
                    <p className="type-caption mt-3 rounded-sm bg-zinc-50 px-3 py-2 text-zinc-600">
                      Showing {visibleActiveFieldCount} of{" "}
                      {activeFields.length} fields. Switch to All fields to see
                      hidden copy, media, and links together.
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-200 pt-4">
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
                  <div className="type-caption col-span-2 flex flex-wrap gap-3 border-t border-zinc-200 pt-4 text-zinc-500 max-md:col-span-1">
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
                  // Media and styling first, then the copy. They are the
                  // decisions you make once per section, and leaving them
                  // interleaved with fifty copy fields meant scrolling past
                  // the writing to reach the framing.
                  const imageFields = visibleFields.filter(
                    (field) => field.kind === "image",
                  );
                  const toggleFields = visibleFields.filter(isToggleField);
                  const copyFields = visibleFields.filter(
                    (field) => field.kind !== "image" && !isToggleField(field),
                  );
                  /**
                   * The focal-point widget is the one control that needs two of
                   * its section's other fields: the fit, which decides whether
                   * a focal point does anything at all, and the chosen image,
                   * which is what it is dragged against. Both are siblings, and
                   * `FieldEditor` sees one field at a time - so they are read
                   * here, where the section's own fields and their live edited
                   * values are both in scope.
                   */
                  const readSectionField = (suffix: string) => {
                    const match = section.fields.find((field) =>
                      field.path.endsWith(suffix),
                    );

                    return match
                      ? (values[match.id] ?? match.value).trim()
                      : "";
                  };
                  const imageFraming = {
                    fit: readSectionField(`.${styleFieldPrefix}.backgroundImageFit`),
                    imageSrc: readSectionField(".backgroundImage"),
                  };
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
                      className="overflow-hidden rounded-sm bg-zinc-200 shadow-md"
                    >
                      <button
                        id={buttonId}
                        type="button"
                        aria-controls={panelId}
                        aria-expanded={isOpen}
                        onClick={() => toggleSection(section.id)}
                        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-inset"
                      >
                        <span className="min-w-0">
                          <span className="type-label block text-slate-600">
                            {section.id}
                          </span>
                          <span className="type-heading-sm mt-eyebrow-heading-sm block text-zinc-900">
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
                          className={`mt-1 flex size-9 shrink-0 items-center justify-center rounded-sm border border-zinc-200 text-zinc-900 transition-transform ${
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
                          // Recessed against the white header above it. The
                          // field cards then read as forward without needing a
                          // border each, and the shift in surface replaces the
                          // rule that used to divide header from body.
                          className="grid gap-3 bg-zinc-200 p-5"
                        >
                          {fieldFilter !== "all" ? (
                            <p className="type-caption rounded-sm bg-zinc-50 px-3 py-2 text-zinc-600">
                              This section is filtered to{" "}
                              {getFieldFilterLabel(fieldFilter)}. Switch to All
                              fields to see hidden copy, media, and links
                              together.
                            </p>
                          ) : null}
                          {visibleFields.length > 0 ? (
                            <>
                              {imageFields.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                                  {imageFields.map((field) => (
                                    <FieldEditor
                                      key={field.id}
                                      assets={imageAssets}
                                      field={field}
                                      imageFraming={imageFraming}
                                      value={values[field.id] ?? field.value}
                                      originalValue={
                                        baselineValues[field.id] ?? field.value
                                      }
                                      onChange={(nextValue) =>
                                        updateField(field.id, nextValue)
                                      }
                                    />
                                  ))}
                                </div>
                              ) : null}
                              {/*
                                Toggles are a label and a short button row, so
                                a full-width card wasted most of it and pushed
                                the copy further down.

                                Two across, not three: at a third of the row
                                the wider option sets - colour recipe carries
                                five - wrapped onto a second line, so the cards
                                were taller than the row they saved.
                              */}
                              {toggleFields.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                                  {toggleFields.map((field) => (
                                    <FieldEditor
                                      key={field.id}
                                      assets={imageAssets}
                                      field={field}
                                      imageFraming={imageFraming}
                                      value={values[field.id] ?? field.value}
                                      originalValue={
                                        baselineValues[field.id] ?? field.value
                                      }
                                      onChange={(nextValue) =>
                                        updateField(field.id, nextValue)
                                      }
                                    />
                                  ))}
                                </div>
                              ) : null}
                              {/*
                                Two up, with each card sized to its own
                                content rather than stretched to the row: the
                                textareas auto-grow, so a long body beside a
                                short heading would otherwise leave the short
                                one mostly empty.
                              */}
                              {copyFields.length > 0 ? (
                                <div className="grid grid-cols-2 items-start gap-3 max-md:grid-cols-1">
                                  {copyFields.map((field) => (
                                    <FieldEditor
                                      key={field.id}
                                      assets={imageAssets}
                                      field={field}
                                      imageFraming={imageFraming}
                                      value={values[field.id] ?? field.value}
                                      originalValue={
                                        baselineValues[field.id] ?? field.value
                                      }
                                      onChange={(nextValue) =>
                                        updateField(field.id, nextValue)
                                      }
                                    />
                                  ))}
                                </div>
                              ) : null}
                            </>
                          ) : (
                            <p className="type-text-sm rounded-sm bg-zinc-50 p-4 text-zinc-600">
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
            <div className="rounded-sm bg-zinc-200 p-6 shadow-md">
              <p className="type-label text-zinc-900">No pages connected</p>
              <h2 className="type-heading-md mt-eyebrow-heading-sm text-zinc-900">
                Waiting for clean template output
              </h2>
              <p className="type-text-md mt-heading-body text-zinc-500">
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
          className="radius-button fixed bottom-5 right-5 z-50 min-h-10 border border-zinc-200 bg-white/88 px-3.5 text-xs font-semibold text-zinc-500 shadow-sm backdrop-blur transition-colors hover:border-slate-400 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-500"
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
  assets,
  field,
  imageFraming,
  onChange,
  originalValue,
  value,
}: {
  assets: string[];
  field: ContentEditorField;
  /**
   * The section's fit id and chosen ground image, read from sibling fields by
   * the caller. Only the focal-point control uses them.
   */
  imageFraming?: { fit: string; imageSrc: string };
  onChange: (value: string) => void;
  originalValue: string;
  value: string;
}) {
  // Ahead of the generic controls: an image field is a path, and a text input
  // gives no way to tell a correct one from a typo or a leftover placeholder.
  if (field.kind === "image") {
    return (
      <ImageFieldEditor
        assets={assets}
        field={field}
        onChange={onChange}
        originalValue={originalValue}
        value={value}
      />
    );
  }

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

  /**
   * Ahead of the generic style control below, which renders a toggle row from
   * an option list - a focal point has no such list. This is the mount that
   * draws the real photograph: the content editor is where the ground image is
   * chosen, so it is the only place the node can be placed against what will
   * actually ship.
   */
  if (field.path.endsWith(`.${styleFieldPrefix}.backgroundImageFocus`)) {
    return (
      <div className="grid gap-2 rounded-sm bg-zinc-50 p-4">
        <span className="type-caption font-semibold text-zinc-700">
          Image focal point
        </span>
        <BackgroundImageFocusEditor
          fit={imageFraming?.fit}
          imageSrc={imageFraming?.imageSrc || undefined}
          onChange={onChange}
          value={value}
        />
      </div>
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
  // The contract's own purpose line when it has one; the path heuristic only
  // as a fallback for fields no spec declares, such as style and ratio meta.
  const helperText = field.spec?.purpose ?? getFieldHelperText(field);
  const controlId = getFieldControlId(field);
  const reference = getFieldReference(field, originalValue);
  const useTextarea = shouldUseTextarea(field, value);
  const characterTarget = getCharacterTarget(field.spec?.target);
  const hierarchyClass = hierarchyClassName[getFieldHierarchy(field)];

  return (
    <div
      // col-span-full rather than col-span-2: the grid drops to one column on
      // narrow screens, and a 2-column span there would create an implicit
      // second column and break the stack.
      //
      // No border. The card sits on the recessed panel, so the surface change
      // separates it - a border per card drew a box around every field and
      // made a long section read as a grid of outlines. Empty fields tint
      // rather than outline; they already carry an "empty" pill.
      className={`grid gap-4 rounded-sm bg-zinc-50 p-4 shadow ${
        isLongFormField(field) ? "col-span-full" : ""
      }`}
    >
      <div className="grid content-start gap-2">
        <span className="flex flex-wrap items-center gap-2">
          <span
            className={`type-caption rounded-sm px-2 py-0.5 font-semibold ${
              isDirty
                ? "bg-slate-700 text-white"
                : "border border-zinc-200 bg-white text-zinc-500"
            }`}
          >
            {field.kind}
          </span>
          {isDirty ? (
            <span className="type-caption font-semibold text-slate-600">
              edited
            </span>
          ) : null}
          {isEmpty ? (
            <span className="type-caption rounded-sm bg-zinc-900 px-2 py-0.5 font-semibold text-white">
              empty
            </span>
          ) : null}
        </span>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <label
            className="type-text-sm font-semibold text-zinc-900"
            htmlFor={controlId}
          >
            {field.label}
          </label>
          {characterTarget ? (
            <CharacterCounter target={characterTarget} value={value} />
          ) : null}
        </div>
      </div>
      {useTextarea ? (
        // Inset rather than outlined: on a borderless card a bordered control
        // puts the box back. The recessed surface reads as writable, and the
        // focus ring - not a border colour - carries the focus state.
        <AutoGrowingTextarea
          className={`${getTextareaMinimumHeight(field)} ${hierarchyClass} w-full resize-none overflow-y-hidden rounded-sm border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-slate-500 max-md:text-sm`}
          id={controlId}
          onChange={onChange}
          placeholder={helperText}
          value={value}
        />
      ) : (
        <input
          className={`min-h-14 ${hierarchyClass} w-full rounded-sm border border-zinc-200 bg-white px-4 text-zinc-900 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-slate-500 max-md:text-sm`}
          id={controlId}
          onChange={(event) => onChange(event.target.value)}
          placeholder={helperText}
          value={value}
        />
      )}
      {/*
        Everything below the input is reference, not the task. Inline it was
        four lines of prose per field, which on a 56-field page is most of what
        you scroll past to reach the thing you came to edit.
      */}
      <details className="group">
        <summary className="type-caption cursor-pointer list-none text-zinc-500 transition-colors hover:text-slate-700">
          <span className="group-open:hidden">Details</span>
          <span className="hidden group-open:inline">Hide details</span>
        </summary>
        <div className="grid gap-3 pt-3">
          <p className="type-caption text-zinc-500">{helperText}</p>
          {field.spec?.target ? (
            <p className="type-caption text-zinc-500">
              <span className="font-semibold text-zinc-900">Target: </span>
              {field.spec.target}
            </p>
          ) : null}
          <p className="type-caption break-words text-zinc-500">
            {field.path}
          </p>
          {reference ? <FieldReferenceBlock reference={reference} /> : null}
        </div>
      </details>
    </div>
  );
}

/**
 * Reads a character range out of a contract `target` string.
 *
 * Targets are prose written for a copywriter - "35-70 characters.", "OPTIONAL.
 * When used: 2-4 items, 28-70 characters each." - not structured data, so this
 * takes the first range that is explicitly about characters and ignores the
 * rest. An item count like "2-4 items" must not be read as a length, which is
 * why the unit has to follow the number rather than the range being taken on
 * its own.
 *
 * Returning null is the normal case for list and asset fields. The editor
 * simply shows no counter rather than inventing a limit.
 */
function getCharacterTarget(target?: string) {
  if (!target) {
    return null;
  }

  const range = /(\d+)\s*[-–]\s*(\d+)\s*characters/i.exec(target);

  if (range) {
    const min = Number(range[1]);
    const max = Number(range[2]);

    return max > min ? { max, min } : null;
  }

  const upTo = /(?:under|up to|max(?:imum)?)\s*(\d+)\s*characters/i.exec(target);

  return upTo ? { max: Number(upTo[1]), min: 0 } : null;
}

/**
 * A four-step size hint, not a type preview.
 *
 * Which type token a field actually renders with lives in each section's JSX,
 * and the same field name is not always the same size across sections - so an
 * exact preview would need a fifth registry to keep in sync with the
 * components. This deliberately conveys hierarchy only, capped well below real
 * display sizes: the editor is for finding and writing a field among fifty,
 * and true display type would make that harder, not easier.
 *
 * `getFieldHelperText` already infers meaning from the path the same way.
 */
function getFieldHierarchy(field: ContentEditorField) {
  const name = field.path.split(".").pop()?.toLowerCase() ?? "";

  if (name === "h1" || name === "headline" || name.endsWith("headlinetop")) {
    return "display";
  }

  if (
    name === "heading" ||
    name === "title" ||
    name.endsWith("title") ||
    name.endsWith("heading")
  ) {
    return "heading";
  }

  if (name === "eyebrow" || name.endsWith("eyebrow") || name.endsWith("label")) {
    return "label";
  }

  return "body";
}

const hierarchyClassName: Record<string, string> = {
  body: "text-base leading-8",
  display: "text-xl font-semibold leading-8",
  heading: "text-lg font-semibold leading-8",
  label: "text-sm font-semibold uppercase tracking-wide",
};

function CharacterCounter({
  target,
  value,
}: {
  target: { max: number; min: number };
  value: string;
}) {
  const length = value.trim().length;
  const isOver = length > target.max;
  const isUnder = length > 0 && length < target.min;
  const tone = isOver
    ? "text-zinc-900 font-semibold"
    : isUnder
      ? "text-zinc-500"
      : "text-zinc-500";

  return (
    <span className={`type-caption ${tone}`}>
      {length}
      {" / "}
      {target.min ? `${target.min}-${target.max}` : target.max}
      {isOver ? " over" : ""}
    </span>
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
    "type-text-sm whitespace-pre-wrap break-words leading-6 text-zinc-900";

  if (!shouldCollapse) {
    return (
      <div className="rounded-sm bg-white p-4">
        <p className="type-caption font-semibold text-slate-600">
          {reference.label}
        </p>
        <p className="type-caption mt-1 text-zinc-500">
          {reference.description}
        </p>
        <p className={`${contentClassName} mt-3`}>{reference.value}</p>
      </div>
    );
  }

  return (
    <details className="group/reference rounded-sm bg-white p-4">
      <summary className="cursor-pointer list-none">
        <span className="flex items-start justify-between gap-4">
          <span>
            <span className="type-caption block font-semibold text-slate-600">
              {reference.label}
            </span>
            <span className="type-caption mt-1 block text-zinc-500">
              {reference.description}
            </span>
          </span>
          <span className="type-caption shrink-0 font-semibold text-zinc-900">
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
      <p className={`${contentClassName} mt-3 border-t border-zinc-200 pt-3`}>
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

/**
 * Fields written as paragraphs or as one entry per line - bodies, bullets,
 * card and step lists, testimonials.
 *
 * The same test drives the taller textarea and the full-width card, because
 * they answer the same question: this field holds more than a phrase. A
 * separate list for the layout would drift from the one for the height.
 */
function isLongFormField(field: ContentEditorField) {
  const normalizedPath = field.path.toLowerCase();

  return multilineFieldPathParts.some((part) => normalizedPath.includes(part));
}

function getTextareaMinimumHeight(field: ContentEditorField) {
  return isLongFormField(field) ? "min-h-40" : "min-h-28";
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
      ? "border-slate-700 bg-slate-700 text-white hover:border-slate-800 hover:bg-slate-800"
      : tone === "quiet"
        ? "border-zinc-200 bg-white text-zinc-500 hover:border-slate-400 hover:text-slate-700"
        : "border-slate-700 bg-slate-700 text-white hover:border-slate-800 hover:bg-slate-800";

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
    <fieldset className="grid content-start gap-3 rounded-sm bg-zinc-50 p-4 shadow">
      <legend className="sr-only">{legend}</legend>
      <div className="grid gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="type-text-sm font-semibold text-zinc-900">
            {field.label}
          </span>
          {isDirty ? (
            <span className="type-caption font-semibold text-slate-600">
              edited
            </span>
          ) : null}
        </span>
        {/*
          The badge and the explanation move into the disclosure. At a third of
          the row the label and its options are what has to fit; the rest is
          read once and then never again.
        */}
        <details>
          <summary className="type-caption cursor-pointer list-none text-zinc-500 transition-colors hover:text-slate-700">
            {badge}
          </summary>
          <p className="type-caption pt-2 text-zinc-500">{helperText}</p>
        </details>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={legend}>
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              aria-pressed={isActive}
              className={`min-h-9 rounded-sm border px-3 text-xs font-semibold transition-colors ${
                isActive
                  ? "border-slate-700 bg-slate-700 text-white"
                  : "border-zinc-200 bg-white text-zinc-500 hover:border-slate-400 hover:text-slate-700"
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
      className="inline-flex min-h-9 items-center justify-center rounded-sm border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-500 transition-colors hover:border-slate-400 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
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
      ? "border-zinc-200 bg-white text-zinc-500 hover:border-slate-400 hover:text-slate-700"
      : "border-slate-700 bg-slate-700 text-white hover:border-slate-800 hover:bg-slate-800";

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

/**
 * An image field still holding the value its section library ships with.
 *
 * The editor already carries that default: asset specs are recorded as an
 * exact `template-default` fallback, so this reuses it rather than keeping a
 * second list of placeholder paths in sync with the export's guard. A field
 * with no value counts too - the renderer falls back to library demo content
 * when one is absent, so blank renders the same placeholder as unchanged.
 */
function isPlaceholderImageValue(field: ContentEditorField, value: string) {
  if (field.kind !== "image") {
    return false;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return true;
  }

  return (
    field.fallback?.source === "template-default" &&
    trimmed === field.fallback.value.trim()
  );
}

function decodeAssetLabel(assetPath: string) {
  const name = assetPath.split("/").pop() ?? assetPath;

  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}

/**
 * Image fields were plain text inputs, so replacing one meant typing a path
 * from memory and a typo produced a broken image with nothing to catch it.
 *
 * The preview is the real check - it resolves the value the same way the page
 * will, so a wrong path shows as a broken thumbnail here rather than on a
 * client site. The picker covers the common case; the text input stays for
 * anything not yet in `public/images`.
 */
function ImageFieldEditor({
  assets,
  field,
  onChange,
  originalValue,
  value,
}: {
  assets: string[];
  field: ContentEditorField;
  onChange: (value: string) => void;
  originalValue: string;
  value: string;
}) {
  const controlId = getFieldControlId(field);
  const isDirty = value !== originalValue;
  const isPlaceholder = isPlaceholderImageValue(field, value);
  const trimmed = value.trim();
  const isKnownAsset = assets.includes(trimmed);

  return (
    // Carries the same card surface as the copy and toggle fields. It had none
    // of its own while every neighbour was bordered, so it read as loose
    // content rather than a field.
    <div
      className={"grid content-start gap-3 rounded-sm bg-zinc-50 p-4 shadow"}
    >
      <div className="flex items-center justify-between gap-4">
        <label className="type-label text-zinc-900" htmlFor={controlId}>
          {field.label}
        </label>
        <div className="flex items-center gap-2">
          {isDirty ? <StatusPill label="edited" /> : null}
          <StatusPill label={isPlaceholder ? "placeholder" : "set"} />
        </div>
      </div>

      <div className="flex items-start gap-4 max-sm:flex-col">
        <div
          className={`radius-4 relative size-24 shrink-0 overflow-hidden border bg-zinc-100 ${
            isPlaceholder ? "border-zinc-900" : "border-zinc-200"
          }`}
        >
          {trimmed ? (
            // Deliberately a plain img, not next/image: the value is arbitrary
            // user input and may not resolve at all, which is exactly what the
            // preview is here to reveal.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              className="size-full object-cover"
              src={trimmed}
            />
          ) : (
            <span className="type-caption absolute inset-0 grid place-items-center text-zinc-500">
              none
            </span>
          )}
        </div>

        <div className="grid min-w-0 flex-1 gap-2">
          {assets.length > 0 ? (
            <select
              className="type-text-sm radius-4 w-full border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-slate-500"
              onChange={(event) => onChange(event.target.value)}
              value={isKnownAsset ? trimmed : ""}
            >
              <option value="">
                {isKnownAsset ? "Choose an image..." : "Custom path (below)"}
              </option>
              {assets.map((asset) => (
                <option key={asset} value={asset}>
                  {decodeAssetLabel(asset)}
                </option>
              ))}
            </select>
          ) : null}

          <input
            className="type-text-sm radius-4 w-full border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-slate-500"
            id={controlId}
            onChange={(event) => onChange(event.target.value)}
            spellCheck={false}
            value={value}
          />

          <p className="type-caption text-zinc-500">
            {/*
              The badge already says "placeholder", so this carries the
              consequence instead of repeating the state.
            */}
            {isPlaceholder
              ? "Blocks export until replaced."
              : "Pick from public/images, or paste a path."}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Fields rendered as a button row rather than a text control - the style axes
 * plus image framing. They share a layout because they share a shape: a label
 * and two to four short options.
 */
function isToggleField(field: ContentEditorField) {
  return (
    Boolean(getStyleFieldSpec(field)) ||
    field.path.endsWith(".imageRatio") ||
    // No option list, so `getStyleFieldSpec` returns nothing for it - but it is
    // a framing decision and belongs beside the image, not adrift in the copy.
    field.path.endsWith(`.${styleFieldPrefix}.backgroundImageFocus`)
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="type-caption rounded-sm bg-zinc-100 px-3 py-1 text-zinc-600">
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

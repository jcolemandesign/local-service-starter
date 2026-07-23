# Staged-Copy Workflow — Technical Handoff

Investigation-only document. No application code, tests, config, persisted data, or other
docs were modified while producing this file. All file:line references below were read
directly from the repository on branch `codex/template-first-workflow`.

## 1. Overview

This traces the complete pipeline from "a template exists" through "a site is exported,"
focused on where copy lives, how it is validated, and how it is applied — because the
validation status (`empty` / `current` / `stale` / `unverified`) is suspected of returning
false `current` results.

```text
Template (page-templates.json)
  → stage → StagedPage (staged-pages.json, embeds its own section snapshot)
  → generate contract (buildTemplateCopyContract) → LLM writes bulk-paste copy
  → parse copy → validate contract status → seed/merge into StagedPage.fields
  → edit / restage
  → site export (reads StagedPage.fields only)
```

No Supabase involvement anywhere in this pipeline — it is entirely flat JSON under
`src/content/`, read/written with `node:fs/promises`. Supabase is confirmed scoped to
auth, lead intake, and dashboard data only (`src/utils/supabase/*`,
`src/app/api/intake/route.ts`) — no `supabase`/`createClient` references exist in
`src/utils/staged-pages.ts`, `src/utils/template-copy-contract.ts`, or
`src/app/api/staged-pages/route.ts` (confirmed via grep).

---

## 2. Page-template storage

**File:** `src/content/page-templates.json` — `{ templates: PageTemplate[] }`, flat JSON.

**API:** `src/app/api/page-templates/route.ts`
- `GET` (lines 53-60) — reads the file.
- `POST` (lines 62-99) — "promote a Pagebuilder option to a template"; normalizes the
  request body into a `PageTemplate` and **prepends** it, filtering out any existing
  template with the same `id` — a full replace-by-id, not a merge.
- `PATCH` — rename/update; `DELETE` — remove.

**Types** (declared inline in the route file, lines 6-39):

```ts
type PageTemplateSection = {
  component: string;
  instruction: string;
  mode: string;
  name: string;
  originalComponent?: string;
  originalIndex?: number;
  reduceBottomPadding?: boolean;
  reduceTopPadding?: boolean;
  ratio?: string;
  variant?: string;
  colorRecipe?: SectionColorRecipe;
  cardFill?: SectionCardFill;
};

type PageTemplate = {
  id: string;
  name: string;
  pageType: string;
  sections: PageTemplateSection[];
  // + promotedAt, sectionCount, sourceOptionName, sourceRecipeId, sourceRecipeName
};
```

**Important structural fact:** this type is **re-declared, not imported**, in at least
three places with slightly different field sets:
- `PageTemplateSummary` — `src/components/sections/TemplateLibrarySection.tsx:23-47`
- `StagedPageTemplateSection` / `StagedPageTemplate` — `src/utils/staged-pages.ts:29-51`
- `TemplateCopyContractSection` / `TemplateCopyContractTemplate` — `src/utils/template-copy-contract.ts:7-22` (this one is intentionally narrower — only `component`, `instruction?`, `mode`, `name`, `ratio?`, `variant?`)

**No section object has a stable ID.** Identity is `component` + `name` + array index
only. There is no `sectionId`, `slotId`, or UUID field anywhere in `PageTemplateSection`.

---

## 3. Staged-page creation

**Function:** `buildStrategyTemplateStagedPage` — `src/utils/staged-pages.ts:385-495`

```ts
export function buildStrategyTemplateStagedPage({
  applyBatchCopy = true,
  pageLabel,
  pageSlug,
  snapshot,
  template,
}: {
  applyBatchCopy?: boolean;
  pageLabel: string;
  pageSlug: string;
  snapshot: StrategySnapshot;
  template: StagedPageTemplate;
}) {
```

Called from `POST /api/staged-pages` (`src/app/api/staged-pages/route.ts:91-97`) — **both
the initial "stage" action and the "refresh" action call this same function.**

The critical structural decision, at `staged-pages.ts:486-493`:

```ts
template: {
  id: template.id,
  name: template.name,
  pageType: template.pageType,
  sectionCount: template.sections.length,
  sections: template.sections,   // full copy embedded, not just template.id
},
```

**Confirmed: a staged page embeds a full denormalized snapshot of `template.sections`**,
not just a soft `template.id` reference. If the source template is edited after staging,
already-staged pages keep the old section array until explicitly refreshed.

Per-section identity within a staged page is **computed, not persisted**:

```ts
`${String(index + 1).padStart(2, "0")}-${slugify(section.name || section.component)}`
```

— at `staged-pages.ts:434-436`, and duplicated (same formula, independently) at
`src/components/sections/StagedPageCanvas.tsx:350-354` as `getSectionId`. This
ordinal+slug string is the only thing tying a `StagedPageField.path` back to a section.
It is recomputed from `(index, name)` every time a page is built or refreshed — it is not
an immutable ID stored on the section object.

---

## 4. Staged-page storage — type and persistence

**Type** — `src/utils/staged-pages.ts:53-77`:

```ts
export type StagedPage = {
  fieldCounts: Record<ContentFieldKind, number>;
  fields: StagedPageField[];
  navigation: StrategyNavigationItem[];
  pageHref: string;
  pageId: string;
  pageLabel: string;
  previewHref: string;
  promotedAt: string;
  snapshot: { clientSlug: string; createdAt: string; id: string; version: number };
  sourceStage: "content-editor" | "strategy-template";
  status: "staged" | "ready";
  template?: {
    id: string;
    name: string;
    pageType: string;
    sectionCount: number;
    sections?: StagedPageTemplateSection[];
  };
};
```

`StagedPageField` (lines 22-27): `{ id: string; kind: "copy" | "image" | "link" | "meta";
path: string; value: string }` — a **flat array**, not nested per section. `path` (e.g.
`"02-fixed-ratio-split-image.eyebrow"`) encodes the section via the same ordinal+slug
scheme described above.

**Persistence:** `src/content/staged-pages.json` — `{ pages: StagedPage[] }`, plain
`node:fs/promises` `readFile`/`writeFile`, path built with
`` `${process.cwd()}/src/content/staged-pages.json` `` (`staged-pages.ts:87-92`). No
Supabase involvement. Read/write helpers: `readStagedPages`, `writeStagedPage`,
`removeStagedPage`, `updateStagedPageFields` (lines 87-195).

Identity key for upsert/dedupe: `getStagedPageKey` → `` `${clientSlug}:${pageId}` ``
(lines 79-81). `writeStagedPage` prepends the new page object and filters out any prior
page with the same key — **a full-object replace**, no per-page row versioning.

---

## 5. Restaging / refreshing a staged page

**There are two structurally different mechanisms — do not conflate them.**

### A. Full rebuild — the "refresh" action

`src/app/api/staged-pages/route.ts`, `action === "refresh"` (lines 47-112), triggered by
`src/components/sections/StagedPageRefreshButton.tsx:35-79`, whose confirm dialog literally
warns: *"Replace ... with a fresh build from the latest batch copy and the current
template? Any content edits made directly on this staged page will be overwritten."*
(lines 36-38).

This calls the **same** `buildStrategyTemplateStagedPage` used for initial creation. It
does **not** preserve existing `StagedPageField` values by field id — it regenerates the
entire `fields` array from `template.sections` and the strategy snapshot's batch copy,
correlated only by the recomputed `${index+1}-slug` path, then `writeStagedPage` fully
replaces the old page object. **Full replacement.**

### B. Partial in-place merge — "sync from strategy snapshot"

`syncStagedPagesFromStrategySnapshot` (`staged-pages.ts:197-300`) +
`reconcileTemplateCopyFields` (`staged-pages.ts:302-383`). This **does** preserve existing
field objects: it iterates `page.fields` and only overwrites specific known paths
(`strategy.pageCopy`, `strategy.contentPlan`, `strategy.strategyBrief`) or empty/copy-kind
fields via `seedFieldsFromStrategyCopy`. A guard at `staged-pages.ts:707-715` refuses to
overwrite a field whose current value differs from what it previously synced from (i.e. it
was manually edited) — protecting manual edits during re-sync. Only runs when
`getTemplateCopyContractStatus(...) === "current"` (gate at lines 225-237).

Both mechanisms correlate sections via the same **recomputed `(index + name)` ordinal/slug
scheme** — there is no persisted stable section ID in either path.

### Confirmed effects of specific restaging scenarios

| Scenario | Confirmed behavior |
|---|---|
| One component swapped at the same position | Position/ordinal unchanged → old copy at that path is still "matched" by path string during refresh's re-seed pass, and (see §7) can pass the schema-compatibility fallback even though the component changed — this is the false-`current` risk, not a safe swap. |
| Section inserted | Not traced as an insert — refresh fully rebuilds `fields` from the new `template.sections` array positionally; any pre-existing field whose path collides with a shifted ordinal is not specially reconciled. |
| Section removed | Same — full rebuild from current `template.sections`; no reconciliation of the removed section's old field values (they are simply absent from the new `fields` array after a refresh). |
| Two sections reordered | **Not preserved by identity.** Because `sectionId`/`path` is derived from `(index, name)`, a reorder changes the derived path for every section after the reorder point. Refresh rebuilds fully, so this doesn't corrupt data, but copy does not "follow" its component across a reorder — it is rematched by array position, not by section identity. |
| Same component appears more than once | Differentiated fine — the ordinal number is always unique per array position regardless of repeated `component`/`name` values, so paths stay unique. |
| Original template changes after staging | Staged `fields`/render data is unaffected until refresh/sync runs (§3). Contract generation for the page **can** be affected earlier — see §6. |
| Repeatable sibling page chooses a different template | Each `StagedPage` carries its own independent `template.id` + `template.sections` snapshot (§3) — confirmed structurally independent once staged. **User-confirmed (not independently code-verified beyond `isRepeatablePageType`, `src/utils/strategy-site-map.ts:448`):** the first staged child page becomes the default/initial template choice for the rest of the sibling pages, but each child can subsequently choose its own template and restaging one child (`clientSlug:pageId` key) only replaces that child. |

---

## 6. Section definitions

Section **content/copy defaults**: `src/content/section-library-v3.ts` —
`sectionLibraryV3Content` (component metadata: labels, descriptions, category groupings,
previews) and `sectionLibraryV3Collections`. Grepped for
`version|fingerprint|schemaVersion|contractVersion` — **zero relevant hits** (only
unrelated prose containing "conversion"). This file has no field-spec/char-limit/item-count
data structure at all.

Section **components** (React): `src/components/sections/*.tsx`, switched on by
component-name string in `renderPageTemplateSection`
(`src/components/sections/PageTemplatePreview.tsx:337-671`, a large `switch (section.component) { ... }`).

**No stable ID separate from array position** anywhere in the render path.
`PageTemplatePreviewSection.id` (`PageTemplatePreview.tsx:122-134`) is optional (`id?:
string`) and is never set for a raw template preview
(`src/app/dev/templates/[templateId]/page.tsx:49-52` maps `template.sections` with no
`id`). It is only populated for staged pages, and even then it is *computed* via
`getSectionId`, not a persisted UUID.

---

## 7. Page-contract generation

**Function:** `buildTemplateCopyContract` — `src/utils/template-copy-contract.ts:85-230`

```ts
type BuildTemplateCopyContractInput = {
  pageLabel: string;
  pageSlug: string;
  strategySnapshot?: TemplateCopyContractStrategySnapshot;
  template: TemplateCopyContractTemplate;
};
```

This function is **generic over its `template` input** — it does not look up a live
template or a staged page itself; the caller resolves that beforehand. Confirmed three
call sites, each resolving `template` differently:

- `src/components/sections/TemplateLibrarySection.tsx:209-214` — a live
  `PageTemplateSummary` from the template library (used *before* any staged page exists —
  correct use).
- **`src/components/sections/StrategyWorkspaceSection.tsx:598-621`** — read directly:

  ```ts
  async function copyPageTemplateContract(page: (typeof assemblyPages)[number]) {
    const copyKey = page.stagedPageId || page.id;
    const template =
      templates.find((item) => item.id === page.templateId) ??
      page.stagedTemplate;
    ...
    const contract = buildTemplateCopyContract({
      pageLabel: page.stagedPageLabel || page.label,
      pageSlug: page.stagedPageId || page.id,
      strategySnapshot: ...,
      template,
    });
  ```

  **This prefers the live/current template over the staged snapshot**, falling back to
  `page.stagedTemplate` only if no live template with that ID exists (e.g. it was
  deleted). **Confirmed bug-adjacent fact:** if a template is edited (not deleted) after a
  page has been staged from it, this call site generates contract copy against the edited
  live template shape, not the frozen shape the staged page actually contains — directly
  contradicting "staged pages are frozen at staging time."
- `src/app/dev/prompt-library/page.tsx:70-90` (`buildStagedPageContracts`) — builds
  `template` straight from `page.template` fields already stored on the `StagedPage`
  (`page.template?.id`, `.name`, `.pageType`, `.sections`) — **this is the correct
  precedent**, generating from the staged snapshot, not a live lookup.

**Answer to "does the contract represent a whole page, template, or section?"** — a whole
template (id + all sections), scoped to one target page via `pageLabel`/`pageSlug` text
only; there is no per-section contract object.

---

## 8. Contract fingerprint generation

**Function:** `getTemplateCopyContractFingerprint` — `template-copy-contract.ts:232-257`

```ts
export function getTemplateCopyContractFingerprint(
  template: TemplateCopyContractTemplate,
) {
  const contractShape = {
    id: template.id,
    pageType: template.pageType,
    sections: template.sections.map((section) => ({
      component: section.component,
      fields: getTemplateCopyFieldsForSection(section).map((field) => ({
        format: field.format ?? "",
        itemCount: field.itemCount ?? 0,
        name: field.name,
        purpose: field.purpose,
        target: field.target,
      })),
      instruction: section.instruction ?? "",
      mode: section.mode,
      name: section.name,
      ratio: section.ratio ?? "",
      variant: section.variant ?? "",
    })),
    version: 2,
  };

  return `tc-v2-${hashContractShape(JSON.stringify(contractShape))}`;
}
```

Hashes: template `id`, `pageType`, and per section — `component`, the derived field specs
(`name`/`purpose`/`target`/`format`/`itemCount`, from `getTemplateCopyFieldsForSection`),
`instruction`, `mode`, `name`, `ratio`, `variant`, plus a hardcoded literal `version: 2`.
It is a **shape/schema fingerprint of the whole template**, never a content hash (it never
touches actual copy text) and never a per-section fingerprint.

Hash function (`hashContractShape`, lines 385-394) is a 32-bit FNV-1a-style hash — not
cryptographic, just a fast non-colliding-in-practice checksum:

```ts
function hashContractShape(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}
```

**The fingerprint is never persisted as a field on any type.** It is embedded only as an
HTML comment inside generated contract text (line 166:
`` `<!-- Template contract: ${contractFingerprint} -->` ``) and re-extracted from pasted
copy via regex:

```ts
export function getBatchCopyContractFingerprint(copy: string) {
  return (
    copy.match(/<!--\s*Template contract:\s*([^\s>]+)\s*-->/i)?.[1] ?? ""
  );
}
```

No per-section schema version or fingerprint exists anywhere in the codebase today
(confirmed by grep across `src/types`, `src/content`, `src/utils` for
`version|fingerprint|schemaVersion|contractVersion` — the only hits are the strategy
snapshot's own `version: number` field, unrelated to template/section schema, and the
literal `version: 2` inside `contractShape` above).

---

## 9. Contract-status validation

**Function:** `getTemplateCopyContractStatus` — `template-copy-contract.ts:281-299`

```ts
export type TemplateCopyContractStatus =
  | "current"
  | "empty"
  | "stale"
  | "unverified";

export function getTemplateCopyContractStatus(
  copy: string,
  template: TemplateCopyContractTemplate | undefined,
): TemplateCopyContractStatus {
  if (!copy.trim()) {
    return "empty";
  }

  const copyFingerprint = getBatchCopyContractFingerprint(copy);

  if (!copyFingerprint || !template) {
    return "unverified";
  }

  return copyFingerprint === getTemplateCopyContractFingerprint(template) ||
    isBatchCopySchemaCompatible(copy, template)
    ? "current"
    : "stale";
}
```

Exact semantics:
- **`empty`** — copy string is blank/whitespace-only.
- **`unverified`** — copy is non-blank but has no embedded
  `<!-- Template contract: ... -->` fingerprint comment, OR no `template` object was
  supplied to compare against.
- **`current`** — either (a) the fingerprint embedded in the pasted copy exactly equals
  the freshly computed fingerprint for the current `template`, **OR** (b) it fails that
  exact match but passes the secondary structural check `isBatchCopySchemaCompatible`.
- **`stale`** — fingerprint present and a template supplied, but neither check passes.

This is **not** a simple `Object.keys` overlap at the top level — it's fingerprint-string
equality first, with a structural fallback.

### The `.every()` fallback — `isBatchCopySchemaCompatible`

`template-copy-contract.ts:301-323`:

```ts
function isBatchCopySchemaCompatible(
  copy: string,
  template: TemplateCopyContractTemplate,
) {
  const fieldsBySectionOrdinal = getBatchCopyFieldsBySectionOrdinal(copy);

  if (fieldsBySectionOrdinal.size !== template.sections.length) {
    return false;
  }

  return template.sections.every((section, index) => {
    const sectionOrdinal = String(index + 1).padStart(2, "0");
    const suppliedFields = fieldsBySectionOrdinal.get(sectionOrdinal);

    if (!suppliedFields) {
      return false;
    }

    return getTemplateCopyFieldsForSection(section).every((field) =>
      suppliedFields.has(normalizeContractFieldName(field.name)),
    );
  });
}
```

and its parsing helper, `template-copy-contract.ts:325-361`:

```ts
function getBatchCopyFieldsBySectionOrdinal(copy: string) {
  const fieldsBySectionOrdinal = new Map<string, Set<string>>();
  const lines = extractContractBulkPasteCopy(copy).split(/\r?\n/);
  let currentSectionOrdinal = "";

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    const sectionMatch = line.match(/^#{2,4}\s+(\d+)(?:-|\s|$)/);

    if (sectionMatch) {
      currentSectionOrdinal = sectionMatch[1].padStart(2, "0");
      fieldsBySectionOrdinal.set(
        currentSectionOrdinal,
        fieldsBySectionOrdinal.get(currentSectionOrdinal) ?? new Set<string>(),
      );
      return;
    }
    ...
    fieldsBySectionOrdinal.get(currentSectionOrdinal)?.add(normalizeContractFieldName(keyedMatch[1]));
  });

  return fieldsBySectionOrdinal;
}
```

**This is the definitive proof of the false-`current` mechanism.** The regex
`/^#{2,4}\s+(\d+)(?:-|\s|$)/` captures **only the leading digit ordinal** from a heading
like `### 03-hero-split-fixed-image` — group 1 is `(\d+)` — and the remainder of the
heading (the slugified section name/component, e.g. `-hero-split-fixed-image`) is
**discarded entirely**. It is never stored, never compared.

Combined with the `.every()` at line 311, validation reduces to: *"for every ordinal
position, does the current template section's required field-**name** set (from
`getTemplateCopyFieldsForSection`, not the component itself) exist in whatever field
names were parsed out of that ordinal's block in the pasted copy?"* **Component identity
is never compared anywhere in this function.**

### Explained failure scenario, using the real code

Suppose a template's section at position 3 is originally `TestimonialCarousel` with
fields `eyebrow`, `headline`, `body`, `ctaLabel`. Copy is generated and pasted for it,
producing a block headed `### 03-testimonial-carousel` with those four field keys.

Later, the template is edited (or a sibling/child page picks a different template) and
the section at position 3 is swapped to a different component — say `FeatureHighlight` —
which happens to require the same generic field names `eyebrow`, `headline`, `body`,
`ctaLabel` (a plausible real-world collision, since many section variants in this codebase
share these generic field labels).

`getTemplateCopyContractStatus` runs:
1. The embedded fingerprint (computed from the *old* template) no longer matches the new
   template's fingerprint → falls through to `isBatchCopySchemaCompatible`.
2. `getBatchCopyFieldsBySectionOrdinal` parses the pasted copy and finds ordinal `"03"`
   with field-name set `{eyebrow, headline, body, ctaLabel}` — the heading's
   `testimonial-carousel` slug is discarded and never checked.
3. `template.sections.every(...)` at ordinal 3 asks: does the *new* `FeatureHighlight`
   section's required field names (also `{eyebrow, headline, body, ctaLabel}`) all exist
   in the supplied set? **Yes.**
4. Result: `isBatchCopySchemaCompatible` returns `true` → status is **`current`** —
   even though the actual copy was written for an entirely different component and its
   content (a testimonial quote/attribution) is semantically wrong for a feature-highlight
   section.

Character limits (`target`), `itemCount`, and `format` are never checked either —
`normalizeContractFieldName` only lowercases and strips non-`[a-z0-9.]` characters from
the **name** string; nothing else from `TemplateCopyFieldSpec` is read during validation.

### Where field requirements/limits are defined

Not colocated with `section-library-v3.ts` (zero `version`/`fingerprint`/`schemaVersion`
hits there, confirmed by grep). They live entirely inside
`getTemplateCopyFieldsForSection` (`template-copy-contract.ts:396-1349`) — a ~950-line
hardcoded `if`/`else` chain keyed on `component`/`mode`/`section.name` substring matching
(e.g. `component.includes("faqaccordion")`, `mode === "action"`), each branch returning a
literal array of:

```ts
export type TemplateCopyFieldSpec = {
  example?: string | string[];
  format?: string;
  itemCount?: number;
  name: string;
  purpose: string;
  target: string;   // free-form English text, e.g. "35-70 characters." — not a machine-checkable number
};
```

This function is the **single shared dependency** for both contract generation (§7-8)
and validation (§9) — specs are not duplicated across two places — but validation only
ever reads the `name` key out of each spec; `target`/`itemCount`/`format` are advisory
text for a human or LLM to follow and are never enforced or even parsed as structured
values during validation.

---

## 10. Batch-copy parsing and application

### There is no function literally named `applyBatchCopy`

It exists only as a boolean parameter on `buildStrategyTemplateStagedPage`
(`staged-pages.ts:385-395`):

```ts
export function buildStrategyTemplateStagedPage({
  applyBatchCopy = true,
  ...
}: { applyBatchCopy?: boolean; ... }) {
```

used at `staged-pages.ts:466-468`:

```ts
const fields = applyBatchCopy
  ? seedFieldsFromStrategyCopy(templateFields, strategyCopy)
  : templateFields;
```

and set from the API route (`src/app/api/staged-pages/route.ts:91-92`):

```ts
const page = buildStrategyTemplateStagedPage({
  applyBatchCopy: contractStatus === "current",
  ...
```

**So "apply batch copy" is all-or-nothing at the whole-page level, gated by the single
whole-page `contractStatus` — not scoped per section.** Given §9's false-`current` proof,
this means a page whose contract is falsely `current` will have its (possibly wrong)
batch copy applied wholesale.

### The real merge logic — `seedFieldsFromStrategyCopy`

`staged-pages.ts:677-724`:

```ts
function seedFieldsFromStrategyCopy(
  fields: StagedPageField[],
  strategyCopy: string,
  options: { overwriteExistingCopy?: boolean; previousStrategyCopy?: string } = {},
) {
  const keyedValues = parseKeyedCopyValues(strategyCopy);
  const previousKeyedValues = options.previousStrategyCopy
    ? parseKeyedCopyValues(options.previousStrategyCopy)
    : new Map<string, string>();

  if (keyedValues.size === 0) {
    return fields;
  }

  return fields.map((field) => {
    if (
      field.kind !== "copy" ||
      field.path.startsWith("strategy.") ||
      (!options.overwriteExistingCopy && field.value.trim().length > 0)
    ) {
      return field;
    }

    const key = getBulkPasteMatchKey(field, keyedValues);
    const value = key ? keyedValues.get(key) : "";
    const previousValue = key ? previousKeyedValues.get(key) : "";

    if (
      options.overwriteExistingCopy &&
      previousValue &&
      field.value.trim() &&
      field.value.trim() !== previousValue &&
      !hasHumanReviewSection(field.value)
    ) {
      return field; // manual edit since last sync — preserve it
    }

    return value ? stagedField({ ...field, value }) : field;
  });
}
```

- **Input:** `StagedPageField[]` (existing fields) + raw `strategyCopy` text + options.
- **Output:** `StagedPageField[]` — same shape, values updated in place.
- **It does not replace the whole page** — it `map`s over the existing field array and
  only ever overwrites individual `kind === "copy"` fields.
- **It merges per-field**, not per-section and not per-page.
- **Matching mechanism:** `getBulkPasteMatchKey` (lines 884-925) builds candidate keys from
  `field.path`, `` `${sectionId}.${fieldName}` ``, alias variants
  (`getBulkPasteSectionAliases`, lines 966-978 — e.g. `stacked-feature-cards` ↔
  `asymmetric-feature-cards`), and `field.id`. If no exact match, it falls back to
  matching by **section ordinal number** plus a fuzzy field-name alias table
  (`getCompatibleBulkPasteFieldNames`, lines 927-960 — e.g. `body` ↔
  `intro`/`description`/`paragraphs`). **Never a bare array-index match, never a
  whole-page replace.**
- **Partial application:** yes, inherently — unmatched fields are returned unchanged, not
  cleared. If `keyedValues.size === 0` (nothing parseable), the entire input `fields`
  array is returned untouched.
- **Unknown/incompatible sections:** if `getBulkPasteMatchKey` finds no key, `value` is
  empty and the original field is returned unchanged. No error is thrown, no section is
  specially flagged.
- **Can one failed section damage unrelated copy?** Not through this function directly —
  each field is evaluated independently and unmatched/unrelated fields pass through
  unchanged. The risk is upstream: the whole-page `applyBatchCopy` boolean gate in
  `buildStrategyTemplateStagedPage` means if `contractStatus` is falsely `current`, *all*
  matchable copy-kind fields across the whole page get seeded/overwritten in one pass —
  there is no per-section circuit breaker.
- **What would be needed for section-scoped application:** a per-section status (§ Narrow
  Recommended Solution, item 3-4) consulted inside `seedFieldsFromStrategyCopy`'s field
  loop (or a pre-filter before calling it) so that fields belonging to a section whose
  parsed-copy identity doesn't match the current section are skipped even when the
  overall page-level fingerprint/compatibility check would otherwise let them through.

### Parsing pipeline

No single `parseBatchCopy` function — a small pipeline, all in `staged-pages.ts`:

- **`parseKeyedCopyValues(text: string): Map<string, string>`** (line 726) — dispatcher;
  tries JSON first, falls back to markdown/bulk-paste text.
- **`parseJsonCopyValues`** (line 742) + **`flattenCopyValue`** (line 754) — parses
  JSON-shaped pasted copy, flattening nested objects/arrays into dotted keys.
- **`parseMarkdownCopyValues`** (line 783) — parses the markdown "Bulk Paste Copy" format
  (`### 01-hero` headings + `` `fieldName`: value `` lines) into
  `Map<normalizedKey, value>`.
- **`extractBulkPasteCopy(text: string): string`** (line 845, exported) — slices out just
  the `# Bulk Paste Copy` section of a larger document, stopping at a
  "Copy Notes"/"Copy QA" heading.

Related (in `template-copy-contract.ts`, used for validation, not for building staged
fields): `isBatchCopySchemaCompatible`, `getBatchCopyFieldsBySectionOrdinal`,
`getBatchCopyContractFingerprint`, `extractContractBulkPasteCopy` — a separate,
parallel parsing path from the one used to actually seed field values. **Note:** these are
two independently-implemented parsers over similar-looking markdown (one in
`staged-pages.ts` for seeding, one in `template-copy-contract.ts` for validation) — they
are not the same code path, which is itself a source of subtle drift risk (e.g. one could
be more lenient than the other), though no concrete divergence was proven during this pass.

---

## 11. API routes

| Route | Methods | Purpose |
|---|---|---|
| `src/app/api/staged-pages/route.ts` | POST, PATCH, DELETE | POST stages a page from a template + snapshot (`action: "stage"`) or fully rebuilds one (`action: "refresh"`); both call `buildStrategyTemplateStagedPage` and both reset export `approved: false`. PATCH updates individual field values via `updateStagedPageFields`, also resets `approved: false`. DELETE removes a staged page, also resets `approved: false`. |
| `src/app/api/site-export/route.ts` | POST | `approve` / `unapprove` / `dry-run` / `export` actions for exporting a client's approved staged pages. |
| `src/app/api/agent-export/route.ts` | GET | Downloads a per-client copywriting-agent instructions file. |
| `src/app/api/content-editor-pages/route.ts` | POST | Creates a Content Editor page from a template, auto-generating content fields from the section library. |
| `src/app/api/content-editor-promotions/route.ts` | POST | Promotes a Content Editor page's edited fields into `staged-pages.json`. No approval-reset logic lives here (confirmed by grep — zero `approv` matches in this file). |
| `src/app/api/page-templates/route.ts` | GET, POST, DELETE, PATCH | List/create/delete/rename templates in `page-templates.json`. |
| `src/app/api/pagebuilder-options/route.ts` | GET, POST | Read/save Pagebuilder section-option drafts. |
| `src/app/api/strategy-workspace/route.ts` | GET, POST | Read/save the strategy workspace; writes a strategy snapshot and re-syncs staged pages from it. |
| `src/app/api/style-guide-tokens/route.ts` | POST | Normalize/write design-token CSS overrides into `globals.css`. |
| `src/app/api/page-index/route.ts` | POST | Clone/delete a local dev page route and update the home page index. |
| `src/app/api/intake/route.ts` | POST | Submits client intake to Supabase + Make.com webhook (unrelated to this pipeline). |

**Confirmed export-approval invalidation:** implemented in
`src/app/api/staged-pages/route.ts` (`approved: false` set at ~lines 100, 145, 185 across
the stage/refresh, PATCH, and DELETE handlers respectively) — **not** in
`content-editor-promotions/route.ts`, which has no approval logic at all. Any edit,
refresh, or deletion of a staged page invalidates its export-approval state.

---

## 12. Existing tests

**None exist.** No `*.test.ts` / `*.spec.ts` / `__tests__` directory anywhere under `src/`
(confirmed via Glob — the only matches found were inside `node_modules`, unrelated to this
project). `package.json` has no `test` script and no test framework
(`jest`/`vitest`/`@testing-library`) in `devDependencies`. There is currently **zero**
test coverage for staged pages, contracts, validation, or batch copy.

---

## 13. Site export

**Engine:** `src/utils/site-export.ts`
- `analyzeSiteExport(requestedClientSlug): Promise<SiteExportAnalysis>` (line 85) — dry-run.
- `exportClientSite(requestedClientSlug): Promise<SiteExportResult>` (line 93) — full
  export; writes to `exports/client-sites/<clientSlug>` (override:
  `CLIENT_EXPORT_ROOT`), runs `tsc --noEmit` + `next build --webpack` in a temp dir
  (`verifyGeneratedSite`, line 735) before atomically renaming into place. Export refuses
  to overwrite an existing destination.
- Internal `resolveSiteExport` (line 147): `readStagedPages()` → filter to client slug →
  filter to pages approved via `readSiteExportState` (`src/utils/site-export-state.ts`) →
  for each approved page, `getStagedPageRenderData(page, clientPages)`
  (`StagedPageCanvas.tsx`) + `resolvePageSections` (line 305) →
  `renderPageTemplateSection` (`PageTemplatePreview.tsx`) → serializable props →
  `content.ts`/`page.tsx`/route files.

**Confirmed: export reads from `StagedPage.fields` (the persisted staged-page snapshot),
never re-reads live template JSON at export time.** Once staged, export operates purely on
`src/content/staged-pages.json` plus `site-export-state` approval flags. Output includes a
`pageworks-export.json` manifest recording clientSlug, per-page snapshot id/version/
templateId, and the section-library git commit used.

Builder-only paths are excluded from the generated site (`src/app/dev/`,
`src/app/api/`, `Pagebuilder*`, `ContentEditor*`, `PromptLibrary*`, `StrategyWorkspace*`,
`StagedPage*`, `StyleGuide*`, `src/content/projects/`, `src/content/staged-pages.json`).

---

## 14. Legacy data / persistence-format investigation

- **Current staged-page persistence format:** flat JSON, `{ pages: StagedPage[] }` in
  `src/content/staged-pages.json` (§4). No Supabase table, no row versioning beyond the
  strategy `snapshot.version` field.
- **No fingerprint field exists on any persisted type today** (`StagedPage`,
  `StagedPageTemplate`, `StagedPageField` all confirmed fingerprint-free). The only place
  a fingerprint is "stored" is as an HTML comment inside raw copy text
  (`<!-- Template contract: tc-v2-... -->`), which itself is not a persisted JSON field —
  it lives inside whatever `value` string happens to contain the pasted bulk-copy text
  (typically a `strategy.pageCopy`-style field), and is stripped out for
  fingerprint-comparison purposes at read time.
- **Where a future per-section fingerprint could be stored:** the same pattern as today's
  whole-template fingerprint — embedded as an HTML comment per section heading in
  generated contract text (e.g. `<!-- Section contract: sc-v1-... -->` right after each
  `### 0N-slug` heading) and recomputed/extracted on read. **This requires no schema
  migration** of `staged-pages.json` or `page-templates.json` — no new field needs to be
  added to any persisted type, exactly mirroring how the existing whole-template
  fingerprint works today.
- **How existing unfingerprinted copy could be structurally validated without migration:**
  fall back to the corrected identity+field-name compatibility check (heading slug/
  component match, not just ordinal — see Narrow Recommended Solution item 2) when no
  per-section fingerprint comment is present in a given section's block. This is a live
  classification at read time, not a backfill write.
- **How valid legacy copy could be backfilled without mass invalidation:** because
  fingerprints are never persisted (they live inside copy text), "backfill" would mean
  regenerating contract text with per-section fingerprint comments only when copy is
  next regenerated/re-pasted — existing staged `StagedPageField.value` strings that
  already contain real copy do not need to be rewritten or invalidated; the corrected
  fallback check (previous bullet) classifies them without requiring any write.
- **What malformed/incompatible legacy data looks like:** copy text with no
  `# Bulk Paste Copy` section (parses to zero keyed values — `seedFieldsFromStrategyCopy`
  short-circuits and returns fields unchanged); a section-count mismatch between parsed
  ordinals and `template.sections.length` (`isBatchCopySchemaCompatible` returns `false`
  immediately, line 307-309); or a heading ordinal with no field lines beneath it
  (`suppliedFields` is an empty set, so any required field name fails the `.has()` check).

---

## 15. Narrow recommended solution

Smallest safe changes to satisfy: truthful per-section validation; prevention of false
`current`; a detailed validation report with failure reasons; per-section copy-schema
versions/fingerprints; safe legacy-copy fingerprint backfill (i.e., none required, see
§14); same-position partial restaging; section-scoped batch-copy application;
preservation of unaffected staged copy; page contracts generated from the actual staged
page; and basic editor visibility for sections needing regenerated copy.

1. **Fix contract-source precedence** — `StrategyWorkspaceSection.tsx:598-621`. Change
   `templates.find(t => t.id === page.templateId) ?? page.stagedTemplate` to prefer
   `page.stagedTemplate` first, falling back to the live template lookup only when no
   staged snapshot exists (e.g. a page that hasn't been staged yet). Matches the existing
   correct precedent in `src/app/dev/prompt-library/page.tsx:70-90`.
2. **Close the false-`current` gap** in `isBatchCopySchemaCompatible` /
   `getBatchCopyFieldsBySectionOrdinal` — retain the slug/component portion of each
   `### 0N-slug` heading (currently discarded by the regex) and require it to match the
   current template section's own computed slug at that ordinal, in addition to the
   existing field-name coverage check. A mismatch means "not schema-compatible" even if
   field names happen to overlap.
3. **Add a per-section fingerprint**, analogous to the existing whole-template one —
   e.g. `getTemplateCopySectionFingerprint(section)` — embedded per section in generated
   contract text (§14: no persisted-schema change needed).
4. **Add a granular status function** — e.g. `getTemplateCopySectionStatuses(copy,
   template): Array<{ sectionId: string; ordinal: string; status: TemplateCopyContractStatus; reasons: string[] }>`
   — built from the per-section fingerprint/compatibility check. Keep the existing
   whole-page `getTemplateCopyContractStatus` in place unmodified so today's call sites
   (e.g. the refresh-gate in `staged-pages/route.ts`) keep working; they can migrate to
   "worst of per-section statuses" in a later, separate change.
5. **Legacy backfill (no migration required)** — sections whose copy predates a
   per-section fingerprint are classified live via the corrected compatibility check from
   item 2, exactly as described in §14.
6. **Section-scoped apply** — change the whole-page `applyBatchCopy` boolean gate on
   `buildStrategyTemplateStagedPage`/the refresh action to consult per-section status
   (item 4) and skip re-seeding fields for sections that are not current/compatible,
   instead of gating the entire page on one aggregate status. This is what enables
   same-position partial restaging and preservation of unaffected staged copy during a
   "refresh."
7. **Editor visibility** — surface per-section status (item 4) in
   `src/app/dev/staged-pages/page.tsx` (list view) and the staged-page editor UI, flagging
   which specific sections need regenerated copy rather than only a single page-level
   badge.

**Why reorder/insert/delete/duplicate reconciliation is out of scope, and the one place a
larger system is arguably unavoidable long-term:** all of today's section correlation
(§3, §5, §9, §10) is positional — `(index, name)` derived, with no persisted stable
section ID. Truthfully reconciling a reorder, insertion, or deletion (i.e., knowing that
"the section that used to be at position 3 is now at position 5, and its copy should move
with it") requires a stable per-section identity that survives array mutation — a schema
change (a persisted `sectionId`/slot ID on `PageTemplateSection`/`StagedPageTemplateSection`)
that is explicitly out of scope for this fix. The narrow recommendation above does not
require or introduce this; it only makes same-position validation and application truthful.
If reorder-safety is wanted later, a stable-slot-ID migration is the smallest correct path,
but it is a distinct, larger change with its own migration story and is intentionally not
bundled here.

---

## 16. Implementation phases

### Phase 1 — Introduce Vitest; fix false-`current` in `isBatchCopySchemaCompatible`
- **Goal:** stop component-identity-blind validation from reporting `current` for
  mismatched sections; establish a test harness for these pure functions.
- **Files:** `package.json` (add `vitest` devDependency + `"test": "vitest run"` script),
  new `vitest.config.ts`, new `src/utils/__tests__/template-copy-contract.test.ts`,
  `src/utils/template-copy-contract.ts` (`isBatchCopySchemaCompatible`,
  `getBatchCopyFieldsBySectionOrdinal`).
- **Types/data shapes affected:** none persisted — internal parsing only.
- **Behavior changed:** schema-compatibility now also requires the heading slug/component
  token to match the current template section at that ordinal, not just field-name
  coverage.
- **Tests required:** new unit tests covering (a) the false-`current` repro case (two
  components sharing a field-name set at the same ordinal — must now report `stale`, not
  `current`); (b) legitimate `current`/`stale`/`empty`/`unverified` cases remain unaffected.
- **Primary risk:** could flip some copy that is currently (incorrectly) reported
  `current` to `stale` if it legitimately predates this stricter check — a false `stale`,
  which is the safer failure direction but may surface as unexpected UI warnings.
- **Rollback boundary:** revert the function change + drop the new test file and
  devDependency; no persisted data is touched, so rollback is a pure code revert.
- **Suggested commit message:** `test(contracts): add vitest and require component identity match in batch-copy schema compatibility check`

### Phase 2 — Fix contract-source precedence
- **Goal:** ensure contracts for already-staged pages are generated from what is actually
  staged, not from a live template that may have since diverged.
- **Files:** `src/components/sections/StrategyWorkspaceSection.tsx` (`copyPageTemplateContract`, lines 598-621).
- **Types/data shapes affected:** none.
- **Behavior changed:** `page.stagedTemplate` is preferred over the live `templates.find(...)` lookup.
- **Tests required:** none exist to extend yet at this call site (component/UI code); add
  a focused unit test if the precedence logic is extracted into a small pure helper as
  part of this change (recommended, to keep it testable under the new Vitest setup from
  Phase 1).
- **Primary risk:** low — a single precedence swap; the only behavior change is which
  template object feeds `buildTemplateCopyContract` when both a live and staged template
  exist.
- **Rollback boundary:** revert the swap.
- **Suggested commit message:** `fix(strategy-workspace): generate page contracts from staged template snapshot, not live template`

### Phase 3 — Per-section fingerprint + granular status
- **Goal:** truthful per-section validation with failure reasons, without removing the
  existing whole-page status function.
- **Files:** `src/utils/template-copy-contract.ts` (new exports:
  `getTemplateCopySectionFingerprint`, `getTemplateCopySectionStatuses`).
- **Types/data shapes affected:** new exported types only (no persisted schema change).
- **Behavior changed:** additive — existing `getTemplateCopyContractStatus` callers are
  unaffected until they opt in.
- **Tests required:** unit tests for the new fingerprint function (stable across
  no-op changes, changes on section edit) and the new status function (per-section
  `reasons[]` content on each of the four statuses).
- **Primary risk:** medium — new surface area to keep in sync with the whole-page
  fingerprint's field derivation (`getTemplateCopyFieldsForSection`) as that function
  evolves.
- **Rollback boundary:** revert the new exports; nothing else depends on them yet.
- **Suggested commit message:** `feat(contracts): add per-section copy fingerprint and status`

### Phase 4 — Section-scoped apply
- **Goal:** same-position partial restaging; preserve unaffected staged copy during
  refresh; replace the whole-page `applyBatchCopy` boolean gate.
- **Files:** `src/utils/staged-pages.ts` (`seedFieldsFromStrategyCopy`,
  `buildStrategyTemplateStagedPage`), `src/app/api/staged-pages/route.ts`.
- **Types/data shapes affected:** no persisted schema change; internal function signatures
  gain an optional per-section-status input.
- **Behavior changed:** "refresh" no longer re-seeds every copy field page-wide based on
  one aggregate status — it consults per-section status (Phase 3) and skips re-seeding
  fields belonging to sections that aren't current/compatible.
- **Tests required:** integration-style unit tests over
  `buildStrategyTemplateStagedPage`/`seedFieldsFromStrategyCopy` covering: a page where
  one section is compatible and one is not — confirm only the compatible section's fields
  are updated and the other section's existing values survive a refresh.
- **Primary risk:** highest in this plan — changes refresh semantics that users may
  currently rely on ("refresh always fully replaces"); needs product sign-off on the new
  behavior before shipping, separate from the correctness fix itself.
- **Rollback boundary:** revert to the page-wide boolean gate; Phase 3's additive
  functions can remain unused without harm.
- **Suggested commit message:** `feat(staged-pages): apply batch copy per-section instead of whole-page gate`

### Phase 5 — Editor visibility
- **Goal:** basic editor visibility for sections needing regenerated copy.
- **Files:** `src/app/dev/staged-pages/page.tsx` and/or the staged-page editor component
  (e.g. `StagedPageCanvas.tsx`/its containing page).
- **Types/data shapes affected:** none persisted — UI consumes Phase 3's per-section
  status output.
- **Behavior changed:** UI-only; surfaces which sections need regenerated copy instead of
  a single page-level badge.
- **Tests required:** none exist for UI in this repo; manual verification via
  `npm run dev` + the `/dev/staged-pages` routes (requires `ENABLE_DEV_ROUTES=true` in
  production, unnecessary in dev).
- **Primary risk:** low — additive UI surface.
- **Rollback boundary:** revert the UI change; underlying data/logic from Phases 1-4
  remains valid and useful on its own.
- **Suggested commit message:** `feat(staged-pages-ui): surface per-section copy status`

---

## 17. Verification commands

- **Focused tests (after Phase 1 introduces Vitest):** `npx vitest run src/utils/__tests__/template-copy-contract.test.ts`
- **Full relevant tests:** `npm run test` (once the `"test": "vitest run"` script exists)
- **Lint:** `npm run lint` (runs `eslint`)
- **Type check:** `npx tsc --noEmit` (no dedicated script exists today; `typescript` is a devDependency)
- **Production build:** `npm run build` (runs `next build`)

No expensive commands (build, full test run) were executed during this investigation
pass — verification commands above are documented, not run, per the investigation-only
scope of this document.

---

## Confirmed Facts

- Staged pages embed a full denormalized copy of `template.sections`
  (`staged-pages.ts:486-493`), not just a `template.id` reference.
- No section object (template or staged) has a persisted stable ID; identity is always
  `(array index, name/component)`-derived (`staged-pages.ts:434-436`,
  `StagedPageCanvas.tsx:350-354`).
- `buildTemplateCopyContract` is generic over its `template` input; whether a contract
  reflects the live template or the staged snapshot depends entirely on the caller.
  `StrategyWorkspaceSection.tsx:598-621` incorrectly prefers the live template over the
  staged snapshot; `dev/prompt-library/page.tsx:70-90` correctly uses the staged snapshot.
- The whole-template fingerprint (`getTemplateCopyContractFingerprint`,
  `template-copy-contract.ts:232-257`) is never persisted; it exists only as an embedded
  HTML comment inside copy text, recomputed on read.
- `getTemplateCopyContractStatus`'s fallback (`isBatchCopySchemaCompatible`) discards the
  component-identifying slug from each section heading during parsing
  (`getBatchCopyFieldsBySectionOrdinal`, regex at line 332) and validates only
  ordinal-position + field-**name** coverage — never component identity, never
  `target`/`itemCount`/format. This produces false `current` results when two components
  at the same position share overlapping field names.
- There is no function named `applyBatchCopy`; the actual per-field merge logic is
  `seedFieldsFromStrategyCopy` (`staged-pages.ts:677-724`), gated at the whole-page level
  by a boolean derived from the (possibly false) whole-page contract status.
- Two distinct restaging code paths exist with different preservation semantics: the
  "refresh" action (full destructive rebuild) and `syncStagedPagesFromStrategySnapshot`
  (protective, per-field merge).
- Site export reads exclusively from `StagedPage.fields`
  (`site-export.ts` → `readStagedPages()` → `StagedPageCanvas.tsx` →
  `PageTemplatePreview.tsx`), never re-reading live template JSON at export time.
- No test files, test script, or test framework exist anywhere in this repository today.
- Export-approval invalidation (`approved: false`) is implemented in
  `src/app/api/staged-pages/route.ts`, not in `content-editor-promotions/route.ts`.

## Unresolved Questions

- The exact code path that assigns "the first staged child page becomes the default
  template choice for sibling pages" was not independently traced beyond confirming
  `isRepeatablePageType` exists (`strategy-site-map.ts:448`) and that each `StagedPage`
  carries an independent `template` snapshot once staged. User has confirmed this
  behavior is correct from direct knowledge of the system; it is recorded here as a
  user-confirmed fact, not a code-cited one, per explicit instruction that further
  tracing was not necessary for this pass.
- Whether any other call site beyond the three identified (§7) resolves
  `TemplateCopyContractTemplate` from a live-vs-staged source was not exhaustively
  searched beyond the grep/read performed during this investigation; a targeted grep for
  all `buildTemplateCopyContract(` call sites would be prudent before Phase 2 lands, to
  confirm no fourth call site has the same precedence issue.
- The two independent bulk-paste parsers (`staged-pages.ts`'s seeding parser vs.
  `template-copy-contract.ts`'s validation parser, §10) were not diffed line-by-line for
  behavioral divergence; no concrete mismatch was found, but this was not exhaustively
  proven safe.

## Recommended First Commit

Phase 1 as specified in §16: introduce Vitest and fix the false-`current` gap in
`isBatchCopySchemaCompatible`/`getBatchCopyFieldsBySectionOrdinal` by requiring the
section heading's slug/component token (currently discarded) to match the current
template section's computed slug at that ordinal, in addition to the existing
field-name-coverage check — with accompanying unit tests proving the false-`current` repro
case now reports `stale`. This is the smallest change that fixes the concretely
demonstrated correctness bug without touching any persisted data shape, any API route
behavior, or any UI.

## Explicitly Out of Scope

- Full template versioning.
- Automatic template-to-page synchronization.
- Cross-page drift detection.
- Stable-slot-ID migration (the one system that would be needed for truthful
  reorder/insert/delete/duplicate reconciliation — see §15 — but is not required by the
  narrow fix above and is not being built now).
- Reorder reconciliation.
- Insertion reconciliation.
- Deletion reconciliation.
- Duplicate-component reconciliation.
- Branching or merging systems for staged copy.

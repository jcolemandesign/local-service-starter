# Builder workflow — current process

How the Pageworks builder actually works today: adding a section, what each
toggle does and where it is stored, and the staged-page lifecycle from template
to exported site.

This is the **current** reference. The other docs in this folder have narrower
jobs:

- `architecture-review-2026-07.md` — decisions log. Why things are shaped the
  way they are, which findings were disproved, what is left in Phase 4. Read it
  before structural work.
- `animation-axis-handoff.md` — the per-section entrance animation axis: how it
  works, which sections are marked or deliberately excluded, and the open
  problems. Read it before touching animation or adding a marker class.
- `pageworks-pipeline.md`, `staged-copy-workflow-handoff.md` — historical, both
  flagged as such at the top. Good for vocabulary and for the original
  mechanism write-ups; wrong in specifics.
- `.claude/skills/add-section/SKILL.md` — the section-registration checklist,
  summarised below.

---

## 1. The pipeline

Each stage hands the next one a **snapshot**, not a live reference. That is the
core rule: promotion severs the runtime tie, so editing a template does not
reach back into pages already staged from it.

```text
Section library          src/components/sections/ + src/content/section-library-v3.ts
  → Pagebuilder          src/content/pagebuilder-options.json      (layout experiments)
  → Template Library     src/content/page-templates.json           (promoted, slotId anchors assigned)
  → Strategy workspace   projects/<client>/strategy-workspace.json → strategy-snapshot(s).json
  → Prompt Library       generates a copy contract per page; copy is pasted back into the snapshot
  → Staged Pages         projects/<client>/staged-pages.json       (embeds its own template snapshot)
  → Content Editor       edits staged fields in place
  → Site export          exports/client-sites/<client>/            (approval-gated)
```

### Screens

| Route | Label | Does |
|---|---|---|
| `/sections` | Section preview | Renders every registered section |
| `/dev/pagebuilder` | Page Builder | Arrange section stacks, set toggles, promote to a template |
| `/dev/templates`, `/dev/templates/[templateId]` | Template Library | Promoted templates; stage a page; copy a contract |
| `/dev/projects`, `/dev/projects/[slug]/strategy` | Workspace archive / Strategy | Client sitemap, page copy, snapshots |
| `/dev/prompt-library` | Prompt Library | Builds the copy contract handed to the copywriting LLM |
| `/dev/staged-pages` | Staged Pages | Per-page status, refresh, alts, approval and export controls |
| `/dev/staged-pages/[pageId]`, `.../debug` | Staged preview | Renders the staged page; debug view shows raw fields |
| `/dev/content-editor` | Content Editor | Edits staged copy, assets and per-section style overrides |
| `/dev/style-guide` | Style Guide | Global tokens; promote writes an override block into `globals.css` |

### Where data lives

Everything in the builder pipeline is flat JSON under `src/content/`, read and
written with `node:fs/promises`. **No Supabase** — that is scoped to auth, lead
intake and the dashboard.

Per client, under `src/content/projects/<clientSlug>/`:

```txt
page-slots.json          client-specific sitemap slots, merged over baseStrategyPageSlots
strategy-workspace.json  the working document
strategy-snapshot.json   latest saved snapshot (strategy-snapshots.json keeps history)
source-packet.json       intake / research inputs
strategy-digest.md       digest handed to the prompt library
staged-pages.json        the staged pages themselves
site-export.json         per-page export approval state
```

Shared, not per client: `pagebuilder-options.json`, `page-templates.json`,
`section-library-v3.ts`.

### API routes

`page-templates`, `pagebuilder-options`, `strategy-workspace`, `staged-pages`,
`site-export`, `agent-export`, `style-guide-tokens`, `style-guide-slots`,
`page-index`. All builder routes are gated by `requireBuilderApiAccess()` and
refuse to run in production unless `ENABLE_DEV_ROUTES=true`.

---

## 2. Adding a new section

The section library is the source of truth. A section is not done until all of
these exist — the checklist is in `.claude/skills/add-section/SKILL.md`, and
`AGENTS.md` repeats it:

1. Component in `src/components/sections/`
2. Export from `src/components/sections/index.ts`
3. Entry in `src/content/section-library-v3.ts`, in the right semantic collection
4. Entry in the `/sections` preview map (`src/app/sections/page.tsx`)
5. Added to **both** pagebuilder lists under the **same semantic mode** as the
   library — `sectionSwapOptions` in `PagebuilderShell.tsx` (what is offered)
   and `previewCatalog` in `PagebuilderSection.tsx` (what the gallery renders).
   The `sectionStack` arrays in `pagebuilder.ts` are recipe defaults, not the
   catalog; `pagebuilder-catalog-parity.test.ts` pins both against the registry
6. Wiring in **all three render paths** — `renderPageTemplateSection` in
   `PageTemplatePreview.tsx` (with an `xxxProps()` mapper, rendering from
   `page.fields`); `renderPreviewSection` in `PagebuilderSection.tsx` (the
   gallery, rendering from library demo content — a missing case renders the
   "Preview unavailable" placeholder); and the ternary chain in
   `PagebuilderShell.tsx` (the builder canvas). That chain applies toggles
   centrally through `withSectionToggles`, so a branch there is needed only for
   a `variant` axis or heading level — see §3
7. A copy field spec — a branch in `getTemplateCopyFieldsForSection`
   (`src/utils/template-copy-contract.ts`)
8. An asset field spec if it renders images — a branch in
   `getTemplateAssetFieldsForSection` (`src/utils/staged-pages.ts`)
9. Membership in the toggle sets it qualifies for in
   `src/content/section-style-options.ts` — the decision list is in the
   add-section skill; §3 below explains each set

### The failure that does not error

Every `xxxProps()` mapper spreads `...sectionLibraryV3Content.X` as its fallback
base. If the mapper reads a field name that no spec declares, that field is
never requested from the LLM, never written to `page.fields`, and the section
silently renders **demo content on a client site**. Export validation cannot
catch it: `validateStagedFields` only inspects fields that exist in
`page.fields`, and an unspecced field never gets there.

So: **the field names the mapper reads must exactly match the names the spec
declares.** Cross-check by hand.

Two things that make this harder to eyeball, both recorded in the architecture
review after they generated ~24 false positives:

- Specs sometimes build names with template literals (`item${slot}Title`), so
  grepping for a literal name finds nothing.
- Nested `getValue(section, A, getValue(section, B, demo))` is a **priority
  chain** — only the outermost name must be declared. Same for
  `cardItemsWithFallback(section, ["a","b"], …)`, and for `getTitle` /
  `getBody`, which read `h1|headline|heading|title` and
  `body|intro|description`.

A section with no branch at all falls through to `fallbackFields`
(`eyebrow`/`heading`/`body`/`items`), which is almost never right.

The guard is `src/utils/__tests__/section-demo-content-leak.test.ts`. It drives
the real render path — builds the fields the spec declares, renders, reads
`element.props` back, compares against demo content — mirroring how
`site-export.ts` serialises sections. Known gaps live in its `KNOWN_GAPS` list,
asserted bidirectionally, so closing one forces removing it from the list.
Prefer this approach over reasoning about source text for anything in this area.

Note that `getTemplateCopyFieldsForSection` and
`getTemplateAssetFieldsForSection` match on a fuzzy `component + mode + name`
string via `.includes(...)`, so **the order of the if-chain is semantically
significant**. Add branches with that in mind.

Two consequences worth stating outright, because each shipped a bug:

- **A specific branch must sit above every generic branch that could claim its
  name.** `CTAServiceTriageSectionV3` carried a full 13-field spec that never
  ran: the generic `lookupValue.includes("service")` branch matched first,
  because the *component name* contains "service". A shadowed branch is
  invisible — no error, no unused-code warning, just demo copy on the page.
- **Match on the shortest distinctive substring, not the full name.** The asset
  spec tested `photogallerycarousel`, which silently missed the Large variant's
  `photogallerylargecarousel` and returned no fields at all.

Before finishing: the section appears in `/sections` and in pagebuilder under
the matching mode, spec and mapper agree on every field name, and
`npm run lint` / `npx tsc --noEmit` / `npm run test` pass.

---

## 3. Toggles

A toggle is one axis of a section's appearance or content shape. Two things
decide how a toggle behaves: **where it is stored**, and **whether it changes
which copy fields the section asks for**.

### Template-level vs staged override

**Template-level** toggles are set in Pagebuilder and stored on the template
section (`page-templates.json` / `pagebuilder-options.json`, and on
`WorkingSection` while editing):

```txt
variant     ratio     cardLinks     cardMedia     align   icons   headingSize   headlineWrap
colorRecipe cardFill  cardBorder    reduceTopPadding  reduceBottomPadding
```

**Staged overrides** are the copy-neutral subset, settable per page in the
Content Editor and stored as `meta` fields at path
`<sectionId>.style.<axis>` — see `styleFieldOptions` in
`src/content/section-style-options.ts`:

```txt
colorRecipe  cardFill  cardBorder  reduceTopPadding  reduceBottomPadding
```

An **empty value always means "inherit whatever pagebuilder saved"**, so the
template stays the source of truth and an override reads as an override. The
same convention covers the ratio field
(`splitImageRatioFieldOptions` starts with `{ label: "Use template default",
value: "" }`).

`variant` and alignment axes are deliberately **not** overridable per page:
`variant` is one overloaded string encoding orientation, heading size and image
mode together, so exposing it would drag copy-affecting modes along with it.

Because the staged preview and the site export both render through
`renderPageTemplateSection`, an override honoured by the preview is emitted by
the export with no extra wiring.

### Copy-affecting vs copy-neutral

The copy-contract fingerprint hashes: `component`, the derived field specs,
`instruction`, `mode`, `name`, `ratio`, `variant`. Therefore:

| Axis | Stored on | Copy-affecting? | Notes |
|---|---|---|---|
| `variant` | template | **Yes** | In the fingerprint directly |
| `ratio` | template (staged override allowed) | **Yes** | In the fingerprint directly |
| `cardLinks` | template | **Yes**, indirectly | `getTemplateCopyFieldsForSection` reads it (`section.cardLinks !== "off"`), so destinations and link labels come and go with it - the shared `linkLabel` on the card grids, `sectionAction` or per-card `actionLabel` on the split-decision sections |
| `cardMedia` | template | No | Photo / compact icon / none for the vertical card-link grids. One asset field per card is reused across treatments, and legacy `with-images` / `text-only` variants resolve to photo / none. |
| `align` | template | No | Deliberately its own field, not folded into `variant`, so a purely visual nudge does not report every approved page's copy as stale |
| `icons` | template | No | Marker icons on/off; same reasoning as `align` |
| `headingSize` | template | No | Shared three-step headline scale; each component preserves its pre-toggle size as the unset default |
| `headlineWrap` | template | No | `text-wrap` on the section's headline (`balance` / `pretty` / `wrap`); same reasoning as `align` |
| `colorRecipe`, `cardFill`, `cardBorder` | template + staged override | No | Repaint only |
| `reduceTopPadding`, `reduceBottomPadding` | template + staged override | No | Frame padding only; offered to content-height sections, not to `viewportHeightComponents` — min-height takes the space back, so the control would read as broken |

Flipping a copy-affecting toggle moves the fingerprint, which flips affected
sections to `stale`. That is expected and safe — it surfaces warnings on
existing pages rather than silently applying copy written for a different shape.

### Per-component gating

The builder only offers an axis to sections that actually read it, so no toggle
renders that silently does nothing. The membership sets live in
`section-style-options.ts`:

- `cardStyleComponents` / `sectionSupportsCardStyle` — who gets `cardFill` and
  `cardBorder`
- `cardLinkComponents` / `sectionSupportsCardLinks` — ordinary link cards only;
  CTA sections (buttons are the conversion action) and callout sections (cards
  are controls, not navigation) are excluded
- `cardLinkGridAlignComponents`, `tableCompareAlignComponents` — the two
  alignment axes
- `iconComponents` / `sectionSupportsIcons` — sections that draw marker icons
- `headingSizeComponents` / `sectionSupportsHeadingSize` — sections that use
  the shared three-step headline scale
- `headlineWrapComponents` / `sectionSupportsHeadlineWrap` — sections whose
  headline is the whole composition, where how it breaks is a layout decision
  rather than the type scale's default
- `cardFillOptInComponents` — sections that render **no** card by default, so an
  unset value means `none` rather than the usual `solid`. `resolveCardFill()`
  exists because `globals.css` keys off `data-pagebuilder-card-fill`, and
  reporting `solid` on an opt-in section applies the wrong recipe rules.
- `viewportHeightComponents` / `sectionSupportsSectionSpacing` — the inverse of
  the others: membership *removes* the spacing controls. These sections pin a
  viewport-derived min-height, so trimming padding never shortens them.

Every reusable section with a card or panel background must read `cardFill` and
`cardBorder` and appear in `cardStyleComponents`. Transparency is a required
capability for filled card surfaces, not a section-by-section design choice.
For composite cards such as comparison tables, `cardBorder="off"` removes the
outer outline while structural internal dividers may remain.

`getSectionStyleFieldSpecs(component)` returns what a given section offers.

Membership decides both whether the **control appears** and whether its value
**reaches the component**. `getSectionToggleProps` in
`src/components/sections/section-toggle-props.ts` reads the same sets, so the two
answers cannot disagree, and `withSectionToggles` clones the resolved values onto
whatever the builder rendered.

That matters because the builder canvas renders most sections from a
`previewCatalog` element built once from a synthetic section carrying no toggle
values. Toggles used to reach a section only if someone had hand-written a branch
for it in the render chain in `PagebuilderShell.tsx`; 51 of 93 sections had no
such branch, so their controls rendered and did nothing. `section-toggle-props.test.ts`
asserts the values land on the element for every registered section.

Note the older CSS mechanism still exists alongside this: the section frame
carries `data-pagebuilder-card-fill` / `-card-border` / `-color-recipe`, and
`globals.css` implements them with selectors that guess at markup
(`> section.bg-service-surface`, `article` scoped to four modes, `a.bg-service-surface`
for two named components). It works only for sections whose DOM happens to match,
which is why a card that is a `div.bg-service-surface` under mode Utility was
unaffected by either mechanism before the props path was made universal. Prefer
the props path; treat the CSS rules as legacy.

### Two traps when adding an axis

1. **Option values must stay strings** so `""` can mean inherit — but
   `reduceTopPadding`/`reduceBottomPadding` are stored as **booleans** on the
   section record. Spreading `"default"` onto them is truthy and would reduce
   the padding it was meant to restore. `booleanStyleFields` marks them; the
   resolvers convert rather than spread.
2. **Persisted values are opaque ids, not descriptions.** The split-image
   variants read `text-3-image-4-right` while the labels read "Text 6 / Image 7"
   — the grid is 14 columns with a gap. Renaming a value would require
   migrating every saved page.

Option lists live in `section-style-options.ts` and are imported everywhere —
pagebuilder, content editor, `PageTemplatePreview`, the style guide controls.
They used to be declared per screen, and duplicated lists drift silently: a
value one screen accepts and another does not falls back to a default with no
error. One list per axis.

---

## 4. Staged pages

### What a staged page is

A `StagedPage` (`src/utils/staged-pages.ts`) holds a **full denormalised copy**
of `template.sections`, not a `template.id` reference. Editing the source
template afterwards does not touch pages already staged from it.

Fields are a flat array, not nested per section:

```ts
type StagedPageField = {
  id: string;    // `${pageId}.${path}`
  kind: "copy" | "image" | "link" | "meta";
  path: string;  // `07-cards-features-4-up-split.body`
  value: string;
};
```

### Section identity

The path prefix is `NN-slugify(section.name || section.component)`, derived by
`getSectionId` in `src/utils/section-id.ts` — one implementation, canonicalised
on `name || component` (it used to be seven implementations with two precedence
rules).

Paths stay **derived and human-readable** so records remain diffable and
greppable. Identity is anchored separately by a persisted `slotId`
(`crypto.randomUUID`), assigned at template promotion and carried through the
template → pagebuilder → template round trip. Renaming or reordering a section
changes its derived path; `getSectionIdRenames` maps old id → new for every slot
whose derived id changed, and `remapFieldPathsForRenamedSections` moves the
fields onto the new paths before the path-keyed merge runs.

Without that anchor, a renamed section presents the merge with nothing to match:
its copy is neither carried forward nor deleted, it is simply never read again
while the section renders demo content. That is not theoretical — section 07 of
the About page did exactly this after a rename. Sections with no anchor fall
back to path matching, which is what every call site did before, so the degraded
case is never worse than the old behaviour.

### Copy contracts and statuses

The Prompt Library generates a contract from a template; the LLM returns bulk
paste copy; the copy is pasted into the strategy workspace and saved into a
snapshot. Fingerprints ride along **inside the copy text as HTML comments** —
`<!-- Template contract: tc-v2-… -->` for the whole template and `sc-v1-…` per
section — so content versioning needs no persisted schema change.

Statuses, from `getTemplateCopySectionStatuses`:

| Status | Means |
|---|---|
| `current` | Section fingerprint matches, or the identity+field-name compatibility check passes |
| `stale` | Fingerprint present but does not match this section definition |
| `unverified` | No matching section block found at this position in the pasted copy |
| `empty` | No copy pasted for this page yet |
| `site-level` | Nav/footer — copy is not written per page, so this section keeps whatever the content editor holds. Section-level only; deliberately not `current` |

When resolving which template to check against, **the staged snapshot wins** —
`resolveContractTemplate(stagedTemplate, liveTemplates, templateId)`. Checking
against the live template would validate against a shape the page does not have.

### Staging and refresh

`POST /api/staged-pages` with `action: "stage" | "refresh" | "preview" |
"promote-alt"`. Stage and refresh run the same path; `preview` builds the
candidate without writing it.

`buildStagedPageCandidate`:

1. Resolve the client's sitemap slots and the page's strategy copy through
   `resolveStrategyCopyForPage`.
2. Build fields from `template.sections`, seeding batch copy **per section** —
   only sections whose status is `current` are seeded. A stale or unverified
   section is left blank rather than filled with copy that may belong to a
   different component.
3. Remap the previously staged page's paths for any renamed/reordered slot.
4. `mergePreservingIncompatibleSections` restores the previous values for every
   **non-`current`** section.

Net effect: a same-position restage only touches the sections that actually have
good new copy, and never blanks sections that were fine.

Two ordering constraints that are easy to break:

- Copy must be resolved **the same way seeding resolves it**. Reading
  `pageCopy.<slug>` directly diverges for a page with no matching slot and for a
  fuzzy slot match — every section then looks non-`current`, the merge restores
  everything, and the user gets a success message for a refresh that changed
  nothing.
- Archive the existing page **after** building the candidate, never before. The
  candidate reads the page currently at that slug to preserve values.

`getCopySeedingSummary` reports whether a paste actually reached a field, so a
total miss is visible at stage time instead of only as demo prose in the
preview. It distinguishes `seededNothing` (real page copy reached nothing —
a fault) from `stagedWithoutPageCopy` (no page copy exists yet, so seeding fell
back to whole-site planning prose — expected).

### Alts

`onExisting: "alt"` parks the page currently at a slug in the next free alt slot
instead of discarding it. An alt is a full staged page with its own `pageId`
(`<base>-alt1`), so the preview route, content editor and debug view address it
with no special casing. The marker keeps alts out of the two places that must
show exactly one page per slot: site navigation and export. `altIndex` is a
stable slot, not a recency rank — renumbering would move the URL of a page you
already have open in the other tab. `action: "promote-alt"` swaps an alt with
the live page.

### Approval and export

Every mutation — stage, refresh, field edit, delete, promote-alt — sets
`approved: false` for that page. Approving after the Style Guide has been
re-promoted also un-approves pages approved under the old tokens, and says so,
because an export emits one `globals.css` per client.

`POST /api/site-export` takes `approve` / `unapprove` / `dry-run` / `export`.
Export reads **only** `StagedPage.fields` — it never re-reads live template JSON
at export time. It builds and verifies in a temp directory (`tsc --noEmit` plus
a real `next build` against the generated output), refuses to overwrite, and
renames into place atomically. The manifest (version 2) records the generated
files, the snapshot id/version/templateId per page, and the section-library
commit.

`mode: "update"` syncs into an existing export instead of swapping the directory,
for a deployed site that is already a git repo with history, `node_modules`,
real `.env` values and host config. Files a previous export produced and this
one does not are removed; everything else is left alone. Update refuses a
directory with no manifest from this tool, or one exported for a different
client.

---

## 5. Verification

```bash
npm run lint          # eslint
npx tsc --noEmit      # no dedicated script
npm run test          # vitest run
npm run build         # next build
```

The tests under `src/utils/__tests__/` are the real safety net for this
pipeline, and several run against **real records** rather than fixtures —
`staged-pages-orphan-fields.test.ts` fails if a remap leaves fields behind;
`client-page-slots.test.ts` pins the sitemap ordering, because a reorder
silently changes every service page's ordinal and therefore its field paths;
`staged-pages-slot-id-remap.test.ts` includes a negative control asserting the
copy *is* lost without the anchor, so the test cannot quietly stop testing
anything.

Adding fields to a spec changes its contract fingerprint and flips affected
sections to `stale`. Expected — but it surfaces warnings on existing pages, so
do it deliberately.

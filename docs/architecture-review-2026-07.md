# Architecture review — July 2026

Director-level review of the Pageworks builder, run against branch
`codex/template-first-workflow`. This file records **verified** conclusions and,
just as importantly, the findings that were **investigated and disproved** — so
they don't get re-chased.

Status legend: ✅ verified · ❌ disproved · 🔶 real but smaller than first claimed

---

## Findings that were disproved

Two findings were reported as CRITICAL. Both are false. Do not act on them.

### ❌ "ContentCardTwoUp ships demo content to clients"

Claimed: `ContentCardTwoUpSectionV3` has no branch in
`getTemplateCopyFieldsForSection`, so it falls through to `fallbackFields` and
renders section-library HVAC prose.

Reality: the branch exists at `src/utils/template-copy-contract.ts:1263` and
declares `item${slot}Title`, `item${slot}Body`, `item${slot}Supporting` for
slots 1–4 — exactly the fields `contentCardTwoUpProps` reads. Spec and mapper
agree.

The original audit missed it because the spec builds field names with a template
literal rather than string literals. The apparent "zero occurrences in staged
data" had a mundane cause: the component only appears in the `templeto`
template, which has never been staged.

### ❌ "Every exported footer reads 'Example Local Service'"

Claimed: `footerProps` reads `logoLabel`, which no spec declares, so the footer
falls back to the demo business name.

Reality: `footerProps` reads `businessName` **first**, with `logoLabel` only as
an inner fallback — and `03-footer.businessName = "North Star HVAC"` is present
in staged data. The footer is correct.

The cause was an analysis bug worth remembering: nested
`getValue(section, A, getValue(section, B, demo))` is a **priority chain**, where
only the outermost name must be declared. Treating each name as an independent
required read produced ~24 false positives on live components. The same applies
to `cardItemsWithFallback(section, ["a","b"], …)` alias arrays and to
`getTitle`/`getBody` (which read `h1|headline|heading|title` and
`body|intro|description` respectively).

**Any future drift analysis must model these chains, or it will be mostly noise.**

---

## 🔶 The drift problem — real, but narrow

The mechanism the review described is real: every `xxxProps()` mapper spreads its
section-library demo content as a fallback base, so a field the mapper reads but
no spec declares silently renders demo copy. Export validation structurally
cannot catch it — `validateStagedFields` only inspects fields that already exist
in `page.fields`, and an unspecced field never gets there.

Measured result: **11 live components** have at least one such gap. Not the
system-wide corruption originally implied, but not nothing either — e.g.
`TrustLogoGridSectionV3.label` renders "Recognized as a top service provider",
an unverified marketing claim.

The 11 are recorded in `KNOWN_GAPS` in
`src/utils/__tests__/section-demo-content-leak.test.ts`, asserted
bidirectionally so closing one forces removing it from the list.

### Fixed in this pass
- `contentfixedcoverfade` branch: added `backgroundLabel` (was rendering
  `"Closing CTA"` — builder jargon — on the home page).
- Added a `thankyouconfirmation` branch, which did not exist at all. Its `note`
  field explicitly warns against assuming heating/cooling, since the demo
  fallback is trade-specific and would be wrong for a non-HVAC client.

---

## ✅ Verified findings still worth acting on

Ordered by value, with the original phase numbering.

**Section identity has no stable key.** Identity is
`NN-slugify(section.name || section.component)` — an array index plus a
hand-typed display label — and it is the persistence key for all copy. It is
derived in six places with **two different precedence rules**:
`template-copy-contract.ts:180,357` use `name || mode || component`; everything
else (`staged-pages.ts:316,345,436`, `StagedPageCanvas.tsx:351`,
`content-editor.ts:165`) uses `name || component`. They agree only while `name`
is non-empty. Renaming a section's label invalidates every staged page's field
paths at that position.

**`staged-pages.json` is one global file for all clients**, rewritten whole on
every field save (`updateStagedPageFields`, `staged-pages.ts:144-197`), with no
locking. ~640 lines/page. The recommended fix is *partitioning*, not a database:
move to `src/content/projects/<clientSlug>/staged-pages.json`, matching how
strategy snapshots and export state are already partitioned. Do **not** migrate
to Postgres — it would discard the diffable/revertable property that makes this
workable solo and fix none of the identity problems.

**`styleTokenCss` is a single overwritable field per client**
(`site-export-state.ts:73-75`). Approving page B re-freezes page A's tokens.

**Refresh can silently no-op.** `buildStagedPageCandidate` computes merge
statuses from `snapshot.fields['pageCopy.' + slugify(pageSlug)]`, while
`buildStrategyTemplateStagedPage` computes seeding statuses via
`getStrategyCopyForPage`, which has a different fallback chain
(`strategy-site-map.ts:293-315`). When they disagree, every section looks
non-`current`, all previous values are restored, and the user sees a success
message for a no-op. Verified as a code-path divergence; likely doesn't fire on
current North Star data, but will for any page whose slug is not in
`strategyPageSlots`.

**`strategyPageSlots` is hardcoded to one HVAC client**
(`strategy-site-map.ts:30-261`). Every client of every trade gets the North Star
sitemap. A plumber gets "Heat Pump Service" as a page slot.

**Contract `version` literals** (`template-copy-contract.ts:263,292`) are
hardcoded in the shape objects; bumping either invalidates all existing copy at
once with no migration path.

---

## ✅ What is good and should be protected

- **`src/utils/site-export.ts`** — temp-dir staging, real `tsc --noEmit` +
  `next build` against generated output before an atomic rename, refusal to
  overwrite, dependency-closure analysis, builder-code leak detection, manifest
  pinning the section-library commit. Better than most commercial tooling.
- **The design-token layer** — `--color-x: var(--live-x, default)` indirection
  lets the Style Guide preview changes without mutating defaults.
- **Snapshot-over-reference** for staged templates. Correct call.
- **Fingerprints-in-comments** (`tc-v2-…`, `sc-v1-…`) — content versioning with
  zero persisted-schema change. Elegant given the LLM-in-the-loop constraint.
- **Approval invalidation on every mutation** — conservative and correct.
- **The primitives layer** — small and unambitious. Don't grow it.
- **Supabase scoping** — two tables, RLS on, disentangled from the builder.

Leave the explicit `switch` in `renderPageTemplateSection` alone: it is what lets
the export engine statically resolve component file paths. A dynamic registry
would break export analyzability.

---

## Phase 2 — done

- **Section identity unified** into `src/utils/section-id.ts`. Seven
  implementations, two precedence rules; canonicalised on `name || component`.
  Verified behaviour-preserving first: all 217 sections in both JSON files have
  a non-empty name, so the rules had not yet diverged.
- **Refresh no-op fixed.** `buildStagedPageCandidate` now resolves copy through
  `getStrategyCopyForPage`, the same path seeding uses.
- **Approval/token conflict fixed.** Approving a page after the Style Guide has
  been re-promoted now un-approves pages that were approved under the old
  tokens, and says so, instead of silently re-freezing them.
- **Orphaned About page copy recovered** — see the note below.
- **Parser agreement pinned** rather than merged. The heading-regex and
  normaliser differences between `parseMarkdownCopyValues` and
  `getBatchCopyFieldsBySectionOrdinal` are latent: no spec field name contains a
  hyphen, and generated contracts always emit `### NN-slug`. The extractors are
  equivalent. Only JSON is a reachable divergence. Merging would change matching
  across all existing copy for no active defect, so the tests assert the
  property instead: whatever validation certifies must actually seed.

### Observed: the rename bug is not theoretical

While verifying the identity refactor, section 07 of the About page turned out
to have been renamed ("Asymmetric feature cards" → "Cards features 4 up split")
with its five fields stranded under the old `07-asymmetric-feature-cards.*`
paths. That section had been rendering pure demo fallback while real approved
copy sat unreachable. Repaired in d109015. This is the strongest argument for
the persisted `slotId` in Phase 3.

## Phase 3 — done

Done:

- **Staged pages split per client** into
  `src/content/projects/<clientSlug>/staged-pages.json`. `readStagedPages()`
  enumerates client directories and concatenates, so consumers were unchanged;
  writes touch only the affected client. Migration verified lossless (7 pages,
  482 fields; git recorded a pure rename). Closes the cross-client dedupe
  collision — two clients can now both have a page called `home`.
- **Content Editor reads at request time.** The static
  `import stagedPagesData from "./staged-pages.json"` baked data in at build
  time while `/dev/staged-pages` read it at runtime, so the two surfaces could
  disagree. Now `getContentEditorPages()` with `force-dynamic`.
- **Validation at the read boundary.** Malformed records are skipped with a
  specific warning rather than crashing whichever surface reads them.
- **Orphan detection** over real records — see below.

### `StagedPage.status` is NOT vestigial

Corrected: this doc previously repeated the review's claim that it should be
deleted. It is rendered — `StatusPill` in `src/app/dev/staged-pages/page.tsx`
and status labels in `StrategyWorkspaceSection`. What is true is narrower: it is
write-only-one-value, because `"ready"` is never assigned to a staged page. So
the pill always reads "staged" and a `"ready"` branch in StrategyWorkspace is
unreachable.

Deleting it removes visible UI, so it is a product decision, not cleanup.
Options: drop the pill, or give `"ready"` a meaning — approved-for-export is the
obvious candidate, since that state already exists in `site-export.json`.

### `slotId` — done

The item that structurally fixes rename/reorder fragility. Shipped as designed:
an anchor, not a replacement for the path.

**The obvious implementation is wrong**, and was avoided. If `getSectionId`
simply returned a persisted `slotId`, every existing field path would change at
once and all current copy would orphan — the exact failure the change is meant
to prevent, applied to the whole repo.

What landed:

- `slotId` persisted on each template section (`createSlotId`, `crypto.randomUUID`
  rather than a new dependency), assigned at promotion in the page-templates
  route. Repeats are dropped at that write boundary, since a slot anchors
  exactly one section.
- Field paths stay derived and human-readable
  (`07-cards-features-4-up-split.body`), so records remain diffable and
  greppable and nothing was re-identified.
- `getSectionIdRenames` (`src/utils/section-id.ts`) maps old section id → new
  for every slot whose derived id changed. Renames resolve against the previous
  ids in one pass, so a straight swap of two sections maps both without one
  clobbering the other.
- `remapFieldPathsForRenamedSections` (`src/utils/staged-pages.ts`) moves those
  fields onto the new paths, wired into `buildStagedPageCandidate` ahead of the
  path-keyed merge. That merge is where copy was being dropped: it matches by
  path, so a renamed section previously had nothing to preserve.
- Anchors survive the template → pagebuilder → template round trip
  (`WorkingSection`, `serializeWorkingSection`, the pagebuilder-options route,
  and the Template Library's send-to-pagebuilder payload), so re-promoting an
  edited template does not lose them. Re-promotion also carries the previous
  template's anchors by index when the stack shape is unchanged.
- Backfilled: 150 anchors across 15 templates; the 64 staged sections took the
  anchor of the template section they were staged from. Verified purely
  additive — stripping `slotId` back out reproduced both files byte-for-byte.

Sections with no anchor produce no renames and fall back to path matching,
which is what every call site did before, so the degraded case is never worse
than the old behaviour.

Safety nets: `src/utils/__tests__/staged-pages-orphan-fields.test.ts` still runs
against real records and fails if any remap leaves fields behind (verified to
fire by reintroducing the About page orphan).
`src/utils/__tests__/staged-pages-slot-id-remap.test.ts` covers rename, reorder,
swap, and missing-anchor cases, and includes a negative control asserting the
copy *is* lost without the anchor — so the test cannot quietly stop testing
anything.

## Phase 4 — only if client count grows

Collapse to one `SectionDefinition` per section (demo content + field spec +
`toProps` colocated), which would remove the drift class structurally rather
than testing for it. Also: make `strategyPageSlots` per-client config, and add
re-export / update-after-launch.

## Checkpoints

Each tagged at a verified-green commit (`tsc --noEmit`, `eslint`, full vitest
run):

- `checkpoint/phase-1-complete`
- `checkpoint/phase-2-section-id`
- `checkpoint/phase-2-refresh-fix`
- `checkpoint/phase-2-complete`
- `checkpoint/phase-3-per-client-split`
- `checkpoint/phase-3-complete`

Test count over this work: 24 → 95.

Adding fields to a spec changes its contract fingerprint and flips affected
sections to `stale`. Expected and safe, but it surfaces warnings on existing
pages.

---

## Note on the analysis itself

Two of the three findings originally labelled CRITICAL did not survive
verification. Both came from reasoning about source text rather than executing
the code. The durable fix was to stop parsing source and instead **drive the
real render path** — build the fields the spec declares, render the section, read
`element.props` back, and compare against demo content. That is what
`section-demo-content-leak.test.ts` does, and it mirrors exactly how
`site-export.ts` serializes sections.

Prefer that approach for anything in this area.

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

## Remaining phases

- **Phase 2 — workflow simplification.** Unify the refresh copy source; extract
  one `getSectionId`; unify the two markdown parsers (`parseMarkdownCopyValues`
  in `staged-pages.ts:929` vs `getBatchCopyFieldsBySectionOrdinal` in
  `template-copy-contract.ts:474` — their heading regexes already differ); make
  `styleTokenCss` a set of named token records.
- **Phase 3 — structural cleanup.** Split `staged-pages.json` per client; add
  parsing at the `readStagedPages()` boundary; introduce a persisted `slotId`
  backfilled from current derived ids; delete vestigial `StagedPage.status`.
- **Phase 4 — only if client count grows.** Collapse to one `SectionDefinition`
  per section (demo content + field spec + `toProps` colocated), which would
  remove the drift class structurally rather than testing for it.

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

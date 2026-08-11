# Section animation axis — handoff

Written 2026-08-11, at the end of the session that built it. Nine commits, from
`7649db7` to `fbb3c59`, on `codex/template-first-workflow`.

Read `docs/builder-workflow.md` §3 first if you have not — this document assumes
its vocabulary (toggle axes, copy-affecting vs copy-neutral, the three render
paths, membership sets).

---

## 1. What exists

A per-section **entrance animation** toggle, off by default, settable in
pagebuilder and overridable per staged page.

The single most important fact for anyone picking this up: **almost none of this
was new machinery.** `globals.css` already carried a complete CSS scroll-driven
reveal — keyframes, an `@supports` guard, a reduced-motion guard, and a
`--reveal-index` stagger hook. Nothing in the builder could reach it, and five
sections animated unconditionally with no way to turn it off. The work was to
give it a switch and roll it out.

### The one architectural decision

**Ownership is inverted. A section does not decide whether it animates.**

- A section marks which of its elements are revealable units (`reveal-on-scroll`)
  and, in a list, which index each one is (`--reveal-index`).
- Whether any of it moves is the frame's `data-pagebuilder-animation` attribute.

Both marker rules in `globals.css` are scoped to that attribute, so "off by
default" is the selector matching nothing rather than markup being stripped. A
section saved before the axis existed renders byte-identically to before.

This is the same split the colour recipes use, for the same reason: a value the
system owns cannot drift section by section.

### Zero JavaScript

`animation-timeline: view()` is driven by the scroller. No Motion, no
IntersectionObserver, no client boundary, no bundle cost. This matters because 21
sections already import `motion/react` and an outer JS wrapper would have had to
negotiate with all of them.

### The token layer

Every value is a custom property with a default (`--anim-reveal-distance`,
`--anim-reveal-entry-start`, `--anim-reveal-entry-end`, `--anim-reveal-stagger`,
`--anim-reveal-easing`, `--anim-pulse-scale`, `--anim-pulse-stagger`).

**This is what makes the future style-guide "animation suites" cheap** — a suite
re-points seven properties, and touches no section. `animation-css-agreement`
fails if a literal creeps back into the keyframes or ranges.

---

## 2. Where the pieces are

| Concern | File |
|---|---|
| Option list, resolver, membership, exclusions | `src/content/section-style-options.ts` |
| The `SectionAnimation` type | `src/content/section-color-recipes.ts` |
| Keyframes, token layer, gated rules | `src/app/globals.css` (~line 207–290, ~400) |
| Staged/export frame + staged override fold | `src/components/sections/PageTemplatePreview.tsx` |
| Builder canvas frame + the control | `src/components/sections/PagebuilderShell.tsx` |
| Export field + emitted attribute | `src/utils/site-export.ts` |
| Transport across the four hops | `sectionToggleFieldNames` in section-style-options |
| Save normalisation | `src/app/api/pagebuilder-options/route.ts` |

Key names: `styleFieldOptions.animation`, `resolveSectionAnimation`,
`animationComponents`, `animationExcludedComponents`, `sectionSupportsAnimation`.

### Tests

- `animation-marker-ownership.test.ts` — 8 assertions. Registry vs markup in both
  directions; no section may set the attribute itself; both frame owners must
  still set it; markers pair with a stagger index; three exception lists kept
  honest (`dormantMarkers`, `sharedMarkerSources`, `singleUnitReveals`).
- `animation-css-agreement.test.ts` — offered values have rules, resolver accepts
  exactly the offered set, no ungated marker rule, token layer intact.
- `hero-variant-parity.test.ts` — from the bug in §5.

---

## 3. Rollout status

**16 of 98 marked. 36 recorded as never. ~46 left.**

Done: the five card grids (Scan), the three section headers, and four Narrative
sections, plus the four that already animated before the axis existed.

| Family | total | marked | left |
|---|---|---|---|
| Section Headers | 3 | 3 | 0 |
| Scan | 11 | 5 | 6 |
| Narrative | 17 | 7 | 10 |
| Decision | 14 | 1 | 13 |
| Utility | 13 | 0 | 13 |
| Action | 13 | 0 | 13 |
| Proof | 9 | 0 | 9 |
| Images | 5 | 0 | 5 |
| Hero | 10 | 0 | all excluded |
| Navigation | 3 | 0 | all excluded |

### Why an exclusion set exists

`animationComponents` is opt-in, so an excluded section needs no code to stay
still. The set exists to say **which** — otherwise "unmarked" is ambiguous
between "nobody got to it" and "must not animate", and the remaining work is a
sweep across ~46 sections. Four reasons, and they are different reasons:

- **Hero (10)** — above the fold at load. Measured: an element in view at load
  holds at the end state, opacity 1, no movement, even with a stagger index. The
  control would render and do nothing.
- **Navigation (3)** — fixed/absolute, out of flow.
- **Marquees (3)** — already in continuous motion; never gated.
- **Owns its own motion (20)** — 18 via `motion/react`, plus two found by
  behaviour. **Membership here is by behaviour, not by import**: the first pass
  grepped for `motion/react` and missed the ideas panel (drives its own
  `translate3d` from a scroll listener) and the horizontal card carousel (a rAF
  drag rail). If a section animates itself on scroll by any means, it belongs
  here.

### Conventions established while rolling out

- **Body copy is not staggered.** A stack of paragraphs arriving line by line
  reads as a loading state. Section headers and prose splits reveal as one unit;
  `singleUnitReveals` records that as a decision rather than an omission.
- **A card grid's lead card animates with its neighbours.** Leaving it static
  reads as one card failing rather than as a deliberate anchor.
- **Stagger by reading order, not source order,** where a layout flips (the
  priority grid's card leads on the left and trails on the right).
- Marker and index must be on **the same element**. `CardLinkShell` gained a
  `style` passthrough for this, because `LayoutGridItem` forwards none and
  animating the grid cell would mean changing a shared primitive.

---

## 4. Open problems — READ BEFORE CONTINUING

### 4.1 The control's effect is invisible when you use it (unfixed)

**This is the biggest outstanding issue and it is a real usability defect, not a
code bug.** A scroll entrance only plays while a section travels *into* view. You
scroll to a section, click its toggle — and it is already past its entry range,
held at the end state. Nothing can visibly happen at the moment of use.

Verified working in a live server despite appearing broken:
- builder canvas, cards 0–3 mid-entry: **0.44 / 0.33 / 0.00 / 0.00**
- template preview, below fold: **opacity 0**, timeline active

Needs an affordance — after toggling, scroll the canvas so the section re-enters,
or a "replay" button beside the control. Not designed yet; it is new builder UI.

### 4.2 Tall sections reveal too slowly (unfixed, and the reason for §4.4)

`entry 0% → 52%` is a fraction of the *entry phase*, which scales with the
element's height. On a tall section (a 4-up card grid) the cards are still at
~0.3 opacity when already well onto the screen. On a short one the fade is quick.

**A subject taller than the scrollport never fully enters**, so its entry range
degenerates — this is a known sharp edge of `view()` and the likeliest source of
"it looks wrong on big sections".

Needs a height-aware answer. Options not yet evaluated: switch tall sections to a
`cover`-based range, clamp the range in absolute units, or give tall sections
their own token set. **Do not tune the global tokens until this is decided** —
the two problems will fight.

### 4.3 Nobody has judged the rhythm

7% per index is unreviewed taste. It is one token and 16 sections use it, so this
is the cheapest it will ever be to change.

### 4.4 Per-section fine-tuning is expected

The intent is to tune animation per section rather than ship one global curve.
That likely means per-section token overrides on the frame, which the token layer
already supports in principle (set `--anim-reveal-*` on the frame and the rule
picks it up). **Not built, not tested.** It interacts with §4.2 — a height
strategy and a per-section override strategy should be designed together.

### 4.5 Pulse is gated but not offered

`.pulse-on-scroll` has one user (`DecisionSplitDecisionSectionV3`) and is scoped
to `[data-pagebuilder-animation="pulse"]`, which nothing can select. Promoting it
is one entry in `styleFieldOptions.animation`. It currently does not animate.

---

## 5. Reported "bugs" that were not the axis

Three reports came in near the end. Only one was a real defect in this work.

**Reveal not visible in pagebuilder / promoted template** — not a bug, see §4.1.
The value persists correctly through every hop, verified in both JSON files.

**Reveal not visible on a staged page** — not a bug, but a sharp edge worth
knowing: a staged page holds a **full denormalised snapshot** of the template
taken at stage time (builder-workflow §4). 160 staged sections currently carry no
`animation` key at all. **Adding a toggle axis does not reach already-staged
pages until they are refreshed or restaged.**

**Split hero overlap wrong on the staged/template preview** — a real bug, fixed
in `c767a62`, and **it was not introduced by this work.** Three paths resolve
that hero's variant; only the builder canvas checked the real axis
(`fullImageSplitVariantValues`, six values, both overlap treatments). The gallery
and the staged/export frame checked
`sectionLibraryV3Content.heroSplitFullHeight.variants` — the **demo content**
list, four arrangements, neither overlap. The validator returned `undefined`, the
component applied its default, the layout was merely wrong. No error.

> **Export consequence:** the export renders through the frame that was wrong, so
> any client site already exported with an overlap hero has a plain split frozen
> into it. Re-export to fix.

**Logo missing on the template preview** — real, fixed in `fbb3c59`. It was the
only preview route not passing `siteIdentity`. Resolved the way
`/dev/pagebuilder` already resolves it, which had the identical bug and records
it in a comment.

---

## 6. Mistakes made in this session, so they are not repeated

**`| head` truncated a grep and I concluded `--reveal-index` was dead code.** It
was already set at all six marker sites. The claim reached the plan *and* the
`1d93496` commit message, which is now wrong; `da146ce` carries the correction.
Phase 2 turned out to be only the guard.

**A scroll-driven timeline only advances when the tab paints.** In a
backgrounded/non-painting tab the ViewTimeline is inactive, reports
`currentTime: null`, and applies **no effect at all** — everything renders
visible. Scripted `scrollTo` plus a timer moves layout but not the animation, so
a sweep taken that way reads frozen and looks like proof the mechanism is dead.
This fooled the investigation twice. **Force a paint (screenshot) at each sample
point, and treat `currentTime: null` as "not measured", never as a result.**

**A bare "pagebuilder" in a CSS comment would have shipped to a client.**
`neutralizeBuilderVocabulary` only rewrites the hyphenated forms. That is why
nothing else in `globals.css` says the word.

**Three existing guards caught real transport gaps** that would all have shipped
silently: `normalizeSection` in the pagebuilder-options route (value saves, dies
on reload), `sectionToggleFieldNames` (value lost at promotion), and the
vocabulary test above. Trust these tests; they are the real safety net.

---

## 7. How to verify

```bash
npx vitest run        # 759 at handoff
npx tsc --noEmit
npx eslint src/
npx next build        # run it — the only gate that sees the server/client split
```

Scroll-driven animation **cannot** be verified from tests. For anything visual,
serve a probe page that extracts the rules verbatim from `globals.css` (there is
a working pattern for this — read the block by brace matching, assert it contains
`data-pagebuilder-animation` so the probe cannot silently prove nothing) and
sample computed `animationName` and `opacity` at a forced paint. Normalise CRLF
when slicing `globals.css` on this machine.

`/dev/pagebuilder` and `/dev/templates/<id>` both work for live inspection. **The
dev server writes repo files while running** — record
`git hash-object src/content/pagebuilder-options.json src/content/page-templates.json`
before and after, and never sweep builder state into a code commit.

# Section animation axis — handoff

Written 2026-08-11 at the end of the session that built it, and revised the same
day by the session that finished the rollout and closed its two blockers. Branch
`codex/template-first-workflow`.

Read `docs/builder-workflow.md` §3 first if you have not — this document assumes
its vocabulary (toggle axes, copy-affecting vs copy-neutral, the three render
paths, membership sets).

---

## 1. What exists

A per-section **entrance animation** toggle, off by default, settable in
pagebuilder and overridable per staged page, with a **Play entrance** button
beside it so an editor can see what they just switched on.

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

**The section is the trigger, and the clock is the motion.** Scroll position
decides *when* a section's entrance starts and nothing else; the animation then
plays at a fixed duration, the same whether the reader creeps or flicks past.

This is the axis's second design, and the first is worth recording because it
was not broken, it was **scrubbed**. A CSS scroll-driven animation's progress
*is* the scroll position, so the entrance lasted exactly as long as the reader
took to scroll past it — a trackpad flick put the whole range behind them in
~150ms and the motion never registered. Stretching the range so it lasts longer
means starting it earlier, and the earliest point is the instant the section's
first pixel crosses the bottom edge, which is too early to look at. **"Starts
late" and "lasts long" cannot both fit inside one screen of travel.**

Scrubbing is still wanted for a few sections and is kept whole, gated on
`[data-pagebuilder-animation="scrub"]` — dormant until the builder offers that
value, the same arrangement `pulse` is in. §4.5 has the cost of promoting it.

Both marker rules in `globals.css` are scoped to that attribute, so "off by
default" is the selector matching nothing rather than markup being stripped. A
section saved before the axis existed renders byte-identically to before.
Measured: a marked element with no frame attribute computes
`animation-name: none`.

This is the same split the colour recipes use, for the same reason: a value the
system owns cannot drift section by section.

### One observer, and no client boundary in any section

`SectionEntrance` is a `"use client"` component that renders `null`, mounted
once in the root layout. It holds one `IntersectionObserver` for every section
frame in the document and sets one attribute. Sections stay server components —
this matters because 21 of them already import `motion/react`, and a wrapper
per section would have had to negotiate with all of them.

It carries a `MutationObserver` too, because the builder adds sections after
mount. Without it a newly added section would render in the stylesheet's
*waiting* state and never be observed — hidden forever, which is the one failure
mode worse than no animation.

**Content is visible unless the observer is running.** Units are hidden only
under `[data-pagebuilder-animation-ready]`, set on the root once the observer is
alive, so a failed bundle, a crawler or `prefers-reduced-motion` all get content
rather than a blank page. The observer also settles everything already on screen
*before* setting that flag, so nothing a reader can already see is hidden and
re-shown.

The export needs the component copied, and it is listed as an explicit
dependency root in `site-export.ts` for the same reason `AmbientDrift` is: the
generated root layout is source text the import walk never reads.

### The token layer

Every value is a custom property with a default (`--anim-reveal-distance`,
`--anim-reveal-duration`, `--anim-reveal-delay-step`, `--anim-reveal-easing`,
`--anim-pulse-scale`, `--anim-pulse-stagger`, and the scrubbed variant's own
`--anim-scrub-entry-start` / `-entry-end` / `-stagger`).

**This is what makes the future style-guide "animation suites" cheap** — a suite
re-points them, and touches no section. `animation-css-agreement` fails if a
literal creeps back into the keyframes, the duration or the stagger.

It is also what §4.4 turned out to need. The tokens are read from the *animating
element*, so any element can answer one differently by setting it inline — which
is how two sections give their bled image panels a pure fade with no rule, no
variant and no exception list. See §3.

---

## 2. Where the pieces are

| Concern | File |
|---|---|
| Option list, resolver, membership, exclusions | `src/content/section-style-options.ts` |
| The `SectionAnimation` type | `src/content/section-color-recipes.ts` |
| Keyframes, tokens, the three states, the dormant scrub | `src/app/globals.css` (~line 207–420) |
| The trigger — one observer, renders nothing | `src/components/primitives/SectionEntrance.tsx` |
| Where it is mounted | `src/app/layout.tsx`, and `buildRootLayout` in `site-export.ts` |
| Staged/export frame + staged override fold | `src/components/sections/PageTemplatePreview.tsx` |
| Builder canvas frame, the control, the replay | `src/components/sections/PagebuilderShell.tsx` |
| Export field, emitted attribute, dependency root | `src/utils/site-export.ts` |
| Transport across the four hops | `sectionToggleFieldNames` in section-style-options |
| Save normalisation | `src/app/api/pagebuilder-options/route.ts` |

Key names: `styleFieldOptions.animation`, `resolveSectionAnimation`,
`animationComponents`, `animationExcludedComponents`, `sectionSupportsAnimation`,
`replaySectionAnimation`, `SectionEntrance`.

### The three states

One attribute on the frame, `data-pagebuilder-animation-state`, and the whole
state machine is which of three selectors matches:

| State | Selector | Means |
|---|---|---|
| waiting | `:not([…-state])` | observed, below the trigger line — hidden |
| arriving | `[…-state="in"]` | crossed the line — the timed animation runs |
| settled | `[…-state="settled"]` | on screen at load — no entrance to play |

`settled` needs no rule of its own: it simply stops matching the hiding rule, so
nothing has to out-specify anything. That is also what makes the builder's
replay a two-line reset rather than a fight with the cascade.

### Tests

- `animation-marker-ownership.test.ts` — 13 assertions. Registry vs markup in
  both directions; **every registered section is offered or excluded, with no
  silent middle**; neither set names a section the library does not have; no
  section may set the animation attribute or the state attribute itself; both
  frame owners must still set the animation attribute; the builder must replay
  by resetting state, and no file may carry the retired replay attribute;
  markers pair with a stagger index; the exception lists are kept honest
  (`dormantMarkers`, `sharedMarkerSources`, `singleUnitReveals`).
  **It strips comments before scanning** — every marker in the library carries a
  comment naming the class, and prose explaining why a section marks one unit
  counted as marking two.
- `animation-css-agreement.test.ts` — 9 assertions. Offered values have rules,
  resolver accepts exactly the offered set, no ungated marker rule, token layer
  intact, the entrance is **timed rather than scrubbed** (has a duration, staggers
  by delay, is on no scroll timeline), the waiting rule is scoped to the
  observer's ready flag **and excludes frames that already have a state**, and
  the scrubbed variant is intact, capped, clamped and unoffered.
- `hero-variant-parity.test.ts` — from the bug in §5.

---

## 3. Rollout status — **complete**

**Every one of the 98 registered sections is accounted for: 57 marked, 41
excluded, 0 unaccounted.** `animation-marker-ownership` fails if that ever stops
being true, so "unmarked" is no longer a state a new section can quietly sit in.

| Family | total | marked | excluded |
|---|---|---|---|
| Section Headers | 3 | 3 | 0 |
| Scan | 11 | 8 | 3 |
| Narrative | 17 | 12 | 5 |
| Decision | 14 | 11 | 3 |
| Utility | 13 | 10 | 3 |
| Action | 13 | 9 | 4 |
| Proof | 9 | 3 | 6 |
| Images | 5 | 1 | 4 |
| Hero | 10 | 0 | 10 |
| Navigation | 3 | 0 | 3 |

### Why an exclusion set exists

`animationComponents` is opt-in, so an excluded section needs no code to stay
still. The set exists to say **which**. Five reasons, and they are different
reasons:

- **Hero (10)** — above the fold at load. Measured: an element in view at load
  holds at the end state, opacity 1, no movement, even with a stagger index. The
  control would render and do nothing.
- **Thank-you confirmation (1)** — the same reason reached from the other end. It
  is not a section that happens to sit first; it is the entire content of
  `/thank-you`.
- **Navigation (3)** — fixed/absolute, out of flow.
- **Marquees (3)** — already in continuous motion; never gated.
- **Owns its own motion (24)** — 18 via `motion/react`, plus six found by
  behaviour. **Membership here is by behaviour, not by import**: the first pass
  grepped for `motion/react` and missed the ideas panel (drives its own
  `translate3d` from a scroll listener), the horizontal card carousel and the
  three photo galleries (`useLoopedRail`, a rAF drag rail), and the fixed cover
  fade (a sticky cover panel a foreground panel scrolls over — the whole
  composition *is* the scroll effect). If a section animates itself on scroll by
  any means, it belongs here.

### Conventions established while rolling out

Five, and the last three came out of the second half of the sweep:

- **Body copy is not staggered.** A stack of paragraphs arriving line by line
  reads as a loading state. Section headers and prose splits reveal as one unit;
  `singleUnitReveals` records that as a decision rather than an omission.
- **A card grid's lead card animates with its neighbours.** Leaving it static
  reads as one card failing rather than as a deliberate anchor.
- **Stagger by reading order, not source order.** Eight sections arrange
  themselves by a prop while the JSX order stays fixed, so each computes its
  indices from that prop. Get it wrong and the layout sweeps right-to-left on
  exactly the arrangements that flip — which reads as a rendering fault, not as
  a stagger.
- **A composite card is one unit.** The comparison tables, the matrix, the offer
  terms card and the two connected process diagrams draw several panels inside a
  single border box, joined by shared rules, subgrids or elbow spans drawn to
  meet each card's edge. Staggering those panels moves them out from under the
  frame that contains them: the card visibly comes apart and re-assembles.
  Sections whose cards are independent stagger their cards; sections whose cards
  are joined reveal as one.
- **A footer is one unit,** marked on its own root element. Its columns are
  chrome a reader scans, not a sequence they follow, so a stagger walks the eye
  down the navigation; marking the root also keeps the legal bar aligned with
  the columns throughout.

And two mechanical rules:

- Marker and index must be on **the same element**. `CardLinkShell` gained a
  `style` passthrough for this, because `LayoutGridItem` forwards none and
  animating the grid cell would mean changing a shared primitive. Several local
  card helpers gained a `revealIndex` prop for the same reason.
- **A sticky element is never marked.** Its box travels *with* the scroller
  rather than through it, so a view timeline on it never describes an arrival.
  Three sections have one: the services bento's split header, the narrative
  feature rail's prose column, the FAQ's heading column.

### The per-element token override

A bled image panel — the full-image narrative split, the CTA with image — is
absolutely positioned to the section's own edges. The library's 18px rise opens
a band of bare ground along the top of that bleed for the length of the
entrance, the crop visibly detaching from the section it is cut into. Both set
`--anim-reveal-distance: 0px` on the panel and fade without moving.

Worth stating because it is the shape §4.4 was asking for and it needed nothing
built: the tokens resolve against the animating element, so per-element tuning
is already available to any marker. Verified in Chrome — the override resolves
on the element.

---

## 4. Open problems

4.1 and 4.2 were the blockers. Both are closed. What is left is taste and one
dormant value.

### 4.1 The control's effect is invisible when you use it — **fixed, third time**

A section already on screen has no arrival left to play, so clicking its toggle
could never show anything. Three attempts, and the first two are worth keeping
written down because each looked correct when it shipped.

**Attempt one: a parallel clock-based CSS rule** behind a
`data-pagebuilder-animation-replay` attribute. It could not restart — a CSS
animation only restarts when its `animation-name` changes, and a rule that
swapped nothing but the timeline kept the same name. The *first* press worked,
because the axis had just gone `none → reveal` and that does change the name
from `none`; every press after updated an animation already at its end state and
did nothing. A dead button, but only after one success, which is the worst
possible shape for a bug report.

**Attempt two: scroll the canvas** so the section left the viewport and came
back, playing the real rule. It restarted reliably and it was honest — and it
read as a harsh jump, because parking the section meant throwing the canvas a
full screen backwards before scrolling forwards again.

**What works: reset the frame's state.** Remove
`data-pagebuilder-animation-state`, read `offsetWidth` to force the style flush,
set it back to `in`. The units return to the waiting rule and start again from
the top. Nothing scrolls, and it restarts every press because the intermediate
state is real — measured: `animation-name` goes to `none` between the two.

That the reset is safe at all is a property of the design: the state attribute
is the observer's, never React's, so an imperative change cannot be clobbered by
the next commit.

### 4.2 The entrance was mistimed — **fixed, by changing the mechanism**

Three faults, reported as "starts too early to see", "I don't see it animate on
scroll", and "it ends so quick".

The first two were addressed by anchoring every unit to the section rather than
to its own box, and starting the range a fifth of the way into the arrival. That
helped and was not enough, because the third fault is not a tuning problem —
**a scroll-driven animation is scrubbed.** §1 has the argument; the short form
is that its progress *is* the scroll position, so a flick finishes it in ~150ms,
and the only way to make it last longer is to start it earlier, which is the
first fault again.

So scroll position is now a **trigger** and nothing more, and the motion runs on
a clock:

```css
--anim-reveal-distance: 28px;
--anim-reveal-duration: 620ms;
--anim-reveal-delay-step: 90ms;
--anim-reveal-easing: cubic-bezier(0.22, 1, 0.36, 1);
```

The distance went 18px → 28px and the easing from `linear` to a decisive
out-curve, both because the entrance was reported as hard to see even once it
was timed correctly. Distance and front-loaded easing are what make a short
movement register.

The trigger line is `triggerInset` in `SectionEntrance`: 18% of the viewport
height, subtracted from the observer root's bottom edge, so a section must come
that far up before anything moves. **That is the knob for "too early / too
late"** — it is one number and it is the whole of that decision.

Measured on `/dev/templates/tester`: waiting units compute
`opacity: 0; translate: 0 28px; animation-name: none`; on `in` they compute
`section-reveal 0.62s cubic-bezier(0.22, 1, 0.36, 1)` with delays
`0 / 0.09 / 0.18 / 0.27s` across the four cards; `settled` computes
`opacity: 1; translate: none; animation-name: none`. A frame added after mount
and sitting in the viewport was settled by the MutationObserver rather than left
hidden.

**Not verified: that the IntersectionObserver fires at the right scroll
position.** A hidden tab runs no rendering steps, so neither IO callbacks nor
`requestAnimationFrame` are delivered, and every probe here ran in a background
tab. The state machine either side of the trigger is measured; the trigger
itself is standard IO with a `rootMargin` and has to be judged on screen.

### 4.3 Nobody has judged the rhythm

Still true, and now genuinely cheap to judge — four numbers, one place, 57
sections:

| Token | Now | What it decides |
|---|---|---|
| `triggerInset` (TS) | `0.18` | how far up the screen a section comes before anything moves |
| `--anim-reveal-duration` | `620ms` | how long one unit takes |
| `--anim-reveal-delay-step` | `90ms` | the gap between units |
| `--anim-reveal-distance` | `28px` | how far each unit travels |

Timing them was not possible before, and that is the real change. While the
motion was scrubbed, "how long does it take" had no answer — it depended on the
reader's scrolling — so there was nothing to tune. Every number here now means
one thing on every section.

`triggerInset` is the one most likely to want moving: it is the entire answer to
"does this start too early", and nothing else depends on it.

### 4.4 Per-section fine-tuning — available, partly used

Per-element token overrides work today and two sections use one (§3). What does
not exist is a **control** for it: nothing in the builder can set
`--anim-reveal-*` on a frame, so tuning is a code edit at the marker.

Whether it should be a control is a real question rather than a missing feature.
The axis deliberately keeps per-section expressiveness in *which elements a
section marks*, and a per-section duration dial is the kind of knob that makes
every page's motion slightly different — which is what the style-guide suites
exist to prevent.

### 4.5 Two values are gated but not offered: `scrub` and `pulse`

**`scrub`** is the original scroll-driven reveal, kept whole. Progress is the
reader's scroll position rather than a clock, which is wrong for an entrance —
that is why it is not the default any more — and right for the handful of
sections that should be *driven* rather than triggered. Everything it needs is
in `globals.css`: its own range tokens, its own height cap, and the named view
timeline on the frame.

Promoting it is cheap and honest: one entry in `styleFieldOptions.animation`,
because every marked section already carries the markers it needs. The open
question is not mechanism but membership — offering it library-wide invites it
onto sections where an entrance is the right answer, so it probably wants a
`scrubComponents` set naming the few, in the same shape as every other
membership set in `section-style-options.ts`.

**`pulse`** now has no users at all. It had one, and that section was the only
marked-up section in the library no editor could animate. It marks the ordinary
entrance now and is registered like everything else; the rule, keyframes and
tokens stay as the dormant path a suite can promote.

**Promoting `pulse` is not one line, and this is the trap.** Adding it to the
option list offers it on all 57 animated sections and it would do nothing on
every one of them, because none of them mark a pulse unit — the exact failure
the membership sets exist to prevent, inverted. It needs a per-section option
filter or every animated section marking both. `scrub` does not have this
problem, which is the difference between the two.

---

## 5. Reported "bugs" that were not the axis

Three reports came in near the end of the first session. Only one was a real
defect in this work.

**Reveal not visible in pagebuilder / promoted template** — not a bug, see §4.1,
now fixed by the replay. The value persisted correctly through every hop the
whole time, verified in both JSON files.

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

## 6. Mistakes made, so they are not repeated

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

**The marker scans read source as text, and comments are source.** Adding a
comment that named `pulse-on-scroll` while explaining why a section no longer
marked one made the stagger check count three markers against two indices. The
fix was to strip comments, not to reword the comment — `color-css-agreement`
already had the same problem and the same answer.

**A fix verified in a probe still shipped a broken button.** The clock-based
replay in §4.1 was measured working: the attribute produced
`animation-timeline: auto` and a correct per-index delay, in a synthetic frame
built for the purpose. What the probe could not show is that the synthetic frame
had *just been created*, so its animation was starting anyway — the restart the
button depended on was never actually under test. The lesson is not "probe
less"; it is that a probe which constructs its own subject can only test the
rule, never the sequence of state a user puts it through. If the affordance is
"press this twice", the probe has to press it twice, from the state the second
press really starts in. The probe in §7 now does.

**Two rounds of tuning were spent on a constraint no tuning could reach.** The
entrance was moved later, capped, clamped and re-anchored to the section, all of
which were real improvements and none of which touched the actual complaint: a
scrubbed animation ends when the reader stops scrolling. The signal was there in
the first report — "it ends so quick" is a statement about *duration*, and a
scrubbed animation does not have one. When a symptom names a property the
mechanism cannot express, that is the mechanism being wrong, not the numbers.

**Four existing guards caught real gaps** that would all have shipped silently:
`normalizeSection` in the pagebuilder-options route (value saves, dies on
reload), `sectionToggleFieldNames` (value lost at promotion), the vocabulary
test, and the stagger-pairing check above. Trust these tests; they are the real
safety net.

---

## 7. How to verify

```bash
npx vitest run        # 766 at this revision
npx tsc --noEmit
npx eslint src/
npx next build        # run it — the only gate that sees the server/client split
```

Motion **cannot** be verified from tests. Serve a page and ask the DOM — on
`/dev/templates/tester`, which has two sections set to `reveal`:

- **Drive the state machine by hand.** Set `data-pagebuilder-animation-state` to
  `in`, then remove it, then set it again, reading computed
  `opacity` / `animationName` / `animationDuration` / `animationDelay` /
  `translate` at each step. That covers the waiting rule, the timed rule, the
  per-index stagger and — crucially — that the replay's intermediate state is
  real (`animation-name: none` between presses). Attempt one in §4.1 passed
  every static check and failed exactly here.
- **Add a frame after mount**, positioned inside the viewport, and confirm the
  MutationObserver settles it rather than leaving it hidden.
- Synthetic probes on any plain page cover the rest: a marker outside any frame
  (must compute `animation-name: none`), and per-element token overrides.
- `CSS.supports('animation-range-end', 'entry min(62%, 460px)')` answers the
  scrubbed variant's cap question outright.

**A hidden tab paints nothing, and two things depend on painting.**
`requestAnimationFrame` never fires — so a probe that awaits a frame between
scroll steps hangs rather than failing, a 45s CDP timeout rather than a wrong
answer — and IntersectionObserver callbacks are not delivered either, so the
trigger point itself cannot be measured from a background tab. Check
`document.visibilityState` first, and race every rAF against a timeout.
Everything else on this list works in a background tab.

Read rules verbatim out of `globals.css` by brace matching so a probe cannot
silently prove nothing, and normalise CRLF when slicing it on this machine.

`/dev/pagebuilder` and `/dev/templates/<id>` both work for live inspection. **The
dev server writes repo files while running** — record
`git hash-object src/content/pagebuilder-options.json src/content/page-templates.json`
before and after, and never sweep builder state into a code commit. A plain page
like `/thank-you` is enough for CSS probes and writes nothing.

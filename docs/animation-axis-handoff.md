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
pagebuilder and overridable per staged page. It used to carry a **Play entrance**
button; picking a value replays the entrance now, so the button was removed as a
second control for what the first already did — see §8.

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

Scrubbing was kept whole and dormant for a while, and is now retired — §4.5. A
section that genuinely wants to be driven by the scroll owns that motion itself
and sits in `animationExcludedComponents`; nothing on this axis is driven by the
scroller.

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

Every value is a custom property with a default. The full set is declared in
`src/content/motion-tokens.ts`, grouped by which suites consume it — that file,
not this list, is the inventory, and the Style Guide's controls are derived from
it. See the 2026-08-17 "motion is a Style Guide axis" entry at the end for the
group table and the rule that every suite must name its group.

**This is what makes a suite cheap** — a suite re-points tokens, and touches no
section. It is also what makes motion authorable at all: a literal in a keyframe
is a value the Style Guide cannot reach.
`animation-css-agreement` fails if a
literal creeps back into the keyframes, the duration or the stagger.

It is also what §4.4 turned out to need. The tokens are read from the *animating
element*, so an element can answer one differently without a rule per section —
which is how a suite gives a bled image panel a pure fade. That used to be done
by setting the token inline in the section; it is a **unit role** now, and
sections may no longer set `--anim-*` themselves. See §3 and §8.

---

## 2. Where the pieces are

| Concern | File |
|---|---|
| Membership, exclusions, the other style axes | `src/content/section-style-options.ts` |
| **Suite registry, role vocabulary, `SectionAnimation`, parser + resolver** | `src/content/section-animations.ts` |
| Keyframes, tokens, the three states | `src/app/globals.css` (~line 200–1000) |
| **Motion token groups, defaults, validators, both emitters** | `src/content/motion-tokens.ts` |
| The Style Guide's motion controls | `src/components/sections/StyleGuideMotionControls.tsx` |
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

- `animation-marker-ownership.test.ts` — 17 assertions. Registry vs markup in
  both directions; **every registered section is offered or excluded, with no
  silent middle**; neither set names a section the library does not have; no
  section may set the animation attribute or the state attribute itself; both
  frame owners must still set the animation attribute; the builder must replay
  by resetting state, and no file may carry the retired replay attribute;
  markers pair with a stagger index; the exception lists are kept honest
  (`dormantMarkers`, `sharedMarkerSources`, `singleUnitReveals`,
  `inlineAnimationTokens`); **roles come from the closed vocabulary** and sit in
  the same class string as the marker; **no section sets an `--anim-*` token
  inline**.
  **It strips comments before scanning** — every marker in the library carries a
  comment naming the class, and prose explaining why a section marks one unit
  counted as marking two.
- `animation-css-agreement.test.ts` — 11 assertions. Offered values have rules,
  resolver accepts exactly the offered set, no ungated marker rule, token layer
  intact, the entrance is **timed rather than scrubbed** (has a duration, staggers
  by delay, is on no scroll timeline), the waiting rule is scoped to the
  observer's ready flag **and excludes frames that already have a state**,
  nothing on the axis is attached to a scroll timeline, **every registered
  suite has both halves of the timed contract**, and **`differentiatedRoles`
  matches the stylesheet in both directions**.
- `motion-token-agreement.test.ts` — the tokens and the controls. Shipped
  defaults match the authored `:root`, **every declared token has a control and
  every control has a token the stylesheet reads**, an inheriting token is
  undeclared and has a `var()` fallback, every suite names a control group that
  exists, the preview and the promoted block emit the same declarations, and a
  value that could close its own declaration is refused.
- `style-guide-motion-promotion.test.ts` — the route, end to end: a rhythm posted
  to `/api/style-guide-tokens` lands inside the markers, after the authored
  default, replaces the previous block, and survives the export's vocabulary
  rename.
- `hero-variant-parity.test.ts` — from the bug in §5.

---

## 3. Rollout status — **complete**

**Every one of the 97 registered sections is accounted for: 57 marked, 40
excluded, 0 unaccounted.** `animation-marker-ownership` fails if that ever stops
being true, so "unmarked" is no longer a state a new section can quietly sit in.

Counts re-verified 2026-08-15. This table read 98 / 57 / 41 and had drifted in
one row: the Decision family lost a section, so it is 13 / 11 / 2 rather than
14 / 11 / 3. The totals are derived from `sectionLibraryV3Registry` and the two
membership sets, so re-derive them rather than adjusting them by hand.

| Family | total | marked | excluded |
|---|---|---|---|
| Section Headers | 3 | 3 | 0 |
| Scan | 11 | 8 | 3 |
| Narrative | 17 | 12 | 5 |
| Decision | 13 | 11 | 2 |
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

### The per-element token override — **superseded by unit roles**

A bled image panel — the full-image narrative split, the CTA with image — is
absolutely positioned to the section's own edges. The library's rise opens a
band of bare ground along the top of that bleed for the length of the entrance,
the crop visibly detaching from the section it is cut into. Both used to set
`--anim-reveal-distance: 0px` on the panel and fade without moving.

That worked, and it was still the wrong shape: a section deciding how it moved.
What those two panels were actually saying is *"this is a media panel"*, in the
only vocabulary available at the time. **They say it with `reveal-role-media`
now, and the zero distance belongs to the suite.** An inline token override is
also invisible from the stylesheet, so no suite could ever have moved those
elements again — `animation-marker-ownership` now fails on any section that sets
an `--anim-*` token inline, with a named exception map for a genuine one-off.

The mechanism the old note recorded is still true and still useful: tokens
resolve against the animating element, which is exactly how a role class re-points
one without a rule per section. See §8.

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

### 4.5 Two values were gated but not offered: `scrub` and `pulse`

> **Both are resolved.** `pulse` was rebuilt as a timed suite and ships; `scrub`
> is retired outright. The section is kept for the reasoning, and each part
> carries its own correction at the end. Neither value is gated-but-unoffered any
> more, and nothing in the library is today.

**`scrub`** was the original scroll-driven reveal, kept whole. Progress is the
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

**`pulse`** — **shipped, as a rebuilt timed suite. This section is kept for what
it got wrong.**

It said promoting pulse was blocked by a bookkeeping problem: offering it would
put it on all 57 animated sections and do nothing on 56, so it needed "a
per-section option filter or every animated section marking both."

Both halves turned out to be answerable, and neither the way this predicted:

- **The bookkeeping problem dissolved.** A suite declares `requiresRole` and is
  offered only where that role is marked (§8). Pulse declares `action`, so it
  appears on the CTA sections and nowhere else. No filter, no list.
- **The real blocker was never mentioned here.** The dormant rule was
  **scroll-scrubbed** — `animation-timeline: view()`, progress tied to scroll
  position. That is the mechanism §4.2 documents replacing, for the reason it
  documents: a flick puts the range behind the reader in ~150ms and the blip
  never registers. "Promoting it is one entry in the option list" would have
  shipped the known-bad version of itself.

So it was **rebuilt, not promoted**: same intent, on a clock, inside the
two-halves contract. The old `.pulse-on-scroll` marker is retired — a second
marker class is exactly what the role vocabulary makes unnecessary, since a new
effect is a new *role* on the one marker.

**`scrub` is retired — 2026-08-17.** It inherited the correction above and then
the conclusion: its membership problem was solved by `requiresRole`, but it was
still scrubbed, so it needed a rebuild rather than a promotion — and the rebuild
would have reused none of it. It is deleted rather than left dormant, tokens,
height cap and rules together.

Two reasons beyond the rebuild. It was the one part of the axis that **could not
be promoted safely**: its range tokens were declared twice, plain percentages and
then capped `min()` values inside an `@supports` guard, and the promoted token
block is spliced in at the *end* of `globals.css` — promoting the percentages
would have landed after the guard and silently removed the cap. Retiring it
leaves "every animation token is authorable" with no exceptions, which is what
makes that test worth having.

And it was covering a need that is already met a better way. **Scroll-driven
motion is still supported, just not through this axis.** A section that wants to
be *driven* rather than triggered owns that motion itself — "Sticky ideas"
translates its sidebar bubble against the scroll on `requestAnimationFrame` — and
sits in `animationExcludedComponents` under "owns its own motion". That is the
supported arrangement, and it needs nothing from the suite registry.

`animation-css-agreement.test.ts` now pins the absence: no rule may attach an
`animation-timeline`, declare a `view-timeline-name`, or reintroduce the scrub
tokens.

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
npx vitest run        # 846 at this revision
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

---

## 8. Unit roles and motion suites — **groundwork landed 2026-08-15**

The axis has grown from a two-value enum into a library, and this is the shape
it grew into. Full design and phase list: `reference code/animation-library-plan.txt`.

### Why not simply more enum values

The obvious move — `reveal | slide-left | wipe | scale-in` — is the trap §4.5
already documents with `pulse`. Three failure modes, all of them shipping:

1. **Meaningless combinations.** "Typewriter" on a nine-card bento types out
   nine cards.
2. **Bookkeeping explosion.** Preventing that means a membership set *per
   value* — ten values × 97 sections of hand-maintained lists.
3. **It puts motion back in the section.** "Which sections may use the wipe" is
   a per-section motion decision wearing a registry's clothes.

The request that prompted it contained the answer: *"a header that types in vs
a card sliding in from the bottom vs something sliding in from the side."* That
is not one axis. It is two.

### The two layers

**Role** — the section says WHAT KIND OF UNIT each marked element is, never how
it moves:

```tsx
<h2 className="reveal-on-scroll reveal-role-heading">
<article className="reveal-on-scroll reveal-role-card" style={{ "--reveal-index": i }}>
```

Six, closed, declared in `src/content/section-animations.ts`: `heading`,
`content` (the default), `card`, `media`, `accent`, `frame`.

**Suite** — one value on the frame, naming a motion suite that answers how
*every* role arrives. `reveal` is the stored id of the suite labelled **Rise**.

**This kills the pulse trap structurally.** A suite answers every role, so every
suite is safe on every marked section, and no suite needs a membership set.

### The stored id stays `reveal`

The label is "Rise"; the id is not renamed. Persisted values are opaque ids
(`add-section/SKILL.md`, `builder-workflow.md` §3), and the decisive reason is
the one `renamedSectionColorRecipes` writes out: the id is in page templates,
staged pages, saved builder options and exported sites, several of which the dev
server rewrites on its own schedule. An alias cannot race anything; a migration
can. Every *new* suite gets an id named for its motion — `reveal` is the one
grandfathered exception.

### The timed-suite contract

Every offered suite owns **both halves** explicitly in `globals.css`: a waiting
rule that hides its units, and an arrival rule that brings them back.
`animation-css-agreement` requires both of every suite in the registry.

**The waiting selector is deliberately not generalised** across every non-`none`
value. That version was proposed and rejected: it also matches `scrub`, imposing
the timed entrance's hidden state on a variant that has its own scroll-driven
range, and it turns "registered suite with a missing arrival rule" into a state
that hides content indefinitely. Per-suite, a half-finished suite does nothing;
generalised, it blanks the page.

`scrub` and `pulse` stay **outside** this contract, gated exactly as before.

### What the registry does and does not own

It owns ids, labels, the option list and the *documented* role mapping. It does
not own the movement — that is a selector and a keyframe in `globals.css`. Those
are two representations of one fact and **they can drift**. Each suite declares
`differentiatedRoles`, and the test pins it both ways: a named role with no CSS
rule, and a CSS rule for a role not named. That narrows the gap; it does not
close it, because no test reads a keyframe and tells you it looks like a fade.
**The gap is accepted deliberately.** If it ever bites, generating the CSS from
the registry is the fix — not a bigger test.

### "Types in" means a wipe

Settled, and it constrains what may be built: a role class can drive opacity,
transform, scale and clip-path. It **cannot** produce character-by-character
typing without extra markup, JavaScript, and an accessibility story. So the
library ships a **clip wipe and calls it a wipe** — nothing in the builder or
the gallery may use the word "type" for it. Real typing is a separate capability
design (markup split, `aria-label` carrying the whole string, a reduced-motion
path rendering it finished, text that stays selectable) and is **not** implied by
this groundwork.

### What is done, and what is next

Landed: the registry with literal-preserving types, `SectionAnimation` moved out
of `section-color-recipes.ts` (re-exported there for compatibility), the derived
option list, a storage parser separate from the render resolver, the six role
classes, Rise filling the contract template, and the two inline overrides
converted to `reveal-role-media`. **No stored data changed and no computed style
changed** — Rise's two rules are textually what they were.

Next, in order: the style-guide gallery; **prototype a differentiating suite
before backfilling roles** — Rise treats five of six roles identically, so it
cannot tell you whether six is the right number, and classifying 86 marker sites
against an untested taxonomy is how you get one you have to redo; then the
backfill across 47 files; then the project-level default behind an explicit
`site` value, which needs its own review because absence must keep meaning
`none`.

### The prototype's findings — read before the backfill

The second suite — **Wipe** (`wipe`) — was built as a prototype to answer three
questions about the vocabulary before 86 marker sites were classified against
it. It has since been **offered**, gated to the sections that mark a heading.

It shipped first as `status: "prototype"` — real CSS, real gallery specimen,
absent from the builder's option list — because a suite is only as expressive as
the roles the library has been marked up with. Before any backfill, nearly every
marked element was an unroled `content` unit, so a differentiating suite would
have looked *identical to Rise* on nearly every section an editor could pick it
for: a control that appears to work and paints nothing, arriving by a different
door.

**It was renamed from `editorial` to `wipe` on the way out of prototype, and
that was the one free moment.** Persisted ids are never renamed here, but this
one had never been offered, so no template, staged page, saved builder option or
exported site could contain the old string — nothing to migrate, nothing to
alias. The window closed the instant it became selectable. The new id is also
the better one: it names the motion rather than a mood.

**Gating is derived, not a membership list.** The suite declares
`requiresRole: "heading"`; sections declare the roles they mark, in
`sectionAnimationRoleComponents`; availability is the intersection. Adding a
suite adds no list, and a section that gains a heading role in the backfill
gains this suite with no edit to either file. That distinction is the whole
reason the axis grew roles instead of enum values — a hand-maintained set per
suite is the bookkeeping explosion §8 opens by rejecting.

The role registry is the one hand-maintained fact in the system, because nothing
at runtime can read a `className` out of a section's source. It is pinned from
both directions: listed-but-unmarked offers a suite that does nothing;
marked-but-unlisted silently misses a suite it qualifies for.

It was built to answer three questions about the vocabulary before 86 marker
sites are classified against it. It answers all three.

**1. Does `accent` earn a role, or collapse into `card`? — It earns it.**
Wipe gives it `section-reveal-scale`: it grows from 94% while it rises and
fades. A stat or a badge arriving with slightly more presence than the copy
around it is a real distinction and it is not expressible any other way — a card
scaling reads as a panel zooming, which is wrong. Keep it, and keep it *small*:
`accent` is for a figure, not for anything card-sized.

**2. Do `frame` and `card` need different behaviour? — No, and this is the one
to act on.** Neither is in Wipe's `differentiatedRoles`, and the attempt to
give them different rules is what showed why: the difference between "a list
that staggers" and "one block that does not" is `--reveal-index`, which the
**section** sets per element. A suite has no way to express it and no need to.

They are still worth keeping as *two names* — `frame` says "this composite is
one unit" where `card` says "this is one of several", and that is a real fact
about the markup that the stagger index alone does not record. But **do not
expect a suite to distinguish them**, and do not spend backfill time agonising
over the boundary: if it carries an index it is a `card`, if it does not it is a
`frame`. That rule makes the 86 sites mechanical.

**3. Is `heading` one role, or does eyebrow-vs-title matter? — One role.**
The wipe runs across whichever element carries the class. Marking an eyebrow and
its headline separately gives two edges travelling at once, which reads as two
things happening rather than one heading arriving; marking the block gives one.
The existing convention already says this — `SectionHeaderCompactSectionV3` is
in `singleUnitReveals` because "eyebrow, headline and body are one block of
copy" — and the wipe is the first suite that makes the reason visible rather
than merely tasteful. **Mark the header block, not its lines.**

**Net: the vocabulary stays at six.** One role confirmed (`accent`), one pair
confirmed as naming-only rather than motion-bearing (`card` / `frame`), one
boundary settled (`heading` is the block). The backfill can proceed against it.

**A note for whoever writes the next suite.** Both suites answer `media` with
the same zero distance, and that duplication should stay. It is two suites
independently deciding a bled panel must not travel — the next one is free to
disagree, and factoring it into a shared rule would take that freedom away.
Lateral took that freedom immediately: `media` is the one thing that *does*
travel there.

### Where this stands — 2026-08-17

Landed this session: **Focus** (`focus`), Lateral gated on `media`, a per-suite
veto, and three safeguards against the stale dev stylesheet.

| Suite | id | Offered on |
|---|---|---|
| Rise | `reveal` | 57 (no gate) |
| Wipe | `wipe` | 16 (marks a heading) |
| Fade | `fade` | 57 (no gate) — added later the same day, see below |
| Settle | `settle` | 10 (marks media) — see below |
| Settle on load | `settle-load` | 1 (one hero) — see below |
| Focus | `focus` | 16 (marks a heading) |
| Pulse | `pulse` | 10 (marks an action) |
| Lateral | `lateral` | 10 (marks media) — was 57 |

**Open, and it is the live one: Focus reads too quick, and the cause is
probably the easing rather than the duration.** `--anim-reveal-easing` is
`cubic-bezier(0.22, 1, 0.36, 1)`, a decisive out-curve that puts most of the
progress in the first third. That is right for a travel — the unit arrives and
settles — and wrong for a blur, where it means the 10px is gone by ~200ms and
the remaining 400ms is a tail nobody can see. So the entrance is nominally
620ms and perceptually about a third of that.

Untested as of this writing. Two candidate fixes, which compose: a
Focus-specific `--anim-focus-duration` around 900ms, and a gentler curve for the
focus keyframe so the blur resolves across the whole duration. Wipe's
`--anim-wipe-duration` is the precedent for a suite owning its own tempo.

**THE STYLE GUIDE PROMOTES NOTHING, and this cost a round trip.** Its rhythm
controls are React state scoped to the gallery element. They save nothing, reach
no page, and reset on reload — deliberately, so you can judge a rhythm without
authoring one. "Promoting" is a hand edit to a token in `globals.css` and there
is no button for it. Changing the easing there and then looking at pagebuilder
shows the default curve, because that is all pagebuilder has ever been given.
If that keeps biting, the honest fix is a **Copy as CSS** affordance that emits
the token block for pasting — not a write path from a dev screen into the
stylesheet.

Also open:

- **`accent` is marked on no section.** Keeping the role — Josh is looking for
  places to use it. Until then half of Focus's signature is visible only in the
  gallery.
- **Wipe and Focus are offered on the same 16 sections.** Two answers to how a
  headline arrives, which is intended; if a given section should only offer one,
  `suiteExcludedComponents` is now how to say so. It is empty.
- **`scrub` is still gated, unoffered and unrebuilt** — §4.5.

### Where this stands — 2026-08-17, later: motion is a Style Guide axis

**The section above is superseded on two points. Both were resolved rather than
worked around, and the "Copy as CSS" suggestion was rejected.**

**Motion promotes like every other token now.** The rhythm controls are no longer
private state on the gallery; they write the same Style Guide draft that colour,
type, radii and spacing write, and the existing **Promote Style Guide** button
writes them into the marker block in `globals.css`. Everything downstream reads
that block through ordinary cascade — the gallery, pagebuilder, staged pages,
real pages — and `freezeStyleTokens` carries it into the exported site. Approval
invalidation came free: `setPageExportApproval` compares the whole block, so
re-promoting a rhythm correctly un-approves pages approved under the old timing.

A write path from a dev screen into the stylesheet turned out to be exactly what
the Style Guide already was. Nothing new was built for it.

**The controls are grouped by motion family, and the groups are data.**
`src/content/motion-tokens.ts` declares them; the draft's defaults, the live
preview's inline variables, the promoted CSS, the validators and the panels are
all derived from it.

| Group | Tokens | Consumed by |
|---|---|---|
| `rhythm` | duration, stagger, distance, easing | every suite |
| `wipe` | wipe duration*, accent scale-from | Wipe |
| `pulse` | beat scale, beat duration, beat delay | Pulse |
| `lateral` | unit travel, media travel | Lateral |
| `focus` | blur easing, blur amount, blur duration* | Focus |

\* **Inherit-by-default.** Both duration tokens are undeclared, and their rules
read `var(--anim-<suite>-duration, var(--anim-reveal-duration))`, so unset means
"keep time with the shared rhythm" and the promotion omits the declaration
rather than emitting it empty. The control ships with "Match shared rhythm"
ticked; unticking it authors a tempo for that suite alone.

`--anim-wipe-duration` was a declared 720ms until this was reported as *the
shared Duration control doing nothing to Wipe* — which was fair. Under that suite
the cards, media, frame and accent all fade at the shared duration, and the one
thing that did not was the wipe itself, which is the entire suite. A control
reading "how long one unit takes to arrive" that visibly cannot move the
headline, on the suite whose whole point is the headline, is a control that
appears to work and paints nothing. A suite may still own its tempo — it just has
to be chosen rather than inherited from a constant nobody revisits.

**Every suite declares which group authors it.** `controlGroups` is a *required*
field on the suite definition, so adding a suite without answering "what authors
this?" is a compile error. A suite whose motion model cannot use an existing
group must bring its own group and its own tokens in the same change. The rule
in one line: **no animation may exist whose live behaviour cannot be authored and
promoted through the Style Guide.**

`motion-token-agreement.test.ts` enforces it in both directions — a token
declared in the stylesheet with no control, and a control whose token the
stylesheet never reads, both fail.

**Focus's easing is still Focus's alone**, and the shared control no longer
touches it. The gallery's old picker set both easing tokens at once because it
was the only control; with a real Focus group that workaround would defeat the
distinction the suite exists to express. Focus also gained
`--anim-focus-duration`, undeclared and inherit-by-default — the blur rule reads
`var(--anim-focus-duration, var(--anim-reveal-duration))`, so unset means "keep
time with Rise". That is the lever the open Focus-timing item was waiting on, and
it is now a control rather than a hand edit.

**Two things were found and fixed on the way:**

- **`--anim-lateral-distance` was dead.** Declared at 40px, read by nothing; the
  rule hardcoded `0px`, and the two comments in `globals.css` disagreed about
  which was intended. The rule was right about the design — one panel travels,
  everything else fades in place — so the token ships at `0px` and the rule now
  reads it. The dial survives; nothing on any page moved. The widened
  custom-properties test would have caught this years earlier had it not named
  four tokens by hand.
- **`scrub` is retired**, tokens and rules together. See §4.5.

### Where this stands — the load entrance

**`settle-load` is the one suite the observer never touches**, and it is a
prototype on `HeroSplitFullHeightSectionV3` alone.

A hero is above the fold, so it has no arrival to trigger — which is why every
hero sits in `animationExcludedComponents` under *"above the fold at load, so a
scroll entrance is inert"*. **The obvious fix is wrong.** Hanging an animation
off the `settled` state the observer already sets on above-the-fold frames looks
safe — nothing matches `settled` today, and the waiting rule is scoped to
`:not([state])` so nothing gets hidden. But the observer runs on mount, *after*
first paint, so an animation starting at `opacity: 0` blanks something the
reader is already looking at. Paint, blank, fade back in: the exact flash the
settle-before-ready ordering in `SectionEntrance` exists to prevent,
reintroduced on the first thing on the page.

So its rules carry **no `data-pagebuilder-animation-state` selector at all**. The
gate is `data-pagebuilder-animation`, which the frame owners render server-side,
so it is in the HTML at first paint and the animation begins with the page. No
JavaScript participates; if scripting never runs, nothing changes, because there
is no hiding rule to get stuck in.

It cannot be a state of `settle`. Dropping that suite's state gate would fire it
at load on the ten below-fold sections whose entire reason for using it is the
scroll trigger.

**Hero-only by veto, in both directions.** `suiteExcludedComponents` strikes
`settle-load` from the ten scroll-triggered media sections, and strikes
`reveal` / `fade` / `settle` / `lateral` from the hero — Wipe, Focus and Pulse
need no entry, because they gate on roles it does not mark and the derived gate
already withholds them. That is a hand-maintained list in a system built to
avoid them, and it is the right shape here: *above the fold* is a property of
where a section is **used**, not of what it marks, so there is nothing to derive
from. If a second hero takes this, the gate should become the inverse of the
above-fold exclusion reason rather than a longer list.

`animation-css-agreement.test.ts` exempts it from the timed contract and adds
the mirror: an untimed suite must have gated rules **and** none of them may read
an animation state. An exemption that only subtracts assertions is how a
half-finished timed suite would slip past the file built to catch it.

### Where this stands — 2026-08-17, later still

**Fade (`fade`) is the sixth suite**, offered everywhere Rise is (57 sections).
Units fade up in place, staggered by reading order, and nothing moves. It reuses
`section-fade` and the shared rhythm — no keyframe and no token of its own, which
is the cheapest a suite can be and the shape the token layer exists to make
possible.

It is a suite rather than "Rise with distance 0" because the distance is a
*shared* token: turning it down answers for all 57 sections at once. A section
that wants stillness while the library keeps its travel cannot say so on Rise,
and the only vocabulary left would be a section overriding a token inline —
which `animation-marker-ownership.test.ts` forbids, and rightly. A suite is the
unit of "how this section arrives", so the answer is a suite.

`differentiatedRoles: []`, which is the finding rather than an oversight. Rise
makes a special case of `media` because a bled panel that travels opens a band of
bare ground beneath it; that is a defect of the movement, so with no movement it
dissolves and every role gets one answer. Wipe recorded the same thing when it
stopped travelling. Note the test count did not move when Fade landed — the
suite-level assertions loop over the registry, so it was covered by the existing
tests rather than needing new ones.

**Entrance animation is its own block in pagebuilder**, three across, shaped like
Background texture. It used to sit in the icon-toggle run drawn as two 56px icons
where a section offered only off/on and as named buttons where it offered more —
one control with two appearances, and the icon one was wrong. A section marking a
heading now offers Rise, Fade, Wipe and Focus, and squeezing that into half a row
beside "Background" made an editorial decision look like an on/off switch someone
had run out of room for. `EntranceAnimationIcon` is deleted with it.

### What Focus found

**Two suites now gate on `heading`, and that is fine.** Wipe and Focus are two
answers to "how does a headline arrive", offered side by side on the same 15
sections. The gate was never a claim of exclusivity — it only says a suite is
not offered where it would paint nothing.

**`accent` is marked nowhere.** The role backfill classified 86 marker sites and
gave `accent` zero of them (`heading` 14, `content` 6, `card` 26, `media` 10,
`frame` 11, `action` 7). Focus blurs `heading` and `accent`, so half of its
signature is currently visible only in the style-guide gallery. That is not a
defect in Focus — it is the Phase 5 finding coming due. `accent` earned its place
on the argument that a stat or a badge deserves more presence than the copy
around it, and nothing has yet been marked as one.

**The role stays** — decided 2026-08-16, with a pass over the library to find
stat figures and badges to mark as one still to come. So the gap is a backfill
that has not happened, not a role to retire: two suites already describe
behaviour for it, and the markup is what is missing.

**The blur is not put on body copy, and that is a legibility call rather than a
performance one.** 10px over a heading reads as resolving; the same blur over a
paragraph of `type-text-md` is a grey smear that becomes text, which reads as the
page failing to load. Media is excluded for the performance reason instead — blur
cost scales with area, and a bled panel is the largest area on the page.

### The suites, as they stand

| Suite | id | Offered | Signature role | What it does |
|---|---|---|---|---|
| Rise | `reveal` | everywhere | — | units rise and fade in |
| Fade | `fade` | everywhere | — | units fade up in place, staggered; nothing moves |
| Settle | `settle` | marks `media` | `media` | the image eases down from 1.06 inside its frame; everything else fades in place |
| Settle on load | `settle-load` | one hero, by veto | `media` | the same gesture, played from first paint instead of on scroll |
| Wipe | `wipe` | marks a `heading` | `heading` | an edge crosses the heading; cards rise, accents scale, media fades |
| Pulse | `pulse` | marks an `action` | `action` | normal arrival, then one soft beat on the action once it lands |
| Lateral | `lateral` | everywhere | `media` | the media panel slides in from off-screen; everything else fades in place |
| Focus | `focus` | marks a `heading` | `heading` | the heading resolves out of a 10px blur; everything else fades in place |

**Seven roles now, not six.** `action` joined with Pulse, and the Phase 5
finding that "six is right" was right *for the suites that existed then* — no
existing role could carry "the thing the reader is meant to do". `accent` is
visual emphasis, `card` is one of several, `frame` is a composite.

**The action role goes on the unit, not on the button.** Every CTA section here
already marks a block that *contains* its button — a copy column, a conversion
card — so marking the button as well would nest a revealable unit inside a
revealable unit, and two opacity fades multiply into a muddy one.

**`CTAServiceTriageSectionV3` is deliberately not an action section.** Its
actions live on several triage cards, so there is no single thing for a beat to
point at, and pulsing all of them points at nothing. It is simply not offered
Pulse — the gate working, not an omission.

**One beat, never a loop.** An infinitely pulsing CTA never stops asking, reads
as a page that has not finished loading, and is a real problem for anyone who
finds movement distracting. The beat is delayed past the entrance so the reader
watches the section land and *then* watches one thing move; overlapping the two
just looks like a longer, wobblier entrance. Both properties are asserted in
`animation-css-agreement.test.ts` rather than trusted, because neither is
obvious from reading the rule.

Two animations run on the action unit at once and do not collide: the entrance
owns `opacity` and `translate`, the beat owns `scale`, and in modern CSS those
are separate properties rather than fields of one `transform` shorthand.

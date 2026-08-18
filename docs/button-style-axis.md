# Button style axis — handoff

Written 2026-08-17, at the end of the session that built it. Branch
`animation-suite-library`.

Read `docs/builder-workflow.md` §3 first if you have not — this assumes its
vocabulary (toggle axes, copy-affecting vs copy-neutral, the three render paths,
membership sets). The axis is modelled closely on the motion axis in
`animation-axis-handoff.md`, and where it deviates the deviation is called out.

---

## 1. What exists

A **library of button styles**, assigned to three global slots in the Style
Guide, plus a per-section **Special CTA** switch in the builder.

- **Primary** and **secondary** each take one style, site-wide.
- **Special** takes one style that nothing uses until a section asks for it.
- A section's switch says *that its primary CTA is the special one*. It never
  says which style that is.

That last line is the whole design. A per-section style picker is exactly what
the Style Guide exists to prevent — the same argument that keeps a motion suite
off the section and a colour off it too.

### Ownership

**A section does not decide what its buttons look like.** It renders a primary or
a secondary CTA and stops. The frame's `data-pagebuilder-special-cta` decides
whether the primary is the emphatic one; `globals.css` decides what that means.

No section component changed to gain the switch, and none can opt out of the
library: `button-cta-ownership.test.ts` fails on a section that sets a `--btn-*`
token, names a slot class by hand, or imports one of the retired treatments.

---

## 2. Where the pieces are

| Concern | File |
|---|---|
| **The style registry, the token vocabulary, both emitters** | `src/content/button-styles.ts` |
| The anatomy, the CTA colour roles, the three slot rules | `src/app/globals.css` (search `.button-cta`) |
| The primitive, and the class hooks everything shares | `src/components/primitives/Button.tsx` |
| The other CTA — a `<button>` that opens the modal | `src/components/request-service/RequestServiceModal.tsx` |
| The Style Guide's three pickers | `src/components/sections/StyleGuideButtonControls.tsx` |
| Draft key, live preview `<style>` | `src/components/sections/StyleGuideLiveSurface.tsx` |
| Promotion | `src/app/api/style-guide-tokens/route.ts` |
| Membership, options, resolver | `src/content/section-style-options.ts` |
| Builder control + canvas frame | `src/components/sections/PagebuilderShell.tsx` |
| Staged/export frame | `src/components/sections/PageTemplatePreview.tsx` |
| Export field and emitted attribute | `src/utils/site-export.ts` |

Key names: `buttonStyles`, `buttonStyleCss`, `buttonSlotSelectors`,
`normalizeButtonStyleSelection`, `specialCtaComponents`, `resolveSpecialCta`,
`buttonClassNames`.

---

## 3. The anatomy

One box and two pseudo-elements, in `@layer components` so section-passed
Tailwind utilities still win:

```txt
.button-cta               the box
.button-cta::before       the fill layer — the sweep
.button-cta::after        the glyph
```

The fill layer paints **above the button's background and below its label**, which
is painting order rather than a trick: a negative-z-index child of a stacking
context paints after the context root's background and before its inline content.
`isolation: isolate` is what guarantees the button *is* the context.

A style is one preset of ~22 structural tokens: where the fill comes from, how it
arrives (a `translate` for a sweep, an `inset` for a chip growing out of one
edge), whether the box lifts or presses, whether there is a glyph, and the tempo.

**Every gesture token is the hover value.** The resting state is inert in the
anatomy and `:hover` switches to the token, so a style states what happens and
declines a gesture by answering it with the inert value.

### A style carries no colour

Colour belongs to the colour recipes, which resolve `--recipe-cta-fill` and
`--recipe-cta-label` per section ground. A style names one of five **CTA colour
roles** and gets whatever the recipe hands it:

```txt
--btn-cta-fill        --btn-cta-fill-hover      --btn-cta-label
--btn-cta-edge        --btn-cta-edge-ink
```

---

## 4. The two traps, both of which shipped

Both are cascade traps, both produced a page that looked plausible, and neither
threw anything.

### 4.1 A custom property substitutes its `var()`s where it is DECLARED

The slots were first declared at `:root`, which meant
`--btn-surface: var(--color-cta-primary)` resolved **at the root**, outside every
colour recipe. It fell through to the brand accent, every button on the site
inherited that one already-resolved colour, and the recipes' `--live-cta-*` — set
far down the tree on the section frame — was never read again.

The symptom: **the primary button was the same blue on a red ground and a navy
one.** The two light-ground recipes looked perfect throughout, because their
answer happens to equal the root fallback, so the bug was invisible on the
recipes anyone tests first.

So the slots are declared **on the buttons**, as three rules
(`buttonSlotSelectors`), inside the recipe's subtree. `button-style-agreement`
fails on any `--btn-*` declared at `:root`.

### 4.2 `--color-*` tokens are frozen at `:root` by `@theme inline`

The same trap one level up, and the more surprising half. Tailwind's
`@theme inline` block emits `--color-cta-primary` and friends as `:root` custom
properties, so they carry the root's answer everywhere. **Tailwind's own utilities
escape it** because `inline` means it substitutes the *value* into the generated
utility — `bg-cta-primary` expands to the full `--live-*` chain and resolves at
the element. Hand-written CSS reading the token does not get that treatment, and
there is no way to tell the two apart by reading them.

Measured, with a brand recipe on the frame: `--live-cta-primary` was `#fff` at
the button while `--color-cta-primary` was `#007cbd` at the button **and** at the
root.

This is why the five CTA roles exist. They are declared on `.button-cta` from the
`--live-*` chain, and a style may name nothing else — `button-style-agreement`
fails on any style value containing `var(--color-`.

> **If you write any rule outside a utility that needs a recipe-scoped colour,
> read the `--live-*` chain, not the `--color-*` token.** This is not specific to
> buttons.

### 4.3 `npm run css:verify` cannot see this class of bug

It compares token *names* between source and served CSS. Both traps change only
values, so it reported OK while the served stylesheet was stale **and** while the
values were wrong. A stale CSS chunk also survived a file touch with its hash
unchanged; only a dev-server restart cleared it.

---

## 5. The CTA hover is the recipe's

No recipe used to answer "what does the primary fill become on hover", so all
eight fell through to `--color-cta-primary-hover`'s last resort — the near-black
page ground — while the label stayed whatever the recipe had chosen. Fine on the
two light-ground recipes, whose label is white. On the three dark grounds it was
the invisible-text failure: a light chromatic chip with an ink label, hovering to
near-black under dark text.

Each recipe now declares `--recipe-cta-hover`, moving its fill a small step
**away from its own label** — light grounds darken, dark grounds lighten,
chromatic grounds darken slightly since that is the only direction from white. A
constant cannot be right for three polarities, which is why it is a row in each
recipe rather than a formula in the role table.

---

## 6. The two CTA components

There is no single button component, and pretending otherwise is what made the
first version of this axis reach half the site.

| | Renders | Used for a primary CTA in |
|---|---|---|
| `Button` | `<a>` | 18 sections |
| `RequestServiceButton` | `<button>` that opens the request modal | 32 sections, incl. every hero |

`RequestServiceButton` hand-copied the primary's classes, so the two were free to
drift, and its secondary was a filled surface button — precisely the "second
primary" shape `Button` documents having removed. Both render
`buttonClassNames()` now.

**Its secondary changed appearance on ~32 sections.** That was the point.

Three sections style a bare `<button type="submit">` with the CTA tokens — the two
zip lookups and the financing calculator. Those are form controls that *match* the
button rather than the shared button, they are deliberately outside
`specialCtaComponents`, and converting them is its own change with its own
opinions about the arrow each already draws.

---

## 7. Known interactions

- **`CTAServiceTriageSectionV3` draws its own arrow** under the `icons` axis. With
  Special CTA on and a glyph-bearing style assigned, that button shows two. The
  section's arrow predates the axis; the honest fix is to let the anatomy own it,
  which means deciding what `icons: off` should then mean on that section.
- **A section already staged does not gain this axis** until it is refreshed or
  restaged — a staged page holds a full snapshot (builder-workflow §4). Same
  caveat the animation axis carries.
- **`accent`-family styles read the recipe, not the palette.** A style that looks
  wrong on one recipe is nearly always the recipe's `(fill, label)` pair being
  read correctly; check the recipe row before changing the style.

---

## 8. Adding a style

One entry in `buttonStyles`, with a complete token record and the slots it may
fill. That is the whole cost — no CSS, no membership set, no migration.

The registry is `as const satisfies`, so an omitted token is a compile error, and
`button-style-agreement` catches an empty value (which poisons the rule that
reads it rather than inheriting anything), a `--color-*` reference, a token no
rule reads, and a rule reading a token no style declares.

Ids are persisted in the promoted stylesheet and in every saved Style Guide slot.
**Never rename one.**

---

## 9. How to verify

```bash
npx vitest run        # 919 at this revision
npx tsc --noEmit
npx eslint src/
npx next build
```

Colour and hover **cannot** be verified from tests. Serve the app and ask the DOM,
and note §4.3 first — restart the dev server rather than trusting `css:verify`.

The probe that found both bugs: build a `.pagebuilder-section-frame
.pagebuilder-paint-surface[data-pagebuilder-color-recipe="…"]` wrapper per recipe,
put a `.button-cta.button-cta-primary` and a `.button-cta-secondary` inside, and
read computed `backgroundColor` / `color` / `borderTopColor` for all eight. **If
every recipe returns the same colour, that is the bug** — the frame's own
`backgroundColor` varying while the buttons do not is the signature.

Do the same with `data-pagebuilder-special-cta="on"` to check the frame gate, and
read `::after`'s `content` to confirm the glyph.

Two things that will mislead you on screen: a section mid-entrance renders its
buttons at low opacity and reads as a contrast failure (settle the frame first),
and the builder canvas writes repo files — record
`git hash-object src/content/pagebuilder-options.json src/content/page-templates.json`
before and after.

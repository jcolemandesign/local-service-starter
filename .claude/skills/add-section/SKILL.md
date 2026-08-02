---
name: add-section
description: Checklist for adding a new reusable page section to this project. Use whenever creating a new section component so it gets registered everywhere the section library is referenced (section index, section library, /sections preview, pagebuilder).
---

# Adding a new section

When adding a new reusable section, treat the section library as the source of truth.

A new section is not complete until it is:

- implemented in `src/components/sections/`
- exported from `src/components/sections/index.ts`
- added to `src/content/section-library-v3.ts` in the correct semantic collection
- added to the `/sections` preview map in `src/app/sections/page.tsx`
- added to **both** pagebuilder lists under the same semantic mode as the library (see below)
- given a render `case` in **both** renderer switches (see below), including the `xxxProps()` mapper in `PageTemplatePreview.tsx`
- **given a copy field spec** — a branch in `getTemplateCopyFieldsForSection` (`src/utils/template-copy-contract.ts`)
- **given an asset field spec** if it renders images — a branch in `getTemplateAssetFieldsForSection` (`src/utils/staged-pages.ts`)
- **registered in the toggle membership sets it qualifies for** in `src/content/section-style-options.ts` (see below)

Do not add a section only to pagebuilder. Pagebuilder should reference sections that already exist in the section library.

## Reaching pagebuilder

There are **three render paths**, and a section needs wiring in each:

- `renderPageTemplateSection` in `PageTemplatePreview.tsx` — staged pages and export. Renders from `page.fields` via the section's `xxxProps()` mapper.
- `renderPreviewSection` in `PagebuilderSection.tsx` — the gallery. Renders from `sectionLibraryV3Content` demo content. Without a `case` the section falls to `UnknownSection`, which renders "Preview unavailable" — it looks like a broken section rather than a missing registration.
- **the ternary chain in `PagebuilderShell.tsx`** — the builder canvas. This one is a nested `? :` chain, not a `switch`, so grepping for `switch (section.component)` will not find it.

That third path is the one that silently eats toggles. Its final fallback renders a `previewCatalog` element, which is built **once** from a synthetic section carrying no toggle values. A section without its own branch there still appears and still looks correct — but `cardFill`, `cardBorder`, `icons`, `cardLinks` and the align axes show their controls in the panel and do nothing when changed. Give any toggle-supporting section a branch passing the resolvers:

```tsx
) : section.component === myComponent ? (
  <MySectionV3
    {...sectionLibraryV3Content.mySection}
    cardBorder={getSectionCardBorder(section)}
    cardFill={getSectionCardFill(section)}
    icons={getSectionIcons(section)}
  />
```

Note these are the `getSection*` resolvers, not raw `section.cardFill` — they apply the opt-in and default rules.

"Referenced by pagebuilder" then means two more lists, and neither of them is `src/content/pagebuilder.ts`:

- `sectionSwapOptions` in `PagebuilderShell.tsx` — the list the builder offers. Missing here means the section cannot be chosen at all.
- `previewCatalog` in `PagebuilderSection.tsx` — the gallery preview. Missing here means it can be chosen but renders nothing in the picker.

The `sectionStack` arrays in `src/content/pagebuilder.ts` are a *recipe's default composition* — the sections a new page of that type starts with. Adding a section there does not make it available; it forces it into every page built from that recipe. That is almost never what a new section wants.

`pagebuilder-catalog-parity.test.ts` pins both lists against the library registry, so an omission fails loudly instead of silently.

## Toggle registration

Pagebuilder and the content editor only offer a toggle to sections listed in the matching membership set in `src/content/section-style-options.ts`. A section missing from a set it qualifies for does not error — the control is silently never offered (or, for spacing, offered where it cannot work). Walk this list for every new section:

- renders a card or panel background → `cardStyleComponents` (required — a filled card must always offer the transparent option)
- card surface is **unfilled by default** → also `cardFillOptInComponents`, so unset resolves to `none` instead of `solid`
- cards are ordinary navigation links → `cardLinkComponents` (CTA sections and control-card callouts stay out)
- draws marker icons → `iconComponents`
- the headline is the whole composition → `headlineWrapComponents`
- content fills 12 of 14 columns → `tableCompareAlignComponents`; a three-card row → `cardLinkGridAlignComponents`
- pins a viewport-derived min-height (`section-min-screen` / `-sliver` / `-story` / `-sticky`) → `viewportHeightComponents`, which *removes* the spacing control — min-height takes the space back, so the control would read as broken

## Adding a new toggle axis

If the section needs an axis that does not exist yet:

- **Copy-affecting** (changes which fields the section asks for) → it rides `variant`, `ratio`, or the field specs, all hashed into the copy-contract fingerprint. Flipping it flips approved pages to `stale` — deliberate, but do it knowingly.
- **Copy-neutral** (repaint only) → its own field beside `cardFill` / `align` / `icons`, never folded into `variant`, so a visual nudge cannot stale approved copy.
- One option list per axis, declared in `section-style-options.ts` and imported everywhere — duplicated lists drift silently.
- `""` always means "inherit the template". Persisted values are opaque ids — never rename one.
- An **unset value must resolve to the pre-axis rendering and the pre-axis copy fields**, or every saved page using the section changes or goes stale on read.

## The two steps that fail silently

The copy and asset field specs are the steps that get skipped, and they do **not** produce an error — they produce wrong output on a client site.

Every `xxxProps()` mapper spreads `...sectionLibraryV3Content.X` as its fallback base. If a field name the mapper reads is missing from the field spec, that field is never requested from the LLM, never written to `page.fields`, and the renderer silently falls back to **section-library demo content**. Export validation cannot catch this: it only inspects fields that exist in `page.fields`, and a field that was never specced does not exist there.

So the rule is: **the field names your `xxxProps()` mapper reads must exactly match the field names your spec declares.** Cross-check them by hand before finishing.

If a section has no branch in `getTemplateCopyFieldsForSection`, it falls through to `fallbackFields` (`eyebrow`/`heading`/`body`/`items`) — which is almost never what a custom section actually renders.

Both spec functions match sections on a fuzzy `component + mode + name` string via `.includes(...)`, so **the order of the if-chain is semantically significant** — place a new branch where a broader match cannot shadow it.

## Before finishing

Verify the section appears in `/sections`, appears in pagebuilder under the matching semantic mode, that its spec and props mapper agree on every field name, and that these pass:

```bash
npm run lint
npx tsc --noEmit
npm run test
```

`src/utils/__tests__/section-demo-content-leak.test.ts` is the mechanical check for the silent-fallback failure above — it renders every registered section from its declared spec fields and fails if demo content leaks through. A new section must pass it, not be added to its `KNOWN_GAPS` list.

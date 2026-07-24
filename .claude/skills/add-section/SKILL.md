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
- referenced by pagebuilder using the same semantic mode/category as the section library
- given a render `case` **and** a `xxxProps()` mapper in `PageTemplatePreview.tsx`
- **given a copy field spec** — a branch in `getTemplateCopyFieldsForSection` (`src/utils/template-copy-contract.ts`)
- **given an asset field spec** if it renders images — a branch in `getTemplateAssetFieldsForSection` (`src/utils/staged-pages.ts`)

Do not add a section only to pagebuilder. Pagebuilder should reference sections that already exist in the section library.

## The two steps that fail silently

The last two are the ones that get skipped, and they do **not** produce an error — they produce wrong output on a client site.

Every `xxxProps()` mapper spreads `...sectionLibraryV3Content.X` as its fallback base. If a field name the mapper reads is missing from the field spec, that field is never requested from the LLM, never written to `page.fields`, and the renderer silently falls back to **section-library demo content**. Export validation cannot catch this: it only inspects fields that exist in `page.fields`, and a field that was never specced does not exist there.

So the rule is: **the field names your `xxxProps()` mapper reads must exactly match the field names your spec declares.** Cross-check them by hand before finishing.

If a section has no branch in `getTemplateCopyFieldsForSection`, it falls through to `fallbackFields` (`eyebrow`/`heading`/`body`/`items`) — which is almost never what a custom section actually renders.

## Before finishing

Verify the section appears in `/sections`, appears in pagebuilder under the matching semantic mode, that its spec and props mapper agree on every field name, and that it passes lint/build.

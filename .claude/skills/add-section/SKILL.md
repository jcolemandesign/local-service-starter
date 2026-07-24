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

Do not add a section only to pagebuilder. Pagebuilder should reference sections that already exist in the section library.

Before finishing, verify the section appears in `/sections`, appears in pagebuilder under the matching semantic mode, and passes lint/build.

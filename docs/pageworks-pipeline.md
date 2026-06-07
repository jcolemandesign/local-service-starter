# Pageworks Pipeline

Pageworks is the overhaul name for the local service starter workflow. The goal
is to move from reusable section experiments to baked, lightweight client pages
through clear stages.

## Core Rule

Each stage can use the previous stage as source material, but promotion should
sever unnecessary runtime ties. A promoted page should be normal Next.js page
code, not a live dependency on Pagebuilder state.

## Stages

| Stage | Purpose | Output |
| --- | --- | --- |
| Section Library | Build reusable template sections and global layout rules. | Generic sections and shared layout/token rules. |
| Pagebuilder | Examine layout flows with template sections. | Instructions/briefs for creating concrete pages. |
| Created Pages | WIP pages generated from Pagebuilder instructions. | Baked page files that can be edited and refined. |
| Styleguide | Preview and promote global visual tokens. | Shared tokens for type, color, surfaces, radius, shadow, and spacing. |
| Content Editor | Map page/section copy and image fields into editable forms. | Saved content changes ready for promotion. |
| Website Pages | Review staged pages that are eligible to become public. | Staged pages and public-ready pages. |
| Public Site | Clean client-facing pages. | Final pages with no builder/editor controls. |

## Pagebuilder Design Tabs

Rename the five Pagebuilder design workspaces to:

- `homepage1`
- `homepage2`
- `about`
- `services`
- `individual service page`

Each tab should support:

- Export instruction for recreating the page.
- Copy all layouts.
- Create a baked page from the current design.

## Styleguide Preview Requirements

The styleguide preview must include:

- Type hierarchy.
- Editorial stress tests.
- Cards.
- Buttons.
- Surfaces.
- Color roles.
- Examples of every pertinent type and surface color combination, including
  inverse treatments.
- Borders, radii, and shadows.
- Representative real sections from the section library.

Style changes should preview live inside the styleguide. Promote should update
global shared tokens.

## Content Editor Requirements

The Content Editor is a stepping-stone copy viewer/editor, not a full live
website editor.

It should:

- Group content by page.
- Group fields by section.
- Show editable boxes for copy.
- Include simple image placement/link-name fields.
- Save edits.
- Promote saved edits into the next stage.

It does not need image preview or live page preview in the first version.

## Promotion Model

Pagebuilder promotion should create baked pages.

Created or staged pages may keep metadata about their source recipe, but they
should render directly with section imports and finalized props/content.

Example metadata:

```json
{
  "sourceStage": "pagebuilder",
  "sourceDesign": "homepage1",
  "sourceRecipe": "plumbing-homepage-v1",
  "promotedAt": "2026-06-07"
}
```

## Phase Plan

### Phase 1: Naming And Navigation

Status: complete

- Use the Pageworks Pipeline name in docs.
- Add/rename home menu groups for Pagebuilder, Created Pages, Website Pages,
  Styleguide, and Content Editor.
- Rename Pagebuilder design tabs.

### Phase 2: Pagebuilder Output

Status: complete

- Make each Pagebuilder design tab export an instruction/brief.
- Add a copy-all-layouts action.
- Define the minimum page instruction format.

Minimum page instruction format:

- Pipeline/stage name.
- Target page type.
- Source recipe id.
- Page intent.
- Viewport/design reference.
- Style rules.
- Included section order with component, name, mode, instruction, and origin.
- Excluded sections.
- Implementation rules for baking the page.
- Expected output paths for the baked page and content.

### Phase 2.5: Housekeeping Before Created Pages

Status: complete

- Rename Design Lab code and routes to Pagebuilder.
- Remove the legacy `/dev/design-lab` route instead of keeping it as an alias.
- Limit project-index clone/delete actions to Created Pages.
- Align Pagebuilder recipe intent copy with the five target page types.
- Clean stale navigation and roadmap labels.

### Phase 3: Created Pages

Status: complete

- Add a Created Pages home/menu area.
- Create baked WIP pages from Pagebuilder instructions.
- Keep pages lightweight and independent from Pagebuilder runtime state.

### Phase 4: Styleguide Promotion

Status: in progress

- Build the expanded styleguide preview matrix.
- Wire live token preview locally in the styleguide.
- Add promote behavior for accepted global token changes.

Progress:

- Expanded styleguide preview matrix is in place.
- Live token preview and promote behavior remain open.

### Phase 5: Content Editor

Status: in progress

- Add the Copy Inventory/Content Editor surface.
- Map content by page and section.
- Save and promote copy/image field edits.

Progress:

- Content Editor inventory reads Created Pages content.
- Fields are grouped by page and section.
- Draft save and promotion snapshot are local to the dev browser.

### Phase 6: Website Pages And Public Promotion

- Add Website Pages with Staged Pages.
- Promote staged pages to public routes.
- Keep public pages free of builder/editor controls.

## Next Implementation Slice

Start Phase 5 by replacing the Content Editor placeholder with a copy inventory
surface that reads Created Pages content, groups editable fields by page and
section, and separates save/promote as explicit next steps.

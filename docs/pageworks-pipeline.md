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
| Template Builder | Generate clean pages from approved templates. | Public-ready page files and canonical content. |
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
- Add/rename home menu groups for Pagebuilder, Website Pages,
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

### Phase 2.5: Housekeeping Before Generated Pages

Status: complete

- Rename Design Lab code and routes to Pagebuilder.
- Remove the legacy `/dev/design-lab` route instead of keeping it as an alias.
- Limit project-index clone/delete actions to generated page experiments.
- Align Pagebuilder recipe intent copy with the five target page types.
- Clean stale navigation and roadmap labels.

### Phase 3: Retired Generated Pages

Status: retired

- The old baked WIP generated page route set has been removed.
- Clean pages will be rebuilt through the completed template builder instead.

### Phase 4: Styleguide Promotion

Status: in progress

- Build the expanded styleguide preview matrix.
- Wire live token preview locally in the styleguide.
- Add promote behavior for accepted global token changes.

Progress:

- Expanded styleguide preview matrix is in place.
- Phase 4 control loop has started.
- Live token controls preview color, radius, shadow, and core typography
  variables across the styleguide surface.
- The styleguide control surface now owns the former Font Lab typography role
  controls alongside color, radius, and shadow controls.
- Promote writes a generated token override block to `src/app/globals.css` in
  dev.
- Core typography scale/weight/leading controls have been folded into the
  Styleguide control loop.
- Representative section previews now use current seven-column section-library
  components where available.
- Added surface/type relationship specimens so color choices can be judged
  against headings, muted copy, nested cards, actions, and inverse treatments.
- Former Font Lab role/profile editing has been transferred into the Style
  Guide typography section.

### Phase 5: Content Editor

Status: in progress

- Add the Copy Inventory/Content Editor surface.
- Map content by page and section.
- Save and promote copy/image field edits.

Progress:

- Content Editor inventory is waiting for clean Template Builder output.
- Fields are grouped by page and section.
- Draft save remains local to the dev browser.
- Promote writes staged content snapshots to `src/content/staged-pages.json`.
- Website Pages reads staged content snapshots from the repo.

### Phase 6: Website Pages And Public Promotion

Status: in progress

- Add Website Pages with Staged Pages.
- Promote staged pages to public routes.
- Keep public pages free of builder/editor controls.

Progress:

- Website Pages now lists staged pages promoted from the Content Editor.
- Public route promotion remains open.

## Next Implementation Slice

Continue Phase 5/6 by adding public-route promotion from staged pages, then
decide whether staged content snapshots should become canonical content files or
remain a promotion handoff artifact.

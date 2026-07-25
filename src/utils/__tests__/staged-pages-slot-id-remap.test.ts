import { describe, expect, it } from "vitest";

import { getSectionIdRenames, type SlottedSection } from "@/utils/section-id";
import {
  mergePreservingIncompatibleSections,
  remapFieldPathsForRenamedSections,
  type StagedPageField,
} from "@/utils/staged-pages";
import type { TemplateCopySectionStatus } from "@/utils/template-copy-contract";

/**
 * Covers the rename recovery described in docs/architecture-review-2026-07.md.
 *
 * Section identity in field paths stays derived (ordinal + slugified name).
 * `slotId` is the persisted anchor that lets a restage recognise a renamed or
 * reordered section as the same slot and move its copy to the new path, rather
 * than leaving it stranded at a path nothing reads - which is what happened to
 * section 07 of the About page (recovered in d109015).
 */

function section(
  name: string,
  slotId: string | undefined,
  component = "WidgetOne",
): SlottedSection {
  return { component, mode: "custom", name, slotId };
}

function field(path: string, value: string): StagedPageField {
  return { id: `home.${path}`, kind: "copy", path, value };
}

describe("getSectionIdRenames", () => {
  it("maps a renamed section's old id to its new id", () => {
    const renames = getSectionIdRenames(
      [section("Asymmetric feature cards", "slot-a")],
      [section("Cards features 4 up split", "slot-a")],
    );

    expect([...renames]).toEqual([
      ["01-asymmetric-feature-cards", "01-cards-features-4-up-split"],
    ]);
  });

  it("ignores slots whose derived id did not change", () => {
    const sections = [section("Widget One", "slot-a")];

    expect(getSectionIdRenames(sections, sections).size).toBe(0);
  });

  it("maps a reorder, where the name is unchanged but the ordinal moved", () => {
    const renames = getSectionIdRenames(
      [section("Widget One", "slot-a"), section("Widget Two", "slot-b")],
      [section("Widget Two", "slot-b"), section("Widget One", "slot-a")],
    );

    // Both directions must be captured off the previous ids in one pass;
    // resolving them sequentially would let one rename clobber the other.
    expect([...renames].sort()).toEqual([
      ["01-widget-one", "02-widget-one"],
      ["02-widget-two", "01-widget-two"],
    ]);
  });

  it("produces no renames when sections have no anchor", () => {
    const renames = getSectionIdRenames(
      [section("Asymmetric feature cards", undefined)],
      [section("Cards features 4 up split", undefined)],
    );

    expect(renames.size).toBe(0);
  });

  it("ignores slots that exist on only one side", () => {
    const renames = getSectionIdRenames(
      [section("Removed section", "slot-gone")],
      [section("Added section", "slot-new")],
    );

    expect(renames.size).toBe(0);
  });
});

describe("remapFieldPathsForRenamedSections", () => {
  it("rewrites path and id for renamed sections only", () => {
    const fields = [
      field("07-asymmetric-feature-cards.heading", "Real heading"),
      field("07-asymmetric-feature-cards.body", "Real body"),
      field("08-faq.heading", "Untouched"),
      field("strategy.pageCopy", "# Bulk Paste Copy"),
    ];

    const remapped = remapFieldPathsForRenamedSections(
      fields,
      new Map([
        ["07-asymmetric-feature-cards", "07-cards-features-4-up-split"],
      ]),
      "home",
    );

    expect(remapped.map((entry) => entry.path)).toEqual([
      "07-cards-features-4-up-split.heading",
      "07-cards-features-4-up-split.body",
      "08-faq.heading",
      "strategy.pageCopy",
    ]);
    expect(remapped[0].id).toBe("home.07-cards-features-4-up-split.heading");
    expect(remapped[0].value).toBe("Real heading");
  });

  it("returns the original array when there is nothing to remap", () => {
    const fields = [field("01-widget-one.heading", "Heading")];

    expect(remapFieldPathsForRenamedSections(fields, new Map(), "home")).toBe(
      fields,
    );
  });
});

describe("restaging a renamed section", () => {
  // "stale" is what a renamed section's freshly built copy verifies as, and it
  // is the status that makes the merge fall back to the previous value.
  const sectionStatuses: TemplateCopySectionStatus[] = [
    {
      ordinal: "07",
      reasons: [],
      sectionId: "07-cards-features-4-up-split",
      status: "stale",
    },
  ];

  // Six untouched sections ahead of it, so the renamed one sits at ordinal 07
  // exactly as the About page did.
  const leadingSections = Array.from({ length: 6 }, (_, index) =>
    section(`Filler ${index + 1}`, `slot-filler-${index + 1}`),
  );
  const previousSections = [
    ...leadingSections,
    section("Asymmetric feature cards", "slot-a"),
  ];
  const nextSections = [
    ...leadingSections,
    section("Cards features 4 up split", "slot-a"),
  ];

  const previousFields = [
    field("07-asymmetric-feature-cards.heading", "Approved heading"),
  ];
  const nextFields = [field("07-cards-features-4-up-split.heading", "")];

  it("preserves approved copy across the rename", () => {
    const renames = getSectionIdRenames(previousSections, nextSections);
    const merged = mergePreservingIncompatibleSections(
      nextFields,
      remapFieldPathsForRenamedSections(previousFields, renames, "home"),
      sectionStatuses,
    );

    expect(merged[0].value).toBe("Approved heading");
  });

  it("loses that copy without the anchor - the bug this prevents", () => {
    const merged = mergePreservingIncompatibleSections(
      nextFields,
      previousFields,
      sectionStatuses,
    );

    expect(merged[0].value).toBe("");
  });
});

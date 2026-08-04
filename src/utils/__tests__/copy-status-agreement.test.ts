import { describe, expect, it } from "vitest";

import {
  getTemplateCopyContractStatus,
  getTemplateCopySectionStatuses,
  getTemplateCopySectionFingerprint,
  type TemplateCopyContractTemplate,
} from "@/utils/template-copy-contract";

/**
 * The page-level status and the per-section statuses must never disagree about
 * whether a page's copy is usable.
 *
 * They used to. The page-level check fell through to a field-name compatibility
 * test that only looked for the names it already knew, so it could not see a
 * section whose spec had *gained* fields. When several sections were given real
 * copy specs, the Strategy Workspace kept reporting those pages clean while
 * Staged Pages correctly reported the sections stale - and the reassuring screen
 * was the wrong one.
 *
 * The page status is now an aggregate of the section statuses. These tests pin
 * that relationship rather than either screen's wording.
 */

const template: TemplateCopyContractTemplate = {
  id: "tmpl-agreement",
  name: "Agreement Template",
  pageType: "Home",
  sections: [
    { component: "WidgetOne", mode: "custom", name: "Widget One" },
    { component: "WidgetTwo", mode: "custom", name: "Widget Two" },
  ],
};

function block(heading: string, fingerprint?: string) {
  return [
    `### ${heading}`,
    ...(fingerprint ? [`<!-- Section contract: ${fingerprint} -->`] : []),
    "eyebrow: Test Eyebrow",
    "heading: Test Heading",
    "body: Test body copy.",
    "items: Item One - Description",
  ];
}

function copyWith(...blocks: string[][]) {
  return [
    "# Bulk Paste Copy",
    "",
    "<!-- Page target: Test Page (/test-page) -->",
    "<!-- Template contract: tc-v2-doesnotmatter -->",
    "",
    ...blocks.flatMap((lines) => [...lines, ""]),
  ].join("\n");
}

function problemSections(copy: string) {
  return getTemplateCopySectionStatuses(copy, template).filter(
    (section) => section.status === "stale" || section.status === "unverified",
  );
}

describe("page and section copy status agree", () => {
  it("reports stale when any one section's fingerprint has moved", () => {
    const copy = copyWith(
      block("01-widget-one", getTemplateCopySectionFingerprint(template.sections[0])),
      block("02-widget-two", "sc-v1-movedsincethiswaswritten"),
    );

    expect(problemSections(copy)).toHaveLength(1);
    expect(getTemplateCopyContractStatus(copy, template)).toBe("stale");
  });

  it("still reports current for legacy copy with no section fingerprints", () => {
    // The tolerance that matters: copy written before per-section fingerprints
    // existed verifies by heading slug and field names, and must not be dragged
    // to stale by the tightening.
    const copy = copyWith(block("01-widget-one"), block("02-widget-two"));

    expect(problemSections(copy)).toHaveLength(0);
    expect(getTemplateCopyContractStatus(copy, template)).toBe("current");
  });

  it("never reports current while a section is stale or unverified", () => {
    const cases = [
      copyWith(
        block("01-widget-one", "sc-v1-moved"),
        block("02-widget-two", "sc-v1-moved"),
      ),
      // Second block missing entirely.
      copyWith(block("01-widget-one")),
      // Copy written for a component that is no longer at that position.
      copyWith(block("01-widget-three"), block("02-widget-two")),
    ];

    for (const copy of cases) {
      if (problemSections(copy).length > 0) {
        expect(getTemplateCopyContractStatus(copy, template)).not.toBe("current");
      }
    }
  });
});

import { describe, expect, it } from "vitest";

import {
  getTemplateCopySectionFingerprint,
  getTemplateCopySectionStatuses,
  type TemplateCopyContractTemplate,
} from "@/utils/template-copy-contract";

/**
 * A page may use the same section twice - two "Large section header" blocks
 * around different groups of offers, say. Those two sections are identical in
 * everything the section fingerprint hashes, so they produce the same value.
 *
 * That broke block-to-ordinal matching in two compounding ways:
 *
 * 1. The fingerprint-to-ordinal map was one-to-one, so the second section
 *    overwrote the first and the earlier ordinal was unreachable.
 * 2. The fingerprint comment that follows a `### NN-slug` heading was looked up
 *    in that map and allowed to *relocate* the block - so a correctly-headed
 *    block was moved onto the other section's ordinal, and the ordinal it left
 *    behind reported no fingerprint and no fields.
 *
 * Three of North Star's pages reported stale copy that was in fact complete.
 */

function template(): TemplateCopyContractTemplate {
  const header = {
    component: "SectionHeaderLargeSectionV3",
    mode: "Section Headers",
    name: "Large section header",
  };

  return {
    id: "tmpl-dupes",
    name: "Duplicate Sections",
    pageType: "Home",
    // Same section at 01 and 03: identical fingerprint, different positions.
    sections: [
      { ...header },
      { component: "WidgetOne", mode: "custom", name: "Widget One" },
      { ...header },
    ],
  };
}

function block(heading: string | null, fingerprint: string, marker: string) {
  return [
    ...(heading ? [`### ${heading}`, ""] : []),
    `<!-- Section contract: ${fingerprint} -->`,
    "",
    `eyebrow: Eyebrow ${marker}`,
    `heading: Heading ${marker}`,
    `body: Body ${marker}`,
    `items: Item ${marker} - Description`,
    "",
  ];
}

function page(...blocks: string[][]) {
  return [
    "# Bulk Paste Copy",
    "",
    "<!-- Template contract: tc-v2-whatever -->",
    "",
    ...blocks.flat(),
  ].join("\n");
}

describe("a page using the same section twice", () => {
  const contract = template();
  const headerPrint = getTemplateCopySectionFingerprint(contract.sections[0]);
  const widgetPrint = getTemplateCopySectionFingerprint(contract.sections[1]);

  it("gives both repeated sections their own copy when headings are present", () => {
    const copy = page(
      block("01-large-section-header", headerPrint, "A"),
      block("02-widget-one", widgetPrint, "B"),
      block("03-large-section-header", headerPrint, "C"),
    );

    const statuses = getTemplateCopySectionStatuses(copy, contract);

    expect(statuses.map((s) => s.status)).toEqual([
      "current",
      "current",
      "current",
    ]);
  });

  it("still resolves both when the model drops the headings", () => {
    // The fingerprint comment has to open a block by itself here, and the two
    // identical ones must claim their ordinals in order rather than both
    // landing on the last.
    const copy = page(
      block(null, headerPrint, "A"),
      block(null, widgetPrint, "B"),
      block(null, headerPrint, "C"),
    );

    const statuses = getTemplateCopySectionStatuses(copy, contract);

    expect(statuses.map((s) => s.status)).toEqual([
      "current",
      "current",
      "current",
    ]);
  });

  it("does not let a heading-less block steal an earlier headed ordinal", () => {
    // First block is headed; the third has no heading and must open the second
    // repeat rather than re-annotating the first.
    const copy = page(
      block("01-large-section-header", headerPrint, "A"),
      block("02-widget-one", widgetPrint, "B"),
      block(null, headerPrint, "C"),
    );

    const statuses = getTemplateCopySectionStatuses(copy, contract);

    expect(statuses.every((s) => s.status === "current")).toBe(true);
  });
});

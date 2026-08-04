import { describe, expect, it } from "vitest";

import { getContentEditorPages } from "@/content/content-editor";
import { getTemplateCopyFieldsForSection } from "@/utils/template-copy-contract";

/**
 * The editor shows a live character count against the contract's `target`.
 *
 * Targets are prose written for a copywriter - "35-70 characters.", "OPTIONAL.
 * When used: 2-4 items, 28-70 characters each." - so the count depends on
 * pulling a range out of a sentence. The risk is reading a number that is not
 * a length: "2-4 items" is a count, and showing "12 / 2-4" under a headline
 * would be worse than showing nothing.
 *
 * This mirrors the parser in ContentEditorSection, which is not exported, and
 * runs it over every target string the contract actually produces.
 */

function getCharacterTarget(target?: string) {
  if (!target) return null;

  const range = /(\d+)\s*[-–]\s*(\d+)\s*characters/i.exec(target);

  if (range) {
    const min = Number(range[1]);
    const max = Number(range[2]);
    return max > min ? { max, min } : null;
  }

  const upTo = /(?:under|up to|max(?:imum)?)\s*(\d+)\s*characters/i.exec(target);

  return upTo ? { max: Number(upTo[1]), min: 0 } : null;
}

describe("character target parsing", () => {
  it("reads a plain range", () => {
    expect(getCharacterTarget("35-70 characters.")).toEqual({
      max: 70,
      min: 35,
    });
  });

  it("reads a range buried in a longer instruction", () => {
    expect(
      getCharacterTarget(
        "OPTIONAL. Omit when the hero does not need this row. When used: 2-4 items, 28-70 characters each, sourced facts only.",
      ),
    ).toEqual({ max: 70, min: 28 });
  });

  /**
   * The whole reason the unit has to follow the number. Without it this target
   * would report a headline as "12 / 2-4".
   */
  it("does not read an item count as a character length", () => {
    expect(getCharacterTarget("Exactly 3 items. Use sourced facts only.")).toBe(
      null,
    );
    expect(getCharacterTarget("Exactly 5 items, one per line.")).toBe(null);
  });

  it("reads an upper bound with no minimum", () => {
    expect(getCharacterTarget("Keep under 60 characters.")).toEqual({
      max: 60,
      min: 0,
    });
  });

  it("returns null for prose with no length at all", () => {
    expect(
      getCharacterTarget(
        "Use lender-approved language verbatim. Write NEEDS REVIEW when unavailable.",
      ),
    ).toBe(null);
    expect(getCharacterTarget(undefined)).toBe(null);
  });

  it("never inverts a range", () => {
    // A malformed target must produce no counter rather than a negative span.
    expect(getCharacterTarget("70-35 characters.")).toBe(null);
  });

  /**
   * Runs the parser over every target the contract emits. This does not assert
   * a coverage ratio - plenty of fields are lists or legal text with no length
   * - only that nothing parses into a nonsensical range.
   */
  it("produces only sane ranges across the whole contract", () => {
    const sections = [
      { component: "HeroFullscreenSectionV2", mode: "Hero", name: "Fullscreen image hero" },
      { component: "FAQSectionV3", mode: "Utility", name: "FAQ" },
      { component: "ContactSectionV3", mode: "Action", name: "Contact section" },
      { component: "FinancingCalculatorSectionV3", mode: "Utility", name: "Financing calculator" },
      { component: "ContentHorizontalCardCarouselSectionV2", mode: "Scan", name: "Horizontal card carousel" },
    ];

    for (const section of sections) {
      for (const field of getTemplateCopyFieldsForSection(section as never)) {
        const parsed = getCharacterTarget(field.target);
        if (!parsed) continue;

        expect(parsed.max).toBeGreaterThan(parsed.min);
        expect(parsed.max).toBeLessThan(1000);
        expect(parsed.min).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe("field spec threading", () => {
  it("carries purpose and target onto editor fields", async () => {
    const pages = await getContentEditorPages();
    const withSpec = pages.flatMap((page) =>
      page.sections.flatMap((section) =>
        section.fields.filter((field) => field.spec?.target),
      ),
    );

    // Without this the counter and the Target line silently never render.
    expect(withSpec.length).toBeGreaterThan(0);
    expect(withSpec.some((field) => field.spec?.purpose)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";

import staged from "@/content/projects/north-star-hvac/staged-pages.json";

/**
 * `[SAMPLE]` is stand-in copy that deliberately passes validation.
 *
 * `NEEDS REVIEW` blocks an export, which is right for a field nobody has
 * answered - but it also makes the page unexportable, so it cannot be used for
 * copy that stands in while the pipeline itself is being tested. `[SAMPLE]`
 * fills that gap, and passing the gate is the whole point of it.
 *
 * Which is exactly why it has to be visible. A `[SAMPLE]` disclosure on a
 * financing calculator is a well-formed sentence that is not true, and nothing
 * else in the export looks for untrue - only for missing, malformed, or left
 * at a library default. The warning is the only thing standing between a
 * placeholder lender term and a live client site.
 */

type Field = { kind: string; path: string; value: string };
type Page = { pageId: string; fields?: Field[] };

const pages = ((staged as { pages?: Page[] }).pages ?? []) as Page[];

function sampleMarked(page: Page) {
  return (page.fields ?? [])
    .filter(
      (field) =>
        field.kind !== "meta" &&
        !field.path.startsWith("strategy.") &&
        /\[SAMPLE\b/i.test(field.value),
    )
    .map((field) => `${page.pageId}/${field.path}`);
}

describe("sample marker detection", () => {
  it("finds the financing calculator's stand-in lender copy", () => {
    const flagged = pages.flatMap(sampleMarked);

    expect(flagged).toEqual([
      "financing/03-financing-calculator.promotionalLabel",
      "financing/03-financing-calculator.promotionalEligibilityNote",
      "financing/03-financing-calculator.disclosure",
    ]);
  });

  /**
   * The three stand-ins must not also carry NEEDS REVIEW, or they would block
   * the export they were written to unblock.
   */
  it("keeps the stand-ins clear of the blocking marker", () => {
    const financing = pages.find((page) => page.pageId === "financing");
    const flagged = sampleMarked(financing as Page);

    for (const path of flagged) {
      const field = (financing?.fields ?? []).find(
        (candidate) => `${financing?.pageId}/${candidate.path}` === path,
      );

      expect(field?.value).not.toMatch(/\bNEEDS REVIEW\b/i);
    }
  });

  it("matches the marker case-insensitively and only at a word start", () => {
    const page: Page = {
      pageId: "test",
      fields: [
        { kind: "copy", path: "01.a", value: "[sample] lower case" },
        { kind: "copy", path: "01.b", value: "[SAMPLE DISCLOSURE] prefixed" },
        { kind: "copy", path: "01.c", value: "a free sample of our work" },
        { kind: "copy", path: "01.d", value: "[SAMPLED] not the marker" },
      ],
    };

    expect(sampleMarked(page)).toEqual(["test/01.a", "test/01.b"]);
  });

  it("ignores meta and strategy fields", () => {
    const page: Page = {
      pageId: "test",
      fields: [
        { kind: "meta", path: "01.contentDirection", value: "[SAMPLE] brief" },
        { kind: "copy", path: "strategy.pageCopy", value: "[SAMPLE] notes" },
      ],
    };

    expect(sampleMarked(page)).toEqual([]);
  });
});

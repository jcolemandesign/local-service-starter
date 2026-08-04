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
  /**
   * Deliberately not pinned to a field list. An earlier version asserted the
   * three financing stand-ins by path and broke the moment those were replaced
   * with real lender copy - which is the outcome the marker exists to lead to,
   * so a test that fails on success is the wrong test. What has to hold is that
   * any marker still present is reported.
   */
  it("reports every marked field it is given", () => {
    const marked = pages.flatMap(sampleMarked);
    const values = pages.flatMap((page) =>
      (page.fields ?? [])
        .filter(
          (field) =>
            field.kind !== "meta" && /\[SAMPLE\b/i.test(field.value),
        )
        .map((field) => `${page.pageId}/${field.path}`),
    );

    expect(marked.sort()).toEqual(values.sort());
  });

  /**
   * A stand-in must not also carry NEEDS REVIEW, or it would block the export
   * it was written to unblock.
   */
  it("keeps any stand-in clear of the blocking marker", () => {
    for (const page of pages) {
      for (const path of sampleMarked(page)) {
        const field = (page.fields ?? []).find(
          (candidate) => `${page.pageId}/${candidate.path}` === path,
        );

        expect(field?.value).not.toMatch(/\bNEEDS REVIEW\b/i);
      }
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

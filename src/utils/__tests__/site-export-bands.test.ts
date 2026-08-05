import { describe, expect, it } from "vitest";

import { buildSectionJsx, neutralizeBuilderVocabulary } from "@/utils/site-export";

/**
 * The exported page's section markup is assembled as a string, so the compiler
 * cannot see inside it. A wrapper opened and never closed, or a band emitted
 * around the wrong run, type-checks perfectly and fails much later - when the
 * generated site is built, in a directory nobody is watching. These assertions
 * are the only thing standing between that and a broken export.
 */

type ExportSection = Parameters<typeof buildSectionJsx>[0][number];

function section(overrides: Partial<ExportSection> = {}): ExportSection {
  return {
    backgroundImage: "",
    backgroundTreatment: "none",
    cardBorder: "on",
    cardFill: "solid",
    colorRecipe: "default",
    component: "ContentMainIdeaGridSectionV3",
    contentKey: "section01",
    joinAbove: "",
    mode: "Narrative",
    props: {},
    reduceBottomPadding: false,
    reduceTopPadding: false,
    sectionId: "section-1",
    sourcePath: "",
    ...overrides,
  };
}

function countOccurrences(markup: string, needle: string) {
  return markup.split(needle).length - 1;
}

/** Every `<div` must be matched by a `</div>`, or the generated page will not parse. */
function isBalanced(markup: string) {
  return (
    countOccurrences(markup, "<div") === countOccurrences(markup, "</div>")
  );
}

describe("exported section markup", () => {
  it("emits no band wrapper when nothing joins", () => {
    const jsx = buildSectionJsx([
      section({ sectionId: "a", contentKey: "section01" }),
      section({ sectionId: "b", contentKey: "section02" }),
    ]);

    expect(jsx).not.toContain("pagebuilder-section-band");
    expect(countOccurrences(jsx, "pagebuilder-section-frame")).toBe(2);
    expect(jsx).not.toContain('data-pagebuilder-color-recipe="inherit"');
    expect(isBalanced(jsx)).toBe(true);
  });

  it("wraps a joined run and makes its members inert", () => {
    const jsx = buildSectionJsx([
      section({ sectionId: "a", colorRecipe: "ink" }),
      section({ sectionId: "b", contentKey: "section02", joinAbove: "join" }),
      section({ sectionId: "c", contentKey: "section03", joinAbove: "join" }),
    ]);

    expect(countOccurrences(jsx, "pagebuilder-section-band")).toBe(1);
    expect(countOccurrences(jsx, "pagebuilder-section-frame")).toBe(3);
    expect(countOccurrences(jsx, 'data-pagebuilder-color-recipe="inherit"')).toBe(3);
    expect(countOccurrences(jsx, 'data-pagebuilder-background-fill="none"')).toBe(3);
    // The band, not its members, carries the recipe that paints the ground.
    expect(jsx).toContain('data-pagebuilder-color-recipe="ink"');
    expect(isBalanced(jsx)).toBe(true);
  });

  it("keeps the markup balanced across mixed banded and bare runs", () => {
    const jsx = buildSectionJsx([
      section({ sectionId: "a" }),
      section({ sectionId: "b", joinAbove: "join" }),
      section({ sectionId: "c" }),
      section({ sectionId: "d", joinAbove: "join" }),
      section({ sectionId: "e" }),
    ]);

    expect(countOccurrences(jsx, "pagebuilder-section-band")).toBe(2);
    expect(countOccurrences(jsx, "pagebuilder-section-frame")).toBe(5);
    expect(isBalanced(jsx)).toBe(true);
  });

  it("gives each band a key so React can keep the runs apart", () => {
    const jsx = buildSectionJsx([
      section({ sectionId: "a" }),
      section({ sectionId: "b", joinAbove: "join" }),
      section({ sectionId: "c" }),
      section({ sectionId: "d", joinAbove: "join" }),
    ]);

    expect(jsx).toContain('key="band-a"');
    expect(jsx).toContain('key="band-c"');
  });

  it("exports the texture on the band, not on its members", () => {
    const jsx = buildSectionJsx([
      section({ sectionId: "a", backgroundTreatment: "drift" }),
      section({ sectionId: "b", joinAbove: "join" }),
    ]);

    expect(
      countOccurrences(jsx, 'data-pagebuilder-background-treatment="drift"'),
    ).toBe(1);
    expect(
      countOccurrences(jsx, 'data-pagebuilder-background-treatment="none"'),
    ).toBe(2);
  });

  it("exports a ground image as an inline custom property on the band", () => {
    const jsx = buildSectionJsx([
      section({
        sectionId: "a",
        backgroundTreatment: "image",
        backgroundImage: "/images/ground.jpg",
      }),
      section({ sectionId: "b", joinAbove: "join" }),
    ]);

    expect(countOccurrences(jsx, "--section-background-image")).toBe(1);
    expect(jsx).toContain('url(\\"/images/ground.jpg\\")');
    expect(isBalanced(jsx)).toBe(true);
  });

  /**
   * The generated file only imports `CSSProperties` where a style prop needs it,
   * so a page with no ground image must not emit the cast that would demand it.
   */
  it("emits no style prop when there is no ground image", () => {
    const jsx = buildSectionJsx([section({ sectionId: "a" })]);

    expect(jsx).not.toContain("style=");
    expect(jsx).not.toContain("CSSProperties");
  });

  /**
   * The band and paint-surface class names are new vocabulary, and the export
   * only stays anonymous if the rename covers them too.
   */
  it("renames the band vocabulary out of the exported markup", () => {
    const jsx = buildSectionJsx([
      section({ sectionId: "a" }),
      section({ sectionId: "b", joinAbove: "join" }),
    ]);
    const renamed = neutralizeBuilderVocabulary(jsx);

    expect(renamed).not.toContain("pagebuilder");
    expect(renamed).toContain("site-section-band");
    expect(renamed).toContain("site-paint-surface");
  });
});

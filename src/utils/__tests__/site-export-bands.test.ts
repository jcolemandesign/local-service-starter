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
    backgroundConfig: null,
    backgroundImage: "",
    backgroundImageFit: "",
    backgroundImageFocus: "",
    backgroundTreatment: "none",
    borderTone: "dark",
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
   * `ambient` is the only treatment the exporter has to emit a child for -
   * every other one is the data attribute and nothing else. Two things can go
   * wrong silently: the overlay is emitted for a treatment that does not want
   * one (which would import a component the page never needs and fail lint in
   * the generated site), or it is omitted for the one that does (which builds
   * fine and ships a section missing its texture).
   */
  it("emits the overlay child only for the ambient treatment", () => {
    const jsx = buildSectionJsx([
      section({ sectionId: "a", backgroundTreatment: "ambient" }),
    ]);

    expect(countOccurrences(jsx, "<BackgroundTreatmentOverlay")).toBe(1);
    expect(jsx).toContain('treatment="ambient"');
    expect(isBalanced(jsx)).toBe(true);
  });

  it("emits no overlay for treatments that are stylesheet rules", () => {
    const jsx = buildSectionJsx([
      section({ sectionId: "a", backgroundTreatment: "drift" }),
      section({ sectionId: "b", contentKey: "section02", backgroundTreatment: "grain" }),
      section({ sectionId: "c", contentKey: "section03", backgroundTreatment: "none" }),
    ]);

    expect(jsx).not.toContain("BackgroundTreatmentOverlay");
  });

  it("emits the band's overlay once, not once per member", () => {
    const jsx = buildSectionJsx([
      section({ sectionId: "a", backgroundTreatment: "ambient" }),
      section({ sectionId: "b", contentKey: "section02", joinAbove: "join" }),
      section({ sectionId: "c", contentKey: "section03", joinAbove: "join" }),
    ]);

    expect(countOccurrences(jsx, "<BackgroundTreatmentOverlay")).toBe(1);
    // Members are inert, so none of the three frames carries a second set.
    expect(countOccurrences(jsx, 'data-pagebuilder-background-treatment="none"')).toBe(3);
    expect(isBalanced(jsx)).toBe(true);
  });

  /**
   * The framing rides the same style prop as the image and the tuned gradient,
   * and is emitted only where it differs from the stylesheet's own defaults -
   * so an export of pages that framed nothing is byte-identical to what it was
   * before the controls existed.
   */
  it("emits the framing alongside the image", () => {
    const jsx = buildSectionJsx([
      section({
        sectionId: "a",
        backgroundTreatment: "image",
        backgroundImage: "/images/ground.jpg",
        backgroundImageFit: "fit",
        backgroundImageFocus: "62 38",
      }),
    ]);

    expect(jsx).toContain('"--section-background-image-fit": "contain"');
    expect(jsx).toContain('"--section-background-image-position": "62% 38%"');
    expect(jsx).toContain("CSSProperties");
  });

  it("emits no framing when it matches the stylesheet default", () => {
    const jsx = buildSectionJsx([
      section({
        sectionId: "a",
        backgroundTreatment: "image",
        backgroundImage: "/images/ground.jpg",
        backgroundImageFit: "fill",
        backgroundImageFocus: "50 50",
      }),
    ]);

    expect(jsx).toContain("--section-background-image");
    expect(jsx).not.toContain("--section-background-image-fit");
    expect(jsx).not.toContain("--section-background-image-position");
  });

  it("drops a framing value the sanitiser rejects", () => {
    const jsx = buildSectionJsx([
      section({
        sectionId: "a",
        backgroundTreatment: "image",
        backgroundImage: "/images/ground.jpg",
        backgroundImageFit: "retired",
        backgroundImageFocus: '50 50"; background-image: url(evil.png)',
      }),
    ]);

    expect(jsx).not.toContain("evil.png");
    expect(jsx).not.toContain("--section-background-image-position");
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

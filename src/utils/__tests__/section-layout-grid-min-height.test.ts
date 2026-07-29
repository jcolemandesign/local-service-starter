import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * `LayoutGrid` renders `site-grid-frame`, which sets `min-height: 100svh`, and
 * its `minHeight="default"` maps to no class at all. The viewport-height floor
 * is therefore opt-out, not opt-in: a section that simply writes
 * `<LayoutGrid columns={14}>` is a full screen tall no matter how little
 * content it has.
 *
 * Nothing errors. Type checking passes, the render tests pass, and in the
 * builder the result reads as a deliberate composition rather than a mistake -
 * the only way to catch it is to notice the section is taller than its content.
 * It shipped twice before anyone did: ProcessStepsBranchingSectionV3 and
 * ProcessStepsStaggeredSectionV3 both went in full-height.
 *
 * The rule pinned here is not "no section may be full height".
 * HeroSplitFullHeightSectionV3 is supposed to be, and
 * ThankYouConfirmationSectionV3 asks for `tall`. The rule is that the axis has
 * to be *stated* - via the `minHeight` prop or a `section-min-*` class - so a
 * full-height section is always something someone chose, never something a
 * default handed out. That is why there is no allowlist: an intentionally tall
 * section satisfies this test by saying so.
 */

const sectionsDir = path.join(process.cwd(), "src", "components", "sections");
const primitivesDir = path.join(process.cwd(), "src", "components", "primitives");
const globalsCssPath = path.join(process.cwd(), "src", "app", "globals.css");

/**
 * Matches the opening tag only, so a section is judged on what it passes rather
 * than on anything further down the file. `(?!Item)` keeps `LayoutGridItem` out,
 * and the lazy body spans the multi-line tags most sections write.
 */
function layoutGridOpeningTags(source: string) {
  return [...source.matchAll(/<LayoutGrid(?!Item)[\s\S]*?>/g)].map((match) =>
    match[0].replace(/\s+/g, " "),
  );
}

/**
 * Both spellings the codebase uses. Substring rather than a parsed className,
 * because the class arrives as a bare string in most sections and through
 * `cx(...)` in others, and the question here is only whether the axis was
 * mentioned at all.
 */
function declaresMinHeight(tag: string) {
  return tag.includes("minHeight=") || tag.includes("section-min-");
}

function sectionFiles() {
  return readdirSync(sectionsDir).filter((file) => file.endsWith(".tsx"));
}

describe("LayoutGrid min-height", () => {
  const tagsByFile = sectionFiles()
    .map((file) => ({
      file,
      tags: layoutGridOpeningTags(
        readFileSync(path.join(sectionsDir, file), "utf8"),
      ),
    }))
    .filter((entry) => entry.tags.length > 0);

  it("finds the sections that use the grid", () => {
    expect(tagsByFile.length).toBeGreaterThan(15);
  });

  it("states the min-height axis on every grid", () => {
    const silent = tagsByFile
      .flatMap(({ file, tags }) =>
        tags.filter((tag) => !declaresMinHeight(tag)).map(() => file),
      )
      .sort();

    expect(
      silent,
      "these sections leave LayoutGrid on its default min-height, so site-grid-frame makes them 100svh tall regardless of content - add minHeight=\"none\" (or section-min-none) if that was not intended, or state the height you do want",
    ).toEqual([]);
  });

  /**
   * The negative control. Every assertion above is worthless if the default
   * stops being full height - the test would keep passing while guarding
   * nothing. Pin the two halves of the premise so that a change to either one
   * fails here and forces a decision about whether this test still has a job.
   */
  it("still has something to guard against", () => {
    const layoutGridSource = readFileSync(
      path.join(primitivesDir, "LayoutGrid.tsx"),
      "utf8",
    );
    const globalsCss = readFileSync(globalsCssPath, "utf8");
    const siteGridFrameRule = globalsCss.match(
      /\.site-grid-frame\s*\{[^}]*\}/,
    )?.[0];

    expect(
      siteGridFrameRule,
      "the .site-grid-frame rule moved or was renamed - this test's premise needs rechecking",
    ).toBeDefined();
    expect(
      siteGridFrameRule,
      "site-grid-frame no longer sets a min-height, so LayoutGrid's default may be harmless now and this test can go",
    ).toContain("min-height");
    expect(
      layoutGridSource,
      "LayoutGrid no longer applies the site frame by default - recheck whether the default is still full height",
    ).toContain('frame = "site"');
    expect(
      layoutGridSource,
      "LayoutGrid's default minHeight is no longer the empty class - if the default became opt-in, this test can go",
    ).toMatch(/default:\s*""/);
  });
});

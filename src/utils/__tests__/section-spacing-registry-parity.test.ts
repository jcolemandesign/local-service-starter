import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { sectionLibraryV3Registry } from "@/content/section-library-v3";
import {
  getSectionStyleFieldSpecs,
  sectionSupportsSectionSpacing,
  viewportHeightComponents,
} from "@/content/section-style-options";

/**
 * `viewportHeightComponents` decides which sections hide the spacing control,
 * and it is a hand-kept list of a fact the components themselves declare: that
 * their height comes from the viewport rather than their content. Both
 * directions of drift are silent.
 *
 * - listed but content-height -> a section that could be tightened offers no
 *   way to do it
 * - viewport-height but unlisted -> the toggle is back, and moving it cannot
 *   shorten the section, which is the confusion the list exists to remove
 *
 * Pin the set against the source, the same way the card-style registry is.
 */

const sectionsDir = path.join(process.cwd(), "src", "components", "sections");

/** The min-heights that come from the viewport rather than from content. */
const viewportMinHeight =
  /section-min-(screen|sliver|story|sticky)|minHeight="(screen|sliver|story)"/;

function componentFile(component: string) {
  return path.join(sectionsDir, `${component}.tsx`);
}

/** Registry sections that live in a file named after themselves. */
const singleFileComponents = sectionLibraryV3Registry
  .map((entry) => entry.component)
  .filter((component) => existsSync(componentFile(component)));

describe("section spacing registry", () => {
  it("resolves most of the library to its own file", () => {
    expect(singleFileComponents.length).toBeGreaterThan(40);
  });

  it("hides spacing only on sections that pin a viewport height", () => {
    const contentHeight = [...viewportHeightComponents]
      .filter((component) => existsSync(componentFile(component)))
      .filter(
        (component) =>
          !viewportMinHeight.test(readFileSync(componentFile(component), "utf8")),
      )
      .sort();

    expect(
      contentHeight,
      "these sections hide the spacing control but their height comes from their content - remove them from viewportHeightComponents",
    ).toEqual([]);
  });

  it("hides spacing on every library section that pins a viewport height", () => {
    const missing = singleFileComponents
      .filter((component) =>
        viewportMinHeight.test(readFileSync(componentFile(component), "utf8")),
      )
      .filter((component) => !viewportHeightComponents.has(component))
      .sort();

    expect(
      missing,
      "these sections are viewport-height but still offer section spacing, which cannot shorten them - add them to viewportHeightComponents",
    ).toEqual([]);
  });

  it("drops both spacing specs together, and keeps the color recipe", () => {
    const names = (component: string) =>
      getSectionStyleFieldSpecs(component).map((spec) => spec.name);

    for (const component of viewportHeightComponents) {
      expect(names(component), component).not.toContain("reduceTopPadding");
      expect(names(component), component).not.toContain("reduceBottomPadding");
      expect(names(component), component).toContain("colorRecipe");
    }
  });

  it("keeps the control on the compact, content-height heroes", () => {
    for (const component of [
      "HeroCompactSectionV3",
      "HeroCompactServiceSectionV3",
      "SectionHeaderCompactSectionV3",
      "SectionHeaderLargeSectionV3",
    ]) {
      expect(sectionSupportsSectionSpacing(component), component).toBe(true);
      expect(getSectionStyleFieldSpecs(component).map((s) => s.name)).toContain(
        "reduceTopPadding",
      );
    }
  });
});

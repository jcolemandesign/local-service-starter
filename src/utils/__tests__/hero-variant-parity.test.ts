import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { sectionLibraryV3Content } from "@/content/section-library-v3";
import {
  fullImageSplitVariantOptions,
  fullImageSplitVariantValues,
} from "@/content/section-style-options";

/**
 * Every render path has to validate a variant against the same set the control
 * writes it from.
 *
 * This is the "one list per axis" rule from `section-style-options.ts`, and the
 * full-image split hero is where it was broken. Three paths render that hero -
 * the builder canvas, the gallery, and the staged/export frame - and only the
 * canvas checked against `fullImageSplitVariantValues`. The other two checked
 * against `sectionLibraryV3Content.heroSplitFullHeight.variants`, which is the
 * DEMO CONTENT list: four arrangements for the /sections preview to cycle, with
 * neither overlap treatment in it.
 *
 * So a hero saved as `text-7-image-9-overlap-right` rendered its overlap in the
 * builder, and silently fell back to a plain split everywhere else - including
 * in the exported client site. Nothing errored: the validator returned
 * `undefined`, the component applied its own default, and the layout was merely
 * wrong.
 *
 * These assertions are cheap and they are the only thing that would catch the
 * next narrower list being reached for.
 */

const sectionsDir = path.join(process.cwd(), "src", "components", "sections");

function readSection(file: string) {
  return readFileSync(path.join(sectionsDir, file), "utf8");
}

/** The three files that resolve a variant before rendering the hero. */
const renderPaths = [
  "PagebuilderShell.tsx",
  "PagebuilderSection.tsx",
  "PageTemplatePreview.tsx",
];

describe("full-image split hero variant parity", () => {
  it("offers both overlap treatments on the axis", () => {
    // The regression is invisible unless these are actually in the set, so pin
    // them by name rather than trusting the count.
    expect([...fullImageSplitVariantValues]).toContain(
      "text-7-image-9-overlap-right",
    );
    expect([...fullImageSplitVariantValues]).toContain(
      "image-9-overlap-left-text-7",
    );
  });

  it("is a strict superset of the library's demo arrangements", () => {
    // The demo list is a legitimate thing - it drives the preview - it is just
    // not the axis. If it ever grows a value the axis lacks, the control could
    // not produce it and the preview would show something unreachable.
    const demo = sectionLibraryV3Content.heroSplitFullHeight.variants.map(
      (option) => option.variant as string,
    );

    for (const variant of demo) {
      expect(
        [...fullImageSplitVariantValues],
        `the library demo offers ${variant}, which the axis does not`,
      ).toContain(variant);
    }

    expect(
      fullImageSplitVariantValues.size,
      "the axis should be wider than the demo list - if these are equal, the overlap treatments have been lost",
    ).toBeGreaterThan(demo.length);
  });

  /**
   * Source-level, because each path resolves the variant in a module-private
   * helper. Asserting they name the shared set is the only way to catch one
   * quietly reaching for the demo list again.
   */
  it("validates against the shared set in every render path", () => {
    for (const file of renderPaths) {
      const source = readSection(file);

      expect(
        source,
        `${file} should validate the full-image split hero against fullImageSplitVariantValues`,
      ).toContain("fullImageSplitVariantValues");

      expect(
        source.includes("heroSplitFullHeight.variants"),
        `${file} validates the hero variant against the library's demo content list, which omits the overlap treatments`,
      ).toBe(false);
    }
  });

  it("keeps a config entry for every offered variant", () => {
    // The other half: a value the axis offers but the component has no config
    // for would fall through to its default just as silently.
    const hero = readSection("HeroSplitFullHeightSectionV3.tsx");

    for (const option of fullImageSplitVariantOptions) {
      expect(
        hero,
        `HeroSplitFullHeightSectionV3 has no variantConfig entry for ${option.value}`,
      ).toContain(option.value);
    }
  });
});

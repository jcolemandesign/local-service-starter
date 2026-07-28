import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { sectionLibraryV3Registry } from "@/content/section-library-v3";
import {
  cardLinkComponents,
  cardStyleComponents,
} from "@/content/section-style-options";
import { getTemplateCopyFieldsForSection } from "@/utils/template-copy-contract";

/**
 * `cardStyleComponents` decides whether the builder offers the card fill and
 * border controls. Nothing checks it against the components that actually read
 * those props, and both directions of drift fail silently:
 *
 * - listed but not reading them -> the editor shows two controls that do
 *   nothing, which is indistinguishable from an editor who never touched them
 * - reading them but not listed -> the section is stuck on its defaults with no
 *   way to reach the control, which is how ContentMainIdeaGridSectionV3 shipped
 *
 * Neither throws, and export validation cannot see either, so pin the set
 * against the source instead.
 */

const sectionsDir = path.join(process.cwd(), "src", "components", "sections");

/**
 * One file can export several sections (the FAQ/CTA/contact/footer bundle
 * exports eight), so attribute the props to the component whose own parameter
 * destructuring reads them rather than to every export in the file.
 */
function componentsReadingCardStyleProps() {
  const reading = new Set<string>();

  for (const file of readdirSync(sectionsDir).filter((f) => f.endsWith(".tsx"))) {
    const source = readFileSync(path.join(sectionsDir, file), "utf8");

    for (const match of source.matchAll(/export function (\w+)\(\{([\s\S]*?)\}:/g)) {
      const [, name, params] = match;

      if (/^\s*card(Fill|Border)\b/m.test(params)) {
        reading.add(name);
      }
    }
  }

  return reading;
}

describe("card style control registry", () => {
  const reading = componentsReadingCardStyleProps();
  const registryComponents = new Set<string>(
    sectionLibraryV3Registry.map((entry) => entry.component),
  );

  it("finds the sections that read the props", () => {
    expect(reading.size).toBeGreaterThan(0);
  });

  it("offers the control on every library section that reads the props", () => {
    const missing = [...reading]
      .filter((component) => registryComponents.has(component))
      .filter((component) => !cardStyleComponents.has(component))
      .sort();

    expect(
      missing,
      "these sections read cardFill/cardBorder but the builder never offers the control - add them to cardStyleComponents",
    ).toEqual([]);
  });

  it("offers the control only where a section reads it", () => {
    const dead = [...cardStyleComponents].filter((c) => !reading.has(c)).sort();

    expect(
      dead,
      "these sections are offered the card controls but read neither prop - the toggles render and do nothing",
    ).toEqual([]);
  });
});

/**
 * The card-links toggle is only worth having if it reaches both ends: the
 * section has to render differently, and the copy spec has to ask for something
 * different. If the spec does not move, the toggle silently leaves the page
 * agent writing destinations for cards that no longer link anywhere - the exact
 * ambiguity the toggle exists to remove.
 */
describe("card links toggle", () => {
  const reading = componentsReadingCardStyleProps();

  it("is offered only where the section reads the prop", () => {
    const notReading = [...cardLinkComponents]
      .filter((component) => !reading.has(component))
      .sort();

    expect(
      notReading,
      "these sections offer the card-links toggle but never read cardLinks",
    ).toEqual([]);
  });

  it("changes the copy spec in both directions for every section", () => {
    for (const component of cardLinkComponents) {
      const base = { component, mode: "Scan", name: component };
      const on = getTemplateCopyFieldsForSection({ ...base, cardLinks: "on" });
      const off = getTemplateCopyFieldsForSection({ ...base, cardLinks: "off" });

      expect(
        JSON.stringify(on) === JSON.stringify(off),
        `${component}: the copy spec is identical with links on and off, so the toggle tells the page agent nothing`,
      ).toBe(false);

      expect(
        off.some((field) => field.name === "linkLabel"),
        `${component}: still requests linkLabel with links off`,
      ).toBe(false);
    }
  });

  it("defaults to links on when the axis is unset", () => {
    for (const component of cardLinkComponents) {
      const base = { component, mode: "Scan", name: component };

      expect(
        JSON.stringify(getTemplateCopyFieldsForSection(base)),
        `${component}: an unset axis must render and spec exactly as links-on`,
      ).toBe(
        JSON.stringify(getTemplateCopyFieldsForSection({ ...base, cardLinks: "on" })),
      );
    }
  });
});

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
function componentsReadingProp(prop: RegExp) {
  const reading = new Set<string>();

  for (const file of readdirSync(sectionsDir).filter((f) => f.endsWith(".tsx"))) {
    const source = readFileSync(path.join(sectionsDir, file), "utf8");

    for (const match of source.matchAll(/export function (\w+)\(\{([\s\S]*?)\}:/g)) {
      const [, name, params] = match;

      if (prop.test(params)) {
        reading.add(name);
      }
    }
  }

  return reading;
}

function componentsReadingCardStyleProps() {
  return componentsReadingProp(/^\s*card(Fill|Border)\b/m);
}

/**
 * Card links is its own axis and has to be detected as one.
 *
 * This used to reuse the card-style scan, which passed only because every
 * card-links section happened to be a card-style section too. The first one
 * that is not - a section header, which has links but no card - then read as
 * "offers the toggle but never reads it" while reading `cardLinks` perfectly
 * well. Checking the prop the assertion is about is the whole fix.
 */
function componentsReadingCardLinksProp() {
  return componentsReadingProp(/^\s*cardLinks\b/m);
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

  it("keeps both comparison-table card surfaces configurable", () => {
    const tableComponents = [
      "DecisionQuestionTableSectionV3",
      "DecisionQuestionTableFourSectionV3",
    ];

    for (const component of tableComponents) {
      expect(cardStyleComponents.has(component), component).toBe(true);

      const source = readFileSync(
        path.join(sectionsDir, `${component}.tsx`),
        "utf8",
      );

      expect(source, `${component}: transparent fill is not rendered`).toContain(
        'cardFill === "none"',
      );
      expect(source, `${component}: border-off is not rendered`).toContain(
        'cardBorder === "off"',
      );
      expect(
        source,
        `${component}: internal border-off dividers do not inherit the section background`,
      ).toContain('"border-bg-page"');
    }
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
  const reading = componentsReadingCardLinksProp();

  /**
   * `getTemplateCopyFieldsForSection` resolves on component *and* mode *and*
   * name, and several broad branches match on mode alone - `mode === "scan"`
   * catches anything before the component-specific branches below it are
   * reached. A synthetic `{ mode: "Scan", name: component }` therefore tests a
   * lookup no real section performs, and silently passed the toggle assertions
   * against a catch-all spec. Drive the real identity instead: the library's
   * collection title is the semantic mode, and its label is the section name.
   */
  function specSectionFor(component: string) {
    const entry = sectionLibraryV3Registry.find(
      (candidate) => candidate.component === component,
    );

    if (!entry) {
      throw new Error(`${component} is not in the section library registry`);
    }

    return { component, mode: entry.family, name: entry.label };
  }

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
      const base = specSectionFor(component);
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
      const base = specSectionFor(component);

      expect(
        JSON.stringify(getTemplateCopyFieldsForSection(base)),
        `${component}: an unset axis must render and spec exactly as links-on`,
      ).toBe(
        JSON.stringify(getTemplateCopyFieldsForSection({ ...base, cardLinks: "on" })),
      );
    }
  });
});

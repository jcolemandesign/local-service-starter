import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  pickSectionToggleFields,
  sectionToggleFieldNames,
} from "@/content/section-style-options";

/**
 * A section's settings are copied at four hops between the builder and the
 * exported site:
 *
 *   working stack -> saved pagebuilder option   (serializeWorkingSection)
 *   working stack -> promoted template          (the /api/page-templates POST)
 *   request       -> stored template            (normalizeSection)
 *   staged page   -> rendered/exported section  (toPreviewSection)
 *
 * Every hop is an allowlist, and a missing name at any one of them is silent -
 * the control works in pagebuilder, the value saves, and the setting is just
 * gone by the time the site is generated. That is not hypothetical: band
 * membership (`joinAbove`) and ground texture (`backgroundTreatment`) were
 * dropped at promotion *and* at the staged-page mapping, so a banded template
 * exported with every band broken into separate painted sections.
 *
 * The fix was to give all four hops one shared name list. These tests pin that
 * arrangement, because nothing else can see a hop quietly growing its own list
 * again.
 */

const sourceRoot = path.join(process.cwd(), "src");

function readSource(...segments: string[]) {
  return readFileSync(path.join(sourceRoot, ...segments), "utf8");
}

describe("section toggle transport", () => {
  it("carries every axis the builder can set", () => {
    // Named rather than derived: deriving the expectation from the same list
    // the code uses would pass no matter what the list said. Anything added to
    // the builder belongs here too, and this failing is the reminder.
    const expected = [
      "align",
      "animation",
      "backgroundConfig",
      "backgroundFill",
      "backgroundImageFit",
      "backgroundImageFocus",
      "backgroundTreatment",
      "borderIntensity",
      "borderSwatch",
      "borderTone",
      "cardBorder",
      "cardFill",
      "cardIntensity",
      "cardLinks",
      "cardMedia",
      "cardSwatch",
      "colorRecipe",
      "headingSize",
      "headlineWrap",
      "icons",
      "joinAbove",
      "navLogoLayout",
      "ratio",
      "specialCta",
      "variant",
    ];

    expect([...sectionToggleFieldNames].sort()).toEqual(expected.sort());
  });

  it("keeps the two axes that bands depend on", () => {
    // Called out on their own because these are the ones that were lost, and
    // the failure they cause - a band silently splitting apart - looks like a
    // rendering bug rather than a dropped field.
    expect(sectionToggleFieldNames).toContain("joinAbove");
    expect(sectionToggleFieldNames).toContain("backgroundTreatment");
  });

  it("picks up every axis a section is carrying", () => {
    const section = Object.fromEntries(
      sectionToggleFieldNames.map((name) => [name, `${name}-value`]),
    );

    expect(pickSectionToggleFields(section)).toEqual(section);
  });

  it("leaves unset axes out rather than writing them as undefined", () => {
    // Spreading the result must not blank a value the target already holds,
    // and a promoted template should not gain keys for axes never used.
    const picked = pickSectionToggleFields({ joinAbove: "join" });

    expect(Object.keys(picked)).toEqual(["joinAbove"]);
    expect("backgroundTreatment" in picked).toBe(false);
  });

  it("ignores anything that is not a toggle axis", () => {
    const picked = pickSectionToggleFields({
      component: "TestimonialsSectionV3",
      instruction: "Something",
      joinAbove: "join",
    });

    expect(picked).toEqual({ joinAbove: "join" });
  });

  /**
   * Source-level, because the remaining hops are not exported: they are
   * module-private helpers and one inline request body. Asserting they read
   * the shared list is the only way to catch a hand-written list growing back
   * in place of it.
   */
  it("routes every hop through the shared list", () => {
    const hops = [
      {
        file: ["components", "sections", "PagebuilderShell.tsx"],
        label: "the saved option and promoted template payloads",
        occurrences: 2,
      },
      {
        file: ["components", "sections", "StagedPageCanvas.tsx"],
        label: "the staged page's preview mapping",
        occurrences: 1,
      },
    ];

    for (const hop of hops) {
      const source = readSource(...hop.file);
      const matches = source.match(/pickSectionToggleFields\(/g) ?? [];

      expect(
        matches.length,
        `${hop.label} should build its section from pickSectionToggleFields`,
      ).toBe(hop.occurrences);
    }

    const route = readSource("app", "api", "page-templates", "route.ts");

    expect(
      route,
      "the template route should normalise from the shared name list",
    ).toContain("sectionToggleFieldNames");
  });

  /**
   * THE FOURTH HOP, which was not on this list and had gone quietly stale.
   *
   * Pagebuilder copies one navigation onto every page, and that copier named
   * seven toggles by hand. Every axis added after it was written reached the
   * source page and stopped: the nav on page one took the setting and its
   * copies did not, which reads as the other pages being stale rather than as
   * a field nothing copied.
   *
   * Asserted on the source because the copier is module-private, and asserted
   * as an absence too - a re-added hand-written name is what regresses this.
   */
  it("copies the shared navigation from the shared list", () => {
    const shell = readSource("components", "sections", "PagebuilderShell.tsx");
    const copier = shell.slice(
      shell.indexOf("function copySharedNavigationSection"),
      shell.indexOf("function findSharedNavigationSource"),
    );

    expect(copier).toContain("sectionToggleFieldNames");

    for (const name of sectionToggleFieldNames) {
      expect(
        copier,
        `the shared navigation copier names ${name} by hand instead of reading the list`,
      ).not.toContain(`${name}: sharedNavigation.`);
    }
  });

  it("does not let the template route drop an axis it accepts", () => {
    const route = readSource("app", "api", "page-templates", "route.ts");
    // The original bug in this file: `cardLinks`, `icons` and `headlineWrap`
    // were declared on the request type and never copied into the stored
    // section, so they type-checked and vanished.
    const stored = route.slice(route.indexOf("function normalizeToggleFields"));

    expect(stored).toContain("sectionToggleFieldNames");
    expect(stored).toContain("backgroundConfig");
  });
});

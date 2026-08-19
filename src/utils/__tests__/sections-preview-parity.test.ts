import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { sectionLibraryV3Registry } from "@/content/section-library-v3";

/**
 * THE FOURTH SURFACE, AND THE ONLY ONE THAT HAD NO TEST.
 *
 * `pagebuilder-catalog-parity.test.ts` pins the section library against the two
 * pagebuilder catalogs and the two renderer switches. `/sections` - step 4 of
 * the add-section checklist - was the one registration surface nothing checked,
 * so a section could be in the library, offered in pagebuilder, renderable on a
 * staged page, and simply absent from the screen whose entire job is showing
 * every section.
 *
 * That failure is quiet in the worst way. Nothing errors and nothing looks
 * broken: the page renders every section it knows about, and the missing one is
 * only missing to someone who already knew to look for it.
 *
 * An audit found no drift when this was written - all 98 registered sections
 * reach every surface. This exists so that stays true, because "in sync today"
 * is what every one of these lists was before it drifted.
 */

const previewPage = readFileSync(
  path.join(process.cwd(), "src", "app", "sections", "page.tsx"),
  "utf8",
).replace(/\r\n?/g, "\n");

/**
 * TWO WAYS A SECTION CAN APPEAR, and both are legitimate.
 *
 * Most sections are entries in a slug-keyed map. Site chrome and the sections
 * that frame the page - nav, footer, the FAQ and CTA blocks it closes with -
 * are rendered directly in the layout instead, because the page uses them as
 * itself rather than as specimens. Requiring a map entry for those would force
 * six sections to be rendered twice to satisfy a test.
 */
const mappedSlugs = new Set(
  [...previewPage.matchAll(/^\s*"([a-z0-9-]+)":\s*\(/gm)].map((match) => match[1]),
);

const renderedComponents = new Set(
  [...previewPage.matchAll(/<(\w+)[\s/>]/g)].map((match) => match[1]),
);

/**
 * THE SIX RENDERED DIRECTLY, AS A CURATED LIST RATHER THAN A RULE.
 *
 * These frame the page instead of being specimens on it, so they appear in the
 * layout rather than in the map. The list is explicit and checked in both
 * directions, and the first draft of this test proves why it has to be.
 *
 * That draft accepted "the component is rendered somewhere in the file" as the
 * escape hatch. It looked reasonable and was nearly vacuous: every map entry
 * also renders its own component, so every section satisfied the fallback and
 * the map could have been emptied entirely without failing. A negative control -
 * renaming one slug key - passed. A blanket rule cannot tell "framed the page"
 * from "is in the map", because the evidence is identical.
 */
const directlyRenderedSlugs = new Map([
  ["info-strip-v3", "the strip under the nav, part of the page's own chrome"],
  ["faq-v3", "the page closes with a real FAQ rather than a specimen of one"],
  ["footer-v3", "site chrome; the page uses it as its own footer"],
  ["cta-v3", "the page's own closing CTA"],
  ["cta-muted-v3", "the muted CTA, rendered in place beside its sibling"],
  ["contact-v3", "the page's own contact block"],
]);

/** The slug is what the registry and the map agree on. The component name is
 *  not: several sections are previewed through a `XxxSectionLibraryDemo`
 *  wrapper that supplies stand-in imagery, and the wrapper's name does not
 *  always contain the wrapped section's - `hero-split-full-height-v3` is
 *  previewed by `HeroSplitFullImageSectionLibraryDemo`. */
function isPreviewed(slug: string) {
  return mappedSlugs.has(slug) || directlyRenderedSlugs.has(slug);
}

describe("sections preview parity", () => {
  it("parses the preview page", () => {
    // Guards the two regexes above: if either stops matching, every assertion
    // below turns into a comparison of empty sets and goes on passing.
    expect(
      mappedSlugs.size,
      "no slug-keyed entries were parsed out of src/app/sections/page.tsx, so this test is asserting nothing",
    ).toBeGreaterThan(40);
    expect(
      renderedComponents.size,
      "no rendered components were parsed out of src/app/sections/page.tsx, so the direct-render escape hatch is unverifiable",
    ).toBeGreaterThan(10);
  });

  it("previews every section the library offers", () => {
    const missing = sectionLibraryV3Registry
      .filter((entry) => !entry.hidden)
      .filter((entry) => !isPreviewed(entry.slug))
      .map((entry) => `${entry.slug} (${entry.component})`)
      .sort();

    expect(
      missing,
      "these sections are in the library but /sections never shows them - add an entry to the slug-keyed map in src/app/sections/page.tsx, or render the component directly if it frames the page rather than being a specimen",
    ).toEqual([]);
  });

  /**
   * A hidden section is withheld from pagebuilder, not from the preview.
   *
   * Hiding is how a section stays buildable and reviewable while being kept off
   * the builder's menu, so the screen for looking at sections is precisely where
   * it should still appear. If a hidden section were dropped from here too there
   * would be nowhere left to look at it, and "hidden" would quietly mean
   * "deleted but still compiled".
   */
  it("keeps hidden sections visible on the preview screen", () => {
    const dropped = sectionLibraryV3Registry
      .filter((entry) => entry.hidden)
      .filter((entry) => !isPreviewed(entry.slug))
      .map((entry) => entry.slug)
      .sort();

    expect(
      dropped,
      "these sections are hidden from pagebuilder AND absent from /sections, so there is nowhere left to look at them",
    ).toEqual([]);
  });

  it("previews nothing the library does not define", () => {
    const known = new Set<string>(
      sectionLibraryV3Registry.map((entry) => entry.slug),
    );
    const unknown = [...mappedSlugs].filter((slug) => !known.has(slug)).sort();

    expect(
      unknown,
      "these slugs are previewed but no longer exist in the section library - the entries are stale and render a section nothing can place",
    ).toEqual([]);
  });
  /**
   * The curated list is real exceptions only, checked three ways.
   *
   * A stale entry silently re-opens the hole the list exists to close: a
   * section named here but no longer rendered is one nothing shows, excused by
   * a list nobody re-read. And an entry that has since gained a map key means
   * the list should shrink rather than carry a section twice.
   */
  it("keeps the directly-rendered list honest", () => {
    const known = new Set<string>(
      sectionLibraryV3Registry.map((entry) => entry.slug),
    );

    for (const [slug] of directlyRenderedSlugs) {
      expect(
        known,
        `${slug} is listed as rendered directly but is not in the section library - the entry is stale`,
      ).toContain(slug);

      const entry = sectionLibraryV3Registry.find((item) => item.slug === slug);

      expect(
        renderedComponents,
        `${slug} is listed as rendered directly but <${entry?.component}> never appears in the preview page, so nothing shows it`,
      ).toContain(entry?.component);
      expect(
        mappedSlugs,
        `${slug} is in the map AND listed as rendered directly - it can only be one, and the list should shrink`,
      ).not.toContain(slug);
    }
  });
});

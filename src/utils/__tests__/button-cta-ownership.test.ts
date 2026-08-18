import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { sectionLibraryV3Registry } from "@/content/section-library-v3";
import { specialCtaComponents } from "@/content/section-style-options";

/**
 * A SECTION DOES NOT DECIDE WHAT ITS BUTTONS LOOK LIKE.
 *
 * It renders a primary or a secondary CTA and stops there. Which style either of
 * those is, is a Style Guide assignment; whether a section's primary is the
 * SPECIAL one is the frame's `data-pagebuilder-special-cta` attribute. Same
 * split as the motion suites and the colour recipes, and here for the same
 * reason - one section used to hard-code its own button treatment, and nothing
 * could reach it.
 *
 * The failure this prevents is silent in both directions:
 *
 *   - a section renders a primary CTA and is NOT in `specialCtaComponents`, so
 *     no editor can ever switch it to the special and nothing says why
 *   - a section is in the set and renders no primary CTA, so the control appears
 *     and paints nothing - the failure every membership set in
 *     `section-style-options.ts` exists to prevent
 *
 * So this pins the set against the markup both ways round.
 */

const sectionsDir = path.join(process.cwd(), "src", "components", "sections");

/**
 * Source with its comments removed, because these scans read markup as text.
 *
 * The same trap `animation-marker-ownership` and `color-css-agreement` both
 * document: a comment explaining why a section does NOT do something names the
 * thing it does not do, and a regex counts that as doing it. Block comments
 * cover JSX's braced form; line comments are stripped only where `//` opens the
 * line, so a `https://` inside a string survives intact.
 */
function withoutComments(source: string) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^[^\S\n]*\/\/.*$/gm, "");
}

const sources = new Map(
  readdirSync(sectionsDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => [
      file.replace(/\.tsx$/, ""),
      withoutComments(readFileSync(path.join(sectionsDir, file), "utf8")),
    ]),
);

const registeredComponents = new Set<string>(
  sectionLibraryV3Registry.map((entry) => entry.component),
);

/**
 * The two components that ARE the CTA vocabulary.
 *
 * One renders an anchor, the other a `<button>` that opens the request modal,
 * and both render the same anatomy. A section's primary CTA is one of these
 * without `variant="secondary"` - which makes membership a fact about the
 * markup rather than a judgement about the design.
 */
// No `s` flag - the project targets below es2018, and it buys nothing here:
// `[^>]` already matches newlines, which is what a multi-line opening tag needs.
const primaryCtaTag = /<(?:Button|RequestServiceButton)\b[^>]*>/g;

function rendersPrimaryCta(source: string) {
  return (source.match(primaryCtaTag) ?? []).some(
    (tag) => !tag.includes('variant="secondary"'),
  );
}

/**
 * Files in the sections directory that the section library does not register.
 *
 * Both are Style Guide surfaces rather than page sections: one is the panel that
 * authors the assignment, the other a standalone showcase of it that appears in
 * no library, no builder list and no preview route. They are the only files
 * allowed to write a slot class by hand, because showing the special outside a
 * section frame is the one thing the frame attribute cannot do.
 *
 * Named and asserted rather than pattern-matched, so this cannot quietly become
 * the place a real section hides.
 */
const styleGuideSurfaces = new Set([
  "ButtonStylesSectionV2",
  "StyleGuideButtonControls",
]);

describe("button CTA ownership", () => {
  /**
   * Every registered section with a primary CTA is offered the switch.
   *
   * Registry-driven on purpose: `sectionLibraryV3Registry` is what pagebuilder
   * offers, so a section can only reach an editor through it.
   */
  it("offers the special CTA to every registered section that has one", () => {
    const missing = [...registeredComponents]
      .filter(
        (component) =>
          rendersPrimaryCta(sources.get(component) ?? "") &&
          !specialCtaComponents.has(component),
      )
      .sort();

    expect(
      missing,
      "these render a primary CTA but are absent from `specialCtaComponents`, so no editor can switch them to the special style - add them to the set",
    ).toEqual([]);
  });

  /** The other direction: nothing in the set is without a primary CTA. */
  it("offers it to nothing that has no primary CTA", () => {
    const empty = [...specialCtaComponents]
      .filter((component) => !rendersPrimaryCta(sources.get(component) ?? ""))
      .sort();

    expect(
      empty,
      "these are in `specialCtaComponents` but render no primary CTA, so the control appears and paints nothing",
    ).toEqual([]);
  });

  /** And the set names sections the library actually has - a renamed or deleted
   *  component leaves a stale entry that reads as coverage and provides none. */
  it("names only registered sections", () => {
    const unknown = [...specialCtaComponents]
      .filter((component) => !registeredComponents.has(component))
      .sort();

    expect(unknown).toEqual([]);
  });

  /**
   * NO SECTION MAY SET A BUTTON TOKEN.
   *
   * The exact counterpart of `animation-marker-ownership`'s rule that no section
   * sets an `--anim-*` token inline, and it exists for the same reason: a token
   * set in a section is invisible from the stylesheet, so no style the Style
   * Guide assigns could ever move that button again.
   */
  it("lets no section set a --btn-* token", () => {
    const offenders = [...sources]
      .filter(([, source]) => /--btn-[\w-]+\s*:/.test(source))
      .map(([component]) => component)
      .sort();

    expect(
      offenders,
      "these set a button token themselves, which the Style Guide cannot reach or override - let the assigned style answer it",
    ).toEqual([]);
  });

  /**
   * NO SECTION MAY NAME A SLOT CLASS.
   *
   * `button-cta-primary` and `button-cta-secondary` come from the `Button`
   * primitive's `variant`; `button-cta-special` comes from the frame attribute.
   * A section writing one by hand is a section choosing a button style, which is
   * the thing this axis exists to prevent - and `button-cta-special` in
   * particular would pin a section to the special whatever the builder said.
   */
  it("lets no section name a slot class", () => {
    const offenders = [...sources]
      .filter(
        ([component, source]) =>
          !styleGuideSurfaces.has(component) &&
          /button-cta-(?:primary|secondary|special)/.test(source),
      )
      .map(([component]) => component)
      .sort();

    expect(
      offenders,
      "these write a button slot class by hand - use `variant` on the primitive, and let the frame attribute deliver the special",
    ).toEqual([]);
  });

  /** The exception list is kept honest: both named files must still exist and
   *  must still be unregistered, or the exemption is covering something else. */
  it("keeps the style guide exceptions honest", () => {
    for (const component of styleGuideSurfaces) {
      expect(sources.has(component), `${component} no longer exists`).toBe(true);
      expect(
        registeredComponents.has(component),
        `${component} is a registered section now, so it may not write a slot class by hand`,
      ).toBe(false);
    }
  });

  /**
   * The retired treatments stay retired.
   *
   * `Button` used to carry a `treatment` prop with three special treatments, and
   * exactly one section hard-coded one. A style is an assignment now, not a
   * component you can import, so an import of any of these is a section reaching
   * for a button style again.
   *
   * MATCHED BY VALUE, NOT BY THE PROP NAME. A bare `treatment=` also catches the
   * BACKGROUND treatment axis, which is a live, unrelated prop of the same name
   * on `BackgroundTreatmentOverlay` - the first version of this check flagged
   * the two frame owners for using it correctly.
   */
  it("has no section importing a retired treatment", () => {
    const retired =
      /\b(?:ExpandingArrowButton|WrappingArrowButton|TextLiftButton)\b|treatment="(?:expanding-arrow|wrapping-arrow|text-lift)"/;
    const offenders = [...sources]
      .filter(([, source]) => retired.test(source))
      .map(([component]) => component)
      .sort();

    expect(
      offenders,
      "the treatment components are retired - a button's style is a Style Guide assignment",
    ).toEqual([]);
  });

  /**
   * Both frame owners emit the attribute.
   *
   * The builder canvas and the staged/export frame are two separate
   * implementations of the same frame, and an axis added to one and not the
   * other works in the builder and vanishes on the staged page - which is how
   * band membership and ground textures were lost before.
   */
  it.each([
    ["src/components/sections/PagebuilderShell.tsx", "the builder canvas"],
    ["src/components/sections/PageTemplatePreview.tsx", "the staged frame"],
    ["src/utils/site-export.ts", "the export"],
  ])("has %s emit the special CTA attribute", (file) => {
    const source = readFileSync(path.join(process.cwd(), file), "utf8");

    expect(source).toContain("data-pagebuilder-special-cta");
  });
});

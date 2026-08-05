import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Colour belongs to the recipe tables in `globals.css`, and to nowhere else.
 *
 * Sections used to carry a per-recipe class map each - eighteen copies of the
 * same tables, which drifted. One of them painted the dark recipe's FAQ section
 * `bg-service-surface` while setting its headings to `text-white`, so the whole
 * section rendered white on near-white and nothing caught it: every class was
 * real, every type checked, and the section only looked wrong on one recipe.
 *
 * These assertions are what stops that coming back. A section that needs a
 * colour names a semantic token and lets the recipe decide; if a section starts
 * branching on `colorRecipe` again, or hardcodes a literal white, this fails.
 */

const sectionsDirectory = path.join(process.cwd(), "src", "components", "sections");

const sectionFiles = readdirSync(sectionsDirectory)
  .filter((file) => file.endsWith(".tsx"))
  // The builder's own chrome legitimately reads the recipe: it renders the
  // picker, and paints the canvas frame that carries the recipe attribute.
  .filter((file) => !file.startsWith("Pagebuilder"))
  .filter((file) => !file.startsWith("StyleGuide"))
  .filter((file) => file !== "PageTemplatePreview.tsx");

function read(file: string) {
  return readFileSync(path.join(sectionsDirectory, file), "utf8");
}

describe("sections do not own colour", () => {
  it("finds the section files it is meant to be checking", () => {
    expect(sectionFiles.length).toBeGreaterThan(40);
  });

  it("has no section branching on the colour recipe", () => {
    const offenders = sectionFiles.filter((file) => {
      const source = read(file);

      return (
        /colorRecipe\s*===/.test(source) || /\[colorRecipe\]/.test(source)
      );
    });

    expect(offenders).toEqual([]);
  });

  /*
   * There is deliberately no assertion here that sections never write
   * `text-white`.
   *
   * It was the obvious third guard and it is wrong: the library uses a literal
   * white in plenty of places that have nothing to do with recipes - a label
   * over a photograph, a button whose fill is the accent and whose text has to
   * clear it. Roughly sixty files trip it. Asserting it would fail on day one
   * and teach the next person to weaken the whole file. What made the FAQ bug
   * possible was a section *choosing per recipe*, and that is what the
   * assertions above actually pin.
   */

  /**
   * The card-text correction must key on the card's fill, not on its tag.
   *
   * Keyed on `article` it matched things that are not cards - the FAQ accordion
   * wraps each question in a bare `<article>` - and pulled dark text onto the
   * dark ground. Paired with a `shadow-service` requirement it then missed real
   * cards that carry no shadow, so the ZIP lookup's light panel kept the
   * section's light text. Both failures look identical from the code: legal
   * classes, passing types, invisible text on exactly one recipe.
   */
  it("corrects card text by fill rather than by tag or shadow", () => {
    const css = readFileSync(
      path.join(process.cwd(), "src", "app", "globals.css"),
      "utf8",
    );

    // Each selector runs from the recipe attribute to the rule's opening brace.
    //
    // Rules pinned to one named component are exempt: they are written against
    // markup they can see, so naming a tag there is a fact rather than a guess.
    // It is the generic rules - the ones that have to hold for all ninety-odd
    // sections - that cannot afford to assume a shape.
    const selectors = Array.from(
      css.matchAll(
        /\.pagebuilder-paint-surface\[data-pagebuilder-color-recipe[^{]*?card-fill="solid"\][^{]*\{/g,
      ),
      (match) => match[0],
    ).filter((selector) => !selector.includes("data-pagebuilder-section-component"));

    expect(selectors.length).toBeGreaterThan(0);

    for (const selector of selectors) {
      expect(selector).not.toMatch(/\barticle\b/);
      expect(selector).not.toContain("shadow-service");
      // The ground token would drag ground-coloured elements in with the cards.
      expect(selector).not.toContain("bg-bg-page");
      expect(selector).toContain("bg-service-surface");
    }
  });

  /** The accent-ink pair only ever existed to patch the accent recipe. */
  it("has no section reaching for the accent contrast tokens", () => {
    const offenders = sectionFiles.filter((file) =>
      /--live-accent-(?:ink|muted-text)/.test(read(file)),
    );

    expect(offenders).toEqual([]);
  });
});

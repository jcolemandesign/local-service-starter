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
  .filter((file) => file !== "PageTemplatePreview.tsx")
  // Builder and dev chrome that happens to live in the sections folder. These
  // render the tooling around a page rather than any part of a page, so no
  // colour recipe ever wraps them and a fixed fill is simply a fixed fill.
  .filter((file) => !file.startsWith("StagedPage"))
  .filter(
    (file) =>
      ![
        "HomeIndexMenu.tsx",
        "PromptLibrarySection.tsx",
        "SiteExportControls.tsx",
        "TemplateLibrarySection.tsx",
      ].includes(file),
  );

function read(file: string) {
  return readFileSync(path.join(sectionsDirectory, file), "utf8");
}

/**
 * Every component a colour recipe can wrap.
 *
 * Broader than the sections folder because a recipe paints a subtree, not a
 * file location: a modal trigger in `request-service/` or a field in `forms/`
 * renders inside a section and inherits its recipe just the same.
 *
 * `legal/` is excluded because it paints its own page ground rather than
 * sitting in one, and the builder chrome below renders the tooling around a
 * page rather than any part of a page.
 */
const componentsDirectory = path.join(process.cwd(), "src", "components");

const chromePattern =
  /Pagebuilder|StyleGuide|PageTemplatePreview|StagedPage|HomeIndexMenu|PromptLibrary|SiteExportControls|TemplateLibrary|[/\\]legal[/\\]/;

function walkTsx(directory: string, found: string[] = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);

    if (entry.isDirectory()) walkTsx(full, found);
    else if (entry.name.endsWith(".tsx") && !chromePattern.test(full)) {
      found.push(full);
    }
  }

  return found;
}

const recipeReachableFiles = walkTsx(componentsDirectory);

describe("sections do not own colour", () => {
  it("finds the section files it is meant to be checking", () => {
    expect(sectionFiles.length).toBeGreaterThan(40);
  });

  /**
   * A hardcoded fill on the same element as a recipe-relative text token.
   *
   * This is narrower than "never write a literal white", which the note below
   * explains is the wrong rule. The failure is the *pairing*: the fill stays
   * put while the text moves with the recipe, so on every dark recipe the two
   * converge and the element renders its own content invisible.
   *
   * Found by rendering a real page under all eight recipes - a form button
   * read `bg-white text-service-ink` and came out white on white on the ink
   * recipe. It had been broken before the overhaul too, at roughly 1.15:1;
   * making the text source a true white only took it from nearly invisible to
   * exactly invisible.
   *
   * Either half alone is fine. A white fill with a fixed label (`text-bg-dark`
   * is unscoped and stays put) is correct for a button over a photograph, and
   * a recipe-relative fill with a recipe-relative label moves as a pair.
   */
  it("never pairs a hardcoded fill with a recipe-relative text token", () => {
    const offenders: string[] = [];

    /*
     * Scanned across `src/components`, not just the sections folder.
     *
     * The instance that prompted this test was in `request-service/`, reached
     * from a section but not living in one - so a sections-only sweep found
     * every offender except the one actually rendering on the page.
     */
    for (const file of recipeReachableFiles) {
      const source = readFileSync(file, "utf8");

      for (const [classString] of source.matchAll(/["'`][^"'`]{0,400}["'`]/g)) {
        // Solid fills only. `bg-white/25` and friends are translucent chips
        // laid over photography - the image supplies the contrast, the fill
        // does not, and they do not converge with the text the way an opaque
        // fill does.
        const hasFixedFill = /\bbg-white(?![/\w-])/.test(classString);
        /*
         * The accent tokens are in this list, and were the reason it had to
         * grow.
         *
         * It covered the ink and muted rows only, so the role that moves
         * FURTHEST between recipes was the one role it did not watch. Ink and
         * muted stay dark on the three light recipes and go light on the five
         * dark ones; the accent does the same and is also the role a section
         * is most likely to paint on a small fixed chip - a carousel arrow, an
         * icon shell, a tag. Every offender this addition found was exactly
         * that shape, and each one rendered near-white on white the moment the
         * recipe went dark.
         */
        const hasRecipeText =
          /\btext-(service-ink|service-muted|service-accent|main|muted|text-accent)\b/.test(
            classString,
          );

        if (hasFixedFill && hasRecipeText) {
          offenders.push(`${path.relative(process.cwd(), file)}: ${classString.slice(0, 70)}`);
        }
      }
    }

    expect(offenders).toEqual([]);
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

    expect(
      selectors.filter((selector) => selector.includes("bg-service-surface"))
        .length,
      "no rule identifies a card by the fill it paints any more",
    ).toBeGreaterThan(0);

    for (const selector of selectors) {
      expect(selector).not.toMatch(/\barticle\b/);
      expect(selector).not.toContain("shadow-service");
      // The ground token would drag ground-coloured elements in with the cards.
      expect(selector).not.toContain("bg-bg-page");

      /**
       * There are two legitimate ways to be a card, and only one of them is a
       * guess about markup.
       *
       * The token-keyed rules infer it - "this element paints the card fill,
       * so it is a card" - and that inference is what the assertions above
       * keep honest. `.recipe-card-context` is the other way: an explicit
       * opt-in, carried by a card the token rule cannot see (an inline style,
       * an image backdrop). A rule reaching cards through that class is not
       * assuming a shape, it is reading a marker, so requiring it to also name
       * the fill token would be requiring it to do the inference it exists to
       * avoid.
       */
      if (selector.includes(".recipe-card-context")) continue;

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

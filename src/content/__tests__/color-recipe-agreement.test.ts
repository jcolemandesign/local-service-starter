import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { colorRecipeIds, recipeInputs } from "@/content/color-recipe-inputs";
import {
  resolveSectionColorRecipe,
  sectionColorRecipes,
} from "@/content/section-color-recipes";

/**
 * Three files have to agree about what the recipes are: the builder-facing
 * list with its labels, the input table the gate resolves colours from, and
 * the CSS that actually paints. Any two of them agreeing is not enough - a
 * recipe present in the first two but missing from the CSS renders as an
 * unstyled section, and the gate would report healthy contrast for it.
 */

const globalsCss = readFileSync(
  path.join(process.cwd(), "src", "app", "globals.css"),
  "utf8",
);

describe("the recipe list and the input table agree", () => {
  it("offers exactly the recipes that have inputs defined", () => {
    expect(sectionColorRecipes.map((r) => r.id)).toEqual(colorRecipeIds);
  });
});

describe("every recipe is painted", () => {
  for (const id of colorRecipeIds) {
    it(`${id} has an input block in globals.css`, () => {
      expect(globalsCss).toContain(
        `.pagebuilder-paint-surface[data-pagebuilder-color-recipe="${id}"] {`,
      );
    });

    it(`${id} declares all eight inputs`, () => {
      // Slice to this recipe's block so a value declared under a neighbour
      // cannot satisfy the assertion.
      const start = globalsCss.indexOf(
        `.pagebuilder-paint-surface[data-pagebuilder-color-recipe="${id}"] {`,
      );
      const block = globalsCss.slice(start, globalsCss.indexOf("}", start));

      for (const input of [
        "--recipe-ground",
        "--recipe-card",
        "--recipe-card-text",
        "--recipe-text",
        "--recipe-faint",
        "--recipe-chromatic",
        "--recipe-cta-fill",
        "--recipe-cta-label",
        "--recipe-eyebrow",
      ]) {
        expect(block, `${id} is missing ${input}`).toContain(`${input}:`);
      }
    });
  }
});

describe("renamed recipes keep resolving", () => {
  /**
   * The ids are written into page templates, staged pages and the builder's
   * saved options, and the dev server rewrites several of those on its own
   * schedule - so they are aliased rather than migrated. A rename can race
   * that; an alias cannot.
   */
  it("maps the pre-overhaul ids to their current names", () => {
    expect(resolveSectionColorRecipe("default")).toBe("page");
    expect(resolveSectionColorRecipe("muted")).toBe("surface");
  });

  it("leaves current ids untouched", () => {
    for (const id of colorRecipeIds) {
      expect(resolveSectionColorRecipe(id)).toBe(id);
    }
  });

  it("does not re-offer a retired id in the picker", () => {
    const offered = sectionColorRecipes.map((r) => r.id) as string[];
    expect(offered).not.toContain("default");
    expect(offered).not.toContain("muted");
  });
});

describe("the retired workarounds are gone", () => {
  /**
   * Both existed to patch around limits the two scales remove. Leaving either
   * in place would silently override the new resolution - the border tone
   * would replace the ground-relative faint line with the old fixed formula,
   * and the eyebrow patch would pin a section to a palette swatch.
   */
  it("no longer overrides the border with the light-tone formula", () => {
    expect(globalsCss).not.toContain(
      "--live-service-border: var(--live-service-border-light)",
    );
  });

  it("carries no section-specific colour rule", () => {
    expect(globalsCss).not.toContain(".content-about-company-eyebrow");
  });
});

describe("the accent recipe renders even when it cannot be chosen", () => {
  it("resolves its ground through the fallback token, not the raw swatch", () => {
    const start = globalsCss.indexOf(
      '.pagebuilder-paint-surface[data-pagebuilder-color-recipe="accent"] {',
    );
    const block = globalsCss.slice(start, globalsCss.indexOf("}", start));

    // --palette-cta-accent carries `var(--live-cta-accent, brand)`. Pointing
    // at --live-cta-accent directly would leave the ground undefined for every
    // palette that has not authored one, and an undefined ground makes every
    // level of both scales mix toward nothing.
    expect(block).toContain("--recipe-ground: var(--palette-cta-accent)");
  });

  it("still lists accent as a recipe, so saved pages keep resolving", () => {
    expect(recipeInputs.accent.requiresSwatch).toBe("accent");
    expect(colorRecipeIds).toContain("accent");
  });
});

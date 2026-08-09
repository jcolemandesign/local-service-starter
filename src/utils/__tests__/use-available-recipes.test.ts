import { describe, expect, it } from "vitest";

import { colorRecipeIds } from "@/content/color-recipe-inputs";
import { availableRecipeIds } from "@/utils/use-available-recipes";

/**
 * Only the pure half is tested here. The hook around it reads
 * `getComputedStyle`, which needs a browser, and the suite runs in node - so
 * the decision logic is factored out to be testable and the hook is a thin
 * reader over it.
 */

const allAuthored = () => true;
const noneAuthored = () => false;

describe("recipe availability", () => {
  it("offers every recipe when the conditional swatches are authored", () => {
    expect(availableRecipeIds(allAuthored).map((r) => r.id)).toEqual(
      colorRecipeIds,
    );
  });

  it("hides only the recipes that depend on an unauthored swatch", () => {
    const offered = availableRecipeIds(noneAuthored).map((r) => r.id);

    // Accent is the only recipe with a `requiresSwatch` today. Every other
    // recipe's ground is an unconditional palette entry and must survive.
    expect(offered).not.toContain("accent");
    expect(offered).toHaveLength(colorRecipeIds.length - 1);

    for (const id of colorRecipeIds) {
      if (id === "accent") continue;
      expect(offered, `${id} must not depend on an optional swatch`).toContain(
        id,
      );
    }
  });

  it("keeps the picker's ordering", () => {
    // The list doubles as the visual ordering of the recipe grid, so filtering
    // must not reshuffle it.
    const offered = availableRecipeIds(noneAuthored).map((r) => r.id);
    const expected = colorRecipeIds.filter((id) => id !== "accent");

    expect(offered).toEqual(expected);
  });
});

describe("hiding is not the same as not rendering", () => {
  /**
   * The distinction this whole mechanism turns on. A page saved while a swatch
   * was authored still names that recipe after the swatch is cleared, and it
   * has to keep painting - the fallback for that lives in CSS
   * (`--palette-cta-accent`), not here.
   *
   * If this ever fails it means someone made the render path consult
   * availability, which turns a hidden recipe into a broken page.
   */
  it("still lists the hidden recipe as a valid id", () => {
    expect(colorRecipeIds).toContain("accent");
  });
});

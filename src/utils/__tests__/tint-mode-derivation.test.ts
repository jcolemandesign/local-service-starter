import { describe, expect, it } from "vitest";

import {
  type ColorPalette,
  colorRecipeIds,
  deriveTintMode,
  recipeInputs,
  resolveRef,
} from "@/content/color-recipe-inputs";
import { isDarkGround, oklabChroma } from "@/utils/color-scales";

/**
 * The chromatic treatment is a function of the ground, and now says so.
 *
 * `deriveTintMode` exists because a card is a ground too. The recipes each
 * declared their own `tintMode` by hand, which was complete while the only
 * ground in the system was a section's own - and silently wrong the moment a
 * card override made a card that is lighter or more chromatic than the section
 * it sits on. The card re-resolved every laddered role and none of the
 * chromatic ones, so the accent landed at 1.36:1 on an overridden card where
 * re-resolving gives 10.08.
 *
 * These tests are what make the derived answer trustworthy enough to use on a
 * card: it has to reproduce all eight authored answers, on every palette,
 * before it is allowed to decide anything new. If a palette ever makes the two
 * disagree, that is a real finding about the palette - the failure names the
 * recipe rather than leaving someone to discover it as a washed-out eyebrow.
 */

const palettes: Record<string, ColorPalette> = {
  /** Slot one, the palette every published figure in the phase 1 reference
   *  was computed against. */
  slotOne: {
    page: "#e5eaef",
    surface: "#d0dde2",
    raised: "#f6fbff",
    ink: "#232834",
    dark: "#0d4356",
    darkSurface: "#24566a",
    brand: "#175c82",
    highlight: "#bf0d22",
  },
  /** The starter's own defaults - a much lower-chroma dark family. */
  northStar: {
    page: "#ffffff",
    surface: "#f4f7f3",
    raised: "#ffffff",
    ink: "#17211d",
    dark: "#17211d",
    darkSurface: "#24332c",
    brand: "#1f7a5a",
    highlight: "#d97706",
  },
  /**
   * Deliberately awkward, and the one that actually exercises the threshold: a
   * warm near-black ink, a dark family that is itself brown rather than
   * neutral, and a violet highlight. This is the palette that would break a
   * derivation keyed on hue or on swatch name.
   */
  warmEarth: {
    page: "#fbf7f2",
    surface: "#efe6d9",
    raised: "#ffffff",
    ink: "#1a1410",
    dark: "#3b1f0e",
    darkSurface: "#5a3418",
    brand: "#c2410c",
    highlight: "#7c3aed",
  },
};

function groundOf(palette: ColorPalette, id: (typeof colorRecipeIds)[number]) {
  return resolveRef(palette, recipeInputs[id].ground, palette.page);
}

describe("tint mode derivation", () => {
  for (const [name, palette] of Object.entries(palettes)) {
    it(`reproduces every declared tintMode on ${name}`, () => {
      for (const id of colorRecipeIds) {
        expect(
          deriveTintMode(groundOf(palette, id)),
          `${id}: the ground implies a different chromatic treatment than the recipe declares`,
        ).toBe(recipeInputs[id].tintMode);
      }
    });
  }

  /**
   * The threshold's margin, asserted rather than assumed.
   *
   * A derivation that happens to agree today because every authored colour
   * sits far from the boundary is worth having; one that agrees because a
   * value sits a thousandth to the right side of it is not. This measures the
   * gap so a palette that narrows it fails here rather than in someone's eye.
   */
  it("separates neutral darks from chromatic grounds with room to spare", () => {
    const neutralDark: number[] = [];
    const chromatic: number[] = [];

    for (const palette of Object.values(palettes)) {
      for (const id of colorRecipeIds) {
        const ground = groundOf(palette, id);

        if (!isDarkGround(ground)) continue;

        (recipeInputs[id].tintMode === "textSource"
          ? chromatic
          : neutralDark
        ).push(oklabChroma(ground));
      }
    }

    expect(neutralDark.length).toBeGreaterThan(0);
    expect(chromatic.length).toBeGreaterThan(0);

    const highestNeutral = Math.max(...neutralDark);
    const lowestChromatic = Math.min(...chromatic);

    expect(
      lowestChromatic - highestNeutral,
      `the most chromatic neutral dark (${highestNeutral.toFixed(4)}) and the least chromatic brand ground (${lowestChromatic.toFixed(4)}) are close enough that the threshold is a guess`,
    ).toBeGreaterThan(0.015);
  });
});

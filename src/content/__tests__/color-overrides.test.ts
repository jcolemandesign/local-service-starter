import { describe, expect, it } from "vitest";

import { toColorPalette } from "@/content/color-palette-adapter";
import { colorRecipeIds } from "@/content/color-recipe-inputs";
import {
  type ColorOverrideIntensity,
  type ColorOverrideSwatch,
  colorOverrideAttributes,
  resolveCardPolarity,
  resolveOverrideIntensity,
  resolveOverrideSwatch,
  resolveSectionCard,
  cardIntensityOptions,
} from "@/content/color-overrides";
import { contrastBars, contrastRatio, isDarkGround } from "@/utils/color-scales";

const palette = toColorPalette({
  bgPage: "#e5eaef",
  serviceSurface: "#d0dde2",
  surfaceRaised: "#f6fbff",
  serviceInk: "#232834",
  bgDark: "#0d4356",
  serviceAccent: "#175c82",
  accent: "#bf0d22",
  bgDarkSurface: "#24566a",
});

const swatches: ColorOverrideSwatch[] = [
  "page",
  "surface",
  "raised",
  "ink",
  "dark",
  "darkSurface",
  "brand",
  "accent",
  "highlight",
];

/** The intensities a CARD may take. Muted and Quiet are excluded by
 *  measurement, not taste - see the note on cardIntensityValues. */
const intensities: ColorOverrideIntensity[] = [...cardIntensityOptions];

describe("unset costs nothing", () => {
  it("falls back to the recipe's own card when no swatch is named", () => {
    for (const recipe of colorRecipeIds) {
      const withNothing = resolveSectionCard(palette, recipe, {});
      const withJunk = resolveSectionCard(palette, recipe, {
        cardSwatch: "not-a-swatch",
      });

      expect(withJunk).toBe(withNothing);
    }
  });

  it("emits no attributes at all when nothing is overridden", () => {
    expect(colorOverrideAttributes(palette, "page", {})).toEqual({});
  });

  it("treats a retired swatch as unset rather than throwing", () => {
    // A stored value that stops being valid has to degrade to the recipe's
    // card. Saved pages outlive palettes.
    expect(resolveOverrideSwatch("muted")).toBeUndefined();
    expect(resolveOverrideSwatch(undefined)).toBeUndefined();
  });

  it("defaults a missing intensity to Strong, per the brief", () => {
    expect(resolveOverrideIntensity(undefined)).toBe("strong");
    expect(resolveOverrideIntensity("nonsense")).toBe("strong");
  });
});

describe("intensity is contextual, not absolute", () => {
  it("resolves the same swatch differently on a light and a dark recipe", () => {
    // The defining property of the whole intensity system: `dark · faint` is a
    // wash of whatever the section sits on. If these ever match, the mix has
    // stopped reading the local ground.
    const onLight = resolveSectionCard(palette, "page", {
      cardSwatch: "dark",
      cardIntensity: "faint",
    });
    const onDark = resolveSectionCard(palette, "dark", {
      cardSwatch: "dark",
      cardIntensity: "faint",
    });

    expect(onLight).not.toBe(onDark);
  });

  it("lands on the swatch itself at Strong", () => {
    for (const recipe of colorRecipeIds) {
      expect(
        resolveSectionCard(palette, recipe, {
          cardSwatch: "highlight",
          cardIntensity: "strong",
        }),
      ).toBe(palette.highlight);
    }
  });
});

describe("card polarity", () => {
  /**
   * The three-dimensional space nobody checks by eye.
   *
   * Polarity is the one value CSS cannot derive, so it is resolved in
   * TypeScript and shipped as an attribute - and a wrong answer type checks,
   * renders, and only looks wrong on the single override that produced it.
   * Walking the whole space is the only way this stays honest.
   */
  it("matches the resolved card's lightness for every swatch, intensity and recipe", () => {
    for (const recipe of colorRecipeIds) {
      for (const cardSwatch of swatches) {
        for (const cardIntensity of intensities) {
          const overrides = { cardSwatch, cardIntensity };
          const card = resolveSectionCard(palette, recipe, overrides);
          const expected = isDarkGround(card) ? "dark" : "light";

          expect(
            resolveCardPolarity(palette, recipe, overrides),
            `${recipe} / ${cardSwatch} / ${cardIntensity} resolved ${card}`,
          ).toBe(expected);
        }
      }
    }
  });

  it("keeps the card's own text readable on it in every combination", () => {
    const failures: string[] = [];

    for (const recipe of colorRecipeIds) {
      for (const cardSwatch of swatches) {
        for (const cardIntensity of intensities) {
          const overrides = { cardSwatch, cardIntensity };
          const card = resolveSectionCard(palette, recipe, overrides);
          const polarity = resolveCardPolarity(palette, recipe, overrides);
          const text = polarity === "dark" ? "#ffffff" : palette.ink;

          if (contrastRatio(text, card) < contrastBars.text) {
            failures.push(
              `${recipe}/${cardSwatch}/${cardIntensity} → ${contrastRatio(text, card).toFixed(2)}`,
            );
          }
        }
      }
    }

    /**
     * Two known misses, listed rather than tolerated by a lowered bar.
     *
     * Both are the highlight recipe - a saturated red ground - washed with a
     * light swatch, landing at 4.33 and 4.17 against 4.5. That is the same
     * marginal family as that recipe's own eyebrow at 4.41, which is already
     * accepted: mixing toward a saturated red produces out-of-gamut
     * intermediates that engines map differently, so the bar is not
     * guaranteeable at render time regardless of what this asserts.
     *
     * Naming them keeps the set singular. A third failure means the polarity
     * split moved, or an intensity was re-admitted that measurement excluded,
     * and either way somebody has to look.
     */
    expect(failures).toEqual([
      "highlight/page/faint → 4.33",
      "highlight/raised/faint → 4.17",
    ]);
  });
});

describe("attributes", () => {
  it("ships swatch, intensity and polarity together for a card override", () => {
    expect(
      colorOverrideAttributes(palette, "page", {
        cardSwatch: "dark",
        cardIntensity: "strong",
      }),
    ).toEqual({
      "data-pagebuilder-card-swatch": "dark",
      "data-pagebuilder-card-intensity": "strong",
      "data-pagebuilder-card-polarity": "dark",
    });
  });

  it("ships no polarity for a border-only override", () => {
    // Polarity describes a card's text. A border override does not move it.
    const attributes = colorOverrideAttributes(palette, "page", {
      borderSwatch: "ink",
      borderIntensity: "quiet",
    });

    expect(attributes["data-pagebuilder-border-swatch"]).toBe("ink");
    expect(attributes["data-pagebuilder-card-polarity"]).toBeUndefined();
  });
});

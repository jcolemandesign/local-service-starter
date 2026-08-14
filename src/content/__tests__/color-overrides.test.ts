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
  borderIsOnlyBoundary,
  cardDependsOnBorder,
  resolveBorderIntensity,
} from "@/content/color-overrides";
import { gateSectionOverrides } from "@/utils/color-gate";
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

  it("defaults a missing card intensity to Strong, per the brief", () => {
    expect(resolveOverrideIntensity(undefined)).toBe("strong");
    expect(resolveOverrideIntensity("nonsense")).toBe("strong");
  });

  /**
   * The two kinds fall back differently and it is deliberate. Naming a swatch
   * for a card asks for that colour; naming one for a border asks to recolour
   * a line already being drawn at Faint. If the border ever defaults to Strong
   * again, the picker's first click puts a full-strength rule around every
   * card in the section - which is the failure this asymmetry exists to stop.
   */
  it("defaults a missing border intensity to Faint, not Strong", () => {
    expect(resolveOverrideIntensity(undefined, "border")).toBe("faint");
    expect(resolveOverrideIntensity("nonsense", "border")).toBe("faint");
  });

  it("degrades a level outside its kind's range to that kind's default", () => {
    // `quiet` is a legitimate border level and an excluded card level; `body`
    // is the reverse. Each has to degrade in its own direction rather than to
    // one shared fallback.
    expect(resolveOverrideIntensity("quiet")).toBe("strong");
    expect(resolveOverrideIntensity("body", "border")).toBe("faint");

    expect(resolveOverrideIntensity("quiet", "border")).toBe("quiet");
    expect(resolveOverrideIntensity("body")).toBe("body");
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
  it("ships swatch, intensity and both card-ground answers for a card override", () => {
    expect(
      colorOverrideAttributes(palette, "page", {
        cardSwatch: "dark",
        cardIntensity: "strong",
      }),
    ).toEqual({
      "data-pagebuilder-card-swatch": "dark",
      "data-pagebuilder-card-intensity": "strong",
      // The two things CSS cannot derive from a `color-mix()` result: which way
      // the card's text points, and which of the three chromatic treatments its
      // ground takes. They travel together because they answer the same
      // question about the same colour.
      "data-pagebuilder-card-polarity": "dark",
      "data-pagebuilder-card-chroma": "tinted",
    });
  });

  /** The card's chroma answer is about the CARD, not the recipe. A brand
   *  swatch at full strength is a chromatic ground however light the section
   *  it sits on is, and the eyebrow on it has to fall to the text source. */
  it("reads the chromatic treatment off the card, not the section", () => {
    expect(
      colorOverrideAttributes(palette, "page", {
        cardSwatch: "brand",
        cardIntensity: "strong",
      })["data-pagebuilder-card-chroma"],
    ).toBe("textSource");

    // The same swatch at Faint is mostly the section's own light ground, so it
    // is a light card and takes the full-strength chromatic.
    expect(
      colorOverrideAttributes(palette, "page", {
        cardSwatch: "brand",
        cardIntensity: "faint",
      })["data-pagebuilder-card-chroma"],
    ).toBe("none");
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

/**
 * The two rules phase 1 measured and deferred. Both are about the relationship
 * between a card's fill and its border, which is why neither could be settled
 * while the override that changes the border did not exist yet.
 */
describe("the border as a boundary", () => {
  const filled = { fill: "solid", border: "on" } as const;
  const unfilled = { fill: "none", border: "on" } as const;

  it("leaves the border where the editor put it, filled or not", () => {
    /**
     * Faint used to be floored to Quiet on an unfilled card - the line is the
     * only thing separating card from ground there, and Faint runs 1.24-1.52
     * against WCAG 1.4.11's 3:1.
     *
     * The floor was withdrawn because it did not deliver that bar. Quiet
     * clears 3:1 for two of the eight selectable swatches on this palette's
     * page recipe (Ink 3.74, Dark 3.02) and misses for the other six, so it
     * removed the choice in every case and fixed it in two. It is a finding
     * now - see the gate test below - which is the same call `cardDependsOnBorder`
     * already makes for the neighbouring failure.
     */
    for (const surface of [filled, unfilled]) {
      expect(borderIsOnlyBoundary(surface)).toBe(surface === unfilled);
      expect(resolveBorderIntensity({ borderIntensity: "faint" })).toBe("faint");
      expect(resolveBorderIntensity({ borderIntensity: "quiet" })).toBe("quiet");
      expect(resolveBorderIntensity({})).toBe("faint");
    }
  });

  it("carries the editor's choice into the emitted attributes", () => {
    // The resolver is worthless if the markup disagrees with it.
    expect(
      colorOverrideAttributes(palette, "page", {
        borderSwatch: "ink",
        borderIntensity: "faint",
      })["data-pagebuilder-border-intensity"],
    ).toBe("faint");
  });

  it("reports an unfilled card's border against the non-text bar", () => {
    /**
     * What replaced the floor. The finding exists precisely when the fill is
     * off, so it has to survive the early return that drops the card findings
     * in that state.
     */
    const overrides = { borderSwatch: "raised", borderIntensity: "faint" };

    const findings = gateSectionOverrides(palette, "page", overrides, unfilled);

    expect(findings).toHaveLength(1);
    expect(findings[0].role).toBe("card-border");
    expect(findings[0].bar).toBe(3);
    expect(findings[0].pass).toBe(false);

    // Filled, the line is not carrying the boundary alone and is not reported.
    expect(
      gateSectionOverrides(palette, "page", overrides, filled).some(
        (f) => f.role === "card-border",
      ),
    ).toBe(false);

    // A dark swatch on a light ground clears the bar and passes.
    expect(
      gateSectionOverrides(
        palette,
        "page",
        { borderSwatch: "ink", borderIntensity: "quiet" },
        unfilled,
      )[0].pass,
    ).toBe(true);
  });

  it("reports a card that depends on its border, rather than forcing it on", () => {
    /**
     * The page recipe is the case phase 1 named: `raised` sits close enough to
     * `page` that the Faint border is part of what separates them. The gate
     * says so; it does not overrule an editor who wanted a borderless panel.
     */
    expect(cardDependsOnBorder(palette, "page", {})).toBe(true);
    expect(cardDependsOnBorder(palette, "dark", {})).toBe(false);

    const findings = gateSectionOverrides(palette, "page", {}, {
      fill: "solid",
      border: "off",
    });

    expect(findings).toHaveLength(1);
    expect(findings[0].pass).toBe(false);
    expect(findings[0].role).toBe("card-surface");
  });

  it("says nothing about a borderless card that stands on its own fill", () => {
    expect(
      gateSectionOverrides(palette, "dark", {}, { fill: "solid", border: "off" }),
    ).toEqual([]);
  });

  it("says nothing at all about a card with no fill", () => {
    /**
     * Every finding measures paint the page does not put down: the fill is
     * forced transparent, so a swatch matching the ground is a fact about the
     * stored value and not about the pixels. The case that surfaced it was the
     * page recipe with a `page` card override - a true and useless "1.00
     * against a 1.15 bar", clearable only by changing something invisible.
     */
    const sameAsGround = { cardSwatch: "page", cardIntensity: "strong" };

    expect(
      gateSectionOverrides(palette, "page", sameAsGround, {
        fill: "solid",
        border: "on",
      }).some((f) => !f.pass),
    ).toBe(true);

    for (const border of ["on", "off"] as const) {
      expect(
        gateSectionOverrides(palette, "page", sameAsGround, {
          fill: "none",
          border,
        }),
      ).toEqual([]);
    }
  });
});

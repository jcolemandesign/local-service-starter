import { describe, expect, it } from "vitest";

import {
  type StoredColorTokens,
  deriveDarkSurface,
  toColorPalette,
} from "@/content/color-palette-adapter";
import { gateColorSystem } from "@/utils/color-gate";
import { contrastBars, contrastRatio } from "@/utils/color-scales";

/** A slot as saved BEFORE the colour system overhaul: no bgDarkSurface, no
 *  ctaAccent. These must keep loading - an approved page records the tokens it
 *  was approved under, so a required new field would invalidate history. */
const legacySlot: StoredColorTokens = {
  bgPage: "#e5eaef",
  serviceSurface: "#d0dde2",
  surfaceRaised: "#f6fbff",
  serviceInk: "#232834",
  bgDark: "#0d4356",
  serviceAccent: "#175c82",
  accent: "#bf0d22",
};

describe("legacy token names", () => {
  it("maps serviceAccent to brand and accent to highlight", () => {
    const palette = toColorPalette(legacySlot);

    // The mapping that surprises people: `accent` means two different things
    // on either side of the adapter, which is why it is centralised.
    expect(palette.brand).toBe("#175c82");
    expect(palette.highlight).toBe("#bf0d22");
  });

  it("leaves the CTA accent unset rather than inventing one", () => {
    // Substituting a colour nobody chose would silently un-hide the Accent
    // recipe and ship a duplicate of Brand.
    expect(toColorPalette(legacySlot).accent).toBeUndefined();
  });

  it("prefers an authored dark surface over the derivation", () => {
    const palette = toColorPalette({ ...legacySlot, bgDarkSurface: "#24566a" });
    expect(palette.darkSurface).toBe("#24566a");
  });

  it("prefers an authored CTA accent over the brand fallback", () => {
    const palette = toColorPalette({ ...legacySlot, ctaAccent: "#1f7a5a" });
    expect(palette.accent).toBe("#1f7a5a");
  });
});

describe("derived dark surface", () => {
  it("reads as a card against the ground it was derived from", () => {
    const derived = deriveDarkSurface("#0d4356");
    expect(contrastRatio(derived, "#0d4356")).toBeGreaterThan(contrastBars.card);
  });

  /**
   * These grounds are chosen to SPAN rather than to pass.
   *
   * An earlier version of this test used five variations on navy - luminance
   * 0.007 to 0.048 - which held comfortably and proved nothing about the
   * edges. Pure black is the case that actually broke the first derivation:
   * contrast against a ground of luminance ~0 is (L + 0.05) / 0.05, so a fixed
   * proportional mix barely moves it and 12% toward white landed at 1.04.
   */
  const spanningDarkGrounds: [string, string][] = [
    ["#000000", "pure black — the case that broke the first derivation"],
    ["#0a0a0a", "near black, neutral"],
    ["#10141b", "near black, cool"],
    ["#1a1a1a", "neutral charcoal"],
    ["#0d4356", "saturated teal (reference palette)"],
    ["#2b1d3a", "purple"],
    ["#3d1f1f", "maroon"],
    ["#1f3d1f", "green"],
    ["#4a3410", "brown, the lightest plausible dark"],
  ];

  for (const [dark, label] of spanningDarkGrounds) {
    it(`stays a card on ${label}`, () => {
      const derived = deriveDarkSurface(dark);
      expect(contrastRatio(derived, dark)).toBeGreaterThan(contrastBars.card);
    });

    it(`keeps white text readable on the card derived from ${label}`, () => {
      const derived = deriveDarkSurface(dark);
      expect(contrastRatio("#ffffff", derived)).toBeGreaterThanOrEqual(
        contrastBars.text,
      );
    });
  }

  it("leaves ordinary dark grounds at the preferred lift", () => {
    // The floor correction must not quietly re-tune palettes that never
    // needed it - the whole reason for lifting conditionally rather than
    // raising the constant for everyone.
    expect(deriveDarkSurface("#0d4356")).toBe("#2d5869");
  });

  it("lifts further only where the preferred lift falls short", () => {
    const black = deriveDarkSurface("#000000");
    expect(contrastRatio(black, "#000000")).toBeGreaterThan(contrastBars.card);
    // Demonstrably more than the preferred 12% would have produced.
    expect(black).not.toBe("#060606");
  });
});

describe("a legacy slot survives the gate", () => {
  it("hides the accent recipe and keeps failures to the known misses", () => {
    const report = gateColorSystem(toColorPalette(legacySlot));

    expect(report.hidden).toEqual(["accent"]);
    /**
     * The derived dark surface differs slightly from the authored #24566a, so
     * this enumerates the misses rather than asserting exact ratios.
     *
     * `page/card-surface` joined the list when the page recipe's card changed
     * from `raised` to `surface`: this slot's two lightest neutrals sit close
     * enough that the pairing lands just under the 1.15 card floor. It is a
     * property of the palette, not of the recipe - see the same note in
     * `color-gate.test.ts`.
     */
    expect(report.failures.map((f) => `${f.recipe}/${f.role}`).sort()).toEqual([
      "highlight/text-muted",
      "page/card-surface",
    ]);
  });
});

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

  it("stays a card across a range of dark grounds", () => {
    // A business authors its own dark. The derivation has to hold for more
    // than the one palette it was tuned against.
    for (const dark of ["#0d4356", "#10141b", "#1a1a1a", "#2b1d3a", "#00303a"]) {
      const derived = deriveDarkSurface(dark);
      expect(contrastRatio(derived, dark)).toBeGreaterThan(contrastBars.card);
    }
  });

  it("keeps white text readable on the derived card", () => {
    for (const dark of ["#0d4356", "#10141b", "#2b1d3a"]) {
      const derived = deriveDarkSurface(dark);
      expect(contrastRatio("#ffffff", derived)).toBeGreaterThanOrEqual(
        contrastBars.text,
      );
    }
  });
});

describe("a legacy slot survives the gate", () => {
  it("hides the accent recipe and keeps failures to the one known miss", () => {
    const report = gateColorSystem(toColorPalette(legacySlot));

    expect(report.hidden).toEqual(["accent"]);
    // The derived dark surface differs slightly from the authored #24566a, so
    // this asserts the miss stays singular rather than asserting exact ratios.
    expect(report.failures.map((f) => `${f.recipe}/${f.role}`)).toEqual([
      "highlight/text-muted",
    ]);
  });
});

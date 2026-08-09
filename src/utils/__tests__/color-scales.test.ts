import { describe, expect, it } from "vitest";

import {
  contrastRatio,
  ladderLevels,
  mixOklab,
  resolveLadder,
  resolveTint,
  tintRoles,
} from "@/utils/color-scales";

const palette = {
  page: "#e5eaef",
  surface: "#d0dde2",
  ink: "#232834",
  dark: "#0d4356",
  darkSurface: "#24566a",
  brand: "#175c82",
  highlight: "#bf0d22",
  white: "#ffffff",
};

describe("mixing space", () => {
  /**
   * The regression guard for the one decision that is correctness rather than
   * preference. OKLCh interpolates hue on a polar path, so mixing the
   * highlight red toward a blue-grey ground travels through magenta. OKLab
   * keeps it a desaturated red. If someone "simplifies" the mix space, this
   * catches it.
   */
  it("keeps a red desaturating toward a blue ground red, not magenta", () => {
    const seventyPercent = mixOklab(palette.highlight, palette.page, 0.7);
    const fiftyEight = mixOklab(palette.highlight, palette.page, 0.58);

    expect(seventyPercent).toBe("#d36561");
    expect(fiftyEight).toBe("#d97d79");

    // The OKLCh results these replace were #c664a1 and #c27fc1 - both have a
    // blue channel above the red one, which is what magenta looks like
    // numerically. Assert the hue never inverts that way.
    for (const hex of [seventyPercent, fiftyEight]) {
      const r = parseInt(hex.slice(1, 3), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      expect(r).toBeGreaterThan(b);
    }
  });
});

describe("the two scales do not overlap", () => {
  it("runs the ladder from 100% down to 20% and the tint from 50% to 30%", () => {
    const ladder = Object.values(ladderLevels);
    const tint = Object.values(tintRoles);

    expect(Math.min(...ladder)).toBe(0.2);
    expect(Math.max(...ladder)).toBe(1);
    expect(Math.min(...tint)).toBe(0.3);
    expect(Math.max(...tint)).toBe(0.5);
  });

  it("shows why a ladder rung cannot stand in for a tint value", () => {
    // Quiet is the closest rung to the tint range and is still too saturated
    // to serve as an eyebrow on the worst neutral-dark ground.
    const quietAsEyebrow = mixOklab(palette.brand, palette.white, ladderLevels.quiet);
    expect(contrastRatio(quietAsEyebrow, palette.darkSurface)).toBeLessThan(4.5);

    // The tint's own value clears it.
    const tinted = resolveTint(palette.brand, palette.white, "text");
    expect(contrastRatio(tinted, palette.darkSurface)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("ladder", () => {
  /**
   * Muted at 76% rather than 70% is the plan's one contested number. It is a
   * floor chosen so the ladder survives `ink` being authored light, which is a
   * permitted choice. Both authorings are asserted so lowering the rung fails
   * loudly rather than quietly shipping a sub-AA eyebrow.
   */
  it("keeps Muted above AA for both legal ink authorings", () => {
    for (const ink of ["#232834", "#0d4356"]) {
      for (const ground of [palette.page, palette.surface]) {
        const muted = resolveLadder(ink, ground, "muted");
        expect(contrastRatio(muted, ground)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("keeps the meta level above the large-text bar on light grounds", () => {
    for (const ground of [palette.page, palette.surface]) {
      const meta = resolveLadder(palette.ink, ground, "quiet");
      expect(contrastRatio(meta, ground)).toBeGreaterThanOrEqual(3);
    }
  });

  it("produces a stepped hierarchy, measured in output not in percentages", () => {
    const ratios = (["strong", "body", "muted", "quiet"] as const).map((level) =>
      contrastRatio(resolveLadder(palette.ink, palette.page, level), palette.page),
    );

    for (let i = 1; i < ratios.length; i += 1) {
      // Each rung is meaningfully lighter than the one above it. 1.15x is the
      // smallest step that stays visible as a hierarchy rather than reading as
      // two names for the same colour.
      expect(ratios[i - 1] / ratios[i]).toBeGreaterThan(1.15);
    }
  });
});

describe("tint", () => {
  it("clears the button-edge bar on every neutral dark ground", () => {
    const fill = resolveTint(palette.brand, palette.white, "fill");

    for (const ground of [palette.ink, palette.dark, palette.darkSurface]) {
      expect(contrastRatio(fill, ground)).toBeGreaterThanOrEqual(3);
    }
  });

  it("clears the readable-text bar for eyebrows on every neutral dark ground", () => {
    const text = resolveTint(palette.brand, palette.white, "text");

    for (const ground of [palette.ink, palette.dark, palette.darkSurface]) {
      expect(contrastRatio(text, ground)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("is why the chromatic swatch cannot be used at full strength there", () => {
    for (const ground of [palette.ink, palette.dark, palette.darkSurface]) {
      expect(contrastRatio(palette.brand, ground)).toBeLessThan(3);
    }
  });

  it("darkens rather than lightens when the text source is ink", () => {
    // The direction is never declared by a recipe - it falls out of the text
    // source being ink on light grounds and white on dark ones.
    const onLight = resolveTint(palette.brand, palette.ink, "fill");
    const onDark = resolveTint(palette.brand, palette.white, "fill");

    expect(contrastRatio(onLight, palette.page)).toBeGreaterThan(
      contrastRatio(palette.brand, palette.page),
    );
    expect(contrastRatio(onDark, palette.dark)).toBeGreaterThan(
      contrastRatio(palette.brand, palette.dark),
    );
  });
});

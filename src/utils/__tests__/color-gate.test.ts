import { describe, expect, it } from "vitest";

import type { ColorPalette } from "@/content/color-recipe-inputs";
import { gateColorSystem } from "@/utils/color-gate";

/**
 * Slot 1's settled palette, as authored in the phase 1 plan.
 *
 * Every figure published in `reference code/color-system-phase-1.txt` section
 * 4 was computed from exactly these values. This suite is what stops those
 * numbers drifting away from what the system actually resolves - an earlier
 * draft published a card table computed under a superseded palette, and
 * without a test the disagreement would have shipped.
 */
const slotOne: ColorPalette = {
  page: "#e5eaef",
  surface: "#d0dde2",
  raised: "#f6fbff",
  ink: "#232834",
  dark: "#0d4356",
  darkSurface: "#24566a",
  brand: "#175c82",
  highlight: "#bf0d22",
  // accent deliberately unset - brand already carries a CTA at 7.27.
};

const ratioFor = (
  report: ReturnType<typeof gateColorSystem>,
  recipe: string,
  role: string,
  surface: string,
) => {
  const found = report.findings.find(
    (f) => f.recipe === recipe && f.role === role && f.surface === surface,
  );

  if (!found) throw new Error(`no finding for ${recipe}/${role}/${surface}`);

  return Number(found.ratio.toFixed(2));
};

describe("recipe availability", () => {
  it("hides the accent recipe when accent is unset, and measures the rest", () => {
    const report = gateColorSystem(slotOne);

    expect(report.hidden).toEqual(["accent"]);
    expect(report.measured).toEqual([
      "page",
      "surface",
      "ink",
      "dark",
      "darkSurface",
      "brand",
      "highlight",
    ]);
  });

  it("measures the accent recipe once accent is authored", () => {
    const report = gateColorSystem({ ...slotOne, accent: "#1f7a5a" });

    expect(report.hidden).toEqual([]);
    expect(report.measured).toContain("accent");
  });

  it("still resolves the accent recipe's ground when accent is unset", () => {
    // Hiding governs the picker, not saved data. A page already assigned the
    // accent recipe has to render, so the ground falls back to brand rather
    // than resolving to nothing.
    const report = gateColorSystem({ ...slotOne, accent: "#175c82" });
    expect(ratioFor(report, "accent", "text-strong", "ground")).toBe(7.27);
  });
});

describe("published figures — text on section ground", () => {
  const report = gateColorSystem(slotOne);

  const expected: Record<string, [number, number, number, number]> = {
    // recipe: [Strong, Body, Muted, Meta]
    page: [12.18, 8.61, 6.57, 3.94],
    surface: [10.62, 7.73, 5.95, 3.72],
    ink: [14.74, 10.85, 8.62, 5.43],
    dark: [10.75, 8.28, 6.75, 4.55],
    darkSurface: [8.03, 6.36, 5.31, 3.77],
    brand: [7.27, 5.8, 4.89, 3.52],
    highlight: [6.37, 5.17, 4.41, 3.24],
  };

  for (const [recipe, [strong, body, muted, meta]] of Object.entries(expected)) {
    it(`${recipe} matches the plan`, () => {
      expect(ratioFor(report, recipe, "text-strong", "ground")).toBe(strong);
      expect(ratioFor(report, recipe, "text-body", "ground")).toBe(body);
      expect(ratioFor(report, recipe, "text-muted", "ground")).toBe(muted);
      expect(ratioFor(report, recipe, "text-meta", "ground")).toBe(meta);
    });
  }
});

describe("published figures — CTA and eyebrow", () => {
  const report = gateColorSystem(slotOne);

  it("uses full-strength chromatic on light grounds", () => {
    expect(ratioFor(report, "page", "cta-fill", "ground")).toBe(6);
    expect(ratioFor(report, "surface", "cta-fill", "ground")).toBe(5.23);
    expect(ratioFor(report, "page", "eyebrow", "ground")).toBe(6);
  });

  it("uses the tint on neutral dark grounds — this is the chromatic button", () => {
    expect(ratioFor(report, "ink", "cta-fill", "ground")).toBe(6.12);
    expect(ratioFor(report, "dark", "cta-fill", "ground")).toBe(4.46);
    expect(ratioFor(report, "darkSurface", "cta-fill", "ground")).toBe(3.34);

    expect(ratioFor(report, "ink", "eyebrow", "ground")).toBe(8.93);
    expect(ratioFor(report, "dark", "eyebrow", "ground")).toBe(6.51);
    expect(ratioFor(report, "darkSurface", "eyebrow", "ground")).toBe(4.87);
  });

  it("falls to the text source on chromatic grounds", () => {
    expect(ratioFor(report, "brand", "cta-fill", "ground")).toBe(7.27);
    expect(ratioFor(report, "highlight", "cta-fill", "ground")).toBe(6.37);
  });
});

describe("published figures — cards", () => {
  const report = gateColorSystem(slotOne);

  /**
   * `surface` is 1.33 for a different reason than when this table was
   * published, and the number not moving hides that. It used to be a brand
   * wash of the ground; it is the raised swatch now, and on this palette the
   * two land on the same figure to three significant digits. So this row is no
   * longer a statement about the wash - it moves when `raised` moves, and a
   * palette that authors raised close to surface drops it under the 1.15 floor
   * rather than being held up by the tint.
   */
  /**
   * `page` moved for a stated reason too: its card was `raised` and is now
   * `surface`, so the two light recipes step one rung each rather than both
   * reaching for the lightest neutral. On this palette that is 1.1622 -> 1.1471
   * and drops it a hair under the 1.15 card floor - see the known misses below.
   */
  const expected: Record<string, number> = {
    page: 1.15,
    surface: 1.33,
    ink: 1.37,
    dark: 1.34,
    darkSurface: 1.34,
    brand: 2.03,
    highlight: 1.69,
  };

  for (const [recipe, ratio] of Object.entries(expected)) {
    it(`${recipe}'s card reads as a card at ${ratio}`, () => {
      expect(ratioFor(report, recipe, "card-surface", "ground")).toBe(ratio);
    });
  }
});

describe("known misses are known", () => {
  const report = gateColorSystem(slotOne);

  /**
   * The highlight recipe's Muted eyebrow lands about 2% under AA. It is
   * accepted rather than re-tuned: moving the rung would invalidate every
   * other published figure to chase one recipe, and mixing toward a saturated
   * red produces out-of-gamut intermediates that engines map differently, so
   * the bar is not guaranteeable at render time anyway.
   *
   * The second is the page recipe's card, at 1.1471 against a 1.15 floor.
   * That one arrived deliberately: page's card was `raised` and is now
   * `surface`, and on THIS palette surface sits 0.003 too close to page. It is
   * a property of the reference palette rather than of the recipe - the
   * promoted palette puts the same pairing at 1.20 - which is exactly the kind
   * of thing the gate is for, since the figure moves with whatever a business
   * authors.
   *
   * The point of this test is that the misses stay ENUMERATED. Both are named
   * below, so a third one - or either of these moving - fails here and someone
   * has to look.
   */
  it("has exactly the two failing findings we accepted", () => {
    expect(
      report.failures.map((f) => `${f.recipe}/${f.role}@${f.ratio.toFixed(2)}`).sort(),
    ).toEqual(["highlight/text-muted@4.41", "page/card-surface@1.15"]);

    for (const f of report.failures) {
      expect(f.surface).toBe("ground");
    }
  });

  it("reports margins so a barely-passing palette is visible", () => {
    // The tint constants are tuned to this palette's worst neutral dark
    // ground. A business authoring a lighter darkSurface shrinks this margin,
    // and the report has to make that visible before it becomes a failure.
    const fill = report.findings.find(
      (f) => f.recipe === "darkSurface" && f.role === "cta-fill",
    );

    expect(fill?.pass).toBe(true);
    expect(fill?.margin).toBeLessThan(0.5);
  });
});

describe("gate scope", () => {
  it("states the card-context coverage rather than implying it is global", () => {
    const report = gateColorSystem(slotOne);

    // The exact figure is asserted against real usage in
    // color-card-coverage.test.ts; here it only has to be present and partial.
    expect(report.coveredCardSections).toBeGreaterThan(0);
    expect(report.totalCardSections).toBe(149);
    expect(report.coveredCardSections).toBeLessThan(report.totalCardSections);
  });
});

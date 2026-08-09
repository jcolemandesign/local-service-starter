import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { toColorPalette } from "@/content/color-palette-adapter";
import {
  colorRecipeIds,
  recipeInputs,
  resolveRef,
} from "@/content/color-recipe-inputs";
import {
  compressedRecipes,
  recipeRungs,
  rungOverrideCss,
} from "@/content/color-rungs";
import { parsePromotedTokens } from "@/utils/promoted-palette";
import { contrastRatio, mixOklab } from "@/utils/color-scales";

const globalsCss = readFileSync(
  path.join(process.cwd(), "src", "app", "globals.css"),
  "utf8",
);

/** The promoted palette: a mid-tone brand blue, which is the case that needs
 *  the spread narrowed. */
const palette = toColorPalette({
  bgPage: "#dbdbdb",
  serviceSurface: "#e3e6e8",
  surfaceRaised: "#e5f4ff",
  serviceInk: "#232834",
  bgDark: "#0d4356",
  serviceAccent: "#007cbd",
  accent: "#bf0d22",
  bgDarkSurface: "#2d5869",
});

const groundOf = (recipe: (typeof colorRecipeIds)[number]) =>
  resolveRef(palette, recipeInputs[recipe].ground, palette.page);
const textOf = (recipe: (typeof colorRecipeIds)[number]) =>
  resolveRef(palette, recipeInputs[recipe].text, palette.ink);

describe("the hierarchy reads as a hierarchy on every ground", () => {
  /**
   * The point of the three rungs is emphasis: a headline should sit above body
   * copy, which should sit above a muted line. That has to hold on every
   * ground the system can produce, including the tight ones - a hierarchy that
   * flattens has stopped doing its job just as surely as one that fades out.
   */
  it("keeps strong, body, muted and meta in descending order everywhere", () => {
    for (const recipe of colorRecipeIds) {
      const ground = groundOf(recipe);
      const text = textOf(recipe);
      const rungs = recipeRungs(palette, recipe);

      const steps = [1, rungs.body, rungs.muted, rungs.meta].map((pct) =>
        contrastRatio(mixOklab(text, ground, pct), ground),
      );

      for (let i = 1; i < steps.length; i += 1) {
        expect(
          steps[i],
          `${recipe}: rung ${i} (${steps[i].toFixed(2)}) should sit below rung ${i - 1} (${steps[i - 1].toFixed(2)})`,
        ).toBeLessThan(steps[i - 1]);
      }
    }
  });

  it("keeps the faintest rung readable at the percentage actually EMITTED", () => {
    /**
     * The resolver bisects to the smallest step that still reads, so the
     * emitted percentage has to be rounded up or it lands just under what was
     * guaranteed. Chrome caught this at 2.99 against a 3.00 floor - the
     * resolver said 3.01 and the stylesheet said 68.3%.
     *
     * Asserting on the emitted string rather than on the resolver's float is
     * the point: the float was already correct.
     */
    const css = rungOverrideCss(palette);

    for (const rule of css.matchAll(
      /\[data-pagebuilder-color-recipe="(\w+)"\]\s*\{[^}]*--rung-meta:\s*([\d.]+)%/g,
    )) {
      const [, recipe, emitted] = rule;
      const id = recipe as (typeof colorRecipeIds)[number];
      const ground = groundOf(id);
      const meta = mixOklab(textOf(id), ground, Number(emitted) / 100);

      expect(
        contrastRatio(meta, ground),
        `${recipe} meta rung as emitted (${emitted}%)`,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps the faintest rung readable on every ground", () => {
    // De-emphasis may cost weight. It may not cost legibility - that is the
    // whole constraint, and the only one.
    for (const recipe of colorRecipeIds) {
      const ground = groundOf(recipe);
      const rungs = recipeRungs(palette, recipe);
      const meta = mixOklab(textOf(recipe), ground, rungs.meta);

      expect(
        contrastRatio(meta, ground),
        `${recipe} meta rung`,
      ).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("compression is targeted, not global", () => {
  it("leaves every ground with room on the standard spread", () => {
    // The common case has to cost nothing: these recipes must render exactly
    // as they did before the rungs became adjustable.
    const compressed = compressedRecipes(palette).map((r) => r.recipe);

    expect(compressed).not.toContain("page");
    expect(compressed).not.toContain("surface");
    expect(compressed).not.toContain("ink");
    expect(compressed).not.toContain("dark");
    expect(compressed).not.toContain("darkSurface");
  });

  it("narrows the spread only where the ground is close to its text", () => {
    // The brand blue starts at 4.55 against white, so the standard 58% rung
    // would land at 2.59.
    const brand = recipeRungs(palette, "brand");

    expect(brand.meta).toBeGreaterThan(0.58);
    expect(brand.muted).toBeGreaterThan(0.76);
    expect(brand.body).toBeGreaterThan(0.86);
  });

  it("does not compress a recipe whose faintest rung already reads", () => {
    /**
     * Highlight starts at 6.37 and its faintest rung lands at 3.24, so it
     * needs nothing. Its muted rung at 4.41 is a de-emphasised line on a
     * saturated red band and is meant to look like one - it was previously
     * carried as a "known accepted miss", which it never needed to be.
     */
    expect(compressedRecipes(palette).map((r) => r.recipe)).not.toContain(
      "highlight",
    );
  });

  it("emits nothing at all for a palette that needs no narrowing", () => {
    const roomy = toColorPalette({
      bgPage: "#ffffff",
      serviceSurface: "#f2f2f2",
      surfaceRaised: "#fafafa",
      serviceInk: "#111111",
      bgDark: "#101010",
      serviceAccent: "#123d1f",
      accent: "#3d1212",
    });

    expect(rungOverrideCss(roomy)).toBe("");
  });
});

describe("the emitted CSS matches what the stylesheet reads", () => {
  it("declares the same custom properties globals.css falls back on", () => {
    const css = rungOverrideCss(palette);

    for (const property of ["--rung-body", "--rung-muted", "--rung-meta"]) {
      expect(css).toContain(`${property}:`);
      // The fallback in the stylesheet is what makes an un-emitted recipe
      // render the standard spread. If these names ever drift apart, every
      // compression silently stops applying.
      expect(globalsCss).toContain(`var(${property},`);
    }
  });

  it("targets the painting surface, which is where the rungs can inherit from", () => {
    expect(rungOverrideCss(palette)).toContain(
      '.pagebuilder-paint-surface[data-pagebuilder-color-recipe="brand"]',
    );
  });

  it("agrees with the block currently promoted into globals.css", () => {
    /**
     * The promoted block is generated, but it is generated at promote time -
     * so between a palette edit and the next promote it can describe colours
     * that are no longer authored. Every other half of this system is mirrored
     * by a test for the same reason; this is that test for the rungs.
     *
     * If this fails, re-promote from the style guide. It is not a code bug.
     */
    const promoted = globalsCss.slice(
      globalsCss.indexOf("/* BEGIN PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */"),
      globalsCss.indexOf("/* END PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */"),
    );
    const expected = rungOverrideCss(toColorPalette(parsePromotedTokens(globalsCss)));

    for (const rule of expected.matchAll(
      /\[data-pagebuilder-color-recipe="(\w+)"\]\s*\{([^}]*)\}/g,
    )) {
      const [, recipe, body] = rule;
      const declared = promoted.match(
        new RegExp(`color-recipe="${recipe}"\\]\\s*\\{([^}]*)\\}`),
      );

      expect(declared, `no promoted rung rule for ${recipe}`).not.toBeNull();
      expect(declared?.[1].replace(/\s+/g, " ").trim()).toBe(
        body.replace(/\s+/g, " ").trim(),
      );
    }
  });

  it("resets the spread inside a card context", () => {
    /**
     * A card is a different ground from the section it sits on, so a
     * compression measured for the section does not describe it. Both
     * card-context rules have to reset, or a brand band's ink card would
     * render its hierarchy narrower than it has room for.
     */
    const resets = globalsCss.match(/--rung-body:\s*86%/g) ?? [];

    expect(resets.length).toBeGreaterThanOrEqual(2);
  });
});

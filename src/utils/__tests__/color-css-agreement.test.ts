import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { MIX_SPACE, ladderLevels, tintRoles } from "@/utils/color-scales";

/**
 * Does the CSS agree with the TypeScript?
 *
 * `color-scales.ts` exists so the contrast gate can predict what the browser
 * will paint. That only holds while the two carry the same constants, and
 * nothing else in the suite would notice them diverging: the gate would keep
 * reporting the numbers the plan published while the site rendered different
 * ones, and every test would stay green. This is the test that makes the
 * mirror trustworthy rather than merely present.
 *
 * WHAT THIS CANNOT CHECK, AND WHY IT IS STILL ENOUGH.
 * There is no browser in this suite - vitest runs `environment: "node"`, and
 * adding a real one is a dependency decision, not a test decision. So this
 * asserts the declarations agree, not that Chrome resolves them to the
 * expected hex.
 *
 * That second half was verified by hand against Chrome 151 on 2026-08-08, by
 * reading `getComputedStyle` back through a canvas for eight mixes spanning
 * both scales and both directions:
 *
 *   text-body   #3a404b    faint-line  #babfc6    dark-body  #dce3e6
 *   text-muted  #4c515c    chroma-fill #8dabc0    hl-quiet   #d97d79
 *   text-meta   #6d737d    chroma-text #baccd9
 *
 * All eight matched `mixOklab` exactly. The residual risk is therefore a
 * browser changing its OKLab implementation, not this codebase drifting - and
 * this test covers the drift.
 */

const globalsCss = readFileSync(
  path.join(process.cwd(), "src", "app", "globals.css"),
  "utf8",
);

/** Pull `color-mix(in <space>, var(--x) <pct>%, var(--y))` for one property. */
function readMixDeclaration(property: string) {
  const pattern = new RegExp(
    `--${property}:\\s*color-mix\\(\\s*in\\s+([a-z]+)\\s*,\\s*var\\(--([a-z-]+)\\)\\s+([\\d.]+)%\\s*,\\s*var\\(--([a-z-]+)\\)\\s*\\)`,
  );
  const match = globalsCss.match(pattern);

  if (!match) {
    throw new Error(`[css-agreement] no color-mix declaration for --${property}`);
  }

  return {
    space: match[1],
    source: match[2],
    percent: Number(match[3]),
    target: match[4],
  };
}

describe("ladder constants", () => {
  const rows: [string, keyof typeof ladderLevels][] = [
    ["text-body", "body"],
    ["text-muted", "muted"],
    ["text-meta", "quiet"],
    ["faint-line", "faint"],
  ];

  for (const [property, level] of rows) {
    it(`--${property} uses the ${level} percentage from color-scales`, () => {
      const declaration = readMixDeclaration(property);
      // toBeCloseTo, not toBe: 0.58 * 100 is 57.99999999999999 in binary
      // floating point, and the CSS legitimately says 58%.
      expect(declaration.percent).toBeCloseTo(ladderLevels[level] * 100, 6);
    });

    it(`--${property} mixes toward the local ground`, () => {
      // The ladder's defining property. Mixing toward anything else makes it
      // the tint, and the two are not interchangeable.
      expect(readMixDeclaration(property).target).toBe("recipe-ground");
    });
  }

  it("resolves Strong to the source itself rather than a 100% mix", () => {
    expect(globalsCss).toContain("--text-strong: var(--recipe-text);");
  });
});

describe("tint constants", () => {
  const rows: [string, keyof typeof tintRoles][] = [
    ["chroma-fill", "fill"],
    ["chroma-text", "text"],
  ];

  for (const [property, role] of rows) {
    it(`--${property} uses the ${role} percentage from color-scales`, () => {
      expect(readMixDeclaration(property).percent).toBeCloseTo(
        tintRoles[role] * 100,
        6,
      );
    });

    it(`--${property} mixes toward the recipe's text source, not the ground`, () => {
      // This is what gives the tint its direction for free: the text source is
      // white on dark recipes and ink on light ones, so a chromatic value
      // lightens where it must and darkens where it may.
      const declaration = readMixDeclaration(property);
      expect(declaration.target).toBe("recipe-text");
      expect(declaration.source).toBe("recipe-chromatic");
    });
  }
});

describe("mixing space", () => {
  it("uses oklab everywhere a scale is declared", () => {
    for (const property of [
      "text-body",
      "text-muted",
      "text-meta",
      "faint-line",
      "chroma-fill",
      "chroma-text",
    ]) {
      expect(readMixDeclaration(property).space).toBe(MIX_SPACE);
    }
  });

  it("never uses oklch for a scale, which would route hue through magenta", () => {
    const scaleDeclarations = globalsCss.match(
      /--(?:text|faint|chroma)-[a-z]+:\s*color-mix\([^)]*\)/g,
    );

    expect(scaleDeclarations?.length).toBeGreaterThan(0);
    for (const declaration of scaleDeclarations ?? []) {
      expect(declaration).not.toContain("in oklch");
    }
  });
});

describe("override axes reuse the ladder's numbers", () => {
  /**
   * The override intensities are the ladder's percentages, written out again
   * as literal values because they sit in attribute rules rather than in a
   * mix. Nothing else would notice them drifting: an override at "faint" and a
   * border drawn at Faint would simply stop matching, on some sections only,
   * and look like a design inconsistency rather than a bug.
   */
  for (const [level, fraction] of Object.entries(ladderLevels)) {
    const percent = Math.round(fraction * 100);

    it(`--card-intensity for ${level} is ${percent}%`, () => {
      // Cards are offered a subset of the ladder, so a level may legitimately
      // be absent - but if it is present it must carry the ladder's value.
      const declared = globalsCss.match(
        new RegExp(`card-intensity="${level}"\\]\\s*\\{\\s*--card-intensity:\\s*(\\d+)%`),
      );

      if (declared) expect(Number(declared[1])).toBe(percent);
    });

    it(`--border-intensity for ${level} is ${percent}%`, () => {
      const declared = globalsCss.match(
        new RegExp(
          `border-intensity="${level}"\\]\\s*\\{\\s*--border-intensity:\\s*(\\d+)%`,
        ),
      );

      expect(declared, `no border rule for ${level}`).not.toBeNull();
      expect(Number(declared?.[1])).toBe(percent);
    });
  }

  it("mixes overrides toward the local ground, not a fixed colour", () => {
    // What makes an override contextual. Mixing toward anything else turns
    // `dark · faint` into a fixed grey rather than a wash of the section.
    for (const axis of ["--recipe-card", "--border-override"]) {
      const rule = globalsCss.match(
        new RegExp(`${axis}: color-mix\\([^;]*?var\\(--recipe-ground\\)`, "s"),
      );

      expect(rule, `${axis} does not mix toward --recipe-ground`).not.toBeNull();
    }
  });
});

describe("optional swatches survive being absent", () => {
  /**
   * The failure this guards is silent and total rather than local.
   *
   * An empty custom property (`--live-cta-accent: ;`) is valid CSS, but every
   * `var(--live-cta-accent)` that reads it becomes invalid at computed-value
   * time and takes neither the value nor its own fallback. So one unset
   * optional swatch does not degrade the CTA - it invalidates whatever
   * property referenced it, and the failure is invisible in the source.
   *
   * The route omits the declaration entirely when unset, which is the fix.
   * This asserts the other half: that consumers carry a fallback, so absence
   * is survivable no matter what the route emits.
   */
  it("gives every optional live token a var() fallback at its consumer", () => {
    for (const token of ["live-cta-accent"]) {
      const references = globalsCss.match(
        new RegExp(`var\\(--${token}[^)]*\\)`, "g"),
      );

      expect(references?.length, `--${token} is never consumed`).toBeGreaterThan(
        0,
      );

      for (const reference of references ?? []) {
        expect(
          reference,
          `${reference} has no fallback; if the token is unset this declaration goes invalid rather than degrading`,
        ).toMatch(/,/);
      }
    }
  });

  it("never declares a custom property with an empty value", () => {
    const empties = globalsCss.match(/^\s*--[a-z-]+:\s*;/gm);
    expect(empties ?? []).toEqual([]);
  });
});

describe("colour contexts declare the scales identically", () => {
  /**
   * A custom property containing var() is substituted on the element that
   * declares it, so a scope that re-points --recipe-ground must re-declare the
   * whole block or it inherits already-resolved colours. Today that is
   * guaranteed by one selector list covering both scopes. The moment a third
   * context is added - phase 2's overrides, phase 4's general case - someone
   * has to remember, and forgetting fails silently by rendering the parent's
   * colours on a differently-coloured surface.
   */
  it("declares every scale exactly once, so no copy can drift from another", () => {
    for (const property of [
      "text-strong",
      "text-body",
      "text-muted",
      "text-meta",
      "faint-line",
      "chroma-fill",
      "chroma-text",
    ]) {
      const occurrences = globalsCss.match(
        new RegExp(`^\\s*--${property}:`, "gm"),
      );

      expect(
        occurrences?.length,
        `--${property} is declared ${occurrences?.length ?? 0} times; a second declaration means two copies that can drift. Extend the shared selector list instead.`,
      ).toBe(1);
    }
  });

  it("includes the card context in the selector list that declares them", () => {
    const block = globalsCss.slice(
      globalsCss.indexOf(".recipe-card-context {"),
    );
    expect(block.length).toBeGreaterThan(0);
    // The card context re-points the ground; the scales must be in scope for it.
    expect(globalsCss).toMatch(
      /\.recipe-card-context\s*\{[^}]*--text-body:|--text-body:[\s\S]{0,2000}\.recipe-card-context/,
    );
  });
});

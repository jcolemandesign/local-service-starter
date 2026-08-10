import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  borderIntensityOptions,
  cardIntensityOptions,
} from "@/content/color-overrides";
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

/**
 * Pull `color-mix(in <space>, var(--x) <pct>, var(--y))` for one property.
 *
 * The percentage comes in two forms. Most scales state it literally. The three
 * text rungs state it as `var(--rung-body, 86%)`, because a ground that cannot
 * afford the standard spread narrows it - the promoted block emits `--rung-*`
 * for those recipes and every other recipe takes the fallback. Either way the
 * literal in the CSS is the STANDARD value, which is what this file exists to
 * check against `color-scales.ts`.
 */
function readMixDeclaration(property: string) {
  const percentage = "(?:([\\d.]+)%|var\\(--[a-z-]+,\\s*([\\d.]+)%\\))";
  const pattern = new RegExp(
    `--${property}:\\s*color-mix\\(\\s*in\\s+([a-z]+)\\s*,\\s*var\\(--([a-z-]+)\\)\\s+${percentage}\\s*,\\s*var\\(--([a-z-]+)\\)\\s*\\)`,
  );
  const match = globalsCss.match(pattern);

  if (!match) {
    throw new Error(`[css-agreement] no color-mix declaration for --${property}`);
  }

  return {
    space: match[1],
    source: match[2],
    percent: Number(match[3] ?? match[4]),
    target: match[5],
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
      // The text source gives the tint its direction. CTA fill starts from
      // Accent CTA; eyebrow text starts from the recipe chromatic swatch.
      const declaration = readMixDeclaration(property);
      expect(declaration.target).toBe("recipe-text");
      expect(declaration.source).toBe(
        property === "chroma-fill"
          ? "palette-cta-accent"
          : "recipe-chromatic",
      );
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

describe("the card context cannot leak outside a recipe", () => {
  /**
   * The card context resolves `--live-*` from `--recipe-card-text`, which only
   * exists inside a colour recipe. Applied anywhere else it sets every text
   * token to an invalid value, and an invalid custom property does not fall
   * back - it poisons every `var()` that reads it.
   *
   * That is not hypothetical. The Card primitive carries this class, the style
   * guide renders swatches inside Cards with no recipe anywhere on the page,
   * and every swatch silently painted the project's hardcoded defaults instead
   * of the palette being edited. The control looked broken and the cause was
   * three elements up the tree.
   *
   * So every rule that declares a scale or a `--live-*` row must reach the
   * class through a recipe frame, never as a bare selector.
   */
  it("never declares colour rows against a bare .recipe-card-context", () => {
    /*
     * "Bare" means the class STARTS a selector - the previous non-whitespace
     * character is a comma or a closing brace. Scoped occurrences are preceded
     * by `)`, closing the `:not()` of the frame they descend from.
     *
     * Deliberately not anchored to line starts: the scoped form puts the class
     * on its own indented line, which a line anchor reads as bare.
     */
    const bare = globalsCss.match(/[,}]\s*\.recipe-card-context\s*[,{]/g);

    expect(
      bare,
      "a bare .recipe-card-context selector applies outside every recipe, where its variables resolve to nothing",
    ).toBeNull();
  });

  it("grounds the class only where a fill is actually painted", () => {
    /**
     * A ground is a claim about what is underneath. With `card-fill="none"`
     * the card paints nothing, the content sits on the section's ground, and
     * re-pointing `--recipe-ground` at the card describes a surface that is
     * not there.
     *
     * The token-keyed branches have always carried this guard; the explicit
     * class did not, so the eighteen sections using it disagreed with the
     * cards beside them whenever a fill was switched off. It showed up in the
     * faint line, which mixes toward the ground: on the page recipe an
     * unfilled card drew its border at 1.24 against the ground where its
     * neighbour drew 1.50, with neither section carrying an override.
     */
    const start = globalsCss.indexOf("--recipe-ground: var(--recipe-card);");
    expect(start, "the card-grounding block is gone").toBeGreaterThan(-1);

    const selector = globalsCss.slice(
      globalsCss.lastIndexOf("}", start) + 1,
      start,
    );

    for (const frame of [
      "pagebuilder-paint-surface",
      "pagebuilder-section-band",
    ]) {
      const branch = selector.slice(selector.indexOf(frame));

      expect(
        branch.slice(0, branch.indexOf(".recipe-card-context")),
        `the ${frame} branch grounds an unfilled card`,
      ).toContain('[data-pagebuilder-card-fill="solid"]');
    }
  });

  it("keeps the class reachable through both a section frame and a band", () => {
    // Band members carry recipe="inherit" on their own frame - the band holds
    // the real recipe - so the section form alone would miss every banded card.
    expect(globalsCss).toMatch(
      /pagebuilder-paint-surface\[data-pagebuilder-color-recipe\][\s\S]{0,200}\.recipe-card-context/,
    );
    expect(globalsCss).toMatch(
      /pagebuilder-section-band\[data-pagebuilder-color-recipe\][\s\S]{0,200}\.recipe-card-context/,
    );
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
  /**
   * Both axes are checked against what the pickers actually OFFER, not against
   * the whole ladder. Each range is a subset for its own measured reason - the
   * card excludes Quiet and Muted because neither text polarity clears AA
   * there, the border excludes Strong, Body and Muted because they are not
   * tellable apart on a two-pixel line - and the two subsets are different.
   *
   * Checking presence in both directions is what makes this worth having. A
   * missing rule is a picker option that silently paints nothing. A rule for a
   * level nobody can choose is the reverse: dead CSS that reads as support for
   * a range the product deliberately withdrew, and the next person to widen
   * the picker would find it already "working" at a value measurement
   * excluded.
   */
  const declaredLevels = (axis: "card" | "border") =>
    [
      ...globalsCss.matchAll(
        new RegExp(
          `${axis}-intensity="(\\w+)"\\]\\s*\\{\\s*--${axis}-intensity:\\s*(\\d+)%`,
          "g",
        ),
      ),
    ].map(([, level, percent]) => ({ level, percent: Number(percent) }));

  for (const [axis, offered] of [
    ["card", cardIntensityOptions],
    ["border", borderIntensityOptions],
  ] as const) {
    it(`--${axis}-intensity declares exactly the levels the picker offers`, () => {
      expect(declaredLevels(axis).map((d) => d.level).sort()).toEqual(
        [...offered].sort(),
      );
    });

    it(`--${axis}-intensity carries the ladder's percentages`, () => {
      for (const { level, percent } of declaredLevels(axis)) {
        expect(
          percent,
          `--${axis}-intensity for ${level}`,
        ).toBe(Math.round(ladderLevels[level as keyof typeof ladderLevels] * 100));
      }
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

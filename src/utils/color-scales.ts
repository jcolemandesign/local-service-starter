/**
 * The two colour scales, and the maths under them.
 *
 * This module is the single TypeScript-side resolver referenced by the phase 1
 * plan (`reference code/color-system-phase-1.txt`). CSS does the actual
 * painting via `color-mix(in oklab, ...)`; this file exists so the contrast
 * gate can predict what CSS will produce without shipping a second, drifting
 * definition of the colour system. Every constant here has a counterpart in
 * `globals.css`, and `color-recipe-inputs.ts` is asserted against it in tests.
 *
 * Two scales, not one. Conflating them is what made an earlier draft conclude
 * that a white button was the only option on a dark ground:
 *
 *   - the LADDER mixes a source toward the LOCAL GROUND. It produces the text
 *     hierarchy and the faint border. On a dark ground every level gets
 *     darker, which is correct for text (the source is already light) and
 *     fatal for a chromatic value (it darkens into the ground).
 *   - the TINT mixes a chromatic swatch toward the RECIPE'S TEXT SOURCE. That
 *     is white on dark recipes and ink on light ones, so the direction is
 *     automatic and a chromatic button survives on a dark field.
 *
 * The two ranges do not overlap (100-20 vs 50-30) and are not interchangeable.
 */

/** Mixing space. OKLCh interpolates hue on a polar path, which swings a
 *  chromatic swatch through unrelated hues on its way to a near-neutral
 *  ground - mixing the highlight red toward a blue-grey page lands on magenta
 *  in OKLCh and on a desaturated red in OKLab. Every mix in the system is
 *  OKLab for that reason. */
export const MIX_SPACE = "oklab" as const;

export type LadderLevel = "strong" | "body" | "muted" | "quiet" | "faint";

/**
 * Source strength at each rung, mixed toward the local ground.
 *
 * `muted` is 76% rather than a tidier 70%. `ink` is authored independently of
 * `dark` and may legitimately be set to a light value; at 70% that authoring
 * drops Muted to 4.27 and Quiet to 2.84, failing both bars. A ladder that is
 * unsafe for a permitted authoring choice is a design defect rather than
 * something the gate should warn about on every save. Evenness is measured in
 * resolved contrast, not in the tidiness of these numbers.
 */
export const ladderLevels: Record<LadderLevel, number> = {
  strong: 1,
  body: 0.86,
  muted: 0.76,
  quiet: 0.58,
  faint: 0.2,
};

export type TintRole = "fill" | "text";

/**
 * Chromatic strength for the two tinted roles, mixed toward the text source.
 *
 * Two constants cover all eight recipes; no recipe carries a hand-tuned
 * percentage, which is the hand-maintained table this overhaul retires. They
 * are tuned to the worst neutral-dark ground, so they are slightly washed on
 * the darkest one - CSS has no contrast solver, so a value cannot be derived
 * from a target ratio and the constants have to satisfy the hardest case.
 *
 * PROVISIONAL. These are the two numbers most likely to move once the system
 * can be looked at rather than measured. Retuning is a change here plus the
 * matching pair in globals.css; nothing else depends on their values.
 */
export const tintRoles: Record<TintRole, number> = {
  fill: 0.5,
  text: 0.3,
};

/** Contrast bars, stated once so they are not argued per level. */
export const contrastBars = {
  /** Readable text at any size. */
  text: 4.5,
  /** Large or non-essential text, and non-text boundaries (WCAG 1.4.11). */
  large: 3,
  /** Below this a card stops reading as a card against its ground. */
  card: 1.15,
} as const;

type Rgb = [number, number, number];
type Lab = [number, number, number];

const srgbToLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

const linearToSrgb = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function parseHex(hex: string): Rgb {
  const value = hex.trim().replace(/^#/, "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`[color-scales] not a hex colour: ${hex}`);
  }

  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255) as Rgb;
}

export function toHex(rgb: Rgb): string {
  return `#${rgb
    .map((v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

function rgbToOklab([r, g, b]: Rgb): Lab {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToRgb([L, a, b]: Lab): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/**
 * `color-mix(in oklab, source <amount>, target)` in TypeScript.
 *
 * `amount` is the share of `source`, matching the CSS argument order so a
 * value in this file reads the same as the declaration it predicts.
 */
export function mixOklab(source: string, target: string, amount: number): string {
  const a = rgbToOklab(parseHex(source));
  const b = rgbToOklab(parseHex(target));

  return toHex(
    oklabToRgb(a.map((v, i) => v * amount + b[i] * (1 - amount)) as Lab),
  );
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio. Order-independent. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];

  return (hi + 0.05) / (lo + 0.05);
}

/** True when a ground wants light text on it. Used to pick a card's text
 *  source when a card establishes its own colour context. */
export function isDarkGround(hex: string): boolean {
  return relativeLuminance(hex) < 0.4;
}

/** One rung of the ladder: a source mixed toward its local ground. */
export function resolveLadder(
  source: string,
  ground: string,
  level: LadderLevel,
): string {
  return mixOklab(source, ground, ladderLevels[level]);
}

/** One tinted chromatic role: the chromatic swatch mixed toward the recipe's
 *  text source, which is what makes the direction ground-appropriate without
 *  any recipe declaring one. */
export function resolveTint(
  chromatic: string,
  textSource: string,
  role: TintRole,
): string {
  return mixOklab(chromatic, textSource, tintRoles[role]);
}

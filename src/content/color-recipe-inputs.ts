import {
  type LadderLevel,
  isDarkGround,
  resolveLadder,
} from "@/utils/color-scales";

/**
 * What each colour recipe declares, as data.
 *
 * A recipe states seven inputs and nothing else; both scales in
 * `color-scales.ts` derive every other value from them. This file is the
 * TypeScript half of that table - `globals.css` carries the CSS half, and a
 * test asserts the two agree, because a drifted mirror is worse than no mirror
 * (the contrast gate would validate colours the site never renders).
 *
 * See `reference code/color-system-phase-1.txt` for the measured figures each
 * of these inputs was chosen against.
 */

export type PaletteKey =
  | "page"
  | "surface"
  | "raised"
  | "ink"
  | "dark"
  | "darkSurface"
  | "brand"
  | "accent"
  | "highlight";

/**
 * `accent` is optional by design. It is a CTA-appropriate derivative of the
 * brand colour, needed only when the brand colour itself lacks contrast as a
 * button. A business whose brand colour already works leaves it unset, and
 * that is a success state rather than a gap.
 */
export type ColorPalette = Record<Exclude<PaletteKey, "accent">, string> & {
  accent?: string;
};

/**
 * A colour a recipe can name.
 *
 * `white` is its own kind rather than a palette entry because it is not
 * authored - it is the fixed light end of the system, used as the text source
 * on dark grounds and therefore as the tint endpoint there too.
 */
export type ColorRef =
  | { kind: "swatch"; swatch: PaletteKey }
  | { kind: "white" }
  | { kind: "ladder"; swatch: PaletteKey; level: LadderLevel };

/**
 * How a recipe treats its chromatic roles - the CTA fill and the eyebrow.
 *
 * This is a function of the ground, not a per-recipe preference:
 *
 *   none         light ground. The chromatic swatch already clears both bars
 *                at full strength (6.00 on page, 5.23 on surface).
 *   tinted       neutral dark ground. Full-strength chromatic darkens into
 *                the ground and dies (1.11-2.03), so both roles take the tint.
 *   textSource   chromatic ground. The tint measured against it does not clear
 *                either (3.02 on brand, 2.65 on highlight), and a tinted brand
 *                on a brand ground is the accent-on-accent case the brief
 *                rules out. Both roles fall to the text source.
 */
export type TintMode = "none" | "tinted" | "textSource";

export type RecipeInputs = {
  ground: ColorRef;
  card: ColorRef;
  /** Source the ladder runs from, and the endpoint the tint runs toward. */
  text: ColorRef;
  /** Source the Faint level runs from, for borders and dividers. */
  faint: ColorRef;
  /** Swatch the tint runs from. Unused when tintMode is not "tinted". */
  chromatic: ColorRef;
  /** Button label. Flat - never laddered, never tinted. */
  ctaLabel: ColorRef;
  tintMode: TintMode;
  /**
   * The swatch without which this recipe has no ground. When it is unset the
   * recipe is hidden from the pickers, but it still has to RENDER for pages
   * that already reference it - hiding governs authoring, not data.
   */
  requiresSwatch?: PaletteKey;
};

const swatch = (s: PaletteKey): ColorRef => ({ kind: "swatch", swatch: s });
const white: ColorRef = { kind: "white" };

export const recipeInputs = {
  page: {
    ground: swatch("page"),
    card: swatch("raised"),
    text: swatch("ink"),
    faint: swatch("ink"),
    chromatic: swatch("brand"),
    ctaLabel: white,
    tintMode: "none",
  },
  surface: {
    ground: swatch("surface"),
    /** A wash rather than a swatch: the surface token is already the ground,
     *  so a surface card would be the same flat field as the section. */
    card: { kind: "ladder", swatch: "brand", level: "faint" },
    text: swatch("ink"),
    faint: swatch("brand"),
    chromatic: swatch("brand"),
    ctaLabel: white,
    tintMode: "none",
  },
  ink: {
    ground: swatch("ink"),
    card: swatch("dark"),
    text: white,
    faint: white,
    chromatic: swatch("brand"),
    ctaLabel: swatch("ink"),
    tintMode: "tinted",
  },
  dark: {
    ground: swatch("dark"),
    card: swatch("darkSurface"),
    text: white,
    faint: white,
    chromatic: swatch("brand"),
    ctaLabel: swatch("ink"),
    tintMode: "tinted",
  },
  darkSurface: {
    ground: swatch("darkSurface"),
    card: swatch("dark"),
    text: white,
    faint: white,
    chromatic: swatch("brand"),
    ctaLabel: swatch("ink"),
    tintMode: "tinted",
  },
  brand: {
    ground: swatch("brand"),
    card: swatch("ink"),
    text: white,
    faint: white,
    chromatic: swatch("brand"),
    ctaLabel: swatch("brand"),
    tintMode: "textSource",
  },
  accent: {
    ground: swatch("accent"),
    card: swatch("dark"),
    text: white,
    faint: white,
    chromatic: swatch("accent"),
    ctaLabel: swatch("accent"),
    tintMode: "textSource",
    requiresSwatch: "accent",
  },
  highlight: {
    ground: swatch("highlight"),
    card: swatch("dark"),
    text: white,
    faint: white,
    chromatic: swatch("highlight"),
    ctaLabel: swatch("highlight"),
    tintMode: "textSource",
  },
} as const satisfies Record<string, RecipeInputs>;

export type ColorRecipeId = keyof typeof recipeInputs;

export const colorRecipeIds = Object.keys(recipeInputs) as ColorRecipeId[];

/**
 * A palette swatch, with accent's fallback applied.
 *
 * Every read of `accent` goes through here. An unauthored accent resolving to
 * transparent or to the ground is the silent failure this exists to prevent -
 * and it has three consumers, not one: the CTA fill, the surface recipe's card
 * and faint source, and the accent recipe's own ground.
 */
export function resolveSwatch(palette: ColorPalette, key: PaletteKey): string {
  if (key === "accent") {
    return palette.accent ?? palette.brand;
  }

  return palette[key];
}

export function resolveRef(
  palette: ColorPalette,
  ref: ColorRef,
  ground: string,
): string {
  switch (ref.kind) {
    case "white":
      return "#ffffff";
    case "swatch":
      return resolveSwatch(palette, ref.swatch);
    case "ladder":
      return resolveLadder(resolveSwatch(palette, ref.swatch), ground, ref.level);
  }
}

/**
 * Whether a recipe can be offered in the pickers.
 *
 * Separate from whether it can render: a recipe whose defining swatch is unset
 * is hidden from authoring but still resolves, because saved pages may already
 * name it. `resolveSwatch` supplies the fallback that makes that safe.
 */
export function isRecipeAvailable(
  palette: ColorPalette,
  id: ColorRecipeId,
): boolean {
  // Widened deliberately: `as const` gives each entry an exact literal type,
  // so recipes that omit `requiresSwatch` do not carry the key at all.
  const inputs: RecipeInputs = recipeInputs[id];
  const required = inputs.requiresSwatch;

  return !required || Boolean(palette[required]);
}

/** The card's own text source when a card establishes its own colour context.
 *  A card that flips lightness relative to its section must flip its text with
 *  it, or the section's foreground bleeds onto an incompatible surface. */
export function cardTextSource(palette: ColorPalette, card: string): string {
  return isDarkGround(card) ? "#ffffff" : palette.ink;
}

import {
  type ColorPalette,
  type ColorRecipeId,
  type PaletteKey,
  recipeInputs,
  resolveRef,
  resolveSwatch,
} from "@/content/color-recipe-inputs";
import {
  type LadderLevel,
  isDarkGround,
  ladderLevels,
  mixOklab,
} from "@/utils/color-scales";

/**
 * Section-level card and border overrides.
 *
 * An override names a palette swatch and an intensity, never a resolved
 * colour - the same rule the colour recipe follows, so a palette change moves
 * every override with it instead of stranding hexes in saved pages.
 *
 * The intensity mixes the swatch toward the section's OWN ground, which is
 * what makes an override contextual rather than absolute: `dark · faint` is a
 * wash of whatever the section is sitting on, not a fixed grey. Both halves of
 * that are expressible in CSS, so almost all of this file's job is done by
 * thirty declarations in globals.css. What is left is the one thing CSS cannot
 * answer - see `resolveCardPolarity`.
 */

export type ColorOverrideSwatch = PaletteKey;
export type ColorOverrideIntensity = LadderLevel;

export type SectionColorOverrides = {
  cardSwatch?: string;
  cardIntensity?: string;
  borderSwatch?: string;
  borderIntensity?: string;
};

const swatchValues = new Set<string>([
  "page",
  "surface",
  "raised",
  "ink",
  "dark",
  "darkSurface",
  "brand",
  "accent",
  "highlight",
]);

/**
 * Cards and borders do not get the same intensity range, and the reason is
 * measured rather than aesthetic.
 *
 * A card carries text, so its colour has to stay far enough from mid-tone that
 * one of the two text polarities clears AA on it. Walking all nine swatches
 * across all eight recipes:
 *
 *     strong   72/72 clear, worst 6.37
 *     body     72/72 clear, worst 4.87
 *     faint    70/72 clear, worst 4.17
 *     muted    68/72 clear, worst 4.05
 *     quiet    49/72 clear, worst 2.35
 *
 * Quiet lands a card squarely between its ground and its swatch, where neither
 * white nor ink text works - it fails a third of the time and bottoms out at
 * 2.35. Muted is the same problem in milder form. So cards are offered the two
 * ends and the wash: solid, softened, and a tint of the ground.
 *
 * Faint's two misses are both the highlight recipe against a light swatch,
 * 4.33 and 4.17 - the same marginal family as that recipe's own eyebrow, which
 * is already a known and accepted miss. The gate reports them.
 *
 * A border carries no text, so none of this constrains it and all five levels
 * stay available. That is the opposite of what the phase 2 scope guessed.
 */
const cardIntensityValues = new Set<string>(["strong", "body", "faint"]);
const borderIntensityValues = new Set<string>(Object.keys(ladderLevels));

export const cardIntensityOptions = [
  ...cardIntensityValues,
] as ColorOverrideIntensity[];
export const borderIntensityOptions = [
  ...borderIntensityValues,
] as ColorOverrideIntensity[];

/**
 * `undefined` means "the recipe decides", which is the common case and has to
 * cost nothing. A stored value that is no longer valid resolves the same way
 * rather than throwing, so a retired swatch degrades to the recipe's own card
 * instead of breaking the page.
 */
export function resolveOverrideSwatch(
  value: string | undefined,
): ColorOverrideSwatch | undefined {
  return value && swatchValues.has(value)
    ? (value as ColorOverrideSwatch)
    : undefined;
}

/**
 * No intensity means Strong, per the brief.
 *
 * `kind` decides which range applies. A card intensity outside its range
 * degrades to Strong rather than being honoured, so a value saved before the
 * range narrowed cannot render an unreadable card.
 */
export function resolveOverrideIntensity(
  value: string | undefined,
  kind: "card" | "border" = "card",
): ColorOverrideIntensity {
  const allowed =
    kind === "card" ? cardIntensityValues : borderIntensityValues;

  return value && allowed.has(value)
    ? (value as ColorOverrideIntensity)
    : "strong";
}

/** The colour an override actually paints, mixed toward the recipe's ground. */
export function resolveOverrideColor(
  palette: ColorPalette,
  recipe: ColorRecipeId,
  swatch: ColorOverrideSwatch,
  intensity: ColorOverrideIntensity,
): string {
  const inputs = recipeInputs[recipe];
  const ground = resolveRef(palette, inputs.ground, palette.page);

  return mixOklab(
    resolveSwatch(palette, swatch),
    ground,
    ladderLevels[intensity],
  );
}

/** The card a section renders, override applied or not. */
export function resolveSectionCard(
  palette: ColorPalette,
  recipe: ColorRecipeId,
  overrides: SectionColorOverrides,
): string {
  const swatch = resolveOverrideSwatch(overrides.cardSwatch);
  const inputs = recipeInputs[recipe];
  const ground = resolveRef(palette, inputs.ground, palette.page);

  return swatch
    ? resolveOverrideColor(
        palette,
        recipe,
        swatch,
        resolveOverrideIntensity(overrides.cardIntensity),
      )
    : resolveRef(palette, inputs.card, ground);
}

export type CardPolarity = "light" | "dark";

/**
 * THE ONE THING CSS CANNOT DO.
 *
 * A card's text source has to flip with the card's lightness, and CSS cannot
 * ask how light an arbitrary `color-mix()` result is. `light-dark()` keys off
 * colour-scheme rather than off a computed colour, and `contrast-color()` is
 * not deployable yet. So the polarity is resolved here and shipped as an
 * attribute for the stylesheet to switch on.
 *
 * This is also where a mistake is invisible in review: a wrong polarity type
 * checks, renders, and only looks wrong on the one override that produced it.
 * `color-overrides.test.ts` walks every swatch x intensity x recipe and
 * asserts the polarity matches the resolved card, because eyeballing a
 * three-dimensional space is exactly the kind of checking people skip.
 */
export function resolveCardPolarity(
  palette: ColorPalette,
  recipe: ColorRecipeId,
  overrides: SectionColorOverrides,
): CardPolarity {
  return isDarkGround(resolveSectionCard(palette, recipe, overrides))
    ? "dark"
    : "light";
}

/**
 * The data attributes a section frame carries.
 *
 * Omitted entirely when unset - an absent attribute lets the recipe's own rule
 * win, where an empty one would still match `[data-pagebuilder-card-swatch]`
 * and repaint the card with an undefined swatch.
 */
export function colorOverrideAttributes(
  palette: ColorPalette,
  recipe: ColorRecipeId,
  overrides: SectionColorOverrides,
): Record<string, string> {
  const attributes: Record<string, string> = {};

  const cardSwatch = resolveOverrideSwatch(overrides.cardSwatch);
  if (cardSwatch) {
    attributes["data-pagebuilder-card-swatch"] = cardSwatch;
    attributes["data-pagebuilder-card-intensity"] = resolveOverrideIntensity(
      overrides.cardIntensity,
    );
  }

  const borderSwatch = resolveOverrideSwatch(overrides.borderSwatch);
  if (borderSwatch) {
    attributes["data-pagebuilder-border-swatch"] = borderSwatch;
    attributes["data-pagebuilder-border-intensity"] = resolveOverrideIntensity(
      overrides.borderIntensity,
      "border",
    );
  }

  /**
   * Polarity ships whenever a card override does, not only when it flips.
   *
   * The recipes already declare `--recipe-card-text` for their own cards, so
   * an override that happens to keep the same polarity needs no attribute -
   * but emitting it anyway keeps the rendered markup a complete statement of
   * the card's colour context rather than something that has to be
   * cross-referenced against the recipe to interpret.
   */
  if (cardSwatch) {
    attributes["data-pagebuilder-card-polarity"] = resolveCardPolarity(
      palette,
      recipe,
      overrides,
    );
  }

  return attributes;
}

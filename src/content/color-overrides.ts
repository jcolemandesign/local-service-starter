import {
  type ColorPalette,
  type ColorRecipeId,
  type PaletteKey,
  deriveTintMode,
  recipeInputs,
  resolveRef,
  resolveSwatch,
} from "@/content/color-recipe-inputs";
import {
  type LadderLevel,
  contrastRatio,
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

/**
 * The border gets two levels, not the five it could safely carry.
 *
 * Contrast is not what constrains it - a border holds no text, so all five
 * ladder levels are available on paper. What constrains it is that four of
 * them are not distinguishable on a one- or two-pixel line. Between Strong,
 * Body and Muted the eye sees "a line", and the choice between them is a
 * control that appears to do nothing, which is worse than a control that is
 * not there.
 *
 * The real want is the one the brief describes: the border is already
 * ground-relative at Faint, and sometimes it needs to be more definite. That
 * is one step, not four. So `faint` is the line the system already draws and
 * `quiet` is the same line made deliberate.
 *
 * These stay ladder level names in storage and in CSS rather than becoming a
 * private faint/defined vocabulary. The percentages then remain the ladder's,
 * `color-css-agreement.test.ts` keeps checking them against `ladderLevels`,
 * and re-admitting a level later is a one-line change here rather than a
 * migration. Only the picker's labels say "Faint" and "Defined".
 */
const borderIntensityValues = new Set<string>(["faint", "quiet"]);

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
 * The two kinds fall back differently, and the asymmetry is the point.
 *
 * A card override with no intensity means Strong, per the brief: naming a
 * swatch for a card is asking for that colour, so the unqualified request
 * gives you the colour.
 *
 * A border override with no intensity means Faint. Naming a swatch for a
 * border is asking to recolour a line the system is already drawing, and that
 * line is drawn at Faint - so the unqualified request changes its hue and
 * leaves its weight alone. Falling back to Strong instead would make picking
 * any swatch slam a full-strength rule around the card, which is never what
 * the picker's first click should do.
 *
 * A value outside its kind's range degrades to that kind's default rather than
 * being honoured, so a page saved while the range was wider cannot render an
 * unreadable card or a border nobody can now choose.
 */
export function resolveOverrideIntensity(
  value: string | undefined,
  kind: "card" | "border" = "card",
): ColorOverrideIntensity {
  const allowed = kind === "card" ? cardIntensityValues : borderIntensityValues;
  const fallback: ColorOverrideIntensity = kind === "card" ? "strong" : "faint";

  return value && allowed.has(value)
    ? (value as ColorOverrideIntensity)
    : fallback;
}

/**
 * What the section already decided about its card surface, via the existing
 * `cardFill` / `cardBorder` controls. The two border rules below need it,
 * because both are about the relationship between the fill and the line rather
 * than about either one alone.
 */
export type CardSurfaceState = {
  fill: "none" | "solid";
  border: "on" | "off";
};

/**
 * A card with no fill is distinguished by its border and nothing else.
 *
 * Faint borders resolve to 1.46-1.75 against their ground. Phase 1 accepted
 * that, explicitly and only because the fill was also doing the work of
 * separating the card - two weak signals reading as one clear one. Take the
 * fill away and the line is carrying the boundary by itself, below WCAG
 * 1.4.11's 3:1 for a meaningful non-text boundary, and the acceptance no
 * longer holds.
 *
 * So the intensity floors at Quiet whenever the fill is off and the border is
 * on. Quiet is the step the two-value control already offers, which is why
 * narrowing that control to faint/defined and enforcing this rule are the same
 * shape of change rather than two competing ones.
 */
export function borderIsOnlyBoundary(surface: CardSurfaceState): boolean {
  return surface.fill === "none" && surface.border === "on";
}

/**
 * The border's intensity. The editor's choice, unconditionally.
 *
 * THIS USED TO FLOOR AT QUIET WHENEVER THE FILL WAS OFF, AND THE FLOOR WAS
 * WITHDRAWN ON MEASUREMENT. The intent was sound - with no fill the line is
 * the only thing separating card from ground, and Faint runs 1.24-1.52 against
 * a 3:1 bar - but forcing Quiet does not fix that. Walking the eight
 * selectable swatches on the promoted palette's page recipe, Quiet clears 3:1
 * for exactly two of them (Ink 3.74, Dark 3.02) and misses for the other six,
 * bottoming out at 1.00 where the swatch is the ground's own colour. So the
 * floor removed a choice in all eight cases and delivered the bar in two.
 *
 * It was also the only blocking rule in a file that otherwise reports:
 * `cardDependsOnBorder` above measures the neighbouring failure and says
 * explicitly that it does not force the border back on, because that would
 * overrule an editor who wanted a borderless panel. An unfilled card with a
 * faint line is the same kind of decision. `gateSectionOverrides` now raises
 * it as a finding, so the number is in front of the editor and the choice
 * stays theirs.
 */
export function resolveBorderIntensity(
  overrides: SectionColorOverrides,
): ColorOverrideIntensity {
  return resolveOverrideIntensity(overrides.borderIntensity, "border");
}

/**
 * Below this the card is not separated from its ground by its fill alone, so
 * turning the border off makes it disappear.
 *
 * Phase 1 measured the page recipe's card at 1.16 against `page` and flagged
 * that it clears partly because the Faint border is drawn. The card has since
 * become `surface` rather than `raised`, which puts the same pairing at 1.15
 * on the reference palette and 1.20 on the promoted one - still the closest
 * pairing in the set, and still the case this threshold was written for. The
 * figure moving twice over is exactly why it is checked at gate time against
 * the live palette rather than kept as a list of recipes known to be fragile.
 *
 * This REPORTS. It does not force the border back on. A forced border would
 * silently overrule an editor who wanted a borderless panel, and the same call
 * was already made for the neighbouring question of an override painting a
 * card its own ground colour: the gate warns, the picker allows.
 */
export const CARD_DEPENDS_ON_BORDER_BELOW = 1.25;

export function cardDependsOnBorder(
  palette: ColorPalette,
  recipe: ColorRecipeId,
  overrides: SectionColorOverrides,
): boolean {
  const ground = resolveRef(palette, recipeInputs[recipe].ground, palette.page);

  return (
    contrastRatio(resolveSectionCard(palette, recipe, overrides), ground) <
    CARD_DEPENDS_ON_BORDER_BELOW
  );
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
 *
 * It took a `surface` argument while the border intensity had a fill-dependent
 * floor. With the floor withdrawn nothing here reads the fill state, and an
 * argument that is accepted and ignored is worse than one that is absent - the
 * next caller threads a surface through and expects it to change something.
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
    attributes["data-pagebuilder-border-intensity"] =
      resolveBorderIntensity(overrides);
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
    /**
     * THE SECOND THING CSS CANNOT DO.
     *
     * Polarity above answers "which way does this card's text point". This
     * answers "which of the three chromatic treatments does this card's ground
     * take", and it is the same shape of problem: the rule is a function of
     * the ground's lightness AND its chroma, and CSS can ask a `color-mix()`
     * result neither.
     *
     * Without it the chromatic roles were the only roles that did not
     * re-resolve on a card. Every laddered role already does - the card
     * context re-declares the scales from `--recipe-card-text` - so an
     * overridden card got correct headings, correct body copy, correct
     * dividers, and an eyebrow computed for a ground it is not sitting on.
     */
    attributes["data-pagebuilder-card-chroma"] = deriveTintMode(
      resolveSectionCard(palette, recipe, overrides),
    );
  }

  return attributes;
}

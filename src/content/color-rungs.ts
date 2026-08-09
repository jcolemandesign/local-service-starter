import {
  type ColorPalette,
  type ColorRecipeId,
  colorRecipeIds,
  recipeInputs,
  resolveRef,
} from "@/content/color-recipe-inputs";
import {
  type RungPercentages,
  resolveRungPercentages,
} from "@/utils/color-scales";

/**
 * Which recipes need their text hierarchy narrowed, and by how much.
 *
 * The ladder steps down from the text source toward the ground, so how far it
 * can step depends on how far apart those two start. Most grounds have room to
 * spare and use the standard spread. A saturated brand band does not: it can
 * still carry a headline, body and muted line that read as three levels, but
 * the levels have to sit closer together.
 *
 * Resolved from the palette rather than declared per recipe, because it is a
 * property of the colours a business authored, not of the recipe. A brand band
 * on a deep navy needs no compression at all; the same recipe on a mid-tone
 * blue does. Nothing here is stored - it is recomputed from the palette on
 * every promote, so re-authoring a colour moves the hierarchy with it.
 */

export type RecipeRungs = { recipe: ColorRecipeId; rungs: RungPercentages };

/** The standard spread, as the CSS fallbacks declare it. */
const standard: RungPercentages = { body: 0.86, muted: 0.76, meta: 0.58 };

const isStandard = (rungs: RungPercentages) =>
  rungs.body === standard.body &&
  rungs.muted === standard.muted &&
  rungs.meta === standard.meta;

export function recipeRungs(
  palette: ColorPalette,
  recipe: ColorRecipeId,
): RungPercentages {
  const inputs = recipeInputs[recipe];
  const ground = resolveRef(palette, inputs.ground, palette.page);

  return resolveRungPercentages(
    ground,
    resolveRef(palette, inputs.text, palette.ink),
  );
}

/** Only the recipes that differ from the CSS fallbacks. Emitting the rest
 *  would be noise, and would also hide which grounds are actually tight. */
export function compressedRecipes(palette: ColorPalette): RecipeRungs[] {
  return colorRecipeIds
    .map((recipe) => ({ recipe, rungs: recipeRungs(palette, recipe) }))
    .filter(({ rungs }) => !isStandard(rungs));
}

/**
 * Rounded UP, always, and that direction is the whole point.
 *
 * A higher percentage keeps more of the text source, so it lands with more
 * contrast, not less. `resolveRungPercentages` bisects to the smallest step
 * that still reads - round that to the nearest tenth and half the time you
 * land just under the value it just guaranteed. Measured in Chrome: the brand
 * ground's faintest rung came out at 2.99 against a floor of 3.00, because
 * 68.34% was written as 68.3%.
 *
 * Two decimal places would shrink the error rather than remove it. Rounding
 * up removes it, and costs a rounding error's worth of de-emphasis.
 */
const percent = (value: number) =>
  `${(Math.ceil(value * 1000) / 10).toFixed(1)}%`;

/**
 * The CSS the promoted block carries for those recipes.
 *
 * Declared on the painting surface rather than on its children: these are
 * plain percentages, so they inherit down to wherever the mix reads them
 * without the substitution problem that forces the scales themselves to be
 * re-declared at every scope. Card contexts reset them, because a card is a
 * different ground from the section it sits on.
 *
 * Emitted into the promoted block rather than written into `globals.css` by
 * hand, because the answer depends on the authored palette and CSS cannot ask
 * how far apart two colours are. The block regenerates on every promote, so
 * this cannot go stale the way a stored value would.
 */
export function rungOverrideCss(palette: ColorPalette): string {
  const compressed = compressedRecipes(palette);

  if (compressed.length === 0) return "";

  const rules = compressed
    .map(
      ({ recipe, rungs }) => `.pagebuilder-paint-surface[data-pagebuilder-color-recipe="${recipe}"] {
  --rung-body: ${percent(rungs.body)};
  --rung-muted: ${percent(rungs.muted)};
  --rung-meta: ${percent(rungs.meta)};
}`,
    )
    .join("\n");

  return `
/* Text hierarchy spread, for grounds that cannot afford the standard one.
   The ladder steps toward the ground, so a ground close to its text source has
   less room to step - these recipes keep all three levels distinguishable by
   sitting them closer together rather than by letting the faintest one fall
   away. Recomputed from the palette on every promote; see color-rungs.ts. */
${rules}`;
}

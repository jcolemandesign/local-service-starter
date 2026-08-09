/**
 * The recipes offered in the builder.
 *
 * The ids must match `colorRecipeIds` in `color-recipe-inputs.ts`, which is
 * where each recipe's actual colour inputs live; this list only adds the
 * labels and the ordering the pickers use. A test asserts the two agree.
 *
 * Three of these grounds are chromatic and three are dark, which is why the
 * CTA treatment is a function of the ground rather than a per-recipe choice -
 * see section 4d of `reference code/color-system-phase-1.txt`.
 */
export const sectionColorRecipes = [
  { id: "page", label: "Page" },
  { id: "surface", label: "Surface" },
  { id: "ink", label: "Ink" },
  { id: "dark", label: "Dark" },
  { id: "darkSurface", label: "Dark Surface" },
  { id: "brand", label: "Brand" },
  /**
   * Optional. `accent` is the CTA-appropriate derivative of the brand colour,
   * needed only when the brand colour itself lacks contrast as a button, so a
   * palette may leave it unauthored. When it is unset this recipe is hidden
   * from the pickers - but it still renders for pages that already reference
   * it, with its ground falling back to brand. Hiding governs authoring, not
   * data.
   */
  { id: "accent", label: "Accent" },
  { id: "highlight", label: "Highlight" },
] as const;

export type SectionColorRecipe = (typeof sectionColorRecipes)[number]["id"];
/** Card background + shadow. Independent of SectionCardBorder. */
export type SectionCardFill = "solid" | "none";
/** Card outline. Independent of SectionCardFill, so a card can be transparent
 *  but still outlined, or filled with no outline. */
export type SectionCardBorder = "on" | "off";
/**
 * Which of the two border-color formulas an outlined card draws with.
 *
 * "dark" steps lightness down from the card surface and only reaches
 * meaningful contrast on a light card; "light" steps up and only reaches it
 * on a dark card. Which one is correct depends on the color recipe *and* the
 * business's own accent color, so it is a per-section choice rather than
 * something baked into a recipe row. Independent of SectionCardBorder - the
 * tone only matters once the border is on. See `derivedColorValues` in
 * `color-derivations.ts` for the two formulas.
 */
export type SectionCardBorderTone = "dark" | "light";
/** Section-level background paint. Kept separate from card fill so navigation
 *  can expose transparent chrome without also removing grouped nav surfaces. */
export type SectionBackgroundFill = "solid" | "none";

/**
 * Recipe ids that were renamed, mapped to what they are called now.
 *
 * `muted` became `surface` when the recipes were specified as element/token
 * tables: the ground is the surface token, and "muted" was already the name of
 * a text colour, so one word meant two things. The old id stays readable
 * forever rather than being migrated out of saved data - it is written into
 * page templates, staged pages and the builder's saved options, two of which
 * the dev server rewrites on its own schedule. An alias cannot race anything;
 * a migration can.
 */
const renamedSectionColorRecipes: Record<string, SectionColorRecipe> = {
  muted: "surface",
  /**
   * `default` became `page` when the recipe set grew to eight and every recipe
   * was named for its ground. "Default" described a position in a list rather
   * than a colour, and with eight recipes the list no longer has a default.
   *
   * Same reasoning as `muted` above: aliased rather than migrated, because the
   * id is written into page templates, staged pages and the builder's saved
   * options, and the dev server rewrites several of those on its own schedule.
   */
  default: "page",
};

export function isSectionColorRecipe(value: string | undefined): value is SectionColorRecipe {
  return sectionColorRecipes.some((recipe) => recipe.id === value);
}

/**
 * The recipe a stored value means today, or undefined if it means nothing.
 *
 * Every read of a persisted recipe should come through here rather than
 * comparing against the id directly, so a renamed recipe keeps rendering
 * instead of silently falling back to the default.
 */
export function resolveSectionColorRecipe(
  value: string | undefined,
): SectionColorRecipe | undefined {
  if (isSectionColorRecipe(value)) {
    return value;
  }

  return value ? renamedSectionColorRecipes[value] : undefined;
}

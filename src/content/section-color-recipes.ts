export const sectionColorRecipes = [
  { id: "default", label: "Default" },
  { id: "surface", label: "Surface" },
  { id: "dark", label: "Dark" },
  { id: "accent", label: "Accent" },
  /**
   * Ink inverts the palette's roles rather than introducing colours of its own:
   * the ink token becomes the ground, the muted token becomes the card, and the
   * raised token becomes the text. Every other value in the recipe is derived
   * from those three so the elevation reads the same way it does on a light
   * ground - each step up is a step toward the text token, each step down a step
   * toward the ground - and the CTA falls to the highlight, which is the only
   * saturated colour that survives on a field this dark.
   */
  { id: "ink", label: "Ink" },
] as const;

export type SectionColorRecipe = (typeof sectionColorRecipes)[number]["id"];
/** Card background + shadow. Independent of SectionCardBorder. */
export type SectionCardFill = "solid" | "none";
/** Card outline. Independent of SectionCardFill, so a card can be transparent
 *  but still outlined, or filled with no outline. */
export type SectionCardBorder = "on" | "off";
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

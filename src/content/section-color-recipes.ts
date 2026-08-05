export const sectionColorRecipes = [
  { id: "default", label: "Default" },
  { id: "muted", label: "Muted" },
  { id: "dark", label: "Dark" },
  { id: "accent", label: "Accent" },
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

export function isSectionColorRecipe(value: string | undefined): value is SectionColorRecipe {
  return sectionColorRecipes.some((recipe) => recipe.id === value);
}

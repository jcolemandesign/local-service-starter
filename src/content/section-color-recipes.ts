export const sectionColorRecipes = [
  { id: "default", label: "Default" },
  { id: "muted", label: "Muted" },
  { id: "dark", label: "Dark" },
  { id: "accent", label: "Accent" },
] as const;

export type SectionColorRecipe = (typeof sectionColorRecipes)[number]["id"];
export type SectionCardFill = "solid" | "none";

export function isSectionColorRecipe(value: string | undefined): value is SectionColorRecipe {
  return sectionColorRecipes.some((recipe) => recipe.id === value);
}

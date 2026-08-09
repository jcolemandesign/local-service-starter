"use client";

import type { SectionColorRecipe } from "@/content/section-color-recipes";
import { useAvailableColorRecipes } from "@/utils/use-available-recipes";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

/**
 * Keyed by recipe id so adding a recipe without describing it is a type error
 * rather than a silently blank card.
 *
 * Each line names the ground, the card and the CTA treatment, because those
 * three are what actually differ - the text hierarchy derives from the ground
 * in every recipe and so is not worth repeating eight times.
 */
const recipeDescriptions: Record<SectionColorRecipe, string> = {
  page: "Page ground, lifted cards, brand CTA.",
  surface: "Surface ground, brand-washed cards, brand CTA.",
  ink: "Ink ground, dark cards, tinted brand CTA.",
  dark: "Dark ground, dark-surface cards, tinted brand CTA.",
  darkSurface: "Dark-surface ground, dark cards, tinted brand CTA.",
  brand: "Brand ground, ink cards, white CTA.",
  accent: "Accent ground, dark cards, white CTA. Hidden unless accent is set.",
  highlight: "Highlight ground, dark cards, white CTA and stroke.",
};

export function StyleGuideColorRecipeControls() {
  const { draft, updateDrafts } = useStyleGuideTokens();
  // Pass the unsaved draft so the list responds while the editor is still
  // picking, not only after a save.
  const availableRecipes = useAvailableColorRecipes({
    accent: draft.ctaAccent,
  });

  return (
    <div className="grid gap-6">
      <div>
        <p className="type-label text-service-accent">Section recipes</p>
        <div className="mt-3 grid grid-cols-2 gap-3 max-md:grid-cols-1">
          {availableRecipes.map((recipe) => (
            <div className="rounded border border-service-border bg-bg-page p-3" key={recipe.id}>
              <p className="text-sm font-semibold text-service-ink">{recipe.label}</p>
              <p className="type-caption mt-2 text-service-muted">
                {recipeDescriptions[recipe.id]}
              </p>
            </div>
          ))}
        </div>
        <p className="type-caption mt-3 text-service-muted">
          Recipes are assigned per section in Pagebuilder. Card fill is a separate solid or transparent treatment.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
        <label className="grid gap-2">
          <span className="type-caption font-semibold text-service-ink">Accent ink</span>
          <input
            className="h-10 w-full cursor-pointer rounded border border-service-border bg-bg-page p-1"
            onChange={(event) => updateDrafts({ accentInk: event.target.value })}
            type="color"
            value={draft.accentInk}
          />
        </label>
        <label className="grid gap-2">
          <span className="type-caption font-semibold text-service-ink">Accent muted text</span>
          <input
            className="h-10 w-full cursor-pointer rounded border border-service-border bg-bg-page p-1"
            onChange={(event) => updateDrafts({ accentMutedText: event.target.value })}
            type="color"
            value={draft.accentMutedText}
          />
        </label>
      </div>
    </div>
  );
}

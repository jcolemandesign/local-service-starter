"use client";

import { sectionColorRecipes } from "@/content/section-color-recipes";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

export function StyleGuideColorRecipeControls() {
  const { draft, updateDrafts } = useStyleGuideTokens();

  return (
    <div className="grid gap-6">
      <div>
        <p className="type-label text-service-accent">Section recipes</p>
        <div className="mt-3 grid grid-cols-5 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
          {sectionColorRecipes.map((recipe) => (
            <div className="rounded border border-service-border bg-bg-page p-3" key={recipe.id}>
              <p className="text-sm font-semibold text-service-ink">{recipe.label}</p>
              <p className="type-caption mt-2 text-service-muted">
                {recipe.id === "default" && "Page ground, surface cards, accent CTA."}
                {recipe.id === "surface" && "Surface ground, raised cards, accent CTA."}
                {recipe.id === "dark" && "Dark ground, light surface cards, accent CTA."}
                {recipe.id === "accent" && "Accent ground, dark cards, raised-token CTA."}
                {recipe.id === "ink" && "Ink ground, dark cards, highlight CTA."}
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

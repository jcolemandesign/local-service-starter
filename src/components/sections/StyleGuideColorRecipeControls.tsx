"use client";

import { sectionColorRecipes } from "@/content/section-color-recipes";
import {
  styleGuideColorPalettes,
  useStyleGuideTokens,
} from "@/components/sections/StyleGuideLiveSurface";

export function StyleGuideColorRecipeControls() {
  const { draft, selectColorPalette, updateDrafts } = useStyleGuideTokens();

  return (
    <div className="grid gap-6">
      <div>
        <p className="type-label text-service-accent">Palettes</p>
        <div className="mt-3 grid grid-cols-3 gap-3 max-md:grid-cols-1">
          {styleGuideColorPalettes.map((palette) => (
            <button
              className={`style-guide-palette-tab rounded border p-3 text-left transition-colors hover:border-service-accent ${
                draft.activeColorPaletteId === palette.id
                  ? "border-service-accent bg-service-surface"
                  : "border-service-border bg-bg-page"
              }`}
              key={palette.id}
              aria-pressed={draft.activeColorPaletteId === palette.id}
              onClick={() => selectColorPalette(palette.id)}
              type="button"
            >
              <span className="block text-sm font-semibold text-service-ink">
                {palette.name}
              </span>
              <span className="mt-3 flex gap-1.5" aria-hidden="true">
                {[palette.tokens.bgPage, palette.tokens.serviceSurface, palette.tokens.serviceAccent, palette.tokens.bgDark].map((color) => (
                  <span className="size-5 rounded-sm border border-black/10" key={color} style={{ backgroundColor: color }} />
                ))}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="type-label text-service-accent">Section recipes</p>
        <div className="mt-3 grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
          {sectionColorRecipes.map((recipe) => (
            <div className="rounded border border-service-border bg-bg-page p-3" key={recipe.id}>
              <p className="text-sm font-semibold text-service-ink">{recipe.label}</p>
              <p className="type-caption mt-2 text-service-muted">
                {recipe.id === "default" && "Page field with service-surface cards."}
                {recipe.id === "muted" && "Service-surface field with page cards."}
                {recipe.id === "dark" && "Dark field with light service-surface cards."}
                {recipe.id === "accent" && "Accent field with palette-safe contrast text."}
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

import { describe, expect, it } from "vitest";

import {
  isSectionColorRecipe,
  resolveSectionColorRecipe,
  sectionColorRecipes,
} from "@/content/section-color-recipes";
import pageTemplates from "@/content/page-templates.json";
import pagebuilderOptions from "@/content/pagebuilder-options.json";

/**
 * `muted` was renamed to `surface`, and it is written into 67 places across the
 * saved page templates, staged pages and builder options - none of which were
 * migrated, deliberately: two of those files are rewritten by the dev server on
 * its own schedule, so an alias cannot race anything where a migration can.
 *
 * The failure this guards against is silent. An unresolved recipe does not
 * throw; it falls back to `default`, and a page that was designed on the
 * surface ground quietly renders on the page ground instead. Nothing in lint,
 * typecheck or export validation can see that.
 */
describe("renamed colour recipes", () => {
  it("resolves the old muted id to surface", () => {
    expect(resolveSectionColorRecipe("muted")).toBe("surface");
  });

  it("still resolves every current id to itself", () => {
    sectionColorRecipes.forEach((recipe) => {
      expect(resolveSectionColorRecipe(recipe.id), recipe.id).toBe(recipe.id);
    });
  });

  it("resolves nothing for an unknown or missing value", () => {
    expect(resolveSectionColorRecipe("neon")).toBeUndefined();
    expect(resolveSectionColorRecipe("")).toBeUndefined();
    expect(resolveSectionColorRecipe(undefined)).toBeUndefined();
  });

  /** The alias is a read path only - `muted` must not come back as a choice. */
  it("does not offer the old id in the builder", () => {
    expect(isSectionColorRecipe("muted")).toBe(false);
    expect(sectionColorRecipes.map((recipe) => recipe.id)).not.toContain(
      "muted",
    );
  });

  /**
   * The real corpus. Every recipe value sitting in saved project data has to
   * resolve to something, or the page it belongs to has silently lost its
   * ground.
   */
  it("resolves every recipe value in saved project data", () => {
    const saved = JSON.stringify([pageTemplates, pagebuilderOptions]);
    const values = Array.from(
      saved.matchAll(/"colorRecipe":"([a-z-]*)"/g),
      (match) => match[1],
    ).filter(Boolean);

    expect(values.length).toBeGreaterThan(0);

    const unresolved = Array.from(new Set(values)).filter(
      (value) => !resolveSectionColorRecipe(value),
    );

    expect(unresolved).toEqual([]);
  });
});

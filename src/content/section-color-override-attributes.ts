import {
  type CardSurfaceState,
  colorOverrideAttributes,
} from "@/content/color-overrides";
import type { ColorPalette } from "@/content/color-recipe-inputs";
import { resolveSectionColorRecipe } from "@/content/section-color-recipes";
import {
  cardStyleComponents,
  resolveCardBorder,
  resolveCardFill,
} from "@/content/section-style-options";

/**
 * The colour-override attributes a section frame carries, from a section
 * record.
 *
 * Every render path needs the same four decisions made the same way - which
 * recipe is in force, whether the section renders a card at all, what its fill
 * and border resolved to, and only then what the override paints. Three of
 * those already have shared resolvers; this is the fourth, and it exists so
 * the builder canvas, the staged preview and the export cannot each answer
 * them slightly differently.
 *
 * BAND MEMBERS NEED NO SPECIAL CASE. `withBandRecipe` has already substituted
 * the band's recipe onto every member by the time a section reaches a frame,
 * so `section.colorRecipe` is the effective ground here whether or not the
 * section is in a band. The CSS side needs no case either: the override
 * composes against `--recipe-ground`, which a band member inherits from the
 * band wrapper.
 */

export type SectionColorOverrideSource = {
  component: string;
  colorRecipe?: string;
  cardFill?: string;
  cardBorder?: string;
  cardSwatch?: string;
  cardIntensity?: string;
  borderSwatch?: string;
  borderIntensity?: string;
};

export function sectionColorOverrideAttributes(
  section: SectionColorOverrideSource,
  palette: ColorPalette,
): Record<string, string> {
  /**
   * A section that renders no card has no card colour to override. Gating on
   * the same membership set the pickers gate on is what stops a stored value
   * from painting something on a section whose control was never offered -
   * saved data outlives the registry, and a section can leave the set.
   */
  if (!cardStyleComponents.has(section.component)) return {};

  const surface: CardSurfaceState = {
    fill: resolveCardFill(section.component, section.cardFill),
    border: resolveCardBorder(section.component, section.cardBorder),
  };

  return colorOverrideAttributes(
    palette,
    resolveSectionColorRecipe(section.colorRecipe) ?? "page",
    section,
    surface,
  );
}

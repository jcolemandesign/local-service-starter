import type { ColorPalette } from "@/content/color-recipe-inputs";
import { mixOklab } from "@/utils/color-scales";

/**
 * The one place the style guide's stored token names are translated into the
 * colour system's palette names.
 *
 * The two vocabularies disagree, and the stored one cannot be renamed. Saved
 * slots, staged pages, page templates and approval records all carry these
 * keys, and the dev server rewrites several of those files on its own
 * schedule - a rename can race that, an adapter cannot. So the storage keeps
 * its names forever and this function is where they stop mattering.
 *
 * The mapping that surprises people:
 *
 *   serviceAccent -> brand       the business's actual colour
 *   accent        -> highlight   the "warm accent", a third chromatic
 *   (new)         -> accent      the optional CTA derivative of brand
 *
 * `accent` therefore means something different on each side of this function.
 * That is precisely why the translation is centralised rather than done at
 * each call site.
 */

export type StoredColorTokens = {
  bgPage: string;
  serviceSurface: string;
  surfaceRaised: string;
  serviceInk: string;
  bgDark: string;
  serviceAccent: string;
  accent: string;
  /** Optional, added by the colour system overhaul. Absent on every slot saved
   *  before it, hence the derivations below. */
  bgDarkSurface?: string;
  ctaAccent?: string;
};

/**
 * A card for a dark ground, when none has been authored.
 *
 * Lifting the dark swatch is the only derivation that works without a second
 * authored colour: stepping it down would collide with ink, and reusing ink
 * makes the card a different hue family from its ground. 12% toward white puts
 * the reference palette's card at 1.39 against its ground - the same range as
 * the authored #24566a at 1.34, and comfortably above the 1.15 floor where a
 * card stops reading as one.
 *
 * Expressed as a mix toward white so it agrees exactly with the CSS fallback,
 * which cannot use `oklch(from ...)` arithmetic inside `color-mix`.
 */
export function deriveDarkSurface(dark: string): string {
  return mixOklab("#ffffff", dark, 0.12);
}

export function toColorPalette(tokens: StoredColorTokens): ColorPalette {
  return {
    page: tokens.bgPage,
    surface: tokens.serviceSurface,
    raised: tokens.surfaceRaised,
    ink: tokens.serviceInk,
    dark: tokens.bgDark,
    darkSurface: tokens.bgDarkSurface || deriveDarkSurface(tokens.bgDark),
    brand: tokens.serviceAccent,
    // Optional by design. Unset means the brand colour already works as a CTA,
    // which hides the Accent recipe from the pickers and falls its consumers
    // back to brand. See `resolveSwatch`.
    accent: tokens.ctaAccent || undefined,
    highlight: tokens.accent,
  };
}

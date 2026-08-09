import type { ColorPalette } from "@/content/color-recipe-inputs";
import { contrastRatio, mixOklab } from "@/utils/color-scales";

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
 *
 * THREE VOCABULARIES ARE LIVE AT ONCE. This function covers stored -> plan.
 * The CSS `--palette-*` layer is a third set of names, and it is listed here
 * so there is one file to read rather than a comment to find in globals.css:
 *
 *   plan / palette   stored token      CSS custom property
 *   ---------------------------------------------------------------
 *   page             bgPage            --palette-page
 *   surface          serviceSurface    --palette-surface
 *   raised           surfaceRaised     --palette-raised
 *   ink              serviceInk        --palette-ink
 *   dark             bgDark            --palette-dark
 *   darkSurface      bgDarkSurface     --palette-dark-surface
 *   brand            serviceAccent     --palette-brand  (= --palette-accent)
 *   accent           ctaAccent         --palette-cta-accent
 *   highlight        accent            --palette-highlight
 *
 * `--palette-brand` and `--palette-accent` deliberately point at the same
 * token: the stored name is `serviceAccent` and renaming it would race the
 * files the dev server rewrites. `--palette-cta-accent` is the optional
 * derivative, and falls back to brand when unauthored.
 *
 * The retired names - `serviceMuted`, `accentInk`, `accentMutedText`,
 * `serviceBorder` - have no row here on purpose. They are inert: still
 * readable in saved data, no longer consumed by anything.
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
  const preferred = mixOklab("#ffffff", dark, PREFERRED_LIFT);

  if (contrastRatio(preferred, dark) >= DERIVED_CARD_FLOOR) {
    return preferred;
  }

  /**
   * Near-black grounds need more than the preferred lift.
   *
   * Contrast against a ground of luminance ~0 is (L + 0.05) / 0.05, so a fixed
   * proportional mix barely moves it: 12% toward white from #000000 lands at
   * 1.04, under the floor where a card stops reading as one. A business
   * authoring pure black as its dark would get an invisible card.
   *
   * Raising the constant for everyone was the alternative and it costs more
   * than it fixes - 20% clears black at 1.16 but drags the reference palette's
   * card from 1.39 to 1.73, changing the look of every dark recipe to
   * accommodate an edge case. Lifting only where the preferred value fails
   * keeps the intent intact and confines the correction to the palettes that
   * need it.
   */
  for (let lift = PREFERRED_LIFT + STEP; lift <= MAX_LIFT; lift += STEP) {
    const candidate = mixOklab("#ffffff", dark, lift);

    if (contrastRatio(candidate, dark) >= DERIVED_CARD_FLOOR) {
      return candidate;
    }
  }

  return mixOklab("#ffffff", dark, MAX_LIFT);
}

/** What the derivation aims for: reproduces the reference palette's authored
 *  card at 1.39, against its authored 1.34. */
const PREFERRED_LIFT = 0.12;
/** A little headroom over the 1.15 floor, so a derived card is not sitting on
 *  the exact boundary where it stops reading. */
const DERIVED_CARD_FLOOR = 1.2;
const STEP = 0.02;
/** Past this the "card" is no longer a dark surface in any meaningful sense.
 *  A palette needing more should author the swatch. */
const MAX_LIFT = 0.4;

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

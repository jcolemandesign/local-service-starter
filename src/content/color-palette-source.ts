import type { StoredColorTokens } from "@/content/color-palette-adapter";

/**
 * Which CSS custom property each stored palette token is read from, and what
 * the palette is before anything has been promoted.
 *
 * There are two places that need this and they cannot share a reader: the
 * server render paths parse `globals.css` off disk, and the builder reads the
 * live values out of the DOM. Both are legitimate - the builder has no
 * filesystem and the server has no `getComputedStyle` - but if they disagree
 * about which property feeds `raised`, the same section renders one polarity
 * in the preview and another on the page, which is the hardest class of bug
 * this system can produce because both halves look right in isolation.
 *
 * So the mapping lives here, with no imports that tie it to either
 * environment, and both readers supply only a lookup function.
 */

/**
 * The palette before anything has been promoted.
 *
 * These are the `@theme inline` fallbacks from `globals.css`, copied rather
 * than derived because they are written inline inside `var()` calls and there
 * is nothing to import. `promoted-palette.test.ts` asserts each still matches
 * the stylesheet, so the copy cannot rot quietly.
 *
 * A cold start is not hypothetical: a fresh clone of this starter has no
 * promoted block at all, and every section still has to render.
 */
export const coldStartTokens: StoredColorTokens = {
  bgPage: "#fbfaf6",
  serviceSurface: "#f4f7f3",
  surfaceRaised: "#fafcf9",
  serviceInk: "#17211d",
  bgDark: "#10141b",
  serviceAccent: "#1f7a5a",
  accent: "#c45a2c",
};

/**
 * Only the nine tokens the colour system consumes. The promoted block also
 * carries type, spacing and radius rows, and several colour rows that are
 * `oklch(from ...)` expressions rather than literals - none of which the
 * palette needs, and all of which this ignores.
 */
export const paletteTokenSources: Record<keyof StoredColorTokens, string> = {
  bgPage: "--live-bg-page",
  serviceSurface: "--live-service-surface",
  surfaceRaised: "--live-surface-raised",
  serviceInk: "--live-service-ink",
  bgDark: "--live-bg-dark",
  serviceAccent: "--live-service-accent",
  accent: "--live-accent",
  bgDarkSurface: "--live-bg-dark-surface",
  ctaAccent: "--live-cta-accent",
};

/** Stable order, so a reader can build a comparable snapshot string without
 *  re-deciding the order and accidentally making every snapshot unique. */
export const paletteTokenNames = Object.values(paletteTokenSources);

/**
 * Six-digit hex only.
 *
 * A token whose value is a `color-mix()` or an `oklch(from ...)` expression
 * cannot be fed to the scales, which work on RGB triples. Treating it as unset
 * makes it fall back here rather than fail somewhere further from its cause -
 * and both are real: `--live-service-border` is an `oklch(from ...)`
 * expression in every promoted block this repo has written.
 */
const hexPattern = /^#[0-9a-f]{6}$/i;

/**
 * Build the stored token set from whatever the caller can see.
 *
 * `lookup` returns the raw CSS value for a custom property, or something falsy
 * if it is not declared. Both readers hand in their own.
 */
export function tokensFromLookup(
  lookup: (cssVariable: string) => string | undefined | null,
): StoredColorTokens {
  const read = (key: keyof StoredColorTokens) => {
    const value = lookup(paletteTokenSources[key])?.trim();

    return value && hexPattern.test(value) ? value.toLowerCase() : undefined;
  };

  return {
    bgPage: read("bgPage") ?? coldStartTokens.bgPage,
    serviceSurface: read("serviceSurface") ?? coldStartTokens.serviceSurface,
    surfaceRaised: read("surfaceRaised") ?? coldStartTokens.surfaceRaised,
    serviceInk: read("serviceInk") ?? coldStartTokens.serviceInk,
    bgDark: read("bgDark") ?? coldStartTokens.bgDark,
    serviceAccent: read("serviceAccent") ?? coldStartTokens.serviceAccent,
    accent: read("accent") ?? coldStartTokens.accent,
    /**
     * These two stay undefined when unset, and it is load-bearing.
     * `toColorPalette` derives `darkSurface` from `dark`, and an unset
     * `ctaAccent` is what hides the Accent recipe from the pickers. Defaulting
     * either to a colour would quietly turn an authoring choice into a value.
     */
    bgDarkSurface: read("bgDarkSurface"),
    ctaAccent: read("ctaAccent"),
  };
}

import { readFileSync, statSync } from "node:fs";
import path from "node:path";

import { toColorPalette } from "@/content/color-palette-adapter";
import {
  coldStartTokens,
  tokensFromLookup,
} from "@/content/color-palette-source";
import type { StoredColorTokens } from "@/content/color-palette-adapter";
import type { ColorPalette } from "@/content/color-recipe-inputs";

/**
 * Where a server render path gets the palette.
 *
 * Card text polarity is the one value the colour system cannot express in CSS
 * - there is no way to ask how light a `color-mix()` result is - so it
 * resolves in TypeScript and ships as an attribute. That works in the builder,
 * which reads computed styles out of the DOM, and in export, which already
 * reads `globals.css`. The server render paths had neither: no browser to
 * measure and no palette to compute from.
 *
 * THREE OPTIONS WERE ON THE TABLE. This is the one that was taken, and the
 * reasoning matters more than the code:
 *
 *   1. Store the resolved polarity alongside the override. Rejected. Polarity
 *      is a function of the palette, and the palette is re-authored in the
 *      style guide whenever a business's colours change. A stored polarity is
 *      correct until the first re-promote and silently wrong after it - on
 *      exactly the sections someone bothered to override, and visible only as
 *      unreadable card text nobody is looking at.
 *   2. Duplicate the palette into a TypeScript constant. Rejected for the same
 *      reason one step removed: two sources kept in step by hand, with no test
 *      able to say which one is stale.
 *   3. Parse the promoted block out of `globals.css`. Taken. That block IS the
 *      palette - it is what the browser paints from - so reading it cannot
 *      disagree with what renders. A palette change moves every override with
 *      it for free, which is the same property that made overrides store
 *      semantic intent rather than resolved colour.
 *
 * The cost of (3) is a synchronous file read on the server, memoized against
 * the file's mtime - so the steady state is a `statSync` per render rather
 * than a parse, and the invalidation is real, which matters because promoting
 * rewrites this file while the dev server is running.
 */

const globalsPath = path.join(process.cwd(), "src", "app", "globals.css");

const beginMarker = "/* BEGIN PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";
const endMarker = "/* END PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";

export function parsePromotedTokens(css: string): StoredColorTokens {
  const beginIndex = css.indexOf(beginMarker);
  const endIndex = css.indexOf(endMarker);

  // No promoted block is the cold-start case, not an error. A fresh clone has
  // to render.
  if (beginIndex < 0 || endIndex < beginIndex) return { ...coldStartTokens };

  const declared = new Map<string, string>();

  for (const [, name, value] of css
    .slice(beginIndex, endIndex)
    .matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    declared.set(name, value.trim());
  }

  return tokensFromLookup((cssVariable) => declared.get(cssVariable));
}

let cached: { mtimeMs: number; palette: ColorPalette } | null = null;

/**
 * The promoted palette, memoized against the stylesheet's mtime.
 *
 * The mtime check is not an optimisation detail - promoting from the style
 * guide rewrites `globals.css` underneath a running dev server, and a palette
 * cached for the process lifetime would keep every card's polarity pinned to
 * the colours that were in force when the server booted.
 */
export function readPromotedPalette(): ColorPalette {
  try {
    const { mtimeMs } = statSync(globalsPath);

    if (cached?.mtimeMs === mtimeMs) return cached.palette;

    const palette = toColorPalette(
      parsePromotedTokens(readFileSync(globalsPath, "utf8")),
    );

    cached = { mtimeMs, palette };

    return palette;
  } catch {
    /**
     * An unreadable stylesheet must not take the page down. Polarity is a
     * legibility refinement on overridden cards; every other colour still
     * resolves in CSS, so the cold-start palette renders a correct page with
     * possibly one wrong text polarity rather than no page at all.
     */
    return toColorPalette(coldStartTokens);
  }
}

/** Test seam. The memo is keyed on mtime, which does not move within a run
 *  that writes fixtures faster than the filesystem's timestamp resolution. */
export function clearPromotedPaletteCache() {
  cached = null;
}

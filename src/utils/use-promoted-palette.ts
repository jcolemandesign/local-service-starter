"use client";

import { useSyncExternalStore } from "react";

import { toColorPalette } from "@/content/color-palette-adapter";
import {
  coldStartTokens,
  paletteTokenNames,
  paletteTokenSources,
  tokensFromLookup,
} from "@/content/color-palette-source";
import type { ColorPalette } from "@/content/color-recipe-inputs";

/**
 * The promoted palette, for client surfaces.
 *
 * The builder needs it for the same reason the server render paths do - card
 * text polarity resolves in TypeScript - but it cannot read `globals.css` off
 * disk. It reads the live custom properties instead, which is asking the same
 * authority a different way: the promoted block declares these on `:root`, and
 * they are what the browser is actually painting from.
 *
 * Deliberately the same shape as `use-available-recipes`, and for the same
 * reason given there: pagebuilder has no token context, the style guide owns
 * that, and reading the computed property keeps this usable from any client
 * surface without threading a palette through the tree.
 */

/**
 * Distinguishes "not read yet" from "read, and nothing is promoted".
 *
 * Without it the server render would build a cold-start palette, the client
 * would immediately build the promoted one, and every card polarity attribute
 * would differ between the two - a hydration mismatch on every builder screen.
 * Returning the same sentinel from both sides makes the first client render
 * agree with the server, and the subscription then updates it.
 */
const NOT_READ = "__not-read__";

/**
 * The live values as one string, because `useSyncExternalStore` compares
 * snapshots with `Object.is`: returning a fresh object each call would
 * re-render forever. A string compares by value, so an unchanged stylesheet is
 * a stable snapshot.
 */
function readSnapshot() {
  if (typeof document === "undefined") return NOT_READ;

  const computed = getComputedStyle(document.documentElement);

  return paletteTokenNames
    .map((token) => computed.getPropertyValue(token).trim())
    .join("|");
}

function serverSnapshot() {
  return NOT_READ;
}

/**
 * Nothing pushes a palette change at us - promoting rewrites `globals.css`,
 * which Next's dev server reloads as a stylesheet swap rather than as an event
 * this could subscribe to. So the store never notifies, and the snapshot is
 * re-read on each render pass React schedules for other reasons.
 *
 * That is enough here: the builder re-renders constantly as sections are
 * selected and edited, and a palette promote is not a thing that happens
 * mid-drag. The alternative - polling `getComputedStyle` on an interval -
 * costs a forced style recalculation per tick for a change that happens a
 * handful of times a session.
 */
function subscribe() {
  return () => {};
}

const coldStart = toColorPalette(coldStartTokens);

export function usePromotedPalette(): ColorPalette {
  const snapshot = useSyncExternalStore(
    subscribe,
    readSnapshot,
    serverSnapshot,
  );

  if (snapshot === NOT_READ) return coldStart;

  const values = new Map(
    paletteTokenNames.map((token, index) => [token, snapshot.split("|")[index]]),
  );

  return toColorPalette(
    tokensFromLookup((cssVariable) => values.get(cssVariable)),
  );
}

/** Exported for the test that asserts both readers agree on the token map. */
export { paletteTokenSources };

"use client";

import { useSyncExternalStore } from "react";

import {
  type ColorRecipeId,
  recipeInputs,
} from "@/content/color-recipe-inputs";
import { sectionColorRecipes } from "@/content/section-color-recipes";

/**
 * Which colour recipes can be offered right now.
 *
 * A recipe whose defining swatch is unauthored has no ground. Offering it
 * would let an editor pick a recipe that renders as a duplicate of another one
 * - the Accent recipe falls back to brand - so it is hidden from the pickers.
 *
 * HIDING IS NOT THE SAME AS NOT RENDERING. Saved pages may already name a
 * recipe that has since become unavailable, and those pages still have to
 * paint. That half is handled in CSS, where `--palette-cta-accent` carries the
 * fallback to brand, and it deliberately does not consult this hook.
 *
 * WHY THIS READS COMPUTED CSS RATHER THAN A TOKEN OBJECT.
 * Pagebuilder has no token context - the style guide owns that - and the thing
 * that actually decides what renders is the promoted `globals.css` block, not
 * any in-memory draft. Reading the live custom property asks the authority
 * directly, and it keeps this hook usable from any client surface without
 * threading a palette through the tree.
 *
 * The style guide is the exception and should pass its draft, so the list
 * responds while the editor is still dragging a picker rather than only after
 * a save.
 */

/** The swatch each conditional recipe needs, as a live CSS custom property. */
const requiredLiveTokens: Partial<Record<ColorRecipeId, string>> = {
  accent: "--live-cta-accent",
};

function readsAsAuthored(value: string | undefined | null) {
  return Boolean(value && value.trim());
}

export function availableRecipeIds(
  isAuthored: (recipeId: ColorRecipeId) => boolean,
) {
  return sectionColorRecipes.filter((recipe) => {
    const required = (recipeInputs[recipe.id] as { requiresSwatch?: string })
      .requiresSwatch;

    return !required || isAuthored(recipe.id);
  });
}

const orderedTokens = Object.values(requiredLiveTokens);

/**
 * Distinguishes "not read yet" from "read, and the token is empty".
 *
 * Without it the server render would treat every conditional recipe as
 * unauthored and hide it, then the client would add it back - a hydration
 * mismatch on every builder screen.
 */
const NOT_READ = "__not-read__";

/**
 * The live values as one string, because `useSyncExternalStore` compares
 * snapshots with Object.is: returning a fresh object each call would re-render
 * forever. A string compares by value, so an unchanged stylesheet is a stable
 * snapshot.
 */
function readLiveTokens() {
  const computed = getComputedStyle(document.documentElement);

  return orderedTokens
    .map((token) => computed.getPropertyValue(token).trim())
    .join("|");
}

function serverSnapshot() {
  return NOT_READ;
}

/** The promoted stylesheet only changes on navigation or a dev-server reload,
 *  both of which remount this. There is nothing to subscribe to. */
function subscribe() {
  return () => {};
}

export function useAvailableColorRecipes(
  overrides?: Partial<Record<ColorRecipeId, string | undefined>>,
) {
  const snapshot = useSyncExternalStore(
    subscribe,
    readLiveTokens,
    serverSnapshot,
  );
  const values = snapshot === NOT_READ ? null : snapshot.split("|");

  return availableRecipeIds((recipeId) => {
    // An explicit override wins - that is the style guide handing us its
    // unsaved draft, which is newer than anything in the stylesheet.
    if (overrides && recipeId in overrides) {
      return readsAsAuthored(overrides[recipeId]);
    }

    // Server render: show everything, so the first client paint matches.
    if (!values) return true;

    const token = requiredLiveTokens[recipeId];
    if (!token) return true;

    return readsAsAuthored(values[orderedTokens.indexOf(token)]);
  });
}

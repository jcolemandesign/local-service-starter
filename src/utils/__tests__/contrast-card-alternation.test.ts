import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  type ColorPalette,
  colorRecipeIds,
  recipeInputs,
  resolveRef,
  resolveSwatch,
} from "@/content/color-recipe-inputs";
import { contrastRatio, isDarkGround } from "@/utils/color-scales";

/**
 * The alternating card has to alternate on every recipe.
 *
 * A run of cards that reads light, light, DARK depends on the odd one out
 * sitting on the other side of the section's ground from its neighbours. That
 * was written as a literal `bg-bg-dark`, which is a fixed token - so it worked
 * on the light recipes and collapsed on the five dark ones, where a dark card
 * sat on a dark ground and the run read as one flat block.
 *
 * The recipes now each name a contrast card opposite their own ground. These
 * assertions are what keep the two halves of that promise: it must be on the
 * far side of the ground from the ordinary card, and its own text must clear
 * it.
 */

const globalsCss = readFileSync(
  path.join(process.cwd(), "src", "app", "globals.css"),
  "utf8",
);

/** The promoted style-guide palette, which is what the builder renders. */
const promoted: ColorPalette = {
  page: "#d1d1d1",
  surface: "#e0e0e0",
  raised: "#ffffff",
  ink: "#133049",
  dark: "#153856",
  darkSurface: "#1e4766",
  brand: "#175c82",
  highlight: "#ce0019",
  accent: "#007cbd",
};

const starter: ColorPalette = {
  page: "#ffffff",
  surface: "#f4f7f3",
  raised: "#ffffff",
  ink: "#17211d",
  dark: "#17211d",
  darkSurface: "#24332c",
  brand: "#1f7a5a",
  highlight: "#d97706",
};

/**
 * The contrast card each recipe declares, read out of the stylesheet.
 *
 * Read rather than restated, because the recipe tables in `globals.css` are the
 * spec - a copy here would be a second table free to drift from the one that
 * actually paints.
 */
function declaredContrastCard(recipe: string) {
  const block = globalsCss.match(
    new RegExp(
      `\\[data-pagebuilder-color-recipe="${recipe}"\\] \\{([\\s\\S]*?)\\n  \\}`,
    ),
  );

  if (!block) throw new Error(`no recipe block for ${recipe}`);

  const fill = block[1].match(/--recipe-contrast-card:\s*var\(--palette-([a-zA-Z-]+)\)/);
  const text = block[1].match(
    /--recipe-contrast-card-text:\s*(#[0-9a-f]{6}|var\(--palette-([a-zA-Z-]+)\))/i,
  );

  if (!fill || !text) throw new Error(`${recipe} declares no contrast card`);

  return { fillSwatch: fill[1], textLiteral: text[1], textSwatch: text[2] };
}

function resolve(palette: ColorPalette, swatch: string) {
  return resolveSwatch(palette, swatch as Parameters<typeof resolveSwatch>[1]);
}

describe("the contrast card alternates on every recipe", () => {
  for (const [name, palette] of [
    ["promoted", promoted],
    ["starter", starter],
  ] as const) {
    for (const id of colorRecipeIds) {
      const inputs = recipeInputs[id];
      const ground = resolveRef(palette, inputs.ground, palette.page);
      const card = resolveRef(palette, inputs.card, ground);
      const declared = declaredContrastCard(id);
      const contrastCard = resolve(palette, declared.fillSwatch);
      const contrastInk = declared.textSwatch
        ? resolve(palette, declared.textSwatch)
        : declared.textLiteral;

      it(`${name}/${id}: the contrast card is opposite the ordinary card`, () => {
        expect(
          isDarkGround(contrastCard),
          `both cards are on the same side of the ground, so a run of them reads as one block`,
        ).not.toBe(isDarkGround(card));
      });

      it(`${name}/${id}: the contrast card separates from the section ground`, () => {
        // The same 1.15 floor the ordinary card is held to - a card that does
        // not clear its ground is not reading as a card.
        expect(contrastRatio(contrastCard, ground)).toBeGreaterThanOrEqual(1.15);
      });

      it(`${name}/${id}: the contrast card's own ink clears it`, () => {
        // The fill is by definition the opposite polarity from everything
        // around it, so it cannot borrow the section's foreground.
        expect(contrastRatio(contrastInk, contrastCard)).toBeGreaterThanOrEqual(
          4.5,
        );
      });
    }
  }
});

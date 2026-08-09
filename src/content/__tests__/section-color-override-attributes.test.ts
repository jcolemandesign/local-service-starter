import { describe, expect, it } from "vitest";

import { toColorPalette } from "@/content/color-palette-adapter";
import { sectionColorOverrideAttributes } from "@/content/section-color-override-attributes";
import { cardStyleComponents } from "@/content/section-style-options";

const palette = toColorPalette({
  bgPage: "#e5eaef",
  serviceSurface: "#d0dde2",
  surfaceRaised: "#f6fbff",
  serviceInk: "#232834",
  bgDark: "#0d4356",
  serviceAccent: "#175c82",
  accent: "#bf0d22",
  bgDarkSurface: "#24566a",
});

/** A section that is actually in the card-style registry, so the membership
 *  gate is exercised rather than accidentally satisfied. */
const cardComponent = [...cardStyleComponents][0];

describe("section colour override attributes", () => {
  it("emits nothing for the section that overrides nothing", () => {
    // The case almost every section is in, and the one that has to cost
    // nothing: no attribute means the recipe's own card stands.
    expect(
      sectionColorOverrideAttributes(
        { component: cardComponent, colorRecipe: "page" },
        palette,
      ),
    ).toEqual({});
  });

  it("emits nothing for a section that renders no card", () => {
    /**
     * Saved data outlives the registry. A section carrying an override that
     * later leaves `cardStyleComponents` must stop painting it rather than
     * keep applying a control it no longer offers.
     */
    expect(
      sectionColorOverrideAttributes(
        {
          component: "DefinitelyNotARegisteredSection",
          colorRecipe: "page",
          cardSwatch: "dark",
        },
        palette,
      ),
    ).toEqual({});
  });

  it("ships swatch, intensity and polarity for a card override", () => {
    expect(
      sectionColorOverrideAttributes(
        {
          component: cardComponent,
          colorRecipe: "page",
          cardSwatch: "dark",
          cardIntensity: "strong",
        },
        palette,
      ),
    ).toEqual({
      "data-pagebuilder-card-swatch": "dark",
      "data-pagebuilder-card-intensity": "strong",
      "data-pagebuilder-card-polarity": "dark",
    });
  });

  it("emits the border weight the editor chose, whatever the fill", () => {
    /**
     * This used to assert the opposite: an unfilled card's border was floored
     * to Quiet, and the floor had to survive the trip through this helper
     * because the fill state is only knowable here.
     *
     * The floor is gone - it cleared WCAG 1.4.11's 3:1 for two of the eight
     * selectable swatches and removed the choice for all eight, so it is a
     * gate finding now rather than a correction (see `resolveBorderIntensity`).
     * What this pins is that the fill no longer moves the emitted weight in
     * either direction, on the path all three renderers share.
     */
    for (const cardFill of ["none", "solid"]) {
      const attributes = sectionColorOverrideAttributes(
        {
          component: cardComponent,
          colorRecipe: "page",
          cardFill,
          cardBorder: "on",
          borderSwatch: "ink",
          borderIntensity: "faint",
        },
        palette,
      );

      expect(attributes["data-pagebuilder-border-intensity"]).toBe("faint");
    }
  });

  it("leaves a filled card's border where the editor put it", () => {
    const attributes = sectionColorOverrideAttributes(
      {
        component: cardComponent,
        colorRecipe: "page",
        cardFill: "solid",
        cardBorder: "on",
        borderSwatch: "ink",
        borderIntensity: "faint",
      },
      palette,
    );

    expect(attributes["data-pagebuilder-border-intensity"]).toBe("faint");
  });

  it("measures polarity against the recipe the section actually renders on", () => {
    /**
     * Same swatch, same intensity, two grounds. A wash of `ink` over a light
     * page is light and takes ink text; the same wash over the dark recipe is
     * dark and takes white. If these ever agree, the polarity has stopped
     * reading the recipe and the override is painting unreadable text on one
     * of the two.
     */
    const onLight = sectionColorOverrideAttributes(
      {
        component: cardComponent,
        colorRecipe: "page",
        cardSwatch: "ink",
        cardIntensity: "faint",
      },
      palette,
    );
    const onDark = sectionColorOverrideAttributes(
      {
        component: cardComponent,
        colorRecipe: "dark",
        cardSwatch: "ink",
        cardIntensity: "faint",
      },
      palette,
    );

    expect(onLight["data-pagebuilder-card-polarity"]).toBe("light");
    expect(onDark["data-pagebuilder-card-polarity"]).toBe("dark");
  });
});

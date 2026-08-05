import { createElement, isValidElement } from "react";
import { describe, expect, it } from "vitest";

import { sectionLibraryV3Registry } from "@/content/section-library-v3";
import {
  cardFillOptInComponents,
  cardLinkComponents,
  cardLinkGridAlignComponents,
  cardStyleComponents,
  headlineWrapComponents,
  iconComponents,
  tableCompareAlignComponents,
} from "@/content/section-style-options";
import {
  getSectionToggleProps,
  withSectionToggles,
} from "@/components/sections/section-toggle-props";

/**
 * The builder offers a toggle based on the membership sets, and the section
 * receives it as a prop. Those used to be two independent answers: a section was
 * only passed its toggles if someone had hand-written a branch for it in the
 * render chain in `PagebuilderShell`, so a section could be in the set, render
 * its control, and ignore every change made with it. `withSectionToggles` makes
 * the two answers come from one source.
 *
 * This is a behavioural check rather than a grep over the render chain: it
 * asserts the value actually lands on the element, which is the thing that was
 * broken.
 */

const registryComponents = new Set<string>(
  sectionLibraryV3Registry.map((entry) => entry.component),
);

const toggleSupporting = [
  ...new Set([
    ...cardStyleComponents,
    ...cardLinkComponents,
    ...cardLinkGridAlignComponents,
    ...headlineWrapComponents,
    ...iconComponents,
    ...tableCompareAlignComponents,
  ]),
].filter((component) => registryComponents.has(component));

/** Stand-in for whatever `previewCatalog` built - only its props matter here. */
function prebuiltElement() {
  return createElement("div", { "data-prebuilt": "yes" });
}

describe("section toggle props", () => {
  it("covers the toggle-supporting library sections", () => {
    expect(toggleSupporting.length).toBeGreaterThan(20);
  });

  for (const component of toggleSupporting) {
    it(`${component} receives its toggles on a prebuilt element`, () => {
      const align = cardLinkGridAlignComponents.has(component)
        ? "justified"
        : "right";

      const element = withSectionToggles(prebuiltElement(), {
        align,
        cardBorder: "off",
        cardFill: "none",
        cardLinks: "off",
        colorRecipe: "dark",
        component,
        headlineWrap: "pretty",
        icons: "off",
      });

      expect(isValidElement(element)).toBe(true);

      const props = (element as { props: Record<string, unknown> }).props;

      // The prebuilt element is preserved, not replaced.
      expect(props["data-prebuilt"]).toBe("yes");
      expect(props.colorRecipe, `${component} colorRecipe`).toBe("dark");

      if (cardStyleComponents.has(component)) {
        expect(props.cardFill, `${component} cardFill`).toBe("none");
        expect(props.cardBorder, `${component} cardBorder`).toBe("off");
      }

      if (iconComponents.has(component)) {
        expect(props.icons, `${component} icons`).toBe("off");
      }

      if (cardLinkComponents.has(component)) {
        expect(props.cardLinks, `${component} cardLinks`).toBe("off");
      }

      if (headlineWrapComponents.has(component)) {
        expect(props.headlineWrap, `${component} headlineWrap`).toBe("pretty");
      }

      if (
        cardLinkGridAlignComponents.has(component) ||
        tableCompareAlignComponents.has(component)
      ) {
        expect(props.align, `${component} align`).toBe(align);
      }
    });
  }

  it("offers a prop only where the section is registered for it", () => {
    for (const component of toggleSupporting) {
      const props = getSectionToggleProps({ component });

      expect(
        "cardFill" in props,
        `${component}: cardFill offered without cardStyleComponents membership`,
      ).toBe(cardStyleComponents.has(component));
      expect(
        "icons" in props,
        `${component}: icons offered without iconComponents membership`,
      ).toBe(iconComponents.has(component));
      expect(
        "cardLinks" in props,
        `${component}: cardLinks offered without cardLinkComponents membership`,
      ).toBe(cardLinkComponents.has(component));
    }
  });

  it("resolves an unset fill to the section's own default", () => {
    const optIn = [...cardFillOptInComponents][0];
    const ordinary = [...cardStyleComponents].find(
      (component) => !cardFillOptInComponents.has(component),
    );

    expect(optIn).toBeTruthy();
    expect(ordinary).toBeTruthy();

    // Unset must reproduce what the component renders on its own, or every
    // saved section changes appearance the first time it is read back.
    expect(getSectionToggleProps({ component: optIn }).cardFill).toBe("none");
    expect(getSectionToggleProps({ component: ordinary! }).cardFill).toBe(
      "solid",
    );
  });

  it("gives a section with no toggle sets only the colour recipe", () => {
    const props = getSectionToggleProps({
      colorRecipe: "dark",
      component: "FooterSectionV3",
    });

    // Offered on every section, so it always flows.
    expect(props.colorRecipe).toBe("dark");
    expect(Object.keys(props).sort()).toEqual(["colorRecipe"]);
  });

  it("preserves the navigation appearance when its new surface controls are unset", () => {
    const props = getSectionToggleProps({ component: "NavPrimarySectionV2" });

    expect(props.backgroundFill).toBe("solid");
    expect(props.cardFill).toBe("none");
    expect(props.cardBorder).toBe("off");
  });

  it("falls back to the default recipe rather than passing an unknown value", () => {
    expect(
      getSectionToggleProps({ colorRecipe: "", component: "NavPrimarySectionV2" })
        .colorRecipe,
    ).toBe("default");
    expect(
      getSectionToggleProps({
        colorRecipe: "not-a-recipe",
        component: "NavPrimarySectionV2",
      }).colorRecipe,
    ).toBe("default");
  });
});

import { describe, expect, it } from "vitest";

import {
  applySharedNavigationToTemplate,
  getCanonicalTemplateNavigation,
  type SharedTemplateNavigationSection,
  type TemplateWithNavigation,
} from "@/utils/shared-template-navigation";

type TestTemplate = TemplateWithNavigation<SharedTemplateNavigationSection> & {
  id: string;
};

function navigation(
  component: "NavCenterLogoSectionV2" | "NavPrimarySectionV2",
  slotId: string,
): SharedTemplateNavigationSection {
  const centered = component === "NavCenterLogoSectionV2";

  return {
    component,
    instruction: centered ? "Use the centered nav." : "Use the primary nav.",
    mode: "Navigation",
    name: centered ? "Center logo navigation" : "Primary navigation",
    originalComponent: "NavPrimarySectionV2",
    originalIndex: 0,
    slotId,
    ...(centered
      ? { cardFill: "none", navLogoLayout: "split" }
      : { align: "left", cardFill: "solid", variant: "legacy" }),
  };
}

function template(
  id: string,
  pageType: string,
  nav: SharedTemplateNavigationSection,
): TestTemplate {
  return {
    id,
    pageType,
    sections: [nav],
    sourceRecipeId: pageType === "Home" ? "classic-service" : "contact",
  };
}

describe("shared promoted-template navigation", () => {
  it("makes a newly promoted homepage the canonical source", () => {
    const promoted = template(
      "home-new",
      "Home",
      navigation("NavCenterLogoSectionV2", "home-new-nav"),
    );
    const olderHome = template(
      "home-old",
      "Home",
      navigation("NavPrimarySectionV2", "home-old-nav"),
    );

    expect(getCanonicalTemplateNavigation(promoted, [olderHome])?.component).toBe(
      "NavCenterLogoSectionV2",
    );
  });

  it("uses the newest promoted homepage for a non-home promotion", () => {
    const promoted = template(
      "contact-new",
      "Contact",
      navigation("NavPrimarySectionV2", "contact-nav"),
    );
    const newestHome = template(
      "home-new",
      "Home",
      navigation("NavCenterLogoSectionV2", "home-new-nav"),
    );

    expect(
      getCanonicalTemplateNavigation(promoted, [newestHome])?.component,
    ).toBe("NavCenterLogoSectionV2");
  });

  it("copies the full homepage nav state without replacing target slot identity", () => {
    const target = template(
      "contact",
      "Contact",
      navigation("NavPrimarySectionV2", "contact-nav"),
    );
    const shared = navigation("NavCenterLogoSectionV2", "homepage-nav");
    const result = applySharedNavigationToTemplate(target, shared);
    const resultNav = result.sections[0];

    expect(resultNav).toMatchObject({
      cardFill: "none",
      component: "NavCenterLogoSectionV2",
      name: "Center logo navigation",
      navLogoLayout: "split",
      slotId: "contact-nav",
    });
    expect(resultNav).not.toHaveProperty("align");
    expect(resultNav).not.toHaveProperty("variant");
  });
});

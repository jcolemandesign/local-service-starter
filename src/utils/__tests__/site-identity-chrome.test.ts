/**
 * The nav logo and footer business name are client-level, not per-page.
 *
 * They used to be per-page copy fields - one copy on each staged page, none of
 * them seeded (nav and footer are site chrome, excluded from the page copy
 * spec), so all fifteen of North Star's sat empty on the library demo and
 * changing the business name meant editing fifteen pages by hand.
 *
 * These pin the precedence that replaced that: per-page field, then the client's
 * site identity, then the library demo. The middle step is the new one; the
 * outer two must keep working, or existing pages change appearance and a page
 * that deliberately overrode its chrome loses the override.
 */

import { describe, expect, it } from "vitest";
import { renderPageTemplateSection } from "@/components/sections/PageTemplatePreview";
import type { SiteIdentity } from "@/content/site-identity";

const identity: SiteIdentity = {
  businessName: "North Star HVAC",
  logoSrc: "",
};

function render(component: string, mode: string, name: string, fields: unknown[] = [], id?: SiteIdentity) {
  return renderPageTemplateSection(
    { component, mode, name, id: "01-x" } as never,
    1,
    fields as never,
    [],
    "/",
    id,
  ) as { props: Record<string, unknown> };
}

describe("site identity reaches the chrome", () => {
  it("nav logo uses the site identity when the page field is empty", () => {
    const el = render("NavPrimarySectionV2", "Navigation", "Primary navigation", [
      { id: "p.01-x.logoLabel", kind: "copy", path: "01-x.logoLabel", value: "" },
    ], identity);
    expect(el.props.logoLabel).toBe("North Star HVAC");
  });

  it("a per-page value still overrides the site identity", () => {
    const el = render("NavPrimarySectionV2", "Navigation", "Primary navigation", [
      { id: "p.01-x.logoLabel", kind: "copy", path: "01-x.logoLabel", value: "Page Override" },
    ], identity);
    expect(el.props.logoLabel).toBe("Page Override");
  });

  it("falls back to the library demo with no identity", () => {
    const el = render("NavPrimarySectionV2", "Navigation", "Primary navigation", []);
    expect(el.props.logoLabel).toBeTruthy();
    expect(el.props.logoLabel).not.toBe("North Star HVAC");
  });

  it("footer business name uses the site identity", () => {
    const el = render("FooterSectionV3", "Utility", "Footer", [], identity);
    expect(el.props.businessName).toBe("North Star HVAC");
  });

  it("center-logo and floating bento navs get it too", () => {
    for (const c of ["NavCenterLogoSectionV2", "NavFloatingBentoSectionV2"]) {
      expect(render(c, "Navigation", "Nav", [], identity).props.logoLabel).toBe(
        "North Star HVAC",
      );
    }
  });

  it("passes a logo image path to every nav when one is set", () => {
    const withLogo: SiteIdentity = {
      businessName: "North Star HVAC",
      logoSrc: "/images/north-star-logo.svg",
    };

    for (const c of [
      "NavPrimarySectionV2",
      "NavCenterLogoSectionV2",
      "NavFloatingBentoSectionV2",
    ]) {
      const props = render(c, "Navigation", "Nav", [], withLogo).props;
      expect(props.logoSrc, c).toBe("/images/north-star-logo.svg");
      // The business name still rides along as the image's alt text.
      expect(props.logoLabel, c).toBe("North Star HVAC");
    }
  });

  it("every footer variant gets it", () => {
    for (const c of [
      "FooterSectionV3",
      "FooterHorizontalSectionV3",
      "FooterCompactSectionV3",
      "FooterLinkPanelSectionV3",
    ]) {
      expect(render(c, "Utility", "Footer", [], identity).props.businessName).toBe(
        "North Star HVAC",
      );
    }
  });
});

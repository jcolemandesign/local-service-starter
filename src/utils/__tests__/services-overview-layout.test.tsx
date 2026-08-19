import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";

import { ServicesOverviewSectionV3 } from "@/components/sections/ServicesOverviewSectionV3";
import { sectionAnimationOptionsFor } from "@/content/section-animations";
import { sectionLibraryV3Content } from "@/content/section-library-v3";

function renderServicesOverview(
  overrides: Partial<ComponentProps<typeof ServicesOverviewSectionV3>> = {},
) {
  return renderToStaticMarkup(
    <ServicesOverviewSectionV3
      {...sectionLibraryV3Content.servicesOverview}
      {...overrides}
    />,
  );
}

describe("services overview scan section", () => {
  it("renders the left introduction and three scannable service cards on the 14-column grid", () => {
    const html = renderServicesOverview();

    expect(html).toContain("grid-cols-14");
    expect(html).toContain("Balanced coverage for cooling season");
    expect(html.match(/reveal-role-card/g)).toHaveLength(3);
    expect(html.match(/data-services-overview-icon/g)).toHaveLength(3);
    expect(html.match(/data-services-overview-fit-icon/g)).toHaveLength(1);
    expect(html.match(/data-services-overview-check/g)).toHaveLength(14);
  });

  it("honors the icon, card, border, and left heading-size controls", () => {
    const html = renderServicesOverview({
      cardBorder: "off",
      cardFill: "none",
      headingSize: "heading-lg",
      icons: "off",
    });

    expect(html).toContain("type-heading-lg");
    expect(html).toContain("!bg-transparent !shadow-none");
    expect(html).toContain("!border-transparent");
    expect(html).not.toContain("data-services-overview-icon");
    expect(html).not.toContain("data-services-overview-fit-icon");
    expect(html).not.toContain("data-services-overview-check");
  });

  it("starts with only Rise and Fade animation suites", () => {
    expect(
      sectionAnimationOptionsFor("ServicesOverviewSectionV3").map(
        (option) => option.label,
      ),
    ).toEqual(["Use template default", "None", "Rise", "Fade"]);
  });
});

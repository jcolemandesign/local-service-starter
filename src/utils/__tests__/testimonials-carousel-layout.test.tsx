import { readFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { TestimonialsCarouselSectionV3 } from "@/components/sections/TestimonialsCarouselSectionV3";
import { sectionLibraryV3Content } from "@/content/section-library-v3";

function renderCarousel(cardFill: "solid" | "none", cardBorder: "on" | "off") {
  return renderToStaticMarkup(
    <TestimonialsCarouselSectionV3
      cardBorder={cardBorder}
      cardFill={cardFill}
      items={sectionLibraryV3Content.testimonialsCarousel.items}
    />,
  );
}

describe("testimonial carousel spacing", () => {
  it("pulls indicators closer only when the testimonial has no card chrome", () => {
    const unframed = renderCarousel("none", "off");
    const framed = renderCarousel("solid", "on");

    expect(unframed.match(/!pb-0/g)).toHaveLength(4);
    expect(unframed).toContain("testimonial-carousel-indicators");
    expect(framed).not.toContain("!pb-0");
  });

  it("retains a compact bottom buffer when section bottom spacing is off", () => {
    const css = readFileSync(
      path.join(process.cwd(), "src", "app", "globals.css"),
      "utf8",
    );

    expect(css).toContain(
      '[data-pagebuilder-padding-bottom="none"][data-pagebuilder-section-component="TestimonialsCarouselSectionV3"]',
    );
    expect(css).toContain(
      "padding-bottom: calc(var(--section-space-med) * 0.325) !important;",
    );
  });
});

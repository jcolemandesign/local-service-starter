import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { TestimonialsCarouselCondensedSectionV3 } from "@/components/sections/TestimonialsCarouselCondensedSectionV3";
import { sectionLibraryV3Content } from "@/content/section-library-v3";

function renderCarousel(cardFill: "solid" | "none", cardBorder: "on" | "off") {
  return renderToStaticMarkup(
    <TestimonialsCarouselCondensedSectionV3
      cardBorder={cardBorder}
      cardFill={cardFill}
      items={sectionLibraryV3Content.testimonialsCarousel.items}
    />,
  );
}

describe("condensed testimonial carousel layout", () => {
  it("adds independent dividers only between fully unframed testimonials", () => {
    const unframed = renderCarousel("none", "off");
    const framed = renderCarousel("solid", "on");

    expect(
      unframed.match(/pointer-events-none absolute inset-y-8 w-px/g),
    ).toHaveLength(2);
    expect(framed).not.toContain(
      "pointer-events-none absolute inset-y-8 w-px",
    );
  });
});

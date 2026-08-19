import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ContactStripSmallSectionV3 } from "@/components/sections/ContactStripSmallSectionV3";
import { sectionLibraryV3Content } from "@/content/section-library-v3";

function renderContactStrip(cardFill: "solid" | "none", cardBorder: "on" | "off") {
  return renderToStaticMarkup(
    <ContactStripSmallSectionV3
      {...sectionLibraryV3Content.contactStripSmall}
      cardBorder={cardBorder}
      cardFill={cardFill}
    />,
  );
}

describe("small contact strip layout", () => {
  it("uses a naturally sized divided flex row only when the cards are fully bare", () => {
    const bare = renderContactStrip("none", "off");
    const cards = renderContactStrip("solid", "on");

    expect(bare).toContain("flex items-stretch max-lg:grid");
    expect(bare.match(/flex-auto/g)).toHaveLength(5);
    expect(bare.match(/w-px shrink-0 self-stretch/g)).toHaveLength(4);
    expect(bare).not.toContain("grid-cols-[0.95fr_1.3fr_1.1fr_1.45fr_1.2fr]");

    expect(cards).toContain("grid-cols-[0.95fr_1.3fr_1.1fr_1.45fr_1.2fr]");
    expect(cards).not.toContain("flex-auto");
    expect(cards).not.toContain("w-px shrink-0 self-stretch");
  });
});

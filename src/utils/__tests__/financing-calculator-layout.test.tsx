import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FinancingCalculatorSectionV3 } from "@/components/sections/FinancingCalculatorSectionV3";
import { sectionLibraryV3Content } from "@/content/section-library-v3";

describe("financing calculator layout", () => {
  it("stretches both panels and gives them matching vertical padding", () => {
    const html = renderToStaticMarkup(
      <FinancingCalculatorSectionV3
        {...sectionLibraryV3Content.financingCalculator}
      />,
    );

    expect(html.match(/content-stretch self-stretch/g)).toHaveLength(2);
    expect(
      html.match(/padding-block:var\(--section-space-vsml\)/g),
    ).toHaveLength(2);
  });
});

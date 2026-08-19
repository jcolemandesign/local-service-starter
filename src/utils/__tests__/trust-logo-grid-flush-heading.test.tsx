import { readFileSync } from "node:fs";
import path from "node:path";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { TrustLogoGridSectionV3 } from "@/components/sections/TrustSectionsV3";
import { sectionLibraryV3Content } from "@/content/section-library-v3";

describe("static trust logo grid flush heading", () => {
  it("steps the marked left headline down only when both section edges are flush", () => {
    const markup = renderToStaticMarkup(
      <TrustLogoGridSectionV3
        {...sectionLibraryV3Content.trustLogoMarquee}
      />,
    );
    const css = readFileSync(
      path.join(process.cwd(), "src", "app", "globals.css"),
      "utf8",
    );

    expect(markup).toContain("trust-logo-grid-left-headline type-text-xl");
    expect(markup).toContain("items-center justify-start");
    expect(markup).toContain("py-4 text-left");
    expect(css).toContain(
      '.pagebuilder-section-frame[data-pagebuilder-padding-top="none"][data-pagebuilder-padding-bottom="none"][data-pagebuilder-section-component="TrustLogoGridSectionV3"]',
    );
    expect(css).toContain("--type-text-xl-size: var(--type-text-md-size)");
    expect(css).toContain("--type-text-xl-leading: var(--type-text-md-leading)");
  });
});

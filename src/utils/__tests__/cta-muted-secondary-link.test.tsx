import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("muted CTA secondary link", () => {
  it("uses quiet sentence-case body type instead of the tracked label treatment", () => {
    const source = readFileSync(
      path.join(
        process.cwd(),
        "src",
        "components",
        "sections",
        "FAQConversionContactFooterSectionsV3.tsx",
      ),
      "utf8",
    );
    const linkClasses = source.match(
      /className=\{`([^`]*cta-muted-secondary-link[^`]*)`\}/,
    )?.[1];

    expect(linkClasses).toContain("type-text-sm");
    expect(linkClasses).toContain("pb-1");
    expect(linkClasses).not.toContain("type-label");
    expect(linkClasses).not.toContain("min-h-12");
    expect(linkClasses).not.toContain("max-md:w-full");
  });
});

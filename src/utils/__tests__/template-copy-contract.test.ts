import { describe, expect, it } from "vitest";

import {
  getTemplateCopyContractFingerprint,
  getTemplateCopyContractStatus,
  type TemplateCopyContractTemplate,
} from "@/utils/template-copy-contract";

function template(
  component: string,
  name: string,
): TemplateCopyContractTemplate {
  return {
    id: "tmpl-1",
    name: "Test Template",
    pageType: "Home",
    sections: [
      {
        component,
        mode: "custom",
        name,
      },
    ],
  };
}

const genericFieldsCopy = (heading: string) =>
  [
    "# Bulk Paste Copy",
    "",
    "<!-- Page target: Test Page (/test-page) -->",
    "<!-- Template contract: tc-v2-doesnotmatch -->",
    "",
    `### ${heading}`,
    "eyebrow: Test Eyebrow",
    "heading: Test Heading",
    "body: Test body copy.",
    "items: Item One - Description",
  ].join("\n");

describe("getTemplateCopyContractStatus", () => {
  it("returns empty for blank copy", () => {
    expect(getTemplateCopyContractStatus("   ", template("WidgetOne", "Widget One"))).toBe(
      "empty",
    );
  });

  it("returns unverified when no fingerprint comment is present", () => {
    const copy = "# Bulk Paste Copy\n\n### 01-widget-one\neyebrow: Test";
    expect(getTemplateCopyContractStatus(copy, template("WidgetOne", "Widget One"))).toBe(
      "unverified",
    );
  });

  it("returns unverified when no template is supplied", () => {
    expect(
      getTemplateCopyContractStatus(genericFieldsCopy("01-widget-one"), undefined),
    ).toBe("unverified");
  });

  it("returns current when the embedded fingerprint matches the live template", () => {
    const live = template("WidgetOne", "Widget One");
    const copy = genericFieldsCopy("01-widget-one").replace(
      "tc-v2-doesnotmatch",
      getTemplateCopyContractFingerprint(live),
    );

    expect(getTemplateCopyContractStatus(copy, live)).toBe("current");
  });

  it("returns current via the compatibility fallback when the section is unchanged", () => {
    expect(
      getTemplateCopyContractStatus(
        genericFieldsCopy("01-widget-one"),
        template("WidgetOne", "Widget One"),
      ),
    ).toBe("current");
  });

  it("does not fall back to field-name-only matching for legacy headings with no slug", () => {
    // A heading with no slug (older pasted format) can't be checked for section
    // identity, so it still relies on field-name coverage only - unchanged from
    // prior behavior.
    expect(
      getTemplateCopyContractStatus(
        genericFieldsCopy("01"),
        template("WidgetOne", "Widget One"),
      ),
    ).toBe("current");
  });

  it("does not report current when the section's component changed but field names still overlap (regression)", () => {
    // Copy was written for "Widget One" at position 1. The template has since
    // changed that position to a different component ("Widget Two") that
    // happens to share the same generic field names (eyebrow/heading/body/
    // items, from the shared fallback field spec). Before the fix, the
    // compatibility fallback only checked field names and ordinal position,
    // so this incorrectly reported "current". It must now report "stale"
    // because the heading's section slug ("widget-one") no longer matches
    // the current section at that ordinal ("widget-two").
    const copyWrittenForWidgetOne = genericFieldsCopy("01-widget-one");
    const templateNowHasWidgetTwoAtPosition1 = template(
      "WidgetTwo",
      "Widget Two",
    );

    expect(
      getTemplateCopyContractStatus(
        copyWrittenForWidgetOne,
        templateNowHasWidgetTwoAtPosition1,
      ),
    ).toBe("stale");
  });
});

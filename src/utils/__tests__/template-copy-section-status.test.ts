import { describe, expect, it } from "vitest";

import {
  buildTemplateCopyContract,
  getTemplateCopySectionFingerprint,
  getTemplateCopySectionStatuses,
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
    sections: [{ component, mode: "custom", name }],
  };
}

describe("getTemplateCopySectionFingerprint", () => {
  it("is stable for the same section shape", () => {
    const a = template("WidgetOne", "Widget One").sections[0];
    const b = template("WidgetOne", "Widget One").sections[0];

    expect(getTemplateCopySectionFingerprint(a)).toBe(
      getTemplateCopySectionFingerprint(b),
    );
  });

  it("changes when the section's component changes", () => {
    const widgetOne = template("WidgetOne", "Widget One").sections[0];
    const widgetTwo = template("WidgetTwo", "Widget Two").sections[0];

    expect(getTemplateCopySectionFingerprint(widgetOne)).not.toBe(
      getTemplateCopySectionFingerprint(widgetTwo),
    );
  });
});

describe("getTemplateCopySectionStatuses", () => {
  it("reports empty for every section when copy is blank", () => {
    const statuses = getTemplateCopySectionStatuses(
      "   ",
      template("WidgetOne", "Widget One"),
    );

    expect(statuses).toHaveLength(1);
    expect(statuses[0]).toMatchObject({ ordinal: "01", status: "empty" });
    expect(statuses[0].reasons.length).toBeGreaterThan(0);
  });

  it("reports unverified when no matching section block exists", () => {
    const copy = "# Bulk Paste Copy\n\nSome unrelated text with no headings.";
    const statuses = getTemplateCopySectionStatuses(
      copy,
      template("WidgetOne", "Widget One"),
    );

    expect(statuses[0].status).toBe("unverified");
  });

  it("reports current with no reasons when the embedded section fingerprint matches", () => {
    const live = template("WidgetOne", "Widget One");
    const fingerprint = getTemplateCopySectionFingerprint(live.sections[0]);
    const copy = [
      "# Bulk Paste Copy",
      "",
      "### 01-widget-one",
      `<!-- Section contract: ${fingerprint} -->`,
      "eyebrow: Test Eyebrow",
      "heading: Test Heading",
      "body: Test body copy.",
      "items: Item One - Description",
    ].join("\n");

    const statuses = getTemplateCopySectionStatuses(copy, live);

    expect(statuses[0]).toMatchObject({ reasons: [], status: "current" });
  });

  it("reports stale with a reason when the embedded section fingerprint no longer matches", () => {
    const original = template("WidgetOne", "Widget One");
    const staleFingerprint = getTemplateCopySectionFingerprint(
      original.sections[0],
    );
    const changed = template("WidgetOne", "Widget One");
    changed.sections[0].instruction = "Now with a different instruction";

    const copy = [
      "# Bulk Paste Copy",
      "",
      "### 01-widget-one",
      `<!-- Section contract: ${staleFingerprint} -->`,
      "eyebrow: Test Eyebrow",
      "heading: Test Heading",
      "body: Test body copy.",
      "items: Item One - Description",
    ].join("\n");

    const statuses = getTemplateCopySectionStatuses(copy, changed);

    expect(statuses[0].status).toBe("stale");
    expect(statuses[0].reasons[0]).toMatch(/fingerprint/i);
  });

  it("falls back to identity+field-name matching when no section fingerprint is present, and flags a component swap as stale (regression)", () => {
    const copyWrittenForWidgetOne = [
      "# Bulk Paste Copy",
      "",
      "### 01-widget-one",
      "eyebrow: Test Eyebrow",
      "heading: Test Heading",
      "body: Test body copy.",
      "items: Item One - Description",
    ].join("\n");

    const currentStatuses = getTemplateCopySectionStatuses(
      copyWrittenForWidgetOne,
      template("WidgetOne", "Widget One"),
    );

    expect(currentStatuses[0]).toMatchObject({ status: "current" });
    expect(currentStatuses[0].reasons[0]).toMatch(/legacy field-name match/i);

    const staleStatuses = getTemplateCopySectionStatuses(
      copyWrittenForWidgetOne,
      template("WidgetTwo", "Widget Two"),
    );

    expect(staleStatuses[0].status).toBe("stale");
    expect(staleStatuses[0].reasons[0]).toMatch(/identity/i);
  });

  it("flags stale with a missing-field reason when a required field is absent", () => {
    const copyMissingBody = [
      "# Bulk Paste Copy",
      "",
      "### 01-widget-one",
      "eyebrow: Test Eyebrow",
      "heading: Test Heading",
      "items: Item One - Description",
    ].join("\n");

    const statuses = getTemplateCopySectionStatuses(
      copyMissingBody,
      template("WidgetOne", "Widget One"),
    );

    expect(statuses[0].status).toBe("stale");
    expect(statuses[0].reasons.join(" ")).toMatch(/missing required field/i);
    expect(statuses[0].reasons.join(" ")).toMatch(/body/i);
  });
});

describe("buildTemplateCopyContract", () => {
  it("embeds a per-section 'Section contract' fingerprint line and pairing instruction", () => {
    const live = template("WidgetOne", "Widget One");
    const contract = buildTemplateCopyContract({
      pageLabel: "Test Page",
      pageSlug: "test-page",
      template: live,
    });
    const expectedFingerprint = getTemplateCopySectionFingerprint(
      live.sections[0],
    );

    expect(contract).toContain(`Section contract: ${expectedFingerprint}`);
    expect(contract).toContain("<!-- Section contract: <value> -->");
  });
});

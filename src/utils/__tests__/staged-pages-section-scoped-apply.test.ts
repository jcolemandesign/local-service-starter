import { describe, expect, it } from "vitest";

import {
  buildStrategyTemplateStagedPage,
  mergePreservingIncompatibleSections,
  type StagedPageField,
  type StagedPageTemplate,
} from "@/utils/staged-pages";
import { getTemplateCopySectionStatuses } from "@/utils/template-copy-contract";
import type { StrategySnapshot } from "@/utils/strategy-snapshots";
import type { StrategyWorkspaceFields } from "@/utils/strategy-workspace";

function emptyWorkspaceFields(
  overrides: Partial<StrategyWorkspaceFields> = {},
): StrategyWorkspaceFields {
  return {
    aboutCopy: "",
    contactCopy: "",
    contentPlan: "",
    copywritingAuthority: "",
    copywritingEnergy: "",
    copywritingHumor: "",
    copywritingPersonalityId: "",
    copywritingPersonalityPresence: "",
    copywritingPolish: "",
    copywritingUrgency: "",
    copywritingWarmth: "",
    generalNotes: "",
    homepageCopy: "",
    servicesCopy: "",
    strategyBrief: "",
    supplementalResearch: "",
    thankYouCopy: "",
    ...overrides,
  };
}

function twoSectionTemplate(): StagedPageTemplate {
  return {
    id: "tmpl-1",
    name: "Test Template",
    pageType: "Unmatched Test Page Type",
    sections: [
      {
        component: "WidgetOne",
        instruction: "",
        mode: "custom",
        name: "Widget One",
      },
      {
        component: "WidgetOne",
        instruction: "",
        mode: "custom",
        name: "Widget Two",
      },
    ],
    sourceOptionName: "Test Option",
    sourceRecipeName: "Test Recipe",
  };
}

// Section 1's heading slug ("01-widget-one") matches the template's section 1
// identity, so it verifies as "current". Section 2's heading slug
// ("02-widget-two-wrong") does not match the template's section 2 identity
// ("widget-two"), so it verifies as "stale" - simulating a component/name
// change at that position since this copy was written.
const strategyCopy = [
  "# Bulk Paste Copy",
  "",
  "### 01-widget-one",
  "eyebrow: Test Eyebrow One",
  "heading: Test Heading One",
  "body: Test body one.",
  "items: Item One - Description",
  "",
  "### 02-widget-two-wrong",
  "eyebrow: Test Eyebrow Two",
  "heading: Test Heading Two",
  "body: Test body two.",
  "items: Item Two - Description",
].join("\n");

function testSnapshot(): StrategySnapshot {
  return {
    clientSlug: "test-client",
    createdAt: "2026-01-01T00:00:00.000Z",
    fields: emptyWorkspaceFields({ contentPlan: strategyCopy }),
    id: "snapshot-1",
    navigation: [],
    pages: [],
    version: 1,
  };
}

describe("buildStrategyTemplateStagedPage - section-scoped apply", () => {
  it("seeds the compatible section's fields and leaves the incompatible section's fields blank", () => {
    const page = buildStrategyTemplateStagedPage({
      pageLabel: "Test Page",
      pageSlug: "test-page",
      snapshot: testSnapshot(),
      template: twoSectionTemplate(),
    });

    const findField = (path: string) =>
      page.fields.find((field) => field.path === path)?.value;

    expect(findField("01-widget-one.eyebrow")).toBe("Test Eyebrow One");
    expect(findField("01-widget-one.heading")).toBe("Test Heading One");

    // Section 2 is stale (identity mismatch), so it must not be seeded with
    // copy that may belong to a different component at that position.
    expect(findField("02-widget-two.eyebrow")).toBe("");
    expect(findField("02-widget-two.heading")).toBe("");
  });
});

describe("mergePreservingIncompatibleSections", () => {
  const template = twoSectionTemplate();
  const sectionStatuses = getTemplateCopySectionStatuses(
    strategyCopy,
    template,
  );

  it("keeps the freshly seeded value for a current section but restores the previous value for a stale section", () => {
    const page = buildStrategyTemplateStagedPage({
      pageLabel: "Test Page",
      pageSlug: "test-page",
      snapshot: testSnapshot(),
      template,
    });
    const previousFields: StagedPageField[] = page.fields.map((field) => {
      if (field.path === "01-widget-one.eyebrow") {
        return { ...field, value: "Old Eyebrow One (should be overwritten)" };
      }

      if (field.path === "02-widget-two.eyebrow") {
        return { ...field, value: "Old Eyebrow Two (should survive)" };
      }

      return field;
    });

    const merged = mergePreservingIncompatibleSections(
      page.fields,
      previousFields,
      sectionStatuses,
    );
    const findValue = (path: string) =>
      merged.find((field) => field.path === path)?.value;

    expect(findValue("01-widget-one.eyebrow")).toBe("Test Eyebrow One");
    expect(findValue("02-widget-two.eyebrow")).toBe(
      "Old Eyebrow Two (should survive)",
    );
  });

  it("is a no-op when there is no previous page", () => {
    const page = buildStrategyTemplateStagedPage({
      pageLabel: "Test Page",
      pageSlug: "test-page",
      snapshot: testSnapshot(),
      template,
    });

    expect(
      mergePreservingIncompatibleSections(page.fields, undefined, sectionStatuses),
    ).toBe(page.fields);
  });

  it("is a no-op when every section is current", () => {
    const page = buildStrategyTemplateStagedPage({
      pageLabel: "Test Page",
      pageSlug: "test-page",
      snapshot: testSnapshot(),
      template,
    });
    const allCurrentStatuses = sectionStatuses.map((sectionStatus) => ({
      ...sectionStatus,
      status: "current" as const,
    }));

    expect(
      mergePreservingIncompatibleSections(
        page.fields,
        page.fields,
        allCurrentStatuses,
      ),
    ).toBe(page.fields);
  });

  it("falls back to the freshly built (blank) value when no previous field exists at that path", () => {
    const page = buildStrategyTemplateStagedPage({
      pageLabel: "Test Page",
      pageSlug: "test-page",
      snapshot: testSnapshot(),
      template,
    });
    const previousFieldsWithoutSectionTwo = page.fields.filter(
      (field) => !field.path.startsWith("02-widget-two."),
    );

    const merged = mergePreservingIncompatibleSections(
      page.fields,
      previousFieldsWithoutSectionTwo,
      sectionStatuses,
    );

    expect(
      merged.find((field) => field.path === "02-widget-two.eyebrow")?.value,
    ).toBe("");
  });
});
